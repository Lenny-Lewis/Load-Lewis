import { useEffect, useState, useRef } from "react";
import ShapeLoader from "./ui/ShapeLoader";

// Exact glyph pool from Locomotive LISA
const GLYPHS = "!@#$%&+=qertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM\\/{}[][-_()<>?".split("");

// Block 1 sequence with interspersed code snippets and creative tech statements
const BLOCK_1_ITEMS = [
  { text: "Digital", code: "// init: webgl2_render_context" },
  { text: "const engine = new WebGL();", code: "// gl_FragColor = vec4(col, 1.0)" },
  { text: "Creative Technologist", code: "// model.forward(latent_vectors)" },
  { text: "mesh.rotation.y += delta;", code: "// vertices: 142,840 • 60 FPS" },
  { text: "Lennox Lewis", code: "// Creative Technologist © 2026" },
];

// Block 2 sequence (no 'Based in Kenya', authentic creative engineering phrases & code)
const BLOCK_2_ITEMS = [
  { text: "Building", code: "// status: compiling_geometry" },
  { text: "shader.compile(gl_FragColor);", code: "// PBR_roughness: 0.18" },
  { text: "Interactive 3D & AI", code: "// Three.js • Spline • PyTorch" },
  { text: "y = softmax(Q @ K.T) @ V", code: "// attention_heads: 16 • dim: 1024" },
  { text: "Next-Gen Digital Craft", code: "// [ 3D RUNTIME SYNCHRONIZED ]" },
];

const SPLINE_ASSETS = [
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode",
  "https://prod.spline.design/qgLe0tGeLUHJysaL/scene.splinecode",
];

