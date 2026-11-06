import { caseStudies, caseStudyPath } from "../data/caseStudies";

const navLinks = [
  {
    name: "Work",
    link: "/#work",
  },
  {
    name: "Services",
    link: "/#services",
  },
  {
    name: "Pricing",
    link: "/#pricing",
  },
  {
    name: "Experience",
    link: "/#experience",
  },
  {
    name: "Skills",
    link: "/#skills",
  },
  {
    name: "Contact",
    link: "/#contact",
  },
];

const words = [
  { text: "Ideas", imgPath: "/images/hero/ideas.svg" },
  { text: "Views", imgPath: "/images/hero/concepts.svg" },
  { text: "Design", imgPath: "/images/hero/designs.svg" },
  { text: "Code", imgPath: "/images/hero/code.svg" },
  { text: "Ideas", imgPath: "/images/hero/ideas.svg" },
  { text: "Views", imgPath: "/images/hero/concepts.svg" },
  { text: "Design", imgPath: "/images/hero/designs.svg" },
  { text: "Code", imgPath: "/images/hero/code.svg" },
];

const counterItems = [
  { value: 3, suffix: "+", label: "Years of Experience" },
  { value: 5, suffix: "+", label: "Satisfied Clients" },
  { value: 30, suffix: "+", label: "Completed Projects" },
  { value: 100, suffix: "%", label: "Client Retention Rate" },
];

const resumeLinks = {
  resume: "/resume/Lennox_Lewis_Resume.docx",
  cv: "/resume/Lennox_Odhiambo_CV.docx",
};

const abilities = [
  {
    title: "Quality Focus",
    desc: "Delivering high-quality results while maintaining attention to every detail.",
  },
  {
    title: "Reliable Communication",
    desc: "Keeping you updated at every step to ensure transparency and clarity.",
  },
  {
    title: "On-Time Delivery",
    desc: "Making sure projects are completed on schedule, with quality & attention to detail.",
  },
];

const stackAssetMap = {
  Python: {
    accent: "#3776AB",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg",
  },
  JavaScript: {
    accent: "#F7DF1E",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
  },
  TypeScript: {
    accent: "#3178C6",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
  },
  C: {
    accent: "#A8B9CC",
    imageSrc: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg",
  },
  "C++": {
    accent: "#00599C",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg",
  },
  Kotlin: {
    accent: "#7F52FF",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg",
  },
  HTML: {
    accent: "#E34F26",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
  },
  CSS: {
    accent: "#1572B6",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
  },
  Bash: {
    accent: "#4EAA25",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg",
  },
  React: {
    accent: "#61DAFB",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
  },
  "Next.js": {
    accent: "#FFFFFF",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
  },
  Bootstrap: {
    accent: "#7952B3",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg",
  },
  "Node.js": {
    accent: "#339933",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
  },
  Django: {
    accent: "#092E20",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg",
  },
  Flask: {
    accent: "#E5E7EB",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg",
  },
  FastAPI: {
    accent: "#009688",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg",
  },
  TensorFlow: {
    accent: "#FF6F00",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg",
  },
  PyTorch: {
    accent: "#EE4C2C",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg",
  },
  "Scikit-learn": {
    accent: "#F7931E",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scikitlearn/scikitlearn-original.svg",
  },
  OpenCV: {
    accent: "#5C3EE8",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg",
  },
  NumPy: {
    accent: "#4D77CF",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg",
  },
  Tailwind: {
    accent: "#38BDF8",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg",
  },
  Pandas: {
    accent: "#150458",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg",
  },
  MySQL: {
    accent: "#4479A1",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg",
  },
  PostgreSQL: {
    accent: "#336791",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
  },
  MongoDB: {
    accent: "#47A248",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
  },
  Firebase: {
    accent: "#FFCA28",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg",
  },
  Redis: {
    accent: "#DC382D",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
  },
  Docker: {
    accent: "#2496ED",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
  },
  Azure: {
    accent: "#0078D4",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg",
  },
  Git: {
    accent: "#F05032",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg",
  },
  GitHub: {
    accent: "#FFFFFF",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
  },
  Linux: {
    accent: "#FCC624",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg",
  },
  AWS: {
    accent: "#FF9900",
    imageSrc:
      "https://commons.wikimedia.org/wiki/Special:FilePath/Amazon_Web_Services_2025.svg",
  },
  "VS Code": {
    accent: "#007ACC",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg",
  },
  Vercel: {
    accent: "#FFFFFF",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",
  },
  Jupyter: {
    accent: "#F37626",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg",
  },
  Figma: {
    accent: "#F24E1E",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
  },
  Framer: {
    accent: "#FFFFFF",
    imageSrc: "/images/tech/framer.svg",
  },
  Postman: {
    accent: "#FF6C37",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg",
  },
  Photoshop: {
    accent: "#31A8FF",
    imageSrc:
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg",
  },
  "Hugging Face": {
    accent: "#FFD21E",
    imageSrc: "https://cdn.simpleicons.org/huggingface",
  },
  "MS Office": {
    accent: "#D83B01",
    imageSrc:
      "https://upload.wikimedia.org/wikipedia/en/thumb/3/35/Microsoft_Office_Logo_%282019-present%29.svg/250px-Microsoft_Office_Logo_%282019-present%29.svg.png",
  },
};

