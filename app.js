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

  return docs.filter(doc => {

    const matchesText =
      doc.title.toLowerCase().includes(q) ||
      doc.content.toLowerCase().includes(q);

    const matchesState =
      !filters.state || doc.states.includes(filters.state);

    const matchesBusiness =
      !filters.business || doc.business === filters.business;

    return matchesText && matchesState && matchesBusiness;
  });
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

  return data.answer;
}

async function generateAiSummary(query, results) {

  const summaryBox = document.getElementById("aiSummary");
  const summaryText = document.getElementById("aiSummaryText");
  const sourcesBox = document.getElementById("aiSources");

  summaryBox.classList.remove("hidden");

  if (!query || results.length === 0) {

    summaryText.innerText = "No relevant results to summarize.";

    sourcesBox.innerHTML = "";

    return;
  }

  summaryText.innerText = "Generating summary...";

  const topResults = results.slice(0, 3);

  const response = await fetch("/.netlify/functions/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type: "search-summary",
      query,
      results: topResults
    })
  });

  const data = await response.json();

  summaryText.innerText = data.answer;

  sourcesBox.innerHTML = topResults.map(doc =>
    `<span class="source-link" data-id="${doc.id}">
      ${doc.title}
    </span>`
  ).join(" • ");
}

// -------------------- EVENTS --------------------

document.getElementById("search").addEventListener("input", (e) => {

  const query = e.target.value.trim();

  if (activeTabId !== "search") {
    return;
  }

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

  answerBox.innerText = "Thinking...";

  try {

    const answer = await askAI(question, doc);

    answerBox.innerText = answer;

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

// -------------------- INIT --------------------

renderTabs();
renderView();