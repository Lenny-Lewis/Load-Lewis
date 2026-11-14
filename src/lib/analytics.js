import Clarity from "@microsoft/clarity";

// Clarity only loads in production (see main.jsx). Calling it before init throws,
// so every call is skipped when it isn't loaded, and analytics can never break the UI.
const isLoaded = () => typeof window !== "undefined" && typeof window.clarity === "function";

/**
 * Record a Clarity custom event, optionally with tags (key -> string value).
 * Never pass personal data (names, emails, messages) as tags.
 */
export function track(eventName, tags = {}) {
  if (!isLoaded()) return;
  try {
    for (const [key, value] of Object.entries(tags)) {
      if (value != null && value !== "") Clarity.setTag(key, String(value));
    }
    Clarity.event(eventName);
  } catch {
    // Analytics must never interrupt the visitor.
  }
}
