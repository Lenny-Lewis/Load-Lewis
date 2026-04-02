import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

import TitleHeader from "../components/TitleHeader";
import {
  getPortfolioChatReply,
  portfolioProfile,
  suggestedPrompts,
} from "../data/portfolioChatbot";

const assistantWelcome = {
  role: "assistant",
  text: `Ask about ${portfolioProfile.name}'s featured projects, experience, technical strengths, or how to get in touch.`,
  followUps: suggestedPrompts.slice(0, 3),
};

const typedPhrases = [
  "featured projects",
  "frontend expertise",
  "mobile app work",
  "how to get in touch",
];

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: "easeOut",
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

const PortfolioChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([assistantWelcome]);
  const [typedText, setTypedText] = useState("");
  const [typedIndex, setTypedIndex] = useState(0);
  const messagesRef = useRef(null);

  const quickPrompts = useMemo(() => suggestedPrompts, []);
  const insightCards = useMemo(
    () => [
      {
        label: "Projects",
        value: `${portfolioProfile.projects.length}+`,
        detail: "Selected builds featured in this portfolio.",
      },
      {
        label: "Focus",
        value: "Web + Mobile",
        detail: "React, React Native, frontend systems, and product work.",
      },
      {
        label: "Based In",
        value: portfolioProfile.location,
        detail: "Available for conversations through the contact section.",
      },
    ],
    []
  );

  useEffect(() => {
    const currentPhrase = typedPhrases[typedIndex];
    let currentIndex = 0;

    const typingInterval = window.setInterval(() => {
      currentIndex += 1;
      setTypedText(currentPhrase.slice(0, currentIndex));

      if (currentIndex >= currentPhrase.length) {
        window.clearInterval(typingInterval);

        window.setTimeout(() => {
          setTypedText("");
          setTypedIndex((current) => (current + 1) % typedPhrases.length);
        }, 1400);
      }
    }, 55);

    return () => window.clearInterval(typingInterval);
  }, [typedIndex]);

  useEffect(() => {
    const container = messagesRef.current;

    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  const submitQuestion = (question) => {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) return;

    const reply = getPortfolioChatReply(trimmedQuestion);

    setMessages((current) => [
      ...current,
      { role: "user", text: trimmedQuestion },
      { role: "assistant", text: reply.text, followUps: reply.followUps },
    ]);
    setDraft("");
    setIsOpen(true);
  };

  const resetChat = () => {
    setMessages([assistantWelcome]);
    setDraft("");
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
            title="Ask About Lenny's Work"
            sub="🤖 Portfolio Assistant"
          />

          <motion.div
            className="chatbot-section mt-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
          >
            <motion.div
              className="chatbot-info card-border"
              variants={itemVariants}
              whileInView={{ y: [18, 0], opacity: [0, 1] }}
              viewport={{ once: true, amount: 0.25 }}
            >
              <p className="chatbot-kicker">Ask anything</p>
              <h3>
                Explore Lennox Lewis&apos;s{" "}
                <span className="chatbot-typed">{typedText}</span>
                <span className="chatbot-caret" />
              </h3>
              <p className="chatbot-copy">
                Use the assistant to learn about selected work, development
                experience, core technologies, and contact details without
                digging through every section of the portfolio manually.
              </p>
              <div className="chatbot-summary-grid">
                {insightCards.map((card) => (
                  <motion.div
                    key={card.label}
                    className="chatbot-summary-card"
                    variants={itemVariants}
                    whileHover={{ y: -4, scale: 1.01 }}
                  >
                    <p className="chatbot-summary-label">{card.label}</p>
                    <h4>{card.value}</h4>
                    <p>{card.detail}</p>
                  </motion.div>
                ))}
              </div>
              <div className="chatbot-tags">
                {quickPrompts.map((prompt) => (
                  <motion.button
                    key={prompt}
                    type="button"
                    className="chatbot-chip"
                    onClick={() => submitQuestion(prompt)}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {prompt}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              className="chatbot-panel card-border"
              variants={itemVariants}
              whileInView={{ y: [24, 0], opacity: [0, 1] }}
              viewport={{ once: true, amount: 0.25 }}
            >
              <div className="chatbot-panel-header">
                <div>
                  <p className="chatbot-kicker">Portfolio chat</p>
                  <h3>Ask Lenny&apos;s portfolio assistant</h3>
                </div>
                <div className="chatbot-actions">
                  <button
                    type="button"
                    className="chatbot-reset"
                    onClick={resetChat}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="chatbot-toggle"
                    onClick={() => setIsOpen((current) => !current)}
                  >
                    {isOpen ? "Collapse" : "Open chat"}
                  </button>
                </div>
              </div>

              <div className={`chatbot-shell ${isOpen ? "open" : ""}`}>
                <motion.div
                  className="chatbot-messages"
                  ref={messagesRef}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                >
                  {messages.map((message, index) => (
                    <motion.div
                      key={`${message.role}-${index}`}
                      className={`chatbot-message ${message.role}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.28, ease: "easeOut" }}
                    >
                      <span className="chatbot-badge">
                        {message.role === "assistant" ? "AI" : "You"}
                      </span>
                      <p>{message.text}</p>
                      {message.role === "assistant" &&
                        message.followUps?.length > 0 && (
                          <div className="chatbot-followups">
                            {message.followUps.map((followUp) => (
                              <button
                                key={`${message.role}-${index}-${followUp}`}
                                type="button"
                                className="chatbot-followup"
                                onClick={() => submitQuestion(followUp)}
                              >
                                {followUp}
                              </button>
                            ))}
                          </div>
                        )}
                    </motion.div>
                  ))}
                </motion.div>

                <form onSubmit={handleSubmit} className="chatbot-form">
                  <input
                    type="text"
                    value={draft}
                    onChange={(event) => setDraft(event.target.value)}
                    placeholder="Ask about projects, skills, or experience"
                  />
                  <button type="submit" className="chatbot-send">
                    Send
                  </button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <motion.button
        type="button"
        className="chatbot-fab"
        onClick={() => {
          setIsOpen(true);
          document
            .getElementById("chatbot")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }}
        aria-label="Open portfolio chatbot"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ y: -3, scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
      >
        <span>Ask AI</span>
      </motion.button>
    </>
  );
};

export default PortfolioChatbot;
