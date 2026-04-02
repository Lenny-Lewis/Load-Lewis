const suggestedPrompts = [
  "What projects has Lenny done?",
  "What technologies does Lenny use?",
  "Tell me about Lenny's experience",
  "How can I contact Lenny?",
];

const portfolioProfile = {
  name: "Lennox Lewis",
  role: "Frontend and full stack developer",
  location: "Kenya",
  intro:
    "Lennox is a developer based in Kenya who builds polished web and mobile products with a strong focus on performance, usability, and clean implementation.",
  strengths: [
    "React and React Native product development",
    "Frontend architecture and UI implementation",
    "Backend integration and API-driven features",
    "Performance optimization and scalable app delivery",
  ],
  projects: [
    {
      name: "Ryde",
      summary:
        "An on-demand rides app built with React Native, Expo, and Tailwind CSS for a fast and user-friendly experience.",
      stack: ["React Native", "Expo", "Tailwind CSS"],
      keywords: ["project", "projects", "ryde", "ride", "mobile", "app"],
    },
    {
      name: "Library Management Platform",
      summary:
        "A platform for managing library workflows, collections, and day-to-day user interactions.",
      stack: ["React", "Frontend UI", "Platform Architecture"],
      keywords: ["project", "projects", "library", "management", "platform"],
    },
    {
      name: "YC Directory",
      summary:
        "A startup showcase application designed to surface founders, ideas, and early-stage products in a clean directory experience.",
      stack: ["React", "Directory UI", "Startup Discovery"],
      keywords: ["project", "projects", "yc", "directory", "startup"],
    },
  ],
  experience: [
    {
      title: "Frontend Developer",
      period: "January 2023 - Present",
      summary:
        "Develops and maintains user-facing features, collaborates with design teams, and optimizes web applications for speed and scalability.",
      keywords: ["experience", "frontend", "career", "work", "job"],
    },
    {
      title: "Full Stack Developer",
      period: "June 2024 - Present",
      summary:
        "Builds scalable web applications, integrates frontend and backend systems, and contributes to product-focused engineering work.",
      keywords: ["experience", "full stack", "backend", "api", "career"],
    },
    {
      title: "React Native Developer",
      period: "March 2025 - Present",
      summary:
        "Ships cross-platform mobile apps, improves performance, and works with product teams to turn feedback into features.",
      keywords: ["experience", "react native", "mobile", "career", "apps"],
    },
  ],
  contact: {
    emailPrompt: "Use the contact form in the portfolio to send a message directly.",
    github: "https://github.com/Lenny-Lewis",
    instagram: "https://www.instagram.com/thatboylewis?igsh=aTdxN3VqYW5qZG45",
    x: "https://x.com/thatboylewis",
    linkedin: "https://www.linkedin.com/in/lennox-lewis-975642359",
  },
};

const normalizeText = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const includesAny = (tokens, candidates) =>
  candidates.some((candidate) => tokens.includes(candidate));

const getProjectsReply = () => {
  const lines = portfolioProfile.projects.map(
    (project) =>
      `${project.name}: ${project.summary} Stack: ${project.stack.join(", ")}.`
  );

  return `Lennox has worked on ${portfolioProfile.projects.length} standout portfolio projects. ${lines.join(
    " "
  )}`;
};

const getExperienceReply = () => {
  const lines = portfolioProfile.experience.map(
    (item) => `${item.title} (${item.period}): ${item.summary}`
  );

  return `Lennox's recent experience spans frontend, full stack, and React Native roles. ${lines.join(
    " "
  )}`;
};

const getSkillsReply = () =>
  `Lennox primarily works with ${portfolioProfile.strengths.join(
    ", "
  )}. His portfolio also highlights React, Python, Node.js, Three.js, and Git.`;

const getContactReply = () =>
  `The best way to reach Lennox is through the contact form on this site. You can also find him on GitHub (${portfolioProfile.contact.github}), LinkedIn (${portfolioProfile.contact.linkedin}), X (${portfolioProfile.contact.x}), and Instagram (${portfolioProfile.contact.instagram}).`;

const getIntroReply = () =>
  `${portfolioProfile.intro} His strongest areas are ${portfolioProfile.strengths.join(
    ", "
  )}.`;

export const getPortfolioChatReply = (question) => {
  const tokens = normalizeText(question);

  if (!tokens.length) {
    return "Ask about projects, skills, experience, or contact details and I’ll answer from Lennox's portfolio content.";
  }

  if (
    includesAny(tokens, ["project", "projects", "portfolio", "build", "built"])
  ) {
    return getProjectsReply();
  }

  if (
    includesAny(tokens, [
      "skill",
      "skills",
      "tech",
      "stack",
      "technology",
      "technologies",
      "tools",
    ])
  ) {
    return getSkillsReply();
  }

  if (
    includesAny(tokens, [
      "experience",
      "career",
      "work",
      "role",
      "roles",
      "job",
      "jobs",
    ])
  ) {
    return getExperienceReply();
  }

  if (
    includesAny(tokens, [
      "contact",
      "email",
      "hire",
      "reach",
      "book",
      "connect",
      "social",
    ])
  ) {
    return getContactReply();
  }

  if (
    includesAny(tokens, [
      "who",
      "about",
      "lenny",
      "lennox",
      "introduce",
      "intro",
    ])
  ) {
    return getIntroReply();
  }

  return "I can answer questions about Lennox's projects, skills, experience, and contact details. Try asking what he has built, what technologies he uses, or how to get in touch.";
};

export { portfolioProfile, suggestedPrompts };