// Only icons that stay readable on a black background.
const logoIconsList = [
  "React",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "Python",
  "TensorFlow",
  "PyTorch",
  "Tailwind",
  "MongoDB",
  "PostgreSQL",
  "Firebase",
  "Docker",
  "Figma",
  "Photoshop",
].map((name) => ({ name, imgPath: stackAssetMap[name].imageSrc }));

const services = [
  {
    name: "Website Design & Build",
    categories: ["Landing Pages", "Business Sites", "Redesigns"],
    tiers: [
      {
        name: "Static Website",
        price: "$250",
        features: ["Up to 5 responsive pages", "Custom hero section", "Contact form", "Basic SEO setup"],
      },
      {
        name: "Animated Website",
        price: "$600",
        recommended: true,
        features: ["Everything in Static", "GSAP scroll animations", "Animated navigation", "Page transitions"],
      },
      {
        name: "E-commerce Website",
        price: "$900",
        features: ["Product and category pages", "Cart and checkout", "Online payments", "Order management"],
      },
      {
        name: "3D Website",
        price: "$1,200",
        features: ["Interactive 3D models", "Immersive 3D hero", "GSAP animations", "Performance tuning for 3D"],
      },
    ],
  },
  {
    name: "Web Apps",
    categories: ["Dashboards", "Client Portals", "Full Stack"],
    tiers: [
      {
        name: "Standard App",
        price: "$1,000",
        features: ["Hero and landing page", "User accounts and login", "Database setup", "Admin dashboard"],
      },
      {
        name: "Advanced App",
        price: "$2,000",
        recommended: true,
        features: ["Everything in Standard", "Animated navigation", "User roles and permissions", "Payments and API integrations"],
      },
      {
        name: "AI-Powered App",
        price: "$3,500",
        features: ["Everything in Advanced", "AI and ML features", "Custom AI assistant", "3D models and visuals"],
      },
    ],
  },
  {
    name: "Mobile Apps",
    categories: ["iOS", "Android", "React Native"],
    tiers: [
      {
        name: "Standard App",
        price: "$1,200",
        features: ["iOS and Android with React Native", "Up to 5 screens", "User accounts and login", "App store preparation"],
      },
      {
        name: "Advanced App",
        price: "$2,200",
        recommended: true,
        features: ["Everything in Standard", "Backend and database", "Push notifications", "In-app payments"],
      },
      {
        name: "AI-Powered App",
        price: "$3,500",
        features: ["Everything in Advanced", "AI and ML features", "Custom animations", "Offline support"],
      },
    ],
  },
  {
    name: "Desktop Applications",
    categories: ["Business Tools", "Internal Software", "Cross-Platform"],
    tiers: [
      {
        name: "Standard App",
        price: "$1,000",
        features: ["One operating system", "Up to 5 screens", "Local data storage", "Installer included"],
      },
      {
        name: "Advanced App",
        price: "$1,800",
        recommended: true,
        features: ["Windows, macOS and Linux", "Database setup", "Reports and exports", "User accounts"],
      },
      {
        name: "Connected App",
        price: "$3,000",
        features: ["Everything in Advanced", "Cloud sync", "Third-party integrations", "AI and ML features"],
      },
    ],
  },
  {
    name: "AI & Data",
    categories: ["AI Assistants", "Predictive Models", "Data Analysis"],
    tiers: [
      {
        name: "Data Analysis",
        price: "$800",
        features: ["Data cleaning and preparation", "Patterns and trends", "Visual summaries", "Written findings"],
      },
      {
        name: "Predictive Model",
        price: "$1,500",
        recommended: true,
        features: ["Everything in Data Analysis", "Custom ML model", "Accuracy evaluation", "Ready to connect to your app"],
      },
      {
        name: "AI Assistant",
        price: "$3,000",
        features: ["Custom agentic assistant", "Connected models and tools", "Trained on your data", "Web or app integration"],
      },
    ],
  },
  {
    name: "Company Profiles",
    categories: ["Profile Design", "Layout", "Print & PDF"],
    tiers: [
      {
        name: "Standard Profile",
        price: "$60",
        features: ["Up to 6 pages", "Clean branded layout", "Print-ready PDF"],
      },
      {
        name: "Designed Profile",
        price: "$120",
        recommended: true,
        features: ["Up to 12 pages", "Custom graphics and icons", "Print and digital versions"],
      },
      {
        name: "Premium Profile",
        price: "$250",
        features: ["Up to 20 pages", "Image retouching", "Help refining your wording", "Editable source files"],
      },
    ],
  },
  {
    name: "Company Logos",
    categories: ["Logo Design", "Brand Colours", "File Handover"],
    tiers: [
      {
        name: "Standard Logo",
        price: "$40",
        features: ["2 logo concepts", "2 rounds of changes", "PNG and SVG files"],
      },
      {
        name: "Professional Logo",
        price: "$90",
        recommended: true,
        features: ["3 logo concepts", "Colour and mono versions", "Full file package"],
      },
      {
        name: "Brand Kit",
        price: "$180",
        features: ["Everything in Professional", "Colour palette and typography", "Social media kit", "Simple brand guide"],
      },
    ],
  },
  {
    name: "Ready-Made Projects",
    categories: ["Websites", "Mobile Apps", "Optional Maintenance"],
    pricingNote: "Prices in USD. Maintenance plans have a 12-month minimum. Hosting is separate.",
    tiers: caseStudies
      .filter((study) => study.saleOptions)
      .sort((a, b) => a.saleFrom - b.saleFrom)
      .map((study) => ({
        name: study.title,
        price: `$${study.saleFrom.toLocaleString("en-US")}`,
        features: study.saleOptions.map((option) => option.summary),
        link: caseStudyPath(study.slug),
      })),
  },
];

