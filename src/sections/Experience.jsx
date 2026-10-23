import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { expCards } from "../constants";
import TitleHeader from "../components/TitleHeader";
import GlowCard from "../components/GlowCard";

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  useGSAP(() => {
    const updateTimelineGradient = () => {
      const line = document.querySelector(".experience-line");
      const lineBounds = line?.getBoundingClientRect();
      if (!lineBounds?.height) return;

      const cards = gsap.utils.toArray(".exp-card-wrapper");
      const colorStops = cards.map((card) => {
          const logo = card.querySelector(".timeline-logo");
          const logoBounds = logo.getBoundingClientRect();
          const position = gsap.utils.clamp(
            0,
            100,
            ((logoBounds.top + logoBounds.height / 2 - lineBounds.top) /
              lineBounds.height) *
              100
          );
          return { color: card.dataset.lineColor, position };
        });
      const lastCard = cards.at(-1);
      const lastFrame = lastCard?.querySelector(".timeline-card");
      const lastFrameBounds = lastFrame?.getBoundingClientRect();
      const endPosition = lastFrameBounds
        ? gsap.utils.clamp(
            0,
            100,
            ((lastFrameBounds.bottom - lineBounds.top) / lineBounds.height) * 100
          )
        : 100;
      const lastColor = colorStops.at(-1)?.color || "transparent";

      line.style.background = `linear-gradient(to bottom, ${colorStops
        .map(({ color, position }) => `${color} ${position}%`)
        .join(", ")}, ${lastColor} ${endPosition}%, transparent ${endPosition}%)`;
    };

    updateTimelineGradient();

    // Loop through each timeline card and animate them in
    // as the user scrolls to each card
    gsap.utils.toArray(".timeline-card").forEach((card) => {
      // Animate the card coming in from the left
      // and fade in
      gsap.from(card, {
        // Move the card in from the left
        xPercent: -100,
        // Make the card invisible at the start
        opacity: 0,
        // Set the origin of the animation to the left side of the card
        transformOrigin: "left left",
        // Animate over 1 second
        duration: 1,
        // Use a power2 ease-in-out curve
        ease: "power2.inOut",
        // Trigger the animation when the card is 80% of the way down the screen
        scrollTrigger: {
          // The card is the trigger element
          trigger: card,
          // Trigger the animation when the card is 80% down the screen
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

    gsap.utils.toArray(".timeline-logo").forEach((logo) => {
      gsap.fromTo(
        logo,
        { autoAlpha: 0, scale: 0.8 },
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.25,
          ease: "power1.out",
          scrollTrigger: {
            trigger: logo,
            start: "center center",
            toggleActions: "play none none reverse",
          },
        }
      );
    });

    // Loop through each expText element and animate them in
    // as the user scrolls to each text element
    gsap.utils.toArray(".expText").forEach((text) => {
      // Animate the text opacity from 0 to 1
      // and move it from the left to its final position
      // over 1 second with a power2 ease-in-out curve
      gsap.from(text, {
        // Set the opacity of the text to 0
        opacity: 0,
        // Move the text from the left to its final position
        // (xPercent: 0 means the text is at its final position)
        xPercent: 0,
        // Animate over 1 second
        duration: 1,
        // Use a power2 ease-in-out curve
        ease: "power2.inOut",
        // Trigger the animation when the text is 60% down the screen
        scrollTrigger: {
          // The text is the trigger element
          trigger: text,
          // Trigger the animation when the text is 60% down the screen
          start: "top 60%",
        },
      });
    }, "<"); // position parameter - insert at the start of the animation
  }, []);

  return (
    <section
      id="experience"
      className="flex-center md:mt-40 mt-20 section-padding lg:px-0"
    >
      <div className="w-full h-full md:px-20 px-5">
        <TitleHeader
          title="Professional Work Experience"
          sub={
            <>
              <img src="/images/experience/workoverview.png" alt="" aria-hidden="true" />
              <span>My Career Overview</span>
            </>
          }
        />
        <div className="mt-32 relative">
          <div className="timeline-wrapper">
            <div className="timeline" />
            <div className="gradient-line experience-line w-1 h-full" />
          </div>
          <div className="experience-timeline relative z-50 lg:space-y-32 space-y-10">
            {expCards.map((card) => (
              <div
                key={card.title}
                className="exp-card-wrapper"
                data-line-color={card.lineColor}
              >
                <div className="lg:w-2/6">
                  <GlowCard card={card}>
                    <div className={card.companyName ? "flex items-center gap-4" : ""}>
                      <img
                        src={card.imgPath}
                        alt="exp-img"
                        className={card.imageClassName}
                      />
                      {card.companyName && (
                        <span
                          className={card.companyNameClassName || "font-semibold text-3xl"}
                          style={{ color: card.lineColor }}
                        >
                          {card.companyName}
                        </span>
                      )}
                    </div>
                  </GlowCard>
                </div>
                <div className="lg:w-4/6">
                  <div className="flex items-start">
                    <div className="expText flex lg:gap-20 md:gap-10 gap-5 relative z-20">
                      <div className="timeline-logo">
                        <img src={card.logoPath} alt="logo" className={card.logoClassName} />
                      </div>
                      <div>
                        <h1 className="font-semibold text-3xl" style={{ color: card.lineColor }}>
                          {card.title}
                        </h1>
                        <p className="my-5 text-white-50">
                          🗓️&nbsp;{card.date}
                        </p>
                        <p className="text-[#839CB5] italic">
                          Responsibilities
                        </p>
                        <ul className="list-disc ms-5 mt-5 flex flex-col gap-5 text-white-50">
                          {card.responsibilities.map(
                            (responsibility, index) => (
                              <li key={index} className="text-lg">
                                {responsibility}
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Experience;
