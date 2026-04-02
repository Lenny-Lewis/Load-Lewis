import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { caseStudies } from "../constants";

gsap.registerPlugin(ScrollTrigger);

const AppShowcase = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      sectionRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 1.5 }
    );

    gsap.utils.toArray(".case-study-card").forEach((card, index) => {
      gsap.fromTo(
        card,
        {
          y: 50,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          delay: 0.15 * (index + 1),
          scrollTrigger: {
            trigger: card,
            start: "top bottom-=100",
          },
        }
      );
    });
  }, []);

  return (
    <div id="work" ref={sectionRef} className="app-showcase">
      <div className="w-full">
        <div className="case-study-heading">
          <p className="about-kicker">Case Studies</p>
          <h2>Selected work with clearer context, role definition, and outcomes.</h2>
          <p>
            Beyond visuals, each project below highlights the kind of product
            thinking, implementation focus, and delivery quality Lennox brings
            to client and portfolio work.
          </p>
        </div>

        <div className="case-study-grid">
          {caseStudies.map((study) => (
            <article key={study.name} className="case-study-card card-border">
              <div
                className="case-study-media"
                style={{ backgroundColor: study.accent }}
              >
                <img src={study.imgPath} alt={study.name} />
              </div>
              <div className="case-study-content">
                <div className="case-study-meta">
                  <span>{study.name}</span>
                  <span>{study.role}</span>
                </div>
                <h3>{study.title}</h3>
                <div className="case-study-copy">
                  <div>
                    <p className="about-kicker">Problem</p>
                    <p>{study.problem}</p>
                  </div>
                  <div>
                    <p className="about-kicker">Outcome</p>
                    <p>{study.outcome}</p>
                  </div>
                </div>
                <div className="case-study-stack">
                  {study.stack.map((item) => (
                    <span key={item}>{item}</span>
                  ))}
                </div>
                <div className="case-study-actions">
                  <a href={study.linkHref}>{study.linkLabel}</a>
                  <a href="#chatbot">Ask The Portfolio Assistant</a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppShowcase;
