exports.handler = async function(event) {

  try {

    const body = JSON.parse(event.body);

    const apiKey = process.env.GEMINI_API;

    let prompt = "";

    // SEARCH SUMMARY
    if (body.type === "search-summary") {

      const context = body.results.map(doc => `
DOCUMENT ID: ${doc.id}
TITLE: ${doc.title}
CONTENT:
${doc.content.slice(0, 300)}
      `).join("\n\n----------------\n\n");

      prompt = `
You are an assistant inside an insurance knowledge base tool.

User query:
${body.query}

Documents provided:
${context}

Rules:
- Summarize in 2-5 sentences
- Use ONLY provided documents
- Include document IDs like [driver_status_nc]
- Do NOT hallucinate
      `;
    }

    // DOC QUESTION
    if (body.type === "doc-question") {

      prompt = `
You are an insurance knowledge assistant.

Only use the document below to answer the question.

If the answer is not in the document, say:
"Not found in this document."

DOCUMENT TITLE:
${body.doc.title}

DOCUMENT CONTENT:
${body.doc.content}

QUESTION:
${body.question}
      `;
    }

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
              parts: [{ text: prompt }]
            }
          ]
        })
      }
    );

    const data = await response.json();

    const answer =
      data?.candidates?.[0]?.content?.parts?.[0]?.text
      || "No response returned.";

    return {
      statusCode: 200,
      body: JSON.stringify({
        answer
      })
    };

  } catch (err) {

    console.error(err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        answer: "Server error."
      })
    };
  }
};