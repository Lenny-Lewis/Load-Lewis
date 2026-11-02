import { useEffect, useRef, useState } from "react";

const GLYPHS = "!@#$%&+=qertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM\\/{}][-_()<>?";

const TOP_LINES = [
  "Digital",
  "Digital Craft",
  "Digital Craft & Code",
  "Digital Craft & Code",
];

// "City, Country". Leave empty to hide the bottom block.
const LOCATION = "Nairobi, Kenya";

// Builds: Based → Based in → Based in City → … → Based in City, Country
const buildLocationLines = (location) => {
  if (!location) return [];
  const [city, ...rest] = location.split(",");
  const cityLine = `Based in ${city.trim()}`;
  const fullLine = rest.length ? `${cityLine},${rest.join(",")}` : cityLine;
  return ["Based", "Based in", cityLine, cityLine, fullLine, fullLine, fullLine];
};

const BLOCKS = [TOP_LINES, buildLocationLines(LOCATION)];
const LOGO_NAME = "Lennox Lewis";

// Timing (seconds)
const BLOCK_STAGGER = 0.25;
const CHAR_STAGGER = 0.01;
const LINE_HOLD = 0.5;
const LAST_LINE_EXTRA_HOLD = 1;
const SCRAMBLE_DURATION = 0.08; // 5 glyphs × 16ms
const LOGO_PIECES_START = 0.25;
const LOGO_PIECES_STAGGER = 0.05;
const QUICK_PIECES_STAGGER = 0.025;

// Minimum time the logo stays on screen before the exit can begin.
const MIN_LOGO_MS = 1200;
// Fallback in case a remote 3D asset never reports readiness.
const MAX_WAIT_MS = 8000;
const OVERLAY_FADE_MS = 900;

const SPLINE_ASSETS = [
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode",
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
            {char === " " ? " " : char}
          </span>
        ))}
      </div>
    ))}
  </div>
);

/**
 * quick: repeat visit in this session. The logo shows, its pieces vanish
 * fast, and the overlay fades. No text, no waiting for 3D scenes.
 */
