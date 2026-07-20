import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";

import AnimatedCounter from "../components/AnimatedCounter";
import Button from "../components/Button";
import SplineRobotCard from "../components/SplineRobotCard";
import { words } from "../constants";

const Hero = () => {
  const heroRef = useRef(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".hero-text h1",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.2, duration: 1, ease: "power2.inOut" }
      );
    },
    { scope: heroRef }
  );

  return (
    <section
      id="hero"
      ref={heroRef}
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-[#050505] pt-24"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.03),transparent_30%),linear-gradient(180deg,rgba(255,255,255,0.02),transparent_15%,transparent_85%,rgba(255,255,255,0.02))]" />
      <div className="pointer-events-none absolute left-1/4 top-20 h-96 w-96 -translate-x-1/2 rounded-full bg-white/18 blur-[120px]" />

      <div className="hero-reveal relative z-10 grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <header className="relative flex items-start justify-start px-6 py-12 sm:px-10 lg:px-12 lg:pt-20 xl:pt-32 lg:pb-0 lg:pl-12 xl:pl-16">
          <div className="hero-copy max-w-[25rem] lg:max-w-[42rem] xl:max-w-[48rem]">
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
              based in Kenya building polished digital products for web and
              mobile.
            </p>

            <Button
              text="SEE MY WORK"
              className="md:w-80 md:h-16 w-60 h-12"
              id="counter"
            />
          </div>
        </header>

        <div className="hero-visual relative min-h-[48vh] lg:min-h-screen">
          <SplineRobotCard scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode" />
        </div>
      </div>

      <AnimatedCounter />
    </section>
  );
};

export default Hero;
