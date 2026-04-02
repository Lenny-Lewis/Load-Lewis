const navLinks = [
  {
    name: "About",
    link: "#about",
  },
  {
    name: "Work",
    link: "#work",
  },
  {
    name: "Experience",
    link: "#experience",
  },
  {
    name: "Skills",
    link: "#skills",
  },
  {
    name: "AI Chat",
    link: "#chatbot",
  },
  {
    name: "Contact",
    link: "#contact",
  },
];

const words = [
  { text: "Ideas", imgPath: "/images/ideas.svg" },
  { text: "Concepts", imgPath: "/images/concepts.svg" },
  { text: "Designs", imgPath: "/images/designs.svg" },
  { text: "Code", imgPath: "/images/code.svg" },
  { text: "Ideas", imgPath: "/images/ideas.svg" },
  { text: "Concepts", imgPath: "/images/concepts.svg" },
  { text: "Designs", imgPath: "/images/designs.svg" },
  { text: "Code", imgPath: "/images/code.svg" },
];

const counterItems = [
  { value: 2, suffix: "+", label: "Years of Experience" },
  { value: 15, suffix: "+", label: "Satisfied Clients" },
  { value: 19, suffix: "+", label: "Completed Projects" },
  { value: 90, suffix: "%", label: "Client Retention Rate" },
];

const resumeLinks = {
  resume: "/cv,%20resume/Lennox_Lewis%20Resume.docx",
  cv: "/cv,%20resume/Lennox_Odhiambo_CV.docx",
};

const aboutHighlights = [
  {
    title: "Education",
    value: "Kisii University",
    desc: "Year 3 student balancing software engineering growth with hands-on product work.",
  },
  {
    title: "Availability",
    value: "Open To New Work",
    desc: "Interested in freelance, internships, and product-focused engineering opportunities.",
  },
  {
    title: "Interests",
    value: "Anime, Basketball, Gaming",
    desc: "A mix of curiosity, creativity, and competition that carries into how Lennox builds.",
  },
];

const caseStudies = [
  {
    name: "Ryde",
    title: "Ryde: a cross-platform ride booking experience designed for speed and clarity",
    imgPath: "/images/project1.png",
    accent: "#d7f5ff",
    role: "React Native developer",
    problem:
      "Design a mobile ride-booking experience that feels fast, easy to navigate, and dependable from onboarding to trip request.",
    outcome:
      "Delivered a clean cross-platform experience with a clear booking flow and mobile-first interaction patterns.",
    stack: ["React Native", "Expo", "Tailwind CSS"],
    linkLabel: "Discuss Similar Work",
    linkHref: "#contact",
  },
  {
    name: "Library Management Platform",
    title: "Library Management Platform: a structured workflow for collections and day-to-day operations",
    imgPath: "/images/project2.png",
    accent: "#ffefdb",
    role: "Frontend and platform implementation",
    problem:
      "Organize library workflows into a single interface that supports catalog visibility, user activity, and operational efficiency.",
    outcome:
      "Built a platform-oriented experience that simplifies management tasks while keeping the interface approachable for daily use.",
    stack: ["React", "Frontend UI", "Platform Architecture"],
    linkLabel: "Request Case Study",
    linkHref: "#contact",
  },
  {
    name: "YC Directory",
    title: "YC Directory: a startup showcase built to surface founders, products, and early traction",
    imgPath: "/images/project3.png",
    accent: "#ffe7eb",
    role: "Frontend product developer",
    problem:
      "Create a directory-style experience that makes startup discovery feel curated, lightweight, and easy to browse.",
    outcome:
      "Shaped a clean showcase interface focused on discovery, structure, and clear presentation of early-stage products.",
    stack: ["React", "Directory UI", "Startup Discovery"],
    linkLabel: "Start A Conversation",
    linkHref: "#contact",
  },
];

const logoIconsList = [
  {
    imgPath: "/images/logos/company-logo-1.png",
  },
  {
    imgPath: "/images/logos/company-logo-2.png",
  },
  {
    imgPath: "/images/logos/company-logo-3.png",
  },
  {
    imgPath: "/images/logos/company-logo-4.png",
  },
  {
    imgPath: "/images/logos/company-logo-5.png",
  },
  {
    imgPath: "/images/logos/company-logo-6.png",
  },
  {
    imgPath: "/images/logos/company-logo-7.png",
  },
  {
    imgPath: "/images/logos/company-logo-8.png",
  },
  {
    imgPath: "/images/logos/company-logo-9.png",
  },
  {
    imgPath: "/images/logos/company-logo-10.png",
  },
  {
    imgPath: "/images/logos/company-logo-11.png",
  },
];

const abilities = [
  {
    imgPath: "/images/seo.png",
    title: "Quality Focus",
    desc: "Delivering high-quality results while maintaining attention to every detail.",
  },
  {
    imgPath: "/images/chat.png",
    title: "Reliable Communication",
    desc: "Keeping you updated at every step to ensure transparency and clarity.",
  },
  {
    imgPath: "/images/time.png",
    title: "On-Time Delivery",
    desc: "Making sure projects are completed on schedule, with quality & attention to detail.",
  },
];

const techStackImgs = [
  {
    name: "React Developer",
    imgPath: "/images/logos/react.png",
  },
  {
    name: "Python Developer",
    imgPath: "/images/logos/python.svg",
  },
  {
    name: "Backend Developer",
    imgPath: "/images/logos/node.png",
  },
  {
    name: "Interactive Developer",
    imgPath: "/images/logos/three.png",
  },
  {
    name: "Project Manager",
    imgPath: "/images/logos/git.svg",
  },
];