const Preloader = ({ onComplete, waitForScenes = true, quick = false }) => {
  const rootRef = useRef(null);
  const [isFadingOut, setIsFadingOut] = useState(false);

  // Read props through refs so parent re-renders (route/hash changes) never
  // restart the sequence.
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;
  const configRef = useRef({ waitForScenes: waitForScenes && !quick, quick });

  useEffect(() => {
    if (!configRef.current.waitForScenes || window.matchMedia("(max-width: 767px)").matches) return;
    SPLINE_ASSETS.forEach((url) => {
      fetch(url, { mode: "cors", cache: "force-cache" }).catch(() => {});
    });
  }, []);

  useEffect(() => {
    const { waitForScenes: waitScenes, quick: isQuick } = configRef.current;
    const root = rootRef.current;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const timers = new Set();
    let started = false;
    let rafId = 0;
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

    const fadeOut = () => {
      setIsFadingOut(true);
      schedule(() => onCompleteRef.current?.(), reduceMotion ? 0 : OVERLAY_FADE_MS);
    };

    // Logo pieces (monogram, stars, each letter) disappear one after another.
    const hideLogoPieces = (startAt, stagger) => {
      const pieces = root.querySelectorAll("[data-logo-piece]");
      pieces.forEach((piece, i) => {
        schedule(() => {
          piece.style.opacity = "0";
        }, (startAt + i * stagger) * 1000);
      });
      return startAt + (pieces.length - 1) * stagger;
    };

    // A single rAF loop drives every character. DOM writes happen only when a
    // character changes state, or once per frame while it is scrambling.
    const runScramble = (onDone) => {
      const chars = [];
      root.querySelectorAll("[data-scramble-block]").forEach((block, blockIndex) => {
        const lines = block.querySelectorAll("[data-scramble-line]");
        let charIndex = 0;
        lines.forEach((line, lineIndex) => {
          const lastLine = lineIndex === lines.length - 1;
          line.querySelectorAll("[data-scramble-char]").forEach((el) => {
            const enterAt = blockIndex * BLOCK_STAGGER + charIndex * CHAR_STAGGER;
            const exitAt = enterAt + LINE_HOLD + (lastLine ? LAST_LINE_EXTRA_HOLD : 0);
            const isSpace = el.dataset.target === " ";
            chars.push({
              el,
              target: isSpace ? " " : el.dataset.target,
              isSpace,
              enterAt,
              exitAt,
              state: "hidden",
            });
            charIndex += 1;
          });
        });
      });

      if (!chars.length) {
        onDone();
        return;
      }

      const endAt = Math.max(...chars.map((c) => c.exitAt)) + SCRAMBLE_DURATION;
      const randomGlyph = () => GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      const t0 = performance.now();

      const tick = (now) => {
        const t = (now - t0) / 1000;
        for (const c of chars) {
          let next;
          if (t < c.enterAt || t >= c.exitAt + SCRAMBLE_DURATION) next = "hidden";
          else if (t < c.enterAt + SCRAMBLE_DURATION || t >= c.exitAt) next = "scramble";
          else next = "shown";

          if (next === "scramble" && !c.isSpace) {
            c.el.textContent = randomGlyph();
          } else if (next !== c.state && next === "shown") {
            c.el.textContent = c.target;
          }
          if ((next === "hidden") !== (c.state === "hidden")) {
            c.el.style.opacity = next === "hidden" ? "0" : "1";
          }
          c.state = next;
        }

        if (t >= endAt) onDone();
        else rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    };

    const startSequence = () => {
      if (started) return;
      started = true;

      if (reduceMotion) {
        fadeOut();
        return;
      }

      if (isQuick) {
        const lastPieceAt = hideLogoPieces(0, QUICK_PIECES_STAGGER);
        schedule(fadeOut, lastPieceAt * 1000);
        return;
      }

      hideLogoPieces(LOGO_PIECES_START, LOGO_PIECES_STAGGER);
      runScramble(fadeOut);
    };

    const checkReady = () => {
      if (logoShown && (!waitScenes || (heroReady && contactReady))) startSequence();
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

    schedule(() => {
      logoShown = true;
      checkReady();
    }, reduceMotion ? 500 : MIN_LOGO_MS);
    if (waitScenes) schedule(startSequence, MAX_WAIT_MS);

    return () => {
      window.removeEventListener("hero-3d-ready", onHeroReady);
      window.removeEventListener("contact-3d-ready", onContactReady);
      timers.forEach(window.clearTimeout);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <aside
      ref={rootRef}
      role="status"
      aria-label="Loading portfolio"
      className={`fixed inset-0 z-[99999] select-none overflow-hidden bg-black text-white transition-opacity duration-[900ms] motion-reduce:duration-0 ${
        isFadingOut ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.215, 0.61, 0.355, 1)",
        willChange: "opacity",
      }}
    >
      <div
        aria-hidden="true"
        className="loader-logo absolute inset-0 flex items-center justify-center text-[clamp(1.5rem,4vw,2.75rem)]"
      >
        <div className="loader-wordmark">
          <svg data-logo-piece className="loader-wordmark__monogram" viewBox="0 0 40 40" fill="none" aria-hidden="true">
            <rect x="1" y="1" width="38" height="38" stroke="currentColor" strokeWidth="1.5" />
            <path d="M13 11.5V28H26.5" stroke="currentColor" strokeWidth="1.5" />
          </svg>
          <svg data-logo-piece className="loader-wordmark__stars" viewBox="0 0 49 32" fill="none" aria-hidden="true">
            <path d="M15 1V31M0 16H30M4.5 5.5L25.5 26.5M25.5 5.5L4.5 26.5" stroke="currentColor" strokeWidth="1.3" />
            <path d="M39 5V27M28 16H49M31.5 8.5L46.5 23.5M46.5 8.5L31.5 23.5" stroke="currentColor" strokeWidth="1.2" />
          </svg>
          <span className="loader-wordmark__name">
            {Array.from(LOGO_NAME).map((char, i) =>
              char === " " ? " " : <span key={i} data-logo-piece>{char}</span>
            )}
          </span>
        </div>
      </div>

      {!quick && (
        <div className="pointer-events-none absolute inset-0 grid grid-cols-4 grid-rows-2 gap-x-3 px-[clamp(1.25rem,4vw,3.5rem)] text-[clamp(0.95rem,2vw,2rem)] leading-[1.2] [font-kerning:none] min-[1200px]:grid-cols-12">
          <ScrambleLines
            lines={BLOCKS[0]}
            className="col-span-4 row-start-1 self-end pb-3 min-[1200px]:col-start-5 min-[1200px]:col-end-13"
          />
          {BLOCKS[1].length > 0 && (
            <ScrambleLines
              lines={BLOCKS[1]}
              className="col-start-2 col-end-5 row-start-2 flex flex-col-reverse self-start pt-3 min-[700px]:col-start-3 min-[1200px]:col-start-6 min-[1200px]:col-end-13"
            />
          )}
        </div>
      )}
    </aside>
  );
};

export default Preloader;
