import { useEffect, useState, useRef } from "react";

// Exact glyph set from locomotive.ca
const GLYPHS = "!@#$%&+=qertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM\\/{}[][-_()<>?".split("");

const LINES = [
  "Lennox Lewis",
  "Creative Technologist",
];

const SPLINE_ASSETS = [
  "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode",
  "https://prod.spline.design/qgLe0tGeLUHJysaL/scene.splinecode",
];

const Preloader = ({ onComplete }) => {
  const [chars, setChars] = useState(() =>
    LINES.map((line) => line.split("").map(() => ""))
  );
  const [opacities, setOpacities] = useState(() =>
    LINES.map((line) => line.split("").map(() => 0))
  );
  const [isExiting, setIsExiting] = useState(false);

  const startTimeRef = useRef(Date.now());
  const heroLoadedRef = useRef(false);
  const isDoneRef = useRef(false);
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
      } catch (err) {
        // Ignore prefetch network errors
      }
    });
  }, []);

  // Listen for 3D readiness from Spline / Canvas
  useEffect(() => {
    const handleHeroReady = () => {
      heroLoadedRef.current = true;
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

  // Character scramble animation on entrance
  useEffect(() => {
    const r = 5; // number of random glyph flips
    const s = 16; // ms between flips
    const o = 14; // ms stagger between characters
    const lineDelay = 180; // ms stagger between lines

    LINES.forEach((line, lineIdx) => {
      const targetChars = line.split("");

      targetChars.forEach((realChar, charIdx) => {
        if (realChar === " ") {
          setChars((prev) => {
            const next = prev.map((l) => [...l]);
            next[lineIdx][charIdx] = "\u00A0";
            return next;
          });
          setOpacities((prev) => {
            const next = prev.map((l) => [...l]);
            next[lineIdx][charIdx] = 1;
            return next;
          });
          return;
        }

        const startAt = lineIdx * lineDelay + charIdx * o + 150;

        addTimeout(() => {
          setOpacities((prev) => {
            const next = prev.map((l) => [...l]);
            next[lineIdx][charIdx] = 1;
            return next;
          });

          for (let b = 0; b < r; b++) {
            addTimeout(() => {
              setChars((prev) => {
                const next = prev.map((l) => [...l]);
                next[lineIdx][charIdx] = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                return next;
              });
            }, b * s);
          }

          addTimeout(() => {
            setChars((prev) => {
              const next = prev.map((l) => [...l]);
              next[lineIdx][charIdx] = realChar;
              return next;
            });
          }, r * s);
        }, startAt);
      });
    });

    return () => {
      timeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // Release preloader once 3D is ready
  useEffect(() => {
    const minDuration = 2200; // minimum display time (ms)
    const maxDuration = 4800; // fallback timeout (ms)

    const checkReady = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current;
      const isReady = heroLoadedRef.current || elapsed >= maxDuration;

      if (isReady && elapsed >= minDuration && !isDoneRef.current) {
        isDoneRef.current = true;
        clearInterval(checkReady);

        // Scramble out before curtain lifts
        const r = 5;
        const s = 16;
        const o = 10;

        LINES.forEach((line, lineIdx) => {
          line.split("").forEach((_, charIdx) => {
            const exitStart = lineIdx * 90 + charIdx * o;

            addTimeout(() => {
              for (let y = 0; y < r; y++) {
                addTimeout(() => {
                  setChars((prev) => {
                    const next = prev.map((l) => [...l]);
                    next[lineIdx][charIdx] = GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
                    return next;
                  });
                }, y * s);
              }

              addTimeout(() => {
                setOpacities((prev) => {
                  const next = prev.map((l) => [...l]);
                  next[lineIdx][charIdx] = 0;
                  return next;
                });
              }, r * s);
            }, exitStart);
          });
        });

        // Lift black curtain
        addTimeout(() => {
          setIsExiting(true);
          addTimeout(() => {
            onComplete?.();
          }, 900);
        }, 320);
      }
    }, 100);

    return () => clearInterval(checkReady);
  }, [onComplete]);

  return (
    <aside
      aria-label="Site preloader"
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-black select-none transition-opacity duration-[900ms] ${
        isExiting ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"
      }`}
      style={{
        transitionTimingFunction: "cubic-bezier(0.215, 0.61, 0.355, 1)",
      }}
    >
      {/* Strictly the central text on pure black background */}
      <div className="flex flex-col items-center justify-center text-center space-y-2 sm:space-y-3 font-sans px-4">
        <div className="text-3xl sm:text-5xl md:text-6xl font-medium tracking-tight text-white leading-tight">
          {LINES[0].split("").map((_, i) => (
            <span
              key={i}
              className="inline-block transition-opacity duration-75"
              style={{ opacity: opacities[0][i] }}
            >
              {chars[0][i] || "\u00A0"}
            </span>
          ))}
        </div>

        <div className="text-lg sm:text-2xl md:text-3xl font-light tracking-normal text-white/70 leading-tight">
          {LINES[1].split("").map((_, i) => (
            <span
              key={i}
              className="inline-block transition-opacity duration-75"
              style={{ opacity: opacities[1][i] }}
            >
              {chars[1][i] || "\u00A0"}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default Preloader;
