exports.handler = async function (event) {
  try {
    const body = JSON.parse(event.body || "{}");
    const apiKey = process.env.GEMINI_API;

    let prompt = "";
    let sources = [];

    // ---------------- CHAT MODE ----------------
if (body.type === "chat") {

  const { message, context } = body;

  sources = context
    .split("DOC ID:")
    .slice(1)
    .map(block => {
      const id = block.split("\n")[0].trim();

      const titleMatch = block.match(/TITLE:\s*(.*)/);
      const title = titleMatch ? titleMatch[1].trim() : "Unknown";

      return { id, title };
    });

  prompt = `
You are an insurance knowledge assistant.

RULES:
- Only use provided context
- If unrelated, say: "No relevant document found"

CONTEXT:
${context}

QUESTION:
${message}
`;
}

    // ---------------- DOC QUESTION ----------------
    else if (body.type === "doc-question") {

      const { doc, question } = body;

      sources = [{ id: doc.id, title: doc.title }];

      prompt = `
You are an insurance knowledge assistant.

Only use this document.

TITLE:
${doc.title}

CONTENT:
${doc.content}

QUESTION:
${question}

If not found say: Not found in this document.
`;
    }

    // ---------------- SEARCH SUMMARY ----------------
    else if (body.type === "search-summary") {

      const { query, results } = body;

      sources = results.map(doc => ({
        id: doc.id,
        title: doc.title
      }));

      const context = results.map(doc => `
DOC ID: ${doc.id}
TITLE: ${doc.title}
CONTENT:
${doc.content.slice(0, 400)}
`).join("\n\n---\n\n");

      prompt = `
Summarize these insurance documents.

User query: ${query}

Use ONLY provided documents.

Docs:
${context}
`;
    }

    // ---------------- INVALID TYPE ----------------
    else {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Invalid type" })
      };
    }

    // ---------------- CALL GEMINI ----------------
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
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

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response returned.";

    // ---------------- FINAL RESPONSE ----------------
    return {
      statusCode: 200,
      body: JSON.stringify({
        answer,
        sources
      })
    };

  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "Server error"
      })
    };
  }
};