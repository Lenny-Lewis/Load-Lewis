import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";

/**
 * Single digit reel — a vertical 0–9 strip masked to one digit,
 * racing through digits then crawling to a stop on `digit`.
 */
const SlotReelDigit = ({
  digit,
  reelIndex,
  spinCycles = 14,
  duration = 5.5,
  stagger = 0.45,
  active,
}) => {
  const totalSteps = spinCycles * 10 + digit;
  const stripLength = totalSteps + 1;
  const reelDuration = duration + reelIndex * 0.85;

  // Cover most distance early, then crawl the last stretch onto the winning digit
  const yKeyframes = [
    "0em",
    `-${totalSteps * 0.5}em`,
    `-${totalSteps * 0.78}em`,
    `-${totalSteps * 0.93}em`,
    `-${totalSteps * 0.985}em`,
    `-${totalSteps}em`,
  ];

  return (
    <span
      className="relative inline-block h-[1em] w-[1ch] overflow-hidden leading-none align-baseline"
      style={{ fontVariantNumeric: "tabular-nums" }}
      aria-hidden="true"
    >
      <motion.span
        className="absolute top-0 left-0 flex w-full flex-col will-change-transform"
        initial={{ y: "0em", filter: "blur(0px)" }}
        animate={
          active
            ? {
                y: yKeyframes,
                filter: ["blur(0px)", "blur(8px)", "blur(6px)", "blur(3px)", "blur(0px)"],
              }
            : { y: "0em", filter: "blur(0px)" }
        }
        transition={{
          delay: reelIndex * stagger,
          y: {
            duration: reelDuration,
            // Fast race → lingering crawl onto the final digit
            times: [0, 0.18, 0.4, 0.65, 0.85, 1],
            ease: ["easeOut", "easeOut", "easeOut", "easeOut", "easeOut"],
          },
          filter: {
            duration: reelDuration,
            // Heavy blur while racing; clear only in the final crawl
            times: [0, 0.06, 0.45, 0.78, 1],
            ease: ["easeIn", "linear", "easeOut", "easeOut"],
          },
        }}
      >
        {Array.from({ length: stripLength }, (_, i) => (
          <span
            key={i}
            className="flex h-[1em] w-full shrink-0 items-center justify-center leading-none"
          >
            {i % 10}
          </span>
        ))}
      </motion.span>
    </span>
  );
};

/**
 * Slot-machine number: each digit is an independent reel.
 * Suffix (+, %, etc.) stays static and fades in after the last reel settles.
 */
export const SlotMachineNumber = ({
  value,
  suffix,
  className = "",
  suffixClassName = "",
  spinCycles = 14,
  duration = 5.5,
  stagger = 0.45,
}) => {
  const ref = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, amount: 0.4 });

  const digits = String(value)
    .split("")
    .filter((c) => /\d/.test(c))
    .map(Number);

  const lastReelIndex = Math.max(digits.length - 1, 0);
  const settleTime =
    duration + lastReelIndex * 0.85 + lastReelIndex * stagger;

  if (shouldReduceMotion) {
    return (
      <span ref={ref} className={`inline-flex items-baseline gap-1 ${className}`}>
        <span className="tabular-nums">{value}</span>
        {suffix != null && <span className={suffixClassName}>{suffix}</span>}
      </span>
    );
  }

  return (
    <span
      ref={ref}
      className={`inline-flex items-baseline gap-1 ${className}`}
      aria-label={`${value}${suffix ?? ""}`}
    >
      <span className="inline-flex items-baseline leading-none tabular-nums">
        {digits.map((digit, i) => (
          <SlotReelDigit
            key={`${i}-${digit}`}
            digit={digit}
            reelIndex={i}
            spinCycles={spinCycles}
            duration={duration}
            stagger={stagger}
            active={isInView}
          />
        ))}
      </span>

      {suffix != null && (
        <motion.span
          className={suffixClassName}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: 0.4,
            delay: settleTime,
            ease: "easeOut",
          }}
        >
          {suffix}
        </motion.span>
      )}
    </span>
  );
};

export default SlotMachineNumber;
