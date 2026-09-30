import { useEffect, useState, useRef } from "react";

// Exact glyph pool from Locomotive LISA (app.js)
const GLYPHS = "!@#$%&+=qertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM\\/{}[][-_()<>?".split("");

// Exact progressive morph sequence matching Locomotive LISA
const BLOCK_1_PHRASES = [
  "Digital",
  "Digital-First",
  "Creative Technologist",
  "Full-Stack & 3D Web",
  "Lennox Lewis",
];

const BLOCK_2_PHRASES = [
  "Based",
  "Based in",
  "Based in Nairobi",
  "Based in Nairobi, Kenya",
];

const SPLINE_ASSETS = [
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode",
  "https://prod.spline.design/qgLe0tGeLUHJysaL/scene.splinecode",
];

const Preloader = ({ onComplete }) => {
  const [b1Index, setB1Index] = useState(0);
  const [b2Index, setB2Index] = useState(0);

  const [b1Chars, setB1Chars] = useState(() =>
    BLOCK_1_PHRASES[0].split("").map(() => "")
  );
  const [b1Opacity, setB1Opacity] = useState(() =>
    BLOCK_1_PHRASES[0].split("").map(() => 0)
  );

  const [b2Chars, setB2Chars] = useState(() =>
    BLOCK_2_PHRASES[0].split("").map(() => "")
  );
  const [b2Opacity, setB2Opacity] = useState(() =>
    BLOCK_2_PHRASES[0].split("").map(() => 0)
  );

  const [showLogo, setShowLogo] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  const heroReadyRef = useRef(false);
  const isFinishedRef = useRef(false);
  const timeoutsRef = useRef([]);

  const addTimeout = (fn, delay) => {
    const id = setTimeout(fn, delay);
    timeoutsRef.current.push(id);
    return id;
  };

  // Pre-warm 3D assets in browser cache
  useEffect(() => {
    SPLINE_ASSETS.forEach((url) => {
      try {
        fetch(url, { mode: "cors", cache: "force-cache" }).catch(() => {});
      } catch (err) {}
    });
  }, []);

  // Listen for 3D readiness from hero Spline / ThreeJS canvas
  useEffect(() => {
    const handleHeroReady = () => {
      heroReadyRef.current = true;
    };

    if (typeof window !== "undefined") {
      if (window.__HERO_3D_READY__) {
        handleHeroReady();
      } else {
        window.addEventListener("hero-3d-ready", handleHeroReady, { once: true });
      }
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("hero-3d-ready", handleHeroReady);
      }
    };
  }, []);

  // Locomotive glyph scramble helper for a single phrase
  const animatePhrase = (targetText, setChars, setOpacity, onDone, isAnchor = false) => {
    const chars = targetText.split("");
    const r = 5; // 5 cycles
    const s = 16; // 16ms tick
    const o = 12; // 12ms stagger

    // 1. Initial State: set length & 0 opacity
    setChars(chars.map(() => ""));
    setOpacity(chars.map(() => 0));

    // 2. Scramble Entrance
    chars.forEach((char, idx) => {
      const charDelay = idx * o;

      addTimeout(() => {
        // Reveal opacity
        setOpacity((prev) => {
          const arr = [...prev];
          arr[idx] = 1;
          return arr;
        });

        if (char === " ") {
          setChars((prev) => {
            const arr = [...prev];
            arr[idx] = "\u00A0";
            return arr;
          });
          return;
        }

        // 5 random glyph permutations
        for (let b = 0; b < r; b++) {
          addTimeout(() => {
            setChars((prev) => {
              const arr = [...prev];
              arr[idx] = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
              return arr;
            });
          }, b * s);
        }

        // Lock in real character
        addTimeout(() => {
          setChars((prev) => {
            const arr = [...prev];
            arr[idx] = char;
            return arr;
          });
        }, r * s);
      }, charDelay);
    });

    const entranceDuration = chars.length * o + r * s;
    const holdDuration = isAnchor ? 1400 : 380; // Anchor line holds longer

    // 3. If anchor line, don't scramble out immediately; wait for exit
    if (isAnchor) {
      addTimeout(() => {
        onDone?.();
      }, entranceDuration + holdDuration);
      return;
    }

    // 4. Scramble Out (Locomotive exit phase)
    addTimeout(() => {
      chars.forEach((char, idx) => {
        const exitDelay = idx * 8;

        addTimeout(() => {
          if (char !== " ") {
            for (let y = 0; y < r; y++) {
              addTimeout(() => {
                setChars((prev) => {
                  const arr = [...prev];
                  arr[idx] = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                  return arr;
                });
              }, y * s);
            }
          }

          addTimeout(() => {
            setOpacity((prev) => {
              const arr = [...prev];
              arr[idx] = 0;
              return arr;
            });
          }, r * s);
        }, exitDelay);
      });

      const exitDuration = chars.length * 8 + r * s;
      addTimeout(() => {
        onDone?.();
      }, exitDuration + 50);
    }, entranceDuration + holdDuration);
  };

  // Master Orchestration Sequence
  useEffect(() => {
    // 0. Fade out logo at 0.3s as text begins
    addTimeout(() => {
      setShowLogo(false);
    }, 450);

    // Sequence Block 1
    const runBlock1 = (step) => {
      if (step >= BLOCK_1_PHRASES.length) return;
      const isAnchor = step === BLOCK_1_PHRASES.length - 1;
      setB1Index(step);

      animatePhrase(
        BLOCK_1_PHRASES[step],
        setB1Chars,
        setB1Opacity,
        () => {
          if (!isAnchor) {
            runBlock1(step + 1);
          } else {
            // Block 1 anchor reached
            checkAllReady();
          }
        },
        isAnchor
      );
    };

    // Sequence Block 2 (starts with 0.15s offset)
    const runBlock2 = (step) => {
      if (step >= BLOCK_2_PHRASES.length) return;
      const isAnchor = step === BLOCK_2_PHRASES.length - 1;
      setB2Index(step);

      animatePhrase(
        BLOCK_2_PHRASES[step],
        setB2Chars,
        setB2Opacity,
        () => {
          if (!isAnchor) {
            runBlock2(step + 1);
          } else {
            // Block 2 anchor reached
            checkAllReady();
          }
        },
        isAnchor
      );
    };

    // Launch both blocks
    addTimeout(() => runBlock1(0), 200);
    addTimeout(() => runBlock2(0), 400);

    // Coordinate exit when both anchor lines are displayed & 3D is ready
    let anchorCount = 0;
    const checkAllReady = () => {
      anchorCount++;
      if (anchorCount >= 2) {
        // Wait for 3D ready or fallback timeout
        const wait3D = () => {
          if (isFinishedRef.current) return;
          isFinishedRef.current = true;

          // Scramble both anchor lines out before veil lifts
          const r = 5;
          const s = 16;

          [setB1Chars, setB2Chars].forEach((setChars) => {
            for (let y = 0; y < r; y++) {
              addTimeout(() => {
                setChars((prev) =>
                  prev.map(() => GLYPHS[Math.floor(Math.random() * GLYPHS.length)])
                );
              }, y * s);
            }
          });

          // Curtain dissolve (Locomotive cubic-bezier ease)
          addTimeout(() => {
            setIsFadingOut(true);
            addTimeout(() => {
              onComplete?.();
            }, 900);
          }, r * s + 80);
        };

        if (heroReadyRef.current) {
          addTimeout(wait3D, 500);
        } else {
          // Poll every 100ms or timeout after 4s
          const maxTime = Date.now() + 3500;
          const poll = setInterval(() => {
            if (heroReadyRef.current || Date.now() > maxTime) {
              clearInterval(poll);
              wait3D();
            }
          }, 100);
        }
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
        {/* Brand Logo that appears at the very beginning and dissolves */}
        <div
          className={`absolute flex items-center justify-center transition-all duration-700 ease-out pointer-events-none ${
            showLogo ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="text-2xl sm:text-3xl font-bold tracking-[0.2em] uppercase font-sans text-white/90">
            LENNOX LEWIS®
          </div>
        </div>

        {/* Exact Locomotive 12-Column Asymmetric Grid Layout */}
        <div className="absolute inset-0 w-full h-full grid grid-cols-4 md:grid-cols-12 grid-rows-2 px-6 sm:px-12 md:px-16 pointer-events-none">
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
          </div>

          {/* Bottom-Right Quadrant: Block 2 */}
          <div className="col-span-4 md:col-start-6 md:col-end-13 row-start-2 row-end-3 self-start pt-3 sm:pt-5">
            <p className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-light tracking-tight font-sans text-white/70 leading-tight min-h-[1.25em]">
              {b2Chars.map((char, i) => (
                <span
                  key={i}
                  className="inline-block transition-opacity duration-75"
                  style={{ opacity: b2Opacity[i] }}
                >
                  {char || "\u00A0"}
                </span>
              ))}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Preloader;