const techStackRows = [
  [
    "Python",
    "JavaScript",
    "TypeScript",
    "C",
    "C++",
    "Kotlin",
    "HTML",
    "CSS",
    "Bash",
    "React",
    "Next.js",
    "Bootstrap",
  ],
  [
    "Node.js",
    "Django",
    "Flask",
    "FastAPI",
    "TensorFlow",
    "PyTorch",
    "Scikit-learn",
    "OpenCV",
    "NumPy",
    "Tailwind",
  ],
  [
    "Pandas",
    "MySQL",
    "PostgreSQL",
    "MongoDB",
    "Firebase",
    "Redis",
    "Docker",
    "Azure",
  ],
  ["Git", "GitHub", "Linux", "AWS", "VS Code", "Vercel"],
  ["Jupyter", "Figma", "Postman", "Photoshop"],
  ["Hugging Face", "MS Office"],
  ["Framer"],
].map((row) =>
  row.map((name) => {
    const asset = stackAssetMap[name] || {};

    return {
      name,
      accent: asset.accent || "#8b5cf6",
      imageSrc: asset.imageSrc,
    };
  })
);

const expCards = [
  {
    review: "Supported KEMRI research teams with data analysis and machine learning to turn raw research data into evidence-based findings.",
    lineColor: "#08A8D5",
    plate: "kemri",
    plateAlt: "KEMRI logo",
    companyName: "KEMRI",
    subheading: "Work experience",
    title: "Data Analyst — KEMRI",
    date: "May - August 2026",
    responsibilities: [
      "Cleaned, validated, and prepared research datasets, making them reliable inputs for statistical analysis and ML workflows.",
      "Analyzed research data to uncover patterns and trends that supported evidence-based findings.",
      "Built and evaluated machine learning models to generate predictive insights for research teams.",
      "Communicated results to researchers through clear summaries and visualizations.",
    ],
  },
  {
    review: "Where it started: learning to build fast, responsive interfaces with React, JavaScript and Tailwind CSS.",
    lineColor: "#8B5CF6",
    plate: "frontend",
    plateAlt: "Code icon",
    companyName: "Learning path",
    title: "Frontend Development",
    date: "Since 2023",
    responsibilities: [
      "Building responsive interfaces with React and Tailwind CSS.",
      "Turning designs into clean, reusable components.",
      "Keeping pages fast and easy to use on any device.",
    ],
  },
  {
    review: "Moving beyond the browser to build complete applications, from the database to the interface.",
    lineColor: "#8B5CF6",
    plate: "fullstack",
    plateAlt: "Stacked layers icon",
    companyName: "Learning path",
    title: "Full Stack Development",
    date: "Since 2024",
    responsibilities: [
      "Building full stack projects with the MERN stack and TypeScript.",
      "Designing APIs and connecting them to frontends.",
      "Working with databases such as MongoDB and PostgreSQL.",
    ],
  },
  {
    review: "Designing brand and marketing visuals in Adobe Photoshop that give products and businesses a consistent, professional look.",
    lineColor: "#8B5CF6",
    plate: "design",
    plateAlt: "Pen tool icon",
    companyName: "Learning path",
    title: "Graphic Design",
    date: "Since 2024",
    responsibilities: [
      "Designing logos, social media graphics, posters, and marketing assets in Adobe Photoshop.",
      "Retouching and compositing images into clean visuals for web and print.",
      "Building consistent brand identities, including colour palettes, typography and layouts.",
      "Preparing optimized assets for websites, social platforms, and print.",
    ],
  },
  {
    review: "Building AI-powered systems, from predictive models to an agentic assistant, that turn data into practical tools.",
    lineColor: "#8B5CF6",
    plate: "ai",
    plateAlt: "Circuit brain icon",
    companyName: "Learning path",
    title: "AI & Machine Learning",
    date: "Since 2024",
    responsibilities: [
      "Developing Cindi, an agentic AI assistant that handles tasks through connected models and tools.",
      "Preparing data, training models, and evaluating predictive performance.",
      "Integrating AI features into full-stack MERN and TypeScript applications.",
    ],
  },
  {
    review: "Taking those web skills to phones by learning to build cross-platform apps with React Native.",
    lineColor: "#8B5CF6",
    plate: "mobile",
    plateAlt: "Smartphone icon",
    companyName: "Learning path",
    title: "Mobile Development",
    date: "Since 2025",
    responsibilities: [
      "Building cross-platform apps with React Native.",
      "Connecting apps to backend services and APIs.",
      "Improving performance and usability through testing.",
    ],
  },
];

