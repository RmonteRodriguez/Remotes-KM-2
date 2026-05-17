const SEARCH_TAB = {
  id: "search",
  title: "Search",
  content: null
};

let filters = {
  state: "",
  business: ""
};

let openTabs = [SEARCH_TAB];
let activeTabId = "search";

// -------------------- SEARCH --------------------

function searchDocs(query) {
  const q = (query || "").toLowerCase().trim();
  if (!q) return docs;

  return docs
    .map(doc => {
      let score = 0;

      if (doc.title.toLowerCase().includes(q)) score += 5;
      if (doc.content.toLowerCase().includes(q)) score += 2;

      // bonus for exact word matches
      if (doc.content.toLowerCase().includes("renters") && q.includes("renters")) score += 10;
      if (doc.content.toLowerCase().includes("driver") && q.includes("driver")) score += 10;

      return { doc, score };
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .map(x => x.doc);
}

function renderResults(results, query) {

  const container = document.getElementById("results");

  container.innerHTML = "";

  results.forEach(doc => {

    const card = document.createElement("div");

    card.className = "doc-card";

    card.innerHTML = `
      <div class="card-title">
        ${highlightText(doc.title, query)}
      </div>

      <div class="card-content">
        ${highlightText(getSnippet(doc.content), query)}
      </div>

      <div class="card-meta">
        <span class="badge">${doc.business}</span>
        <span class="states">${doc.states.join(", ")}</span>
      </div>
    `;

    card.onclick = () => openDoc(doc);

    container.appendChild(card);
  });
}

function highlightText(text, query) {

  if (!query) return text;

  const words = query.trim().split(" ");

  let result = text;

  for (let word of words) {

    if (!word) continue;

    const regex = new RegExp(word, "gi");

    result = result.replace(regex, "<mark>$&</mark>");
  }

  return result;
}

function getSnippet(text, length = 180) {

  return text.length > length
    ? text.slice(0, length) + "..."
    : text;
}

function rerunSearch() {

  const query = document.getElementById("search").value.trim();

  const results = searchDocs(query);

  renderResults(results, query);
}

// -------------------- DOC SYSTEM --------------------

function openDoc(doc) {

  const existing = openTabs.find(t => t.id === doc.id);

  if (!existing) {
    openTabs.push(doc);
  }

  activeTabId = doc.id;

  renderTabs();
  renderView();
}

function closeTab(id) {

  openTabs = openTabs.filter(t => t.id !== id);

  if (activeTabId === id) {
    activeTabId = "search";
  }

  renderTabs();
  renderView();
}

// -------------------- TABS --------------------

function renderTabs() {

  const container = document.getElementById("openTabs");

  container.innerHTML = "";

  openTabs.forEach(tab => {

    const tabEl = document.createElement("div");

    tabEl.className = "tab";

    if (tab.id === activeTabId) {
      tabEl.classList.add("active");
    }

    const title = document.createElement("span");

    title.className = "tab-title";
    title.innerText = tab.title;

    tabEl.onclick = () => {

      activeTabId = tab.id;

      renderTabs();
      renderView();
    };

    if (tab.id !== "search") {

      const closeBtn = document.createElement("span");

      closeBtn.className = "close";
      closeBtn.innerText = "×";

      closeBtn.onclick = (e) => {

        e.stopPropagation();

        closeTab(tab.id);
      };

      tabEl.appendChild(title);
      tabEl.appendChild(closeBtn);

    } else {

      tabEl.appendChild(title);
    }

    container.appendChild(tabEl);
  });
}

// -------------------- VIEW --------------------

function renderView() {

  const isSearch = activeTabId === "search";

  if (isSearch) {

    document.getElementById("searchView").style.display = "flex";
    document.getElementById("docView").style.display = "none";

    return;
  }

  const doc = openTabs.find(t => t.id === activeTabId);

  if (!doc) return;

  document.getElementById("searchView").style.display = "none";
  document.getElementById("docView").style.display = "block";

  document.getElementById("docTitle").innerText = doc.title;
  document.getElementById("docContent").innerText = doc.content;
}

// -------------------- AI --------------------

async function askAI(question, doc) {

  const response = await fetch("/.netlify/functions/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: "doc-question",
      question,
      doc
    })
  });

  const data = await response.json();

  // return both so UI can use them
  return {
    answer: data.answer,
    sources: data.sources || []
  };
}

async function generateAiSummary(query, results) {

  const summaryBox = document.getElementById("aiSummary");
  const summaryText = document.getElementById("aiSummaryText");
  const sourcesBox = document.getElementById("aiSources");

  summaryBox.classList.remove("hidden");

  if (!query || results.length === 0) {
    summaryText.innerText = "No relevant results.";
    sourcesBox.innerHTML = "";
    return;
  }

  summaryText.innerText = "Generating summary...";

  // ---------------- SMART GROUPING ----------------
  const grouped = {
    driver: [],
    renters: [],
    other: []
  };

  results.forEach(doc => {
    const text = doc.content.toLowerCase();

    if (text.includes("driver")) grouped.driver.push(doc);
    else if (text.includes("renters")) grouped.renters.push(doc);
    else grouped.other.push(doc);
  });

  const topResults = [
    ...grouped.renters.slice(0, 1),
    ...grouped.driver.slice(0, 1),
    ...grouped.other.slice(0, 1),
  ];

  // ---------------- CALL BACKEND ----------------
  const response = await fetch("/.netlify/functions/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: "search-summary",
      query,
      results: topResults   // 👈 IMPORTANT FIX
    })
  });

  const data = await response.json();

  summaryText.innerText = data.answer;

  // ---------------- SOURCES (from backend) ----------------
  sourcesBox.innerHTML = (data.sources || topResults).map(doc =>
    `<span class="source-link" data-id="${doc.id}">
      📄 ${doc.title}
    </span>`
  ).join(" • ");
}



