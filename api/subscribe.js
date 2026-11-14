// Vercel serverless function: POST /api/subscribe { email }
// Adds the email to the Kit newsletter form. The Kit API key stays on the server.
//
// Env vars (Vercel → Project → Settings → Environment Variables):
//   KIT_API_KEY  – Kit → Settings → Developer → API keys (v4)
//   KIT_FORM_ID  – the number in the form's URL in Kit (app.kit.com/forms/<id>/...)

const KIT_API = "https://api.kit.com/v4";
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const kitPost = (path, body, apiKey) =>
  fetch(`${KIT_API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Kit-Api-Key": apiKey },
    body: JSON.stringify(body),
  });

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { KIT_API_KEY, KIT_FORM_ID } = process.env;
  if (!KIT_API_KEY || !KIT_FORM_ID) {
    console.error("Newsletter: KIT_API_KEY or KIT_FORM_ID is not set.");
    return res.status(500).json({ error: "Newsletter is not configured." });
  }

  const body = typeof req.body === "string" ? safeParse(req.body) : req.body;
  const email = String(body?.email ?? "").trim().toLowerCase();
  // Honeypot: bots fill hidden fields; pretend it worked.
  if (body?.website) return res.status(200).json({ ok: true });
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  try {
    // 1) Create the subscriber (Kit treats this as an upsert).
    const created = await kitPost("/subscribers", { email_address: email }, KIT_API_KEY);
    if (created.status === 422) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }
    if (!created.ok) throw new Error(`Kit create subscriber failed: ${created.status}`);

    // 2) Add them to the newsletter form (200 = already on it, 201 = added).
    const added = await kitPost(
      `/forms/${encodeURIComponent(KIT_FORM_ID)}/subscribers`,
      { email_address: email, referrer: req.headers.referer || null },
      KIT_API_KEY
    );
    if (!added.ok) throw new Error(`Kit add to form failed: ${added.status}`);

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error("Newsletter:", error.message);
    return res.status(502).json({ error: "Couldn't subscribe right now. Please try again later." });
  }
}

function safeParse(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}
