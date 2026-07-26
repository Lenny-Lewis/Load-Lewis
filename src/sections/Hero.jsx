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
      className="relative flex min-h-screen flex-col justify-center overflow-hidden bg-black pt-0 md:pt-24"
    >
      <div className="hero-reveal relative z-10 grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <header className="relative flex items-start justify-start px-6 pt-16 pb-8 sm:px-10 sm:pt-28 sm:pb-12 lg:px-12 lg:pt-20 xl:pt-32 lg:pb-0 lg:pl-12 xl:pl-16">
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
