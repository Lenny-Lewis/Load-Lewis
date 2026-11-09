import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

import AnimatedCounter from "../components/AnimatedCounter";
import Button from "../components/Button";
import SplineRobotCard from "../components/SplineRobotCard";
import { words } from "../constants";
import { usePageRevealed } from "../hooks/usePageRevealed";

const Hero = () => {
  const heroRef = useRef(null);
  const pageRevealed = usePageRevealed();

  useGSAP(
    () => {
      // Coming from another page, hold the headline hidden until the transition uncovers it.
      if (!pageRevealed) {
        gsap.set(".hero-text h1", { y: 50, opacity: 0 });
        return;
      }
      gsap.fromTo(
        ".hero-text h1",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: "power2.inOut" }
      );
    },
    { scope: heroRef, dependencies: [pageRevealed] }
  );

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex flex-col overflow-hidden bg-black pt-16 md:pt-20 lg:pt-20"
    >
      <div className="hero-reveal relative z-10 grid lg:grid-cols-[0.85fr_1.15fr] xl:grid-cols-[0.8fr_1.2fr] min-h-[85vh] lg:min-h-screen items-stretch">
        <header className="relative flex items-start justify-start self-start px-6 pt-4 sm:px-10 sm:pt-6 lg:px-12 lg:pt-4 lg:-translate-y-6 xl:pt-6 lg:pb-0 lg:pl-12 xl:pl-16">
          <div className="hero-copy max-w-[25rem] lg:max-w-[34rem] xl:max-w-[42rem] 2xl:max-w-[48rem]">
            <div className="hero-text">
              <h1>
                Shaping
                <span className="slide">
                  <span className="wrapper">
                    {words.map((word, index) => (
                      <span
                        key={index}
                        className="flex items-center md:gap-3 gap-1 pb-2"
                      >
                        <img
                          src={word.imgPath}
                          alt="person"
                          className="xl:size-12 md:size-10 size-7 md:p-2 p-1 rounded-full bg-white-50"
                        />
                        <span>{word.text}</span>
                      </span>
                    ))}
                  </span>
                </span>
              </h1>
              <h1>into Real Projects</h1>
              <h1>that Deliver Results</h1>
            </div>

            <p className="hero-description max-w-[24rem] text-white/70">
              Hi, I’m Lennox Lewis, a ML Engineer and Full Stack developer
               building polished digital products for web and
              mobile.
            </p>

            <Button
              text="SEE MY WORK"
              className="md:w-80 md:h-16 w-60 h-12"
              id="counter"
            />
          </div>
        </header>

        <div className="hero-visual relative w-full h-full min-h-[50vh] lg:min-h-full flex items-center justify-center">
          <SplineRobotCard scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" />
        </div>
      </div>

      <AnimatedCounter />
    </section>
  );
};

export default Hero;
