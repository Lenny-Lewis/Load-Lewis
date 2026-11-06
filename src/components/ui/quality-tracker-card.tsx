// Adapted from sleep-tracker-card: same stage graph, timeline and legend, without the card frame or stats.
import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export type QualityStage = "Design" | "Build" | "Test" | "Review";

interface QualityGraphSegment {
  stage: QualityStage;
  duration: number; // Relative width, used as the flex-grow value
  height: number; // Percentage height (0-100)
}

export interface QualityData {
  startLabel: string;
  endLabel: string;
  graphData: QualityGraphSegment[];
}

interface QualityTrackerCardProps extends React.HTMLAttributes<HTMLDivElement> {
  data: QualityData;
  /** Index of the segment the sweep has reached. Past the last segment, everything is lit. */
  progress: number;
  icons: {
    start: React.ReactNode;
    end: React.ReactNode;
  };
}

const stageColors: Record<QualityStage, string> = {
  Design: "bg-[#c4b5fd]",
  Build: "bg-[#8b5cf6]",
  Test: "bg-[#a78bfa]",
  Review: "bg-[#6d28d9]",
};

const STAGES = Object.keys(stageColors) as QualityStage[];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const barVariants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: {
    scaleY: 1,
    opacity: 1,
    transition: { type: "spring" as const, stiffness: 100, damping: 12 },
  },
};

const SWEEP_TRANSITION = { duration: 0.35, ease: "easeOut" as const };

// A short shake on the pad, then lift-off towards the rocket's nose (up and to the right).
const LIFT_OFF = {
  x: [0, -1, 1, 0, 12],
  y: [0, 1, -1, 0, -16],
  opacity: [1, 1, 1, 1, 0],
};
const LIFT_OFF_TRANSITION = { duration: 1.1, times: [0, 0.12, 0.24, 0.36, 1], ease: "easeIn" as const };
// Back on the pad instantly, so it fades in rather than flying back.
const ON_PAD = { x: 0, y: 0, opacity: 1 };
const ON_PAD_TRANSITION = { x: { duration: 0 }, y: { duration: 0 }, opacity: { duration: 0.3 } };

const QualityTrackerCard = React.forwardRef<HTMLDivElement, QualityTrackerCardProps>(
  ({ className, data, progress, icons, ...props }, ref) => {
    const { startLabel, endLabel, graphData } = data;
    const reduceMotion = useReducedMotion();
    const activeStage = graphData[progress]?.stage;
    // Reduced motion holds the finished state, where a launched rocket would stay gone.
    const launched = !reduceMotion && progress >= graphData.length;

    return (
      <div ref={ref} className={cn("w-full", className)} {...props}>
        <div className="rounded-lg bg-muted/50 p-3">
          <motion.div
            className="flex h-20 w-full items-end justify-center gap-px"
            variants={containerVariants}
            initial={reduceMotion ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
          >
            {graphData.map((segment, index) => (
              // The outer bar handles the entrance, the inner one the looping sweep.
              <motion.div
                key={index}
                className="origin-bottom"
                style={{ flexGrow: segment.duration, height: `${segment.height}%` }}
                variants={barVariants}
              >
                <motion.div
                  className={cn("size-full origin-bottom rounded-full", stageColors[segment.stage])}
                  animate={{
                    opacity: index <= progress ? 1 : 0.25,
                    scaleY: index === progress ? 1.15 : 1,
                  }}
                  transition={SWEEP_TRANSITION}
                />
              </motion.div>
            ))}
          </motion.div>
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              {icons.start}
              <span>{startLabel}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span>{endLabel}</span>
              <motion.span
                className={cn("inline-flex transition-colors", launched && "text-primary")}
                animate={launched ? LIFT_OFF : ON_PAD}
                transition={launched ? LIFT_OFF_TRANSITION : ON_PAD_TRANSITION}
              >
                {icons.end}
              </motion.span>
            </div>
          </div>
        </div>

        <div className="mt-3 grid grid-cols-4 gap-2">
          {STAGES.map((stage) => (
            <motion.div
              key={stage}
              className="flex items-center gap-1.5"
              animate={{ opacity: !activeStage || activeStage === stage ? 1 : 0.45 }}
              transition={SWEEP_TRANSITION}
            >
              <span className={cn("size-2 flex-none rounded-full", stageColors[stage])} />
              <p className="text-xs font-medium text-white-50">{stage}</p>
            </motion.div>
          ))}
        </div>
      </div>
    );
  },
);
QualityTrackerCard.displayName = "QualityTrackerCard";

export { QualityTrackerCard };
