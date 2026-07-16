import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import TitleHeader from "../components/TitleHeader";
import { techStackRows } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const TechStack = () => {
  useGSAP(() => {
    gsap.fromTo(
      ".stack-card",
      {
        y: 24,
        opacity: 0,
        scale: 0.96,
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
        stagger: 0.025,
        scrollTrigger: {
          trigger: "#skills",
          start: "top 72%",
        },
      }
    );
  }, []);

  return (
    <section id="skills" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader title="Tech Stack" />

        <div className="tech-stack-shell mt-14 md:mt-16">
          <div className="tech-stack-orb tech-stack-orb-left" />
          <div className="tech-stack-orb tech-stack-orb-right" />
          <div className="tech-stack-grid">
            {techStackRows.map((row, rowIndex) => (
              <div key={rowIndex} className="stack-row">
                {row.map((tech) => (
                  <article
                    key={tech.name}
                    className="stack-card group"
                    style={{ "--stack-accent": tech.accent }}
                  >
                    <div className="stack-card-glow" />
                    <div className="stack-icon-wrap">
                      <img
                        src={tech.imageSrc}
                        alt={tech.name}
                        className="stack-icon"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>
                    <p className="stack-name">{tech.name}</p>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
