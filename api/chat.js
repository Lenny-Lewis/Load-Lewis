import { buildPortfolioContext } from "../src/data/portfolioChatbot.js";

const model = process.env.OPENAI_MODEL || "gpt-5-mini";
const portfolioContext = buildPortfolioContext();

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed." });
  }

  const question = req.body?.question?.trim();

  if (!question) {
    return res.status(400).json({ error: "A question is required." });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({
      error: "OPENAI_API_KEY is not configured on the server.",
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        input: [
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text:
                  "You are the portfolio assistant for Lennox Lewis. Answer only using the portfolio context provided. If the answer is not in the context, say that clearly and direct the user to contact Lennox for more detail. Keep answers concise, useful, and accurate.",
              },
            ],
          },
          {
            role: "system",
            content: [
              {
                type: "input_text",
                text: `Portfolio context:\n${portfolioContext}`,
              },
            ],
          },
          {
            role: "user",
            content: [{ type: "input_text", text: question }],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();

      return res.status(response.status).json({
        error: "OpenAI request failed.",
        details: errorText,
      });
    }

    const data = await response.json();

    return res.json({
      answer:
        data.output_text ||
        "I couldn't generate a response from the portfolio context.",
    });
  } catch (error) {
    return res.status(500).json({
      error: "Unexpected server error.",
      details: error instanceof Error ? error.message : String(error),
    });
  }
}
