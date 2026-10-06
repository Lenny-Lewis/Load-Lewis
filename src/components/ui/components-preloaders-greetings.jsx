import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const defaultGreetings = [
  { text: "Hello", language: "English" },
  { text: "Bonjour", language: "French" },
  { text: "안녕하세요", language: "Korean" },
  { text: "Hola", language: "Spanish" },
  { text: "Ciao", language: "Italian" },
  { text: "Hallo", language: "German" },
  { text: "नमस्ते", language: "Hindi" },
  { text: "こんにちは", language: "Japanese" },
  { text: "Olá", language: "Portuguese" },
  { text: "مرحبا", language: "Arabic" },
  { text: "Habari", language: "Swahili" },
  { text: "Привет", language: "Russian" },
];

/** Centered greeting animation for the site's desktop loading curtain. */
export default function GreetingPreloader({
  greetings = defaultGreetings,
  intervalMs = 300,
  className = "",
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const list = greetings?.length ? greetings : defaultGreetings;

  useEffect(() => {
    const timer = window.setInterval(() => {
      setCurrentIndex((index) => (index + 1) % list.length);
    }, intervalMs);
    return () => window.clearInterval(timer);
  }, [intervalMs, list]);

  return (
    <div
      className={`flex min-h-20 w-full items-center justify-center ${className}`}
      aria-label="Greetings in different languages"
    >
      <div className="relative flex h-16 w-60 items-center justify-center overflow-visible">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={currentIndex}
            className="absolute flex items-center gap-3 text-2xl font-medium text-foreground xl:text-3xl"
            aria-live="off"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <span className="h-2 w-2 rounded-full bg-foreground" aria-hidden="true" />
            {list[currentIndex].text}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
