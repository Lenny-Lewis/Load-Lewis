import { motion, useReducedMotion } from "framer-motion";

/**
 * HoverTextSlide component
 * Displays text inside a fixed-height, overflow-hidden container.
 * On hover, the primary copy slides up and out (-100%) while an identical duplicate
 * slides up from below (100% -> 0%), landing exactly in place.
 * 
 * Accessible: Duplicate has aria-hidden="true"
 * Motion-safe: Respects prefers-reduced-motion
 * Touch-safe: Does not get stuck on mobile/tablet taps
 */

const slideTransition = {
  duration: 0.65,
  ease: [0.76, 0, 0.24, 1], // Slow cinematic ease-in-out
};

export const HoverTextSlide = ({
  text,
  className = "",
  containerClassName = "",
  asMotion = false,
}) => {
  const shouldReduceMotion = useReducedMotion();

  // If user prefers reduced motion, render single static text without motion
  if (shouldReduceMotion) {
    return <span className={className}>{text}</span>;
  }

  if (asMotion) {
    return (
      <span
        className={`relative inline-flex flex-col h-[1.3em] overflow-hidden leading-[1.3em] select-none ${containerClassName}`}
      >
        <motion.span
          variants={{
            rest: { y: "0%" },
            hover: { y: "-100%" },
          }}
          transition={slideTransition}
          className={`inline-block ${className}`}
        >
          {text}
        </motion.span>
        <motion.span
          aria-hidden="true"
          variants={{
            rest: { y: "100%" },
            hover: { y: "0%" },
          }}
          transition={slideTransition}
          className={`absolute top-0 left-0 inline-block pointer-events-none ${className}`}
        >
          {text}
        </motion.span>
      </span>
    );
  }

  // Pure CSS transform implementation (relies on parent having "group")
  return (
    <span
      className={`relative inline-flex flex-col h-[1.3em] overflow-hidden leading-[1.3em] select-none ${containerClassName}`}
    >
      <span
        className={`inline-block transform-gpu transition-transform duration-[650ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full motion-reduce:transform-none ${className}`}
      >
        {text}
      </span>
      <span
        aria-hidden="true"
        className={`absolute top-0 left-0 inline-block transform-gpu transition-transform duration-[650ms] ease-[cubic-bezier(0.76,0,0.24,1)] translate-y-full group-hover:translate-y-0 pointer-events-none motion-reduce:hidden ${className}`}
      >
        {text}
      </span>
    </span>
  );
};

export default HoverTextSlide;
