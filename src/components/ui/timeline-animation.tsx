import { type ElementType, type ReactNode, type RefObject, useMemo } from "react";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";

const defaultVariants: Variants = {
  hidden: { opacity: 0, y: -20, filter: "blur(10px)" },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { delay: i * 0.15, duration: 0.5 },
    // A leftover filter would trap fixed-position children inside this element.
    transitionEnd: { filter: "none" },
  }),
};

type TimelineContentProps = {
  as?: ElementType;
  /** Position in the sequence; passed to the variants as `custom` to stagger the reveal. */
  animationNum: number;
  /** The section whose arrival in view starts the sequence. */
  timelineRef: RefObject<Element | null>;
  customVariants?: Variants;
  className?: string;
  children?: ReactNode;
  [key: string]: unknown;
};

/** Reveals its content, in sequence with its siblings, once the timeline's section scrolls into view. */
export const TimelineContent = ({
  as = "div",
  animationNum,
  timelineRef,
  customVariants,
  className,
  children,
  ...rest
}: TimelineContentProps) => {
  const inView = useInView(timelineRef, { once: true, amount: 0.15 });
  const reduceMotion = useReducedMotion();
  const MotionComponent = useMemo(() => motion.create(as), [as]);

  return (
    <MotionComponent
      className={className}
      custom={animationNum}
      variants={customVariants ?? defaultVariants}
      initial={reduceMotion ? false : "hidden"}
      animate={reduceMotion || inView ? "visible" : "hidden"}
      {...rest}
    >
      {children}
    </MotionComponent>
  );
};
