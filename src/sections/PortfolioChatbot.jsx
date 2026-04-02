import { useMemo, useState } from "react";

import TitleHeader from "../components/TitleHeader";
import {
  getPortfolioChatReply,
  portfolioProfile,
  suggestedPrompts,
} from "../data/portfolioChatbot";

const assistantWelcome = {
  role: "assistant",
  text: `Ask me about ${portfolioProfile.name}'s projects, experience, skills, or how to contact him.`,
};

const apiBaseUrl = (import.meta.env.VITE_API_BASE_URL || "/api").replace(
  /\/$/,
  ""
);

const PortfolioChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([assistantWelcome]);
  const [isLoading, setIsLoading] = useState(false);

  const quickPrompts = useMemo(() => suggestedPrompts, []);

  const submitQuestion = async (question) => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) return;

    setMessages((current) => [...current, { role: "user", text: trimmedQuestion }]);
    setDraft("");
    setIsOpen(true);
    setIsLoading(true);

    try {
      const response = await fetch(`${apiBaseUrl}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: trimmedQuestion }),
      });

      if (!response.ok) {
        throw new Error("API request failed");
      }

      const data = await response.json();

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text:
            data.answer ||
            "I couldn't generate a response from the portfolio context.",
        },
      ]);
    } catch {
      const fallbackReply = getPortfolioChatReply(trimmedQuestion);

      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          text: `${fallbackReply} This answer is using the local portfolio fallback because the API is not available yet.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitQuestion(draft);
  };

  return (
    <>
      <section id="chatbot" className="section-padding">
        <div className="w-full md:px-10 px-5">
          <TitleHeader
            title="AI Chatbot About Lenny"
            sub="🤖 Ask About My Work"
          />

          <div className="chatbot-section mt-16">
            <div className="chatbot-info card-border">
              <p className="chatbot-kicker">Portfolio assistant</p>
              <h3>Let visitors explore your CV and projects in conversation.</h3>
              <p className="chatbot-copy">
                This assistant answers from the portfolio content already on the
                site, so users can ask about projects, technical strengths,
                experience, and contact details without digging through every
                section.
              </p>
              <div className="chatbot-tags">
                {quickPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className="chatbot-chip"
                    onClick={() => submitQuestion(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>

            <div className="chatbot-panel card-border">
              <div className="chatbot-panel-header">
                <div>
                  <p className="chatbot-kicker">Live demo</p>
                  <h3>Chat with Lenny&apos;s portfolio</h3>
                </div>
                <button
                  type="button"
                  className="chatbot-toggle"
                  onClick={() => setIsOpen((current) => !current)}
                >
                  {isOpen ? "Collapse" : "Open chat"}
                </button>
              </div>

              <div className={`chatbot-shell ${isOpen ? "open" : ""}`}>
                <div className="chatbot-messages">
                  {messages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`chatbot-message ${message.role}`}
                    >
                      <span className="chatbot-badge">
                        {message.role === "assistant" ? "AI" : "You"}
                      </span>
                      <p>{message.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSubmit} className="chatbot-form">
                  <input
                    type="text"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Ask about projects, skills, or experience"
                    disabled={isLoading}
                  />
                  <button
                    type="submit"
                    className="chatbot-send"
                    disabled={isLoading}
                  >
                    {isLoading ? "Thinking..." : "Send"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <button
        type="button"
        className="chatbot-fab"
        onClick={() => {
          setIsOpen(true);
          document
            .getElementById("chatbot")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        aria-label="Open portfolio chatbot"
      >
        <span>Ask AI</span>
      </button>
    </>
  );
};

export default PortfolioChatbot;
