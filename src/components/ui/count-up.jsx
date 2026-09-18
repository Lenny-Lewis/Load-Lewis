"use client";

import * as React from "react";
import {
  AnimatePresence,
  motion as Motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";
import useMeasure from "react-use-measure";

import { cn } from "@/lib/utils";

function OdometerDigit({ springValue, place }) {
  const [ref, { height }] = useMeasure();
  const y = useTransform(springValue, (value) => {
    if (!height) return 0;
    return -((Math.abs(value) / place) % 10) * height;
  });

  return (
    <span
      style={{
        position: "relative",
        display: "inline-block",
        width: "1ch",
        overflowY: "clip",
        overflowX: "visible",
        lineHeight: 1,
        fontVariantNumeric: "tabular-nums",
      }}
    >
      <span ref={ref} style={{ visibility: "hidden", display: "block" }}>
        0
      </span>
      <Motion.span
        style={{
          y,
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {Array.from({ length: 11 }, (_, index) => (
          <span
            key={index}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: height || "1em",
            }}
          >
            {index % 10}
          </span>
        ))}
      </Motion.span>
    </span>
  );
}

const charVariants = {
  fade: {
    initial: { opacity: 0, scale: 0.7 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.7 },
    transition: { duration: 0.14, ease: "easeOut" },
    overflow: "hidden",
  },
  blur: {
    initial: (up) => ({ opacity: 0, filter: "blur(8px)", y: up ? -8 : 8 }),
    animate: { opacity: 1, filter: "blur(0px)", y: 0 },
    exit: (up) => ({ opacity: 0, filter: "blur(8px)", y: up ? 8 : -8 }),
    transition: { duration: 0.18, ease: "easeOut" },
    overflow: "visible",
  },
};

function CharSlot({ char, charKey, effect, countingUp }) {
  if (!/\d/.test(char)) return <span style={{ display: "inline-block" }}>{char}</span>;

  const variant = charVariants[effect];
  const initial = typeof variant.initial === "function" ? variant.initial(countingUp) : variant.initial;
  const exit = typeof variant.exit === "function" ? variant.exit(countingUp) : variant.exit;

  return (
    <span style={{ position: "relative", display: "inline-block", overflow: variant.overflow }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <Motion.span
          key={charKey}
          initial={initial}
          animate={variant.animate}
          exit={exit}
          transition={variant.transition}
          style={{ display: "inline-block" }}
        >
          {char}
        </Motion.span>
      </AnimatePresence>
    </span>
  );
}

function CountUp({
  to,
  from = 0,
  direction = "up",
  delay = 0,
  duration = 2,
  digitEffect = "none",
  className,
  startWhen = true,
  separator = "",
  onStart,
  onEnd,
}) {
  const ref = React.useRef(null);
  const motionValue = useMotionValue(direction === "down" ? to : from);
  const springValue = useSpring(motionValue, {
    damping: 20 + 40 * (1 / duration),
    stiffness: 100 * (1 / duration),
  });
  const isInView = useInView(ref, { once: true, margin: "0px" });

  const maxDecimals = Math.max(
    String(from).split(".")[1]?.replace(/0+$/, "").length || 0,
    String(to).split(".")[1]?.replace(/0+$/, "").length || 0,
  );
  const formatValue = React.useCallback(
    (value) => {
      const formatted = new Intl.NumberFormat("en-US", {
        useGrouping: Boolean(separator),
        minimumFractionDigits: maxDecimals,
        maximumFractionDigits: maxDecimals,
      }).format(value);
      return separator ? formatted.replace(/,/g, separator) : formatted;
    },
    [maxDecimals, separator],
  );
  const initialValue = formatValue(direction === "down" ? to : from);
  const [chars, setChars] = React.useState(() => initialValue.split(""));

  React.useEffect(() => {
    const initial = formatValue(direction === "down" ? to : from);
    if (digitEffect === "none" && ref.current) ref.current.textContent = initial;
    if (digitEffect !== "none" && digitEffect !== "slide") setChars(initial.split(""));
  }, [from, to, direction, formatValue, digitEffect]);

  React.useEffect(() => {
    if (!isInView || !startWhen) return undefined;
    onStart?.();
    const startTimer = window.setTimeout(() => motionValue.set(direction === "down" ? from : to), delay * 1000);
    const endTimer = window.setTimeout(() => onEnd?.(), (delay + duration) * 1000);
    return () => {
      window.clearTimeout(startTimer);
      window.clearTimeout(endTimer);
    };
  }, [isInView, startWhen, motionValue, direction, from, to, delay, duration, onStart, onEnd]);

  React.useEffect(() => springValue.on("change", (latest) => {
    if (digitEffect === "none" && ref.current) ref.current.textContent = formatValue(latest);
    if (digitEffect !== "none" && digitEffect !== "slide") setChars(formatValue(latest).split(""));
  }), [springValue, formatValue, digitEffect]);

  if (digitEffect === "slide") {
    const target = formatValue(direction === "down" ? from : to);
    const digitCount = [...target].filter((char) => /\d/.test(char)).length;
    let digitIndex = 0;
    return (
      <span ref={ref} className={cn("inline-flex items-center", className)} style={{ fontVariantNumeric: "tabular-nums" }}>
        {[...target].map((char, index) => {
          if (!/\d/.test(char)) return <span key={index}>{char}</span>;
          const place = Math.pow(10, digitCount - 1 - digitIndex++);
          return <OdometerDigit key={index} springValue={springValue} place={place} />;
        })}
      </span>
    );
  }

  if (digitEffect === "none") return <span ref={ref} className={cn(className)} />;

  return (
    <span ref={ref} className={cn("inline-flex items-center", className)}>
      {chars.map((char, index) => (
        <CharSlot key={index} char={char} charKey={`${index}-${char}`} effect={digitEffect} countingUp={direction === "up"} />
      ))}
    </span>
  );
}

export { CountUp };
export default CountUp;
