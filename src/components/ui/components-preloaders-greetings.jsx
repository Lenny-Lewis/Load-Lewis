import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import ShapeLoader from "./ShapeLoader";

const defaultGreetings = [
  { text: "Hello", language: "English" },
  { text: "Bonjour", language: "French" },
  { text: "안녕하세요", language: "Korean" },
  { text: "Hola", language: "Spanish" },
  { text: "Ciao", language: "Italian" },
  { text: "Hallo", language: "German" },
  { text: "नमस्ते", language: "Hindi" },
  { text: "こんにちは", language: "Japanese" },
];

function DynamicText({ greetings, intervalMs, reducedMotion }) {
  const [index, setIndex] = useState(0);

  // Keep a single lightweight timer alive while either loader stage is visible.
  useEffect(() => {
    if (reducedMotion) return undefined;
    const timer = window.setInterval(
      () => setIndex((current) => (current + 1) % greetings.length),
      intervalMs
    );
    return () => window.clearInterval(timer);
  }, [greetings.length, intervalMs, reducedMotion]);

  return (
    <div className="relative flex h-16 w-60 items-center justify-center overflow-visible">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={index}
          className="absolute flex items-center gap-2 text-2xl font-medium text-foreground will-change-transform xl:text-3xl"
          aria-live="off"
          initial={reducedMotion ? false : { y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={reducedMotion ? undefined : { y: -36, opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.2, ease: "easeOut" }}
        >
          <span className="h-2 w-2 rounded-full bg-foreground" aria-hidden="true" />
          {greetings[index].text}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default function GreetingPreloader({
  greetings: greetingList,
  intervalMs = 300,
  fullPage = true,
  visible = true,
  mobile = false,
  onExitComplete,
}) {
  const prefersReducedMotion = useReducedMotion();
  const greetings = useMemo(
    () => greetingList?.length ? greetingList : defaultGreetings,
    [greetingList]
  );

  return (
    <AnimatePresence onExitComplete={onExitComplete}>
      {visible && (
        <motion.div
          key="portfolio-preloader"
          className={`${fullPage ? "fixed" : "absolute"} inset-0 z-[99999] flex items-center justify-center bg-background`}
          initial={false}
          animate={{ yPercent: 0 }}
          exit={{ yPercent: prefersReducedMotion ? 0 : -110 }}
          transition={{ duration: prefersReducedMotion ? 0 : 0.8, ease: "easeInOut" }}
          aria-label="Site preloader"
          role="status"
        >
          {mobile ? (
            <ShapeLoader />
          ) : (
            <div className="flex flex-col items-center text-center">
              <DynamicText
                greetings={greetings}
                intervalMs={intervalMs}
                reducedMotion={prefersReducedMotion}
              />
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
