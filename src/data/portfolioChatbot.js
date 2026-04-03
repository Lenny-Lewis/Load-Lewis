const suggestedPrompts = [
  "What projects has Lenny done?",
  "What technologies does Lenny use?",
  "Tell me about Lenny's experience",
  "How can I contact Lenny?",
  "Hi",
  "What kind of work does Lenny do?",
  "Is Lenny available for freelance work?",
];

const defaultFollowUps = [
  "What projects has Lenny done?",
  "What technologies does Lenny use?",
  "How can I contact Lenny?",
];

const portfolioProfile = {
  name: "Lennox Lewis Odhiambo",
  role: "Frontend and full stack developer",
  location: "Kenya",
  age: "21",
  education: "Kisii University, Year 3 student",
  height: "6 foot flat",
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
      name: "YG Directory",
      summary:
        "A startup showcase application designed to surface founders, ideas, and early-stage products in a clean directory experience.",
      stack: ["React", "Directory UI", "Startup Discovery"],
      keywords: ["project", "projects", "yg", "yc", "directory", "startup"],
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
  services: [
    "Frontend web development",
    "Full stack product development",
    "React Native app development",
    "UI implementation and performance optimization",
  ],
  funFacts: ["Loves anime", "Enjoys basketball", "Plays video games"],
};

const normalizeText = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const includesAny = (tokens, candidates) =>
  candidates.some((candidate) => tokens.includes(candidate));

const createChatReply = (text, followUps = defaultFollowUps) => ({
  text,
  followUps,
});

const getProjectByKeyword = (tokens) =>
  portfolioProfile.projects.find((project) =>
    project.keywords.some((keyword) => tokens.includes(keyword))
  );

const getProjectsReply = () => {
  const lines = portfolioProfile.projects.map(
    (project) =>
      `${project.name}: ${project.summary} Stack: ${project.stack.join(", ")}.`
  );

  return createChatReply(
    `Lennox has worked on ${portfolioProfile.projects.length} standout portfolio projects. ${lines.join(
      " "
    )}`,
    [
      "Tell me about Ryde",
      "Tell me about the Library Management Platform",
      "Tell me about YG Directory",
    ]
  );
};

const getProjectDetailReply = (project) =>
  createChatReply(
    `${project.name} is one of Lennox's featured projects. ${project.summary} The main stack highlighted for it is ${project.stack.join(
      ", "
    )}.`,
    ["What technologies does Lenny use?", "Tell me about Lenny's experience", "How can I contact Lenny?"]
  );

const getExperienceReply = () => {
  const lines = portfolioProfile.experience.map(
    (item) => `${item.title} (${item.period}): ${item.summary}`
  );

  return createChatReply(
    `Lennox's recent experience spans frontend, full stack, and React Native roles. ${lines.join(
      " "
    )}`,
    ["What kind of work does Lenny do?", "What technologies does Lenny use?", "How can I contact Lenny?"]
  );
};

const getSkillsReply = () =>
  createChatReply(
    `Lennox primarily works with ${portfolioProfile.strengths.join(
      ", "
    )}. His portfolio also highlights React, Python, Node.js, Three.js, and Git.`,
    ["What projects has Lenny done?", "Tell me about Lenny's experience", "Is Lenny available for freelance work?"]
  );

const getContactReply = () =>
  createChatReply(
    `The best way to reach Lennox is through the contact form on this site. You can also find him on GitHub (${portfolioProfile.contact.github}), LinkedIn (${portfolioProfile.contact.linkedin}), X (${portfolioProfile.contact.x}), and Instagram (${portfolioProfile.contact.instagram}).`,
    ["Is Lenny available for freelance work?", "What kind of work does Lenny do?", "What projects has Lenny done?"]
  );

const getIntroReply = () =>
  createChatReply(
    `${portfolioProfile.intro} His strongest areas are ${portfolioProfile.strengths.join(
      ", "
    )}.`,
    ["What kind of work does Lenny do?", "Tell me about Lenny's experience", "What technologies does Lenny use?"]
  );

const getGreetingReply = () =>
  createChatReply(
    `Hi. I can help you learn about ${portfolioProfile.name}'s projects, experience, technical strengths, and contact details.`,
    ["What projects has Lenny done?", "What kind of work does Lenny do?", "How can I contact Lenny?"]
  );

const getHelpReply = () =>
  createChatReply(
    "You can ask about featured projects, experience, technologies, services, contact details, availability, or background.",
    ["Tell me about Ryde", "What technologies does Lenny use?", "How old is Lenny?"]
  );

const getServicesReply = () =>
  createChatReply(
    `${portfolioProfile.name} focuses on ${portfolioProfile.services.join(
      ", "
    )}.`,
    ["Is Lenny available for freelance work?", "What projects has Lenny done?", "How can I contact Lenny?"]
  );

const getAvailabilityReply = () =>
  createChatReply(
    `For current availability, the best option is to contact ${portfolioProfile.name} directly through the contact form on this site or via LinkedIn.`,
    ["How can I contact Lenny?", "What kind of work does Lenny do?", "What projects has Lenny done?"]
  );

