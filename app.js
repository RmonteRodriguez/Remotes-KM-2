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
let aiTimeout;

const GEMINI_API_KEY = import.meta.env.GEMINI_API;

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


// -------------------- DOC / TAB SYSTEM --------------------

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
    activeTabId = openTabs.length ? openTabs[0].id : null;
  }

  renderTabs();
  renderView();
}


// -------------------- RENDER TABS --------------------

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

// -------------------- ACTIVE DOC --------------------
function renderView() {
  const isSearch = activeTabId === "search";

  const results = document.getElementById("results");
  const searchInput = document.getElementById("search");

  const titleEl = document.getElementById("docTitle");
  const contentEl = document.getElementById("docContent");

  if (isSearch) {
    titleEl.innerText = "Search";
    contentEl.innerText = "";

    // reset search UI
    if (searchInput) searchInput.value = "";
    if (results) results.innerHTML = "";

    document.getElementById("searchView").style.display = "flex";
    document.getElementById("docView").style.display = "none";

    return;
  }

  const doc = openTabs.find(t => t.id === activeTabId);

  if (!doc) return;

  document.getElementById("searchView").style.display = "none";
  document.getElementById("docView").style.display = "block";

  titleEl.innerText = doc.title;
  contentEl.innerText = doc.content;
}

function rerunSearch() {
  const query = document.getElementById("search").value;
  const results = searchDocs(query);
  renderResults(results, query);
  generateAiSummary(query, results);
}

function getSnippet(text, length = 180) {
  return text.length > length
    ? text.slice(0, length) + "..."
    : text;
}

async function askAI(question, doc) {
  const prompt = `
You are an insurance knowledge assistant.

Only use the document below to answer the question.

If the answer is not in the document, say: "Not found in this document."

DOCUMENT TITLE:
${doc.title}

DOCUMENT CONTENT:
${doc.content}

QUESTION:
${question}
`;

  const response = await fetch(
`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    }
  );

  const data = await response.json();
  console.log("FULL GEMINI RESPONSE:", data);

  if (!response.ok) {
    console.log("REQUEST FAILED:", data);
    return "API request failed (check console)";
  }

  if (!data.candidates || !data.candidates.length) {
    console.log("NO CANDIDATES:", data);
    return "No response received (check console)";
  }

  return data.candidates[0].content.parts[0].text;
}

async function callGeminiSummary(query, context) {
  const prompt = `
You are an assistant inside an insurance knowledge base tool.

User query:
${query}

Documents provided:
${context}

Rules:
- Summarize in 2–5 sentences
- Use ONLY provided documents
- Include document IDs like [driver_status_nc]
- Do NOT hallucinate
`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      })
    }
  );

  const data = await response.json();
  console.log("GEMINI RESPONSE:", data);

  if (!response.ok) {
    console.error("GEMINI ERROR:", data);
    return "AI summary unavailable.";
  }

  return data?.candidates?.[0]?.content?.parts?.[0]?.text
    || "No summary returned.";
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

  const context = topResults.map(doc => `
DOCUMENT ID: ${doc.id}
TITLE: ${doc.title}
CONTENT:
${doc.content.slice(0, 300)}
`).join("\n\n----------------\n\n");

  try {
    const summary = await callGeminiSummary(query, context);
    summaryText.innerText = summary;
  } catch (err) {
    console.error("SUMMARY ERROR:", err);
    summaryText.innerText = "AI failed (check console)";
  }

  sourcesBox.innerHTML = topResults.map(doc =>
    `<span class="source-link" data-id="${doc.id}">
      ${doc.title}
    </span>`
  ).join(" • ");
}

function createLocalSummary(query, context) {
  const q = query?.toLowerCase() || "";

  if (q.includes("driver")) {
    return "Driver status rules vary by state. Most policies require all household members of driving age to be disclosed, and some states restrict exclusions.";
  }

  if (q.includes("coverage")) {
    return "Coverage typically includes liability, collision, and comprehensive. Each protects different types of loss depending on the situation.";
  }

  if (q.includes("renters")) {
    return "Renters insurance often includes liability protection and may restrict certain animal types depending on carrier rules.";
  }

  return "Multiple documents match your search. Results include policy guidelines, coverage rules, and underwriting requirements.";
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

document.getElementById("stateSelect").addEventListener("change", (e) => {
  filters.state = e.target.value;
  rerunSearch();
});

document.getElementById("businessSelect").addEventListener("change", (e) => {
  filters.business = e.target.value;
  rerunSearch();
});

document.getElementById("askBtn").addEventListener("click", async () => {
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
    if (doc) openDoc(doc);
  }
});

document.getElementById("generateSummaryBtn")
.addEventListener("click", () => {

  const query = document.getElementById("search").value.trim();

  const results = searchDocs(query);

  generateAiSummary(query, results);
});

// -------------------- INIT --------------------

renderTabs();
renderView();