const techStackIcons = [
  {
    name: "React Developer",
    modelPath: "/models/react_logo-transformed.glb",
    scale: 1,
    rotation: [0, 0, 0],
  },
  {
    name: "Python Developer",
    modelPath: "/models/python-transformed.glb",
    scale: 0.8,
    rotation: [0, 0, 0],
  },
  {
    name: "Backend Developer",
    modelPath: "/models/node-transformed.glb",
    scale: 5,
    rotation: [0, -Math.PI / 2, 0],
  },
  {
    name: "Interactive Developer",
    modelPath: "/models/three.js-transformed.glb",
    scale: 0.05,
    rotation: [0, 0, 0],
  },
  {
    name: "Project Manager",
    modelPath: "/models/git-svg-transformed.glb",
    scale: 0.05,
    rotation: [0, -Math.PI / 4, 0],
  },
];

const expCards = [
  {
    review: "Lennox brought creativity and technical expertise to the team, significantly improving our frontend performance. His work has been invaluable in delivering faster experiences.",
    imgPath: "/images/exp1.png",
    logoPath: "/images/logo1.png",
    title: "Frontend Developer",
    date: "January 2023 - Present",
    responsibilities: [
      "Developed and maintained user-facing features for the Hostinger website.",
      "Collaborated closely with UI/UX designers to ensure seamless user experiences.",
      "Optimized web applications for maximum speed and scalability.",
    ],
  },
  {
    review: "Lennox’s contributions to Docker's web applications have been outstanding. He approaches challenges with a problem-solving mindset.",
    imgPath: "/images/exp2.png",
    logoPath: "/images/logo2.png",
    title: "Full Stack Developer",
    date: "June 2024 - Present",
    responsibilities: [
      "Led the development of Docker's web applications, focusing on scalability.",
      "Worked with backend engineers to integrate APIs seamlessly with the frontend.",
      "Contributed to open-source projects that were used with the Docker ecosystem.",
    ],
  },
  {
    review: "Lennox’s work on Appwrite’s mobile app brought a high level of quality and efficiency. He delivered solutions that enhanced our mobile experience & meet our product goals.",
    imgPath: "/images/exp3.png",
    logoPath: "/images/logo3.png",
    title: "React Native Developer",
    date: "March 2025 - Present",
    responsibilities: [
      "Built cross-platform mobile apps using React Native, integrating with Appwrite's backend services.",
      "Improved app performance and user experience through code optimization and testing.",
      "Coordinated with the product team to implement features based on feedback.",
    ],
  },
];

const expLogos = [
  {
    name: "logo1",
    imgPath: "/images/logo1.png",
  },
  {
    name: "logo2",
    imgPath: "/images/logo2.png",
  },
  {
    name: "logo3",
    imgPath: "/images/logo3.png",
  },
];

const testimonials = [
  {
    name: "Esther Howard",
    mentions: "@estherhoward",
    review:
      "I can’t say enough good things about Lennox. He was able to take our complex project requirements and turn them into a seamless, functional website. His problem-solving abilities are outstanding.",
    imgPath: "/images/client1.png",
  },
  {
    name: "Wade Warren",
    mentions: "@wadewarren",
    review:
      "Working with Lennox was a fantastic experience. He transformed our outdated website into a modern, user-friendly platform. His attention to detail and commitment to quality are unmatched. Highly recommend him for any web dev projects.",
    imgPath: "/images/client3.png",
  },
  {
    name: "Guy Hawkins",
    mentions: "@guyhawkins",
    review:
      "Collaborating with Lennox was an absolute pleasure. His professionalism, promptness, and dedication to delivering exceptional results were evident throughout our project. Lennox's enthusiasm for every facet of development truly stands out. If you're seeking to elevate your website and elevate your brand, Lennox is the ideal partner.",
    imgPath: "/images/client2.png",
  },
  {
    name: "Marvin McKinney",
    mentions: "@marvinmckinney",
    review:
      "Lennox was a pleasure to work with. He turned our outdated website into a fresh, intuitive platform that’s both modern and easy to navigate. Fantastic work overall.",
    imgPath: "/images/client5.png",
  },
  {
    name: "Floyd Miles",
    mentions: "@floydmiles",
    review:
      "Lennox’s expertise in web development is truly impressive. He delivered a robust and scalable solution for our e-commerce site, and our online sales have significantly increased since the launch. He’s a true professional!",
    imgPath: "/images/client4.png",
  },
  {
    name: "Albert Flores",
    mentions: "@albertflores",
    review:
      "Lennox was a pleasure to work with. He understood our requirements perfectly and delivered a website that exceeded our expectations. His skills in both frontend and backend dev are top-notch.",
    imgPath: "/images/client6.png",
  },
];

const socialImgs = [
  {
    name: "insta",
    imgPath: "/images/insta.png",
    url: "https://www.instagram.com/thatboylewis?igsh=aTdxN3VqYW5qZG45"
  },
  {
    name: "github",
    imgPath: "/images/github.png",
    url: "https://github.com/Lenny-Lewis"
  },
  {
    name: "x",
    imgPath: "/images/x.png",
    url: "https://x.com/thatboylewis"
    
  },
  {
    name: "linkedin",
    imgPath: "/images/linkedin.png",
    url: "https://www.linkedin.com/in/lennox-lewis-975642359"
  },
];

export {
  aboutHighlights,
  words,
  abilities,
  caseStudies,
  logoIconsList,
  counterItems,
  expCards,
  expLogos,
  testimonials,
  resumeLinks,
  socialImgs,
  techStackIcons,
  techStackImgs,
  navLinks,
};