const getLocationReply = () =>
  createChatReply(
    `${portfolioProfile.name} is based in ${portfolioProfile.location}.`,
    ["Where does Lenny study?", "How old is Lenny?", "What does Lenny do for fun?"]
  );

const getNameReply = () =>
  createChatReply(`His full name is ${portfolioProfile.name}.`, [
    "How old is Lenny?",
    "Where does Lenny study?",
    "What does Lenny do for fun?",
  ]);

const getAgeReply = () =>
  createChatReply(`${portfolioProfile.name} is ${portfolioProfile.age} years old.`, [
    "Where does Lenny study?",
    "How tall is Lenny?",
    "What does Lenny do for fun?",
  ]);

const getHeightReply = () =>
  createChatReply(`${portfolioProfile.name} is ${portfolioProfile.height}.`, [
    "How old is Lenny?",
    "Where does Lenny study?",
    "What does Lenny do for fun?",
  ]);

const getFunFactReply = () =>
  createChatReply(
    `${portfolioProfile.name} loves anime, enjoys basketball, and plays video games.`,
    ["How old is Lenny?", "Where does Lenny study?", "What kind of work does Lenny do?"]
  );

const getThanksReply = () =>
  createChatReply(
    "You’re welcome. If you want, ask about projects, skills, experience, or how to get in touch.",
    ["What projects has Lenny done?", "What technologies does Lenny use?", "How can I contact Lenny?"]
  );

const getEducationReply = () =>
  createChatReply(
    `${portfolioProfile.name} is currently a ${portfolioProfile.education}.`,
    ["How old is Lenny?", "How tall is Lenny?", "What does Lenny do for fun?"]
  );

const getPricingReply = () =>
  createChatReply(
    `Pricing is not listed on the portfolio. The best next step is to send a message with your project scope and requirements.`,
    ["How can I contact Lenny?", "Is Lenny available for freelance work?", "What kind of work does Lenny do?"]
  );

const getResumeReply = () =>
  createChatReply(
    `If you need a CV or resume, the best option is to contact ${portfolioProfile.name} directly through the contact section of this site.`,
    ["How can I contact Lenny?", "Tell me about Lenny's experience", "What projects has Lenny done?"]
  );

const getDefaultReply = () =>
  createChatReply(
    "I can help with questions about Lennox's projects, skills, experience, services, availability, location, and contact details.",
    defaultFollowUps
  );

export const getPortfolioChatReply = (question) => {
  const tokens = normalizeText(question);

  if (!tokens.length) {
    return createChatReply(
      "Ask about projects, skills, experience, or contact details and I’ll answer from Lennox's portfolio content.",
      defaultFollowUps
    );
  }

  const matchedProject = getProjectByKeyword(tokens);

  if (
    matchedProject &&
    includesAny(tokens, [
      "tell",
      "about",
      "project",
      "projects",
      "what",
      "describe",
      "details",
    ])
  ) {
    return getProjectDetailReply(matchedProject);
  }

  if (
    includesAny(tokens, [
      "hi",
      "hello",
      "hey",
      "yo",
      "sup",
      "greetings",
    ])
  ) {
    return getGreetingReply();
  }

  if (
    includesAny(tokens, [
      "name",
      "fullname",
      "full",
      "called",
      "call",
    ])
  ) {
    return getNameReply();
  }

  if (
    includesAny(tokens, [
      "age",
      "old",
      "years",
    ])
  ) {
    return getAgeReply();
  }

  if (
    includesAny(tokens, [
      "height",
      "tall",
      "foot",
      "feet",
    ])
  ) {
    return getHeightReply();
  }

  if (
    includesAny(tokens, [
      "fun",
      "hobby",
      "hobbies",
      "anime",
      "basketball",
      "games",
      "gaming",
      "video",
    ])
  ) {
    return getFunFactReply();
  }

  if (
    includesAny(tokens, [
      "help",
      "menu",
      "options",
      "ask",
      "questions",
      "question",
    ])
  ) {
    return getHelpReply();
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
      "service",
      "services",
      "offer",
      "offers",
      "specialize",
      "specialises",
      "specializes",
      "works",
    ])
  ) {
    return getServicesReply();
  }

  if (
    includesAny(tokens, [
      "available",
      "availability",
      "freelance",
      "hire",
      "open",
      "booking",
      "bookings",
    ])
  ) {
    return getAvailabilityReply();
  }

  if (includesAny(tokens, ["where", "location", "based", "country", "kenya"])) {
    return getLocationReply();
  }

  if (
    includesAny(tokens, [
      "contact",
      "email",
      "reach",
      "book",
      "connect",
      "social",
    ])
  ) {
    return getContactReply();
  }

  if (
    includesAny(tokens, ["resume", "cv", "curriculum", "vitae"])
  ) {
    return getResumeReply();
  }

  if (
    includesAny(tokens, ["education", "study", "school", "college", "university"])
  ) {
    return getEducationReply();
  }

  if (
    includesAny(tokens, ["price", "pricing", "rate", "rates", "cost", "budget"])
  ) {
    return getPricingReply();
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

  if (includesAny(tokens, ["thanks", "thank", "appreciate"])) {
    return getThanksReply();
  }

  return getDefaultReply();
};

export { defaultFollowUps, portfolioProfile, suggestedPrompts };