// -------------------- EVENTS --------------------

document.getElementById("search").addEventListener("input", (e) => {

  const query = e.target.value.trim();

  if (activeTabId !== "search") return;

  const results = searchDocs(query);

  renderResults(results, query);
});

document.getElementById("generateSummaryBtn")
.addEventListener("click", () => {

  const query = document.getElementById("search").value.trim();

  const results = searchDocs(query);

  generateAiSummary(query, results);
});

document.getElementById("askBtn")
.addEventListener("click", async () => {

  const question = document.getElementById("docQuestion").value;
  const doc = openTabs.find(t => t.id === activeTabId);

  if (!doc) return;

  const answerBox = document.getElementById("aiAnswer");
  const sourcesBox = document.getElementById("chatSources"); // make sure this exists

  answerBox.innerText = "Thinking...";
  if (sourcesBox) sourcesBox.innerHTML = "";

  try {
    const result = await askAI(question, doc);

    answerBox.innerText = result.answer;

    if (sourcesBox) {
      sourcesBox.innerHTML = (result.sources || []).map(d =>
        `<span class="source-link" data-id="${d.id}">
          ${d.title}
        </span>`
      ).join(" • ");
    }

  } catch (err) {
    console.error(err);
    answerBox.innerText = "Error getting AI response.";
  }
});

document.addEventListener("click", (e) => {

  if (e.target.classList.contains("source-link")) {

    const id = e.target.dataset.id;

    const doc = docs.find(d => d.id === id);

    if (doc) {
      openDoc(doc);
    }
  }
});

document.getElementById("stateSelect").addEventListener("change", (e) => {
  filters.state = e.target.value;
  rerunSearch();
});

document.getElementById("businessSelect").addEventListener("change", (e) => {
  filters.business = e.target.value;
  rerunSearch();
});

document.getElementById("chatSendBtn").addEventListener("click", sendChat);
document.getElementById("chatInput").addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendChat();
});

//------------------Chat Bot------------

async function sendChat() {

  const input = document.getElementById("chatInput");
  const message = input.value.trim();

  if (!message) return;

  input.value = "";

  addMessage("user", message);

  const context = buildChatContext(message);

  addMessage("ai", "Thinking...");

  const response = await fetch("/.netlify/functions/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: "chat",
      message,
      context
    })
  });

  const data = await response.json();

  removeLastAIMessage();
  addMessage("ai", data.answer);
}

function addMessage(type, text) {
  const container = document.getElementById("chatMessages");

  const msg = document.createElement("div");
  msg.className = `msg ${type}`;
  msg.innerText = text;

  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function removeLastAIMessage() {
  const container = document.getElementById("chatMessages");
  const msgs = container.querySelectorAll(".msg.ai");

  if (msgs.length) {
    msgs[msgs.length - 1].remove();
  }
}

function buildChatContext(message) {

  if (!docs || !docs.length) {
    return "NO DOCUMENTS LOADED";
  }

  const q = message.toLowerCase();

  const scored = docs.map(doc => {

    let score = 0;

    const title = doc.title.toLowerCase();
    const content = doc.content.toLowerCase();

    // keyword match
    if (title.includes(q)) score += 5;
    if (content.includes(q)) score += 2;

    // insurance type boosting
    if (q.includes("renters") && content.includes("rent")) score += 10;
    if (q.includes("driver") && content.includes("driver")) score += 10;
    if (q.includes("coverage") && content.includes("coverage")) score += 4;

    return { doc, score };
  });

  const relevantDocs = scored
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5)
    .map(x => x.doc);

  const finalDocs = relevantDocs.length
    ? relevantDocs
    : docs.slice(0, 3);

  return finalDocs.map(doc => `
DOC ID: ${doc.id}
TITLE: ${doc.title}
CONTENT:
${doc.content.slice(0, 500)}
`).join("\n\n---\n\n");
}

const chatToggleBtn = document.getElementById("chatToggleBtn");
const chatbot = document.getElementById("chatbot");

let isMinimized = false;

chatToggleBtn.addEventListener("click", () => {
  isMinimized = !isMinimized;

  if (isMinimized) {
    chatbot.classList.add("minimized");
    chatToggleBtn.innerText = "+";
  } else {
    chatbot.classList.remove("minimized");
    chatToggleBtn.innerText = "−";
  }
});

// -------------------- INIT --------------------

renderTabs();
renderView();