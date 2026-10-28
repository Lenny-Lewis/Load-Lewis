import { useMemo, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMediaQuery } from "react-responsive";

import { expCards } from "../constants";
import TitleHeader from "../components/TitleHeader";
import GlowCard from "../components/GlowCard";
import AgenticFactory3D from "../components/ui/agentic-factory-3d";

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const [activeStation, setActiveStation] = useState(0);
  const careerStations = useMemo(
    () =>
      expCards.map((card) => ({
        id: card.title,
        title: card.title,
        organization:
          card.companyName || card.title.split("—").at(-1)?.trim() || "Career stage",
        date: card.date,
        summary: card.responsibilities.join(" "),
        color: card.lineColor,
      })),
    []
  );

  useGSAP(
    () => {
      if (!isMobile) return;

      const updateTimelineGradient = () => {
        const line = document.querySelector(".experience-line");
        const lineBounds = line?.getBoundingClientRect();
        if (!lineBounds?.height) return;

        const colorStops = gsap.utils.toArray(".exp-card-wrapper").map((card) => {
          const logo = card.querySelector(".timeline-logo");
          const logoBounds = logo?.getBoundingClientRect();
          if (!logoBounds) return null;
          const position = gsap.utils.clamp(
            0,
            100,
            ((logoBounds.top + logoBounds.height / 2 - lineBounds.top) / lineBounds.height) * 100
          );
          return `${card.dataset.lineColor} ${position}%`;
        }).filter(Boolean);

        if (colorStops.length) {
          line.style.background = `linear-gradient(to bottom, ${colorStops.join(", ")})`;
        }
      };

      updateTimelineGradient();

      gsap.utils.toArray(".timeline-card").forEach((card) => {
        gsap.from(card, {
          xPercent: -100,
          opacity: 0,
          transformOrigin: "left left",
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
          },
        });
      });

      gsap.to(".timeline", {
        scaleY: 0,
        transformOrigin: "bottom bottom",
        ease: "none",
        scrollTrigger: {
          trigger: ".experience-timeline",
          start: "top center",
          end: "bottom center",
          scrub: true,
          onRefresh: updateTimelineGradient,
        },
      });

      gsap.utils.toArray(".expText").forEach((text) => {
        gsap.from(text, {
          opacity: 0,
          xPercent: 0,
          duration: 1,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: text,
            start: "top 60%",
          },
        });
      });
    },
    { dependencies: [isMobile], revertOnUpdate: true }
  );

  return (
    <section id="experience" className="experience-section md:mt-40 mt-20">
      <div className="px-5 md:px-20">
        <TitleHeader
          title="Professional Work Experience"
          sub={
            <>
              <img src="/images/experience/workoverview.png" alt="" aria-hidden="true" />
              <span>My Career Overview</span>
            </>
          }
        />
      </div>

      {isMobile ? (
        <div className="mt-16 relative px-5 section-padding lg:px-0 pt-0">
          <div className="timeline-wrapper">
            <div className="timeline" />
            <div className="gradient-line experience-line w-1 h-full" />
          </div>
          <div className="experience-timeline relative z-50 space-y-10">
            {expCards.map((card) => (
              <div
                key={card.title}
                className="exp-card-wrapper"
                data-line-color={card.lineColor}
              >
                <div>
                  <GlowCard card={card}>
                    <div className={card.companyName ? "flex items-center gap-4" : ""}>
                      <img
                        src={card.imgPath}
                        alt=""
                        className={card.imageClassName}
                      />
                      {card.companyName && (
                        <span
                          className={
                            card.companyNameClassName || "font-semibold text-3xl"
                          }
                        >
                          {card.companyName}
                        </span>
                      )}
                    </div>
                  </GlowCard>
                </div>
                <div>
                  <div className="flex items-start">
                    <div className="expText flex gap-5 relative z-20">
                      <div className="timeline-logo">
                        <img src={card.logoPath} alt="" />
                      </div>
                      <div>
                        <h1 className="font-semibold text-3xl">{card.title}</h1>
                        <p className="my-5 text-white-50">🗓️&nbsp;{card.date}</p>
                        <p className="text-[#839CB5] italic">Responsibilities</p>
                        <ul className="list-disc ms-5 mt-5 flex flex-col gap-5 text-white-50">
                          {card.responsibilities.map((responsibility, index) => (
                            <li key={index} className="text-lg">
                              {responsibility}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <AgenticFactory3D
          height="min(90svh, 920px)"
          className="experience-factory-full mt-12 md:mt-16"
          stations={careerStations}
          activeStation={activeStation}
          onStation={setActiveStation}
        />
      )}
    </section>
  );
};

export default Experience;
