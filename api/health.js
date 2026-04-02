const model = process.env.OPENAI_MODEL || "gpt-5-mini";

export default function handler(_req, res) {
  return res.json({
    ok: true,
    model,
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
  });
}