const Preloader = ({ onComplete }) => {
  const [b1Chars, setB1Chars] = useState(() =>
    BLOCK_1_ITEMS[0].text.split("").map(() => "")
  );
  const [b1Opacity, setB1Opacity] = useState(() =>
    BLOCK_1_ITEMS[0].text.split("").map(() => 0)
  );
  const [b1Code, setB1Code] = useState(BLOCK_1_ITEMS[0].code);

  const [b2Chars, setB2Chars] = useState(() =>
    BLOCK_2_ITEMS[0].text.split("").map(() => "")
  );
  const [b2Opacity, setB2Opacity] = useState(() =>
    BLOCK_2_ITEMS[0].text.split("").map(() => 0)
  );
  const [b2Code, setB2Code] = useState(BLOCK_2_ITEMS[0].code);

  const [showLogo, setShowLogo] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  // Drives the ShapeLoader; cleared when the curtain lifts.
  const [assetsReady, setAssetsReady] = useState(false);

  // 3D Readiness tracking for both elements
  const heroReadyRef = useRef(false);
  const contactReadyRef = useRef(false);
  const isFinishedRef = useRef(false);
  const timeoutsRef = useRef([]);

  const addTimeout = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  };

  // Pre-fetch 3D assets in browser cache
  useEffect(() => {
    SPLINE_ASSETS.forEach((url) => {
      try {
        fetch(url, { mode: "cors", cache: "force-cache" }).catch(() => {});
      } catch (err) {}
    });
  }, []);

  // Listen for 3D readiness events for both 3D elements
  useEffect(() => {
    const handleHeroReady = () => {
      heroReadyRef.current = true;
    };
    const handleContactReady = () => {
      contactReadyRef.current = true;
    };

    if (typeof window !== "undefined") {
      if (window.__HERO_3D_READY__) heroReadyRef.current = true;
      if (window.__CONTACT_3D_READY__) contactReadyRef.current = true;

      window.addEventListener("hero-3d-ready", handleHeroReady);
      window.addEventListener("contact-3d-ready", handleContactReady);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("hero-3d-ready", handleHeroReady);
        window.removeEventListener("contact-3d-ready", handleContactReady);
      }
    };
  }, []);

  // Scramble a whole phrase per frame instead of scheduling a timer and React
  // update for every glyph. This keeps the visual effect while limiting the
  // preloader to a handful of updates per phase.
  const animatePhrase = (targetItem, setChars, setOpacity, setCode, onDone, isAnchor = false) => {
    const chars = targetItem.text.split("");
    const scrambleFrames = 5;
    const frameDuration = 80;
    const entranceDuration = 500;
    const exitDuration = 500;

    // Update the companion code comment
    setCode(targetItem.code);

    // Initial state
    setChars(chars.map(() => ""));
    setOpacity(chars.map(() => 0));

    const showScrambleFrame = () => {
      setChars(chars.map((char) => char === " " ? "\u00A0" : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]));
      setOpacity(chars.map(() => 1));
    };
    for (let frame = 0; frame < scrambleFrames; frame += 1) {
      addTimeout(showScrambleFrame, frame * frameDuration);
    }
    addTimeout(() => setChars(chars.map((char) => char === " " ? "\u00A0" : char)), entranceDuration);

    const holdDuration = isAnchor ? 1500 : 420;

    // Anchor lines hold without scrambling out
    if (isAnchor) {
      addTimeout(() => onDone?.(), entranceDuration + holdDuration);
      return;
    }

    // Scramble out
    addTimeout(() => {
      for (let frame = 0; frame < scrambleFrames; frame += 1) {
        addTimeout(showScrambleFrame, frame * frameDuration);
      }
      addTimeout(() => {
        setOpacity(chars.map(() => 0));
        onDone?.();
      }, exitDuration);
    }, entranceDuration + holdDuration);
  };

  // Master Orchestration Sequence
  useEffect(() => {
    // Let the brand mark have its own opening beat before the text sequence.
    addTimeout(() => {
      setShowLogo(false);
    }, 800);

    // Sequence Block 1
    const runBlock1 = (step) => {
      if (step >= BLOCK_1_ITEMS.length) return;
      const isAnchor = step === BLOCK_1_ITEMS.length - 1;

      animatePhrase(
        BLOCK_1_ITEMS[step],
        setB1Chars,
        setB1Opacity,
        setB1Code,
        () => {
          if (!isAnchor) {
            runBlock1(step + 1);
          } else {
            checkAllReady();
          }
        },
        isAnchor
      );
    };

    // Sequence Block 2 (offset by 0.18s)
    const runBlock2 = (step) => {
      if (step >= BLOCK_2_ITEMS.length) return;
      const isAnchor = step === BLOCK_2_ITEMS.length - 1;

      animatePhrase(
        BLOCK_2_ITEMS[step],
        setB2Chars,
        setB2Opacity,
        setB2Code,
        () => {
          if (!isAnchor) {
            runBlock2(step + 1);
          } else {
            checkAllReady();
          }
        },
        isAnchor
      );
    };

    addTimeout(() => runBlock1(0), 1600);
    addTimeout(() => runBlock2(0), 1800);

    // Coordinate exit: on mobile requires BOTH 3D elements to render!
    let anchorCount = 0;
    const checkAllReady = () => {
      anchorCount++;
      if (anchorCount >= 2) {
        const executeCurtainLift = () => {
          if (isFinishedRef.current) return;
          isFinishedRef.current = true;

          // Every 3D asset has reported in — the loader has done its job.
          setAssetsReady(true);

          // Scramble anchor characters out
          [setB1Chars, setB2Chars].forEach((setChars) => {
            for (let frame = 0; frame < 5; frame += 1) {
              addTimeout(() => {
                setChars((prev) => prev.map((char) => char === "\u00A0" ? char : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]));
              }, frame * 80);
            }
          });

          // Dissolve curtain with Locomotive's cubic-bezier ease
          addTimeout(() => {
            setIsFadingOut(true);
            addTimeout(() => {
              onComplete?.();
            }, 900);
          }, 480);
        };

        const maxWaitTime = Date.now() + 8000; // safety fallback timeout

        const checkReadiness = () => {
          // The curtain only lifts once EVERY 3D asset has reported ready.
          // Previously desktop only waited on the hero scene; now both the hero
          // and contact scenes gate completion on every breakpoint, so the
          // animation genuinely finishes only when all 3D assets are loaded.
          const areElementsReady = heroReadyRef.current && contactReadyRef.current;
          const timedOut = Date.now() > maxWaitTime;

          if (areElementsReady || timedOut) {
            executeCurtainLift();
          } else {
            setTimeout(checkReadiness, 100);
          }
        };

        checkReadiness();
      }
    };

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <aside
      aria-label="Site preloader"
      className={`fixed inset-0 z-[99999] bg-black text-white select-none transition-opacity duration-[900ms] pointer-events-auto ${
        isFadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.215, 0.61, 0.355, 1)",
      }}
    >
      <div className="absolute inset-0 w-full h-full flex items-center justify-center">
        {/* Asset-load indicator.
            Mobile: centred on its own — the scramble-text blocks are hidden at
            this breakpoint so the loader owns the screen while 3D streams in.
            Desktop: kept at the foot of the curtain, under the text blocks. */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center pointer-events-none transition-opacity duration-700 ease-out md:inset-x-auto md:inset-y-auto md:bottom-12 md:left-1/2 md:flex-row md:-translate-x-1/2 ${
            assetsReady ? "opacity-0 md:scale-95" : "opacity-100 md:scale-100"
          }`}
        >
          <ShapeLoader className="md:hidden" />
          <p className="mt-5 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-white/30 md:absolute md:mt-0 md:top-[calc(100%+1.25rem)] md:inset-x-0">
            Loading 3D assets
          </p>
        </div>

        {/* Brand Logo that appears at the start and dissolves.
            Hidden on mobile, where the shape loader is the sole focal point. */}
        <div
          className={`absolute hidden md:flex items-center justify-center transition-all duration-700 ease-out pointer-events-none ${
            showLogo ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="text-2xl sm:text-3xl font-bold tracking-[0.2em] uppercase font-sans text-white/90">
            LENNOX LEWIS®
          </div>
        </div>

        {/* Exact Locomotive 12-Column Asymmetric Grid Layout.
            Hidden on mobile: the shape loader is centred there instead, and
            two competing focal points on a small screen read as noise. */}
        <div className="absolute inset-0 w-full h-full hidden md:grid grid-cols-4 md:grid-cols-12 grid-rows-2 px-6 sm:px-12 md:px-16 pointer-events-none">
          {/* Top-Right Quadrant: Block 1 */}
          <div className="col-span-4 md:col-start-5 md:col-end-13 row-start-1 row-end-2 self-end pb-3 sm:pb-5">
            <h2 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight font-sans text-white leading-tight min-h-[1.25em]">
              {b1Chars.map((char, i) => (
                <span
                  key={i}
                  className="inline-block transition-opacity duration-75"
                  style={{ opacity: b1Opacity[i] }}
                >
                  {char || "\u00A0"}
                </span>
              ))}
            </h2>
            {/* Companion Code Snippet */}
            <p className="font-mono text-[11px] sm:text-xs text-white/40 tracking-wider mt-1 transition-opacity duration-200">
              {b1Code}
            </p>
          </div>

          {/* Bottom-Right Quadrant: Block 2 */}
          <div className="col-span-4 md:col-start-6 md:col-end-13 row-start-2 row-end-3 self-start pt-3 sm:pt-5">
            <div className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight font-sans text-white/70 leading-tight min-h-[1.25em]">
              {b2Chars.map((char, i) => (
                <span
                  key={i}
                  className="inline-block transition-opacity duration-75"
                  style={{ opacity: b2Opacity[i] }}
                >
                  {char || "\u00A0"}
                </span>
              ))}
            </div>
            {/* Companion Code Snippet */}
            <p className="font-mono text-[11px] sm:text-xs text-[#cda144]/60 tracking-wider mt-1 transition-opacity duration-200">
              {b2Code}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Preloader;
