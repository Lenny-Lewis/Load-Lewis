import { forwardRef, useCallback, useEffect, useImperativeHandle, useMemo, useState } from "react";
import { type Transition, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TextProps {
  children: React.ReactNode;
  reverse?: boolean;
  transition?: Transition;
  splitBy?: "words" | "characters" | "lines" | string;
  staggerDuration?: number;
  staggerFrom?: "first" | "last" | "center" | "random" | number;
  containerClassName?: string;
  wordLevelClassName?: string;
  elementLevelClassName?: string;
  onClick?: () => void;
  onStart?: () => void;
  onComplete?: () => void;
  /** Starts the reveal when true; it can flip to true later, such as when scrolled into view. */
  autoStart?: boolean;
}

export interface VerticalCutRevealRef {
  startAnimation: () => void;
  reset: () => void;
}

interface WordObject {
  characters: string[];
  needsSpace: boolean;
}

/** Splits text into characters, keeping emoji and other multi-part characters whole. */
const splitIntoCharacters = (text: string): string[] => {
  if (typeof Intl !== "undefined" && "Segmenter" in Intl) {
    const segmenter = new Intl.Segmenter("en", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), ({ segment }) => segment);
  }
  return Array.from(text);
};

/** Each word or letter slides up (or down, with `reverse`) out of a clipped line. */
const VerticalCutReveal = forwardRef<VerticalCutRevealRef, TextProps>(
  (
    {
      children,
      reverse = false,
      transition = { type: "spring", stiffness: 190, damping: 22 },
      splitBy = "words",
      staggerDuration = 0.2,
      staggerFrom = "first",
      containerClassName,
      wordLevelClassName,
      elementLevelClassName,
      onClick,
      onStart,
      onComplete,
      autoStart = true,
      ...props
    },
    ref
  ) => {
    const text = typeof children === "string" ? children : children?.toString() || "";
    const [isAnimating, setIsAnimating] = useState(false);

    const elements = useMemo(() => {
      const words = text.split(" ");
      if (splitBy === "characters") {
        return words.map((word, i) => ({
          characters: splitIntoCharacters(word),
          needsSpace: i !== words.length - 1,
        }));
      }
      return splitBy === "words" ? words : splitBy === "lines" ? text.split("\n") : text.split(splitBy);
    }, [text, splitBy]);

    const getStaggerDelay = useCallback(
      (index: number) => {
        const total =
          splitBy === "characters"
            ? elements.reduce(
                (acc, word) =>
                  acc + (typeof word === "string" ? 1 : word.characters.length + (word.needsSpace ? 1 : 0)),
                0
              )
            : elements.length;
        if (staggerFrom === "first") return index * staggerDuration;
        if (staggerFrom === "last") return (total - 1 - index) * staggerDuration;
        if (staggerFrom === "center") return Math.abs(Math.floor(total / 2) - index) * staggerDuration;
        if (staggerFrom === "random") return Math.abs(Math.floor(Math.random() * total) - index) * staggerDuration;
        return Math.abs(staggerFrom - index) * staggerDuration;
      },
      [elements, splitBy, staggerFrom, staggerDuration]
    );

    const startAnimation = useCallback(() => {
      setIsAnimating(true);
      onStart?.();
    }, [onStart]);

    useImperativeHandle(ref, () => ({ startAnimation, reset: () => setIsAnimating(false) }));

    useEffect(() => {
      if (autoStart) startAnimation();
      // Only a change in autoStart should start it.
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [autoStart]);

    const variants = {
      hidden: { y: reverse ? "-100%" : "100%" },
      visible: (i: number) => ({
        y: 0,
        transition: { ...transition, delay: ((transition?.delay as number) || 0) + getStaggerDelay(i) },
      }),
    };

    const words: WordObject[] =
      splitBy === "characters"
        ? (elements as WordObject[])
        : (elements as string[]).map((el, i) => ({ characters: [el], needsSpace: i !== elements.length - 1 }));

    return (
      <span
        className={cn(containerClassName, "flex flex-wrap whitespace-pre-wrap", splitBy === "lines" && "flex-col")}
        onClick={onClick}
        {...props}
      >
        <span className="sr-only">{text}</span>
        {words.map((wordObj, wordIndex, array) => {
          const previousCharsCount = array.slice(0, wordIndex).reduce((sum, word) => sum + word.characters.length, 0);
          return (
            <span key={wordIndex} aria-hidden="true" className={cn("inline-flex overflow-hidden", wordLevelClassName)}>
              {wordObj.characters.map((char, charIndex) => (
                <span className={cn(elementLevelClassName, "relative whitespace-pre-wrap")} key={charIndex}>
                  <motion.span
                    custom={previousCharsCount + charIndex}
                    initial="hidden"
                    animate={isAnimating ? "visible" : "hidden"}
                    variants={variants}
                    onAnimationComplete={
                      wordIndex === words.length - 1 && charIndex === wordObj.characters.length - 1
                        ? onComplete
                        : undefined
                    }
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                </span>
              ))}
              {wordObj.needsSpace && <span> </span>}
            </span>
          );
        })}
      </span>
    );
  }
);

VerticalCutReveal.displayName = "VerticalCutReveal";

export { VerticalCutReveal };
