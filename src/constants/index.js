const navLinks = [
  {
    name: "Work",
    link: "/#work",
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
  { text: "Ideas", imgPath: "/images/ideas.svg" },
  { text: "Views", imgPath: "/images/concepts.svg" },
  { text: "Design", imgPath: "/images/designs.svg" },
  { text: "Code", imgPath: "/images/code.svg" },
  { text: "Ideas", imgPath: "/images/ideas.svg" },
  { text: "Views", imgPath: "/images/concepts.svg" },
  { text: "Design", imgPath: "/images/designs.svg" },
  { text: "Code", imgPath: "/images/code.svg" },
];

const counterItems = [
  { value: 2, suffix: "+", label: "Years of Experience" },
  { value: 15, suffix: "+", label: "Satisfied Clients" },
  { value: 19, suffix: "+", label: "Completed Projects" },
  { value: 90, suffix: "%", label: "Client Retention Rate" },
];

const resumeLinks = {
  resume: "/resume/Lennox_Lewis_Resume.docx",
  cv: "/resume/Lennox_Odhiambo_CV.docx",
};

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
    imageSrc: "/images/logos/framer.svg",
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
    review: "Lennox brought creativity and technical expertise to the team, significantly improving our frontend performance. His work has been invaluable in delivering faster experiences.",
    lineColor: "#673DE6",
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
    lineColor: "#F02E65",
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
    lineColor: "#2496ED",
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
  {
    review: "Founded and lead engineering at Zed OS Technologies, a Kisumu-based company delivering software, data analytics, and AI solutions to clients.",
    lineColor: "#F15A24",
    imgPath: "/images/zed-os.png",
    imageClassName: "md:size-20 size-10 object-contain",
    companyName: "Zed OS Technologies",
    logoPath: "/images/zed-os.png",
    title: "Founder & Lead Developer",
    date: "Present",
    responsibilities: [
      "Lead a development team building full-stack web products on the MERN stack and TypeScript, from architecture through deployment on Vercel and Render.",
      "Designed and shipped a research, thesis, and project management system that streamlines submissions, supervision, and tracking for university users.",
      "Built a database and data warehouse system that consolidates data sources for reporting and analytics.",
      "Deliver client projects end to end, including e-commerce builds with M-Pesa payment integration.",
    ],
  },
  {
    review: "Supported KEMRI research teams with data analysis and machine learning to turn raw research data into evidence-based findings.",
    lineColor: "#08A8D5",
    imgPath: "/images/kemri-logo.png",
    imageClassName: "md:size-20 size-10 object-contain",
    companyName: "kemri",
    logoPath: "/images/kemri-logo.png",
    title: "Data Analyst — KEMRI",
    date: "May - August 2026",
    responsibilities: [
      "Cleaned, validated, and prepared research datasets, making them reliable inputs for statistical analysis and ML workflows.",
      "Analyzed research data to uncover patterns and trends that supported evidence-based findings.",
      "Built and evaluated machine learning models to generate predictive insights for research teams.",
      "Communicated results to researchers through clear summaries and visualizations.",
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

const testimonialAvatar = (seed) =>
  `https://api.dicebear.com/10.x/adventurer/svg?seed=${encodeURIComponent(seed)}`;

const testimonials = [
  {
    name: "Kevin Katami, CEO at Villagio",
    mentions: "Villagio · Customer Service Week poster",
    rating: 5,
    review:
      "We came to Lennox with almost no time for our Customer Service Week poster. He got the point straight away and sent back something clear and ready to use. Huge help.",
    imgPath: testimonialAvatar("Kevin Katami"),
    imageAlt: "Avatar for Kevin Katami",
  },
  {
    name: "Wade Warren",
    mentions: "Pet care landing page",
    rating: 4,
    review:
      "Pawello feels friendly the second it opens. The orange and the dog imagery are so freaking cool together. I’d give a couple of sections a bit more breathing room, but the page has loads of personality.",
    imgPath: testimonialAvatar("Wade Warren"),
    imageAlt: "Avatar for Wade Warren",
  },
  {
    name: "Guy Hawkins",
    mentions: "Fragrance website concept",
    rating: 5,
    review:
      "Recueil just feels right for a fragrance brand. The bottle gets space to be the star, and the cool colors do a lot without shouting at you. Really lovely work.",
    imgPath: testimonialAvatar("Guy Hawkins"),
    imageAlt: "Avatar for Guy Hawkins",
  },
  {
    name: "Marvin McKinney",
    mentions: "Gaming landing page",
    rating: 4,
    review:
      "ZED Gaming has that big, high-energy first impression you want. I took a second to find where to go next, but once I did, the whole thing felt like a proper gaming world.",
    imgPath: testimonialAvatar("Marvin McKinney"),
    imageAlt: "Avatar for Marvin McKinney",
  },
  {
    name: "Floyd Miles",
    mentions: "Headphones poster concept",
    rating: 3,
    review:
      "The lime green headphones really pop on the Beats poster. The tiny feature labels at the bottom got a little lost for me on mobile, but the main idea lands instantly.",
    imgPath: testimonialAvatar("Floyd Miles"),
    imageAlt: "Avatar for Floyd Miles",
  },
  {
    name: "Albert Flores",
    mentions: "Foldable phone poster concept",
    rating: 4,
    review:
      "Seeing the iPhone Duo open in someone’s hands sold me on the concept right away. The smaller feature copy could be easier to read, but the overall poster is sharp.",
    imgPath: testimonialAvatar("Albert Flores"),
    imageAlt: "Avatar for Albert Flores",
  },
  {
    name: "Esther Howard",
    mentions: "Business website redesign",
    rating: 5,
    review:
      "The new layout made everything easier to find. I was a little nervous about changing the old site, but Lennox kept me in the loop and the result feels like us.",
    imgPath: testimonialAvatar("Esther Howard"),
    imageAlt: "Avatar for Esther Howard",
  },
  {
    name: "Sana Sheikh",
    mentions: "Online store concept",
    rating: 3,
    review:
      "The product pages look great and the mobile version is much easier to use. A couple of details took an extra round to get right, but Lennox listened and fixed them.",
    imgPath: testimonialAvatar("Sana Sheikh"),
    imageAlt: "Avatar for Sana Sheikh",
  },
  {
    name: "Daniel Kim",
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
    imgPath: "/images/insta.svg",
    url: "https://www.instagram.com/thatboylewis?igsh=aTdxN3VqYW5qZG45",
  },
  {
    name: "github",
    imgPath: "/images/github.svg",
    url: "https://github.com/Lenny-Lewis",
  },
  {
    name: "x",
    imgPath: "/images/x.svg",
    url: "https://x.com/thatboylewis",
  },
  {
    name: "reddit",
    imgPath: "/images/redditlogo.svg",
    url: "https://www.reddit.com/u/thatkidlewis/s/n0V2SYZnQd",
  },
  {
    name: "linkedin",
    imgPath: "/images/linkedin.svg",
    url: "https://www.linkedin.com/in/lennox-lewis-975642359",
  },
];

export {
  words,
  abilities,
  logoIconsList,
  counterItems,
  expCards,
  expLogos,
  testimonials,
  resumeLinks,
  socialImgs,
  techStackIcons,
  techStackImgs,
  techStackRows,
  navLinks,
};