export const testimonialAvatar = (seed) =>
  `https://api.dicebear.com/10.x/adventurer/svg?seed=${encodeURIComponent(seed)}`;

const testimonials = [
  {
    // Name withheld at the client's request.
    name: "Zed OS Tech CEO",
    city: "Kisumu",
    country: "KE",
    // Kisumu and Nairobi are too close for these four pins, so they're spread around East Africa on the globe.
    lat: 9,
    lng: 26,
    mentions: "Zed OS Technologies · Company website",
    rating: 5,
    review:
      "It has been such a journey with Lennox Lewis. I was referred to him by a startup and straight away I understood why. He works diligently, very well and is always on time, always asking, always updating. I would definitely recommend him. He has a good understanding of projects and how things work.",
    imgPath: testimonialAvatar("Zed OS Tech CEO"),
    imageAlt: "Avatar for the Zed OS Tech CEO",
  },
  {
    name: "B. Wamuyu",
    city: "Nairobi",
    country: "KE",
    lat: 9,
    lng: 43,
    mentions: "CEO, Villagio Travel & Tours · Company profile",
    rating: 5,
    review:
      "Lennox Lewis works professionally, provides timely updates and heavily upgraded our company profile to something more professional. Funny enough, I wish we found him before we made our website.",
    imgPath: testimonialAvatar("B. Wamuyu"),
    imageAlt: "Avatar for B. Wamuyu",
  },
  {
    name: "Shanzy Solutions",
    city: "Nairobi",
    country: "KE",
    lat: -11,
    lng: 26,
    mentions: "Shanzy Solutions Ltd · Company profile and website",
    rating: 5,
    review:
      "Lennox works really well. Diligent, professional, soft spoken and his products always deliver. We are currently working on our website with him and he is doing such a fantastic job!",
    imgPath: testimonialAvatar("Shanzy Solutions"),
    imageAlt: "Avatar for Shanzy Solutions",
  },
  {
    name: "Kevin Katami, personnel at Villagio",
    city: "Nairobi",
    country: "KE",
    lat: -11,
    lng: 43,
    mentions: "Villagio · Customer Service Week poster",
    rating: 5,
    review:
      "We came to Lennox with almost no time for our Customer Service Week poster. He got the point straight away and sent back something clear and ready to use. Huge help.",
    imgPath: testimonialAvatar("Kevin Katami"),
    imageAlt: "Avatar for Kevin Katami",
  },
  {
    name: "Noah",
    city: "Washington",
    country: "US",
    // Washington state: well clear of the other two US pins.
    lat: 47.4,
    lng: -120.5,
    mentions: "Pet care landing page",
    rating: 4,
    review:
      "Pawello feels friendly the second it opens. The orange and the dog imagery are so freaking cool together. I’d give a couple of sections a bit more breathing room, but the page has loads of personality.",
    imgPath: testimonialAvatar("Noah"),
    imageAlt: "Avatar for Noah",
  },
  {
    name: "Liam",
    city: "Chicago",
    country: "US",
    // Pin nudged south-east of the city so it doesn't overlap Minnesota on the globe.
    lat: 38,
    lng: -84,
    mentions: "Fragrance website concept",
    rating: 5,
    review:
      "Recueil just feels right for a fragrance brand. The bottle gets space to be the star, and the cool colors do a lot without shouting at you. Really lovely work.",
    imgPath: testimonialAvatar("Liam"),
    imageAlt: "Avatar for Liam",
  },
  {
    name: "Oliver",
    city: "Minnesota",
    country: "US",
    // Pin nudged north-west so it doesn't overlap Chicago on the globe.
    lat: 47.5,
    lng: -97,
    mentions: "Gaming landing page",
    rating: 4,
    review:
      "ZED Gaming has that big, high-energy first impression you want. I took a second to find where to go next, but once I did, the whole thing felt like a proper gaming world.",
    imgPath: testimonialAvatar("Oliver"),
    imageAlt: "Avatar for Oliver",
  },
  {
    name: "Eliana",
    city: "Japan",
    country: "JP",
    lat: 36.2048,
    lng: 138.2529,
    mentions: "Headphones poster concept",
    rating: 3,
    review:
      "The lime green headphones really pop on the Beats poster. The tiny feature labels at the bottom got a little lost for me on mobile, but the main idea lands instantly.",
    imgPath: testimonialAvatar("Eliana"),
    imageAlt: "Avatar for Eliana",
  },
  {
    name: "Amelia",
    city: "Taiwan",
    country: "TW",
    lat: 23.6978,
    lng: 120.9605,
    mentions: "Foldable phone poster concept",
    rating: 4,
    review:
      "Seeing the iPhone Duo open in someone’s hands sold me on the concept right away. The smaller feature copy could be easier to read, but the overall poster is sharp.",
    imgPath: testimonialAvatar("Amelia"),
    imageAlt: "Avatar for Amelia",
  },
  {
    name: "Charlotte",
    city: "Germany",
    country: "DE",
    lat: 51.1657,
    lng: 10.4515,
    mentions: "Business website redesign",
    rating: 5,
    review:
      "The new layout made everything easier to find. I was a little nervous about changing the old site, but Lennox kept me in the loop and the result feels like us.",
    imgPath: testimonialAvatar("Charlotte"),
    imageAlt: "Avatar for Charlotte",
  },
  {
    name: "Sana Sheikh",
    city: "India",
    country: "IN",
    lat: 20.5937,
    lng: 78.9629,
    mentions: "Online store concept",
    rating: 3,
    review:
      "The product pages look great and the mobile version is much easier to use. A couple of details took an extra round to get right, but Lennox listened and fixed them.",
    imgPath: testimonialAvatar("Sana Sheikh"),
    imageAlt: "Avatar for Sana Sheikh",
  },
  {
    name: "Daniel Kim",
    city: "Nigeria",
    country: "NG",
    lat: 9.082,
    lng: 8.6753,
    mentions: "Brand campaign poster",
    rating: 4,
    review:
      "The poster got attention straight away — wow, the product lighting was so freaking cool. I’d make the small print a touch bigger, but the whole thing came together really well.",
    imgPath: testimonialAvatar("Daniel Kim"),
    imageAlt: "Avatar for Daniel Kim",
  },
];

const socialImgs = [
  {
    name: "insta",
    imgPath: "/images/social/insta.svg",
    url: "https://www.instagram.com/thatboylewis?igsh=aTdxN3VqYW5qZG45",
  },
  {
    name: "github",
    imgPath: "/images/social/github.svg",
    url: "https://github.com/Lenny-Lewis",
  },
  {
    name: "x",
    imgPath: "/images/social/x.svg",
    url: "https://x.com/thatboylewis",
  },
  {
    name: "reddit",
    imgPath: "/images/social/redditlogo.svg",
    url: "https://www.reddit.com/u/thatkidlewis/s/n0V2SYZnQd",
  },
  {
    name: "linkedin",
    imgPath: "/images/social/linkedin.svg",
    url: "https://www.linkedin.com/in/lennox-lewis-975642359",
  },
];

export {
  words,
  abilities,
  logoIconsList,
  services,
  counterItems,
  expCards,
  testimonials,
  resumeLinks,
  socialImgs,
  techStackRows,
  navLinks,
};
