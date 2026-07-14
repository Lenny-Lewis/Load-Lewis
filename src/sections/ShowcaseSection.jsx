import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const AppShowcase = () => {
  const sectionRef = useRef(null);
  const rydeRef = useRef(null);
  const libraryRef = useRef(null);
  const ycDirectoryRef = useRef(null);
  const graphicsRef = useRef(null);
  const graphicsProjects = [
    {
      title: "Boss Dark Elegance",
      category: "Featured Poster",
      description:
        "A bold, high-contrast composition designed to feel premium, cinematic, and brand-forward.",
      tags: ["Typography", "Contrast", "Luxury Mood"],
      image: "/images/Graphics%20Design/boss_dark_elegance.png",
      alt: "Boss Dark Elegance graphic design",
    },
    {
      title: "Crocks Poster",
      category: "Campaign Visual",
      description:
        "A clean promotional poster built to communicate the message quickly while keeping the visual identity sharp.",
      tags: ["Promotion", "Hierarchy", "Brand Layout"],
      image: "/images/Graphics%20Design/Crocks%20Poster.png",
      alt: "Crocks poster design",
    },
  ];

  useGSAP(() => {
    const cards = [
      rydeRef.current,
      libraryRef.current,
      ycDirectoryRef.current,
      graphicsRef.current,
    ].filter(Boolean);

    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom-=120",
      once: true,
      onEnter: () => {
        gsap.fromTo(
          sectionRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }
        );

        gsap.fromTo(
          cards,
          { y: 22, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.45,
            ease: "power2.out",
            stagger: 0.07,
            overwrite: "auto",
          }
        );
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div id="work" ref={sectionRef} className="app-showcase">
      <div className="w-full">
        <div className="showcaselayout">
          <div ref={rydeRef} className="first-project-wrapper">
            <div className="image-wrapper">
              <a
                href="https://ryde-gamma.vercel.app/"
                target="_blank"
                rel="noreferrer"
              >
                <img src="/images/project1.png" alt="Ryde App Interface" />
              </a>
            </div>
            <div className="text-content">
              <h2>
                On-Demand Rides Made Simple with a Powerful, User-Friendly App
                called Ryde
              </h2>
              <p className="text-white-50 md:text-xl">
                An app built with React Native, Expo, & TailwindCSS for a fast,
                user-friendly experience.
              </p>
            </div>
          </div>

          <div className="project-list-wrapper overflow-hidden">
            <div className="project" ref={libraryRef}>
              <div className="image-wrapper bg-[#FFEFDB]">
                <a
                  href="https://potter-library.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="/images/project2.png"
                    alt="Library Management Platform"
                  />
                </a>
              </div>
              <h2>The Library Management Platform</h2>
            </div>

            <div className="project" ref={ycDirectoryRef}>
              <div className="image-wrapper bg-[#FFE7EB]">
                <a
                  href="https://yg-directory.vercel.app/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img src="/images/project3.png" alt="YG Directory App" />
                </a>
              </div>
              <h2>YG Directory - A Startup Showcase App</h2>
            </div>
          </div>
        </div>

        <div ref={graphicsRef} className="graphics-showcase">
          <div className="graphics-header">
            <div>
              <p className="graphics-kicker">Graphics Design</p>
              <h2>Visual storytelling with a clean, premium finish</h2>
            </div>
            <p className="graphics-copy">
              Selected poster and promotional design work, presented as a
              curated gallery with clear categories and short project notes.
            </p>
          </div>

          <div className="graphics-grid">
            {graphicsProjects.map((project) => (
              <a
                key={project.title}
                className="graphics-card group"
                href={project.image}
                target="_blank"
                rel="noreferrer"
              >
                <img src={project.image} alt={project.alt} />
                <div className="graphics-content">
                  <span>{project.category}</span>
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <div className="graphics-tags">
                    {project.tags.map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppShowcase;
