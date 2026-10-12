import { motion as Motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const REEL_LENGTH = 8;
const ROLL_DURATION = 2;
const STAGGER_DELAY = 0.1;
const BLUR = 6;

// A stable mix gives each reel a different starting strip and changes it on
// replay without generating random values during React rendering.
const mixedDigit = (target, reelIndex, replay, position) => {
  let seed = (target + 1) * 17 + (reelIndex + 1) * 29 + (replay + 1) * 47 + position * 41;
  seed = Math.imul(seed ^ (seed >>> 3), 2654435761);
  return (seed >>> 0) % 10;
};

const SlotReelDigit = ({ digit, reelIndex, replay, active }) => {
  const reverse = reelIndex % 2 === 1;
  const strip = Array.from({ length: REEL_LENGTH }, (_, index) =>
    mixedDigit(digit, reelIndex, replay, index)
  );
  strip[reverse ? 0 : REEL_LENGTH - 1] = digit;

  const startY = reverse ? `-${REEL_LENGTH - 1}em` : "0em";
  const endY = reverse ? "0em" : `-${REEL_LENGTH - 1}em`;

  return (
    <span
      className="relative inline-block h-[1em] w-[1ch] overflow-hidden align-baseline leading-none"
      style={{ fontVariantNumeric: "tabular-nums" }}
    >
      <Motion.span
        className="absolute left-0 top-0 flex w-full flex-col will-change-transform"
        initial={{ y: startY, filter: "blur(0px)" }}
        animate={
          active
            ? {
                y: endY,
                filter: ["blur(0px)", `blur(${BLUR}px)`, `blur(${BLUR}px)`, "blur(0px)"],
              }
            : { y: startY, filter: "blur(0px)" }
        }
        transition={{
          y: {
            duration: ROLL_DURATION,
            delay: reelIndex * STAGGER_DELAY,
            ease: [0.25, 0.46, 0.45, 0.94],
          },
          filter: {
            duration: ROLL_DURATION,
            delay: reelIndex * STAGGER_DELAY,
            times: [0, 0.2, 0.8, 1],
            ease: "easeOut",
          },
        }}
      >
        {strip.map((number, index) => (
          <span
            key={index}
            className="flex h-[1em] w-full shrink-0 items-center justify-center leading-none"
          >
            {number}
          </span>
        ))}
      </Motion.span>
    </span>
  );
};

/**
 * Digits roll in alternating directions as the counter enters view. Clicking
 * the number resets each strip and replays the same two-second animation.
 */
export const SlotMachineNumber = ({
  value,
  suffix,
  label,
  className = "",
  suffixClassName = "",
}) => {
  const ref = useRef(null);
  const replayTimer = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const isInView = useInView(ref, { once: true, amount: 0.4 });
  const [active, setActive] = useState(false);
  const [replay, setReplay] = useState(0);
  const digits = String(value).split("").filter((char) => /\d/.test(char)).map(Number);

  useEffect(() => {
    if (isInView) setActive(true);
  }, [isInView]);

  useEffect(() => () => window.clearTimeout(replayTimer.current), []);

  const handleReplay = () => {
    window.clearTimeout(replayTimer.current);
    setActive(false);
    setReplay((current) => current + 1);
    replayTimer.current = window.setTimeout(() => setActive(true), 50);
  };

  if (shouldReduceMotion) {
    return (
      <span ref={ref} className={`inline-flex items-baseline gap-1 ${className}`}>
        <span className="tabular-nums">{value}</span>
        {suffix != null && <span className={suffixClassName}>{suffix}</span>}
      </span>
    );
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleReplay}
      aria-label={`${value}${suffix ?? ""} ${label ?? ""}. Replay number animation`.trim()}
      className={`inline-flex cursor-pointer appearance-none items-baseline gap-1 border-0 bg-transparent p-0 text-left focus-visible:rounded-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#cda144] ${className}`}
    >
      <span aria-hidden="true" className="inline-flex items-baseline leading-none tabular-nums">
        {digits.map((digit, index) => (
          <SlotReelDigit
            key={`${index}-${digit}-${replay}`}
            digit={digit}
            reelIndex={index}
            replay={replay}
            active={active}
          />
        ))}
      </span>
      {suffix != null && (
        <span aria-hidden="true" className={suffixClassName}>
          {suffix}
        </span>
      )}
    </button>
  );
};

export default SlotMachineNumber;
