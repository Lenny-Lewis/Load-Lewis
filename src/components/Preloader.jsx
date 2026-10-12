import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

const GLYPHS = "!@#$%&+=qertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM\\/{}][-_()<>?";
const TOP_LINES = [
  "Digital",
  "Digital Craft",
  "Digital Craft & Code",
  "Digital Craft & Code",
  "Creative Technologist",
  "Creative Technologist",
];
const BOTTOM_LINES = [
  "Made",
  "Made by",
  "Made by Lennox",
  "Made by Lennox",
  "Made by Lennox Lewis",
  "Made by Lennox Lewis",
  "Made by Lennox Lewis",
];

const SPLINE_ASSETS = [
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode",
  "https://prod.spline.design/qgLe0tGeLUHJysaL/scene.splinecode",
];

const ScrambleLines = ({ lines, className }) => (
  <div className={className} data-scramble-block aria-hidden="true">
    {lines.map((line, lineIndex) => (
      <div key={`${line}-${lineIndex}`} data-scramble-line className="whitespace-nowrap">
        {Array.from(line).map((char, charIndex) => (
          <span
            key={charIndex}
            data-scramble-char
            data-target={char}
            className="inline-block opacity-0"
          >
            {char === " " ? "\u00a0" : char}
          </span>
        ))}
      </div>
    ))}
  </div>
);

const Preloader = ({ onComplete, waitForScenes = true }) => {
  const rootRef = useRef(null);
  const logoRef = useRef(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    if (!waitForScenes || window.matchMedia("(max-width: 767px)").matches) return;
    SPLINE_ASSETS.forEach((url) => {
      fetch(url, { mode: "cors", cache: "force-cache" }).catch(() => {});
    });
  }, [waitForScenes]);

  useEffect(() => {
    const root = rootRef.current;
    const logo = logoRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers = new Set();
    let timeline;
    let finished = false;
    let started = false;
    let logoShown = false;
    let heroReady = Boolean(window.__HERO_3D_READY__);
    let contactReady = Boolean(window.__CONTACT_3D_READY__);

    const schedule = (callback, delay) => {
      const id = window.setTimeout(() => {
        timers.delete(id);
        callback();
      }, delay);
      timers.add(id);
    };

    const finish = () => {
      if (finished) return;
      finished = true;
      setIsFadingOut(true);
      schedule(() => onComplete?.(), 900);
    };

    // LISA's character effect uses five random glyphs at 16 ms intervals.
    const scramble = (element) => {
      const target = element.dataset.target;
      if (target === " ") return;
      for (let frame = 0; frame < 5; frame += 1) {
        schedule(() => {
          element.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }, frame * 16);
      }
      schedule(() => {
        element.textContent = target;
      }, 80);
    };

    const startSequence = () => {
      if (started) return;
      started = true;

      if (reduceMotion) {
        schedule(finish, 500);
        return;
      }

      timeline = gsap.timeline({ onComplete: finish });
      timeline.to(logo, { opacity: 0, duration: 0.2, ease: "power2.out" }, 0);

      const blocks = root.querySelectorAll("[data-scramble-block]");
      blocks.forEach((block, blockIndex) => {
        const lines = block.querySelectorAll("[data-scramble-line]");
        let charIndex = 0;

        lines.forEach((line, lineIndex) => {
          const lastLine = lineIndex === lines.length - 1;
          line.querySelectorAll("[data-scramble-char]").forEach((char) => {
            const enterAt = blockIndex * 0.25 + charIndex * 0.01;
            const exitAt = enterAt + 0.5 + (lastLine ? 1 : 0);

            timeline.set(char, { opacity: 1 }, enterAt);
            timeline.call(() => scramble(char), [], enterAt);
            timeline.call(() => scramble(char), [], exitAt);
            timeline.set(char, { opacity: 0 }, exitAt + 0.08);
            charIndex += 1;
          });
        });
      });
    };

    const checkReady = () => {
      if (logoShown && (!waitForScenes || (heroReady && contactReady))) {
        startSequence();
      }
    };
    const onHeroReady = () => {
      heroReady = true;
      checkReady();
    };
    const onContactReady = () => {
      contactReady = true;
      checkReady();
    };

    window.addEventListener("hero-3d-ready", onHeroReady);
    window.addEventListener("contact-3d-ready", onContactReady);

    // The logo remains visible while the scenes load; a timeout ensures the
    // introduction still runs when a remote 3D asset cannot report readiness.
    if (reduceMotion) {
      gsap.set(logo, { opacity: 1, scale: 1 });
    } else {
      gsap.fromTo(
        logo,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.9, delay: 0.3, ease: "power2.out" }
      );
    }
    schedule(() => {
      logoShown = true;
      checkReady();
    }, 1200);
    if (waitForScenes) schedule(startSequence, 8000);

    return () => {
      window.removeEventListener("hero-3d-ready", onHeroReady);
      window.removeEventListener("contact-3d-ready", onContactReady);
      timers.forEach(window.clearTimeout);
      timeline?.kill();
      gsap.killTweensOf(logo);
    };
  }, [onComplete, waitForScenes]);

  return (
    <aside
      ref={rootRef}
      role="status"
      aria-label="Loading portfolio"
      className={`fixed inset-0 z-[99999] select-none overflow-hidden bg-black text-white transition-opacity duration-[900ms] motion-reduce:duration-0 ${
        isFadingOut ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{ transitionTimingFunction: "cubic-bezier(0.215, 0.61, 0.355, 1)" }}
    >
      <div
        ref={logoRef}
        aria-hidden="true"
        className="absolute inset-0 flex items-center justify-center text-[clamp(1.5rem,4vw,2.75rem)] font-medium tracking-[-0.05em] opacity-0"
      >
        Lennox Lewis
      </div>

      <div className="pointer-events-none absolute inset-0 grid grid-cols-4 grid-rows-2 gap-x-3 px-[clamp(1.25rem,4vw,3.5rem)] text-[clamp(0.95rem,2vw,2rem)] leading-[1.2] min-[1200px]:grid-cols-12">
        <ScrambleLines
          lines={TOP_LINES}
          className="col-span-4 row-start-1 self-end pb-3 min-[1200px]:col-start-5 min-[1200px]:col-end-13"
        />
        <ScrambleLines
          lines={BOTTOM_LINES}
          className="col-start-2 col-end-5 row-start-2 flex flex-col-reverse self-start pt-3 min-[700px]:col-start-3 min-[1200px]:col-start-6 min-[1200px]:col-end-13"
        />
      </div>
    </aside>
  );
};

export default Preloader;
