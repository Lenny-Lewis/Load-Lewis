import { useEffect, useRef } from "react";
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform } from "framer-motion";

/**
 * The footer signature, written in by a pen when it scrolls into view: the pen drops
 * onto the page, writes each stroke at a handwriting pace (slower through curls,
 * faster along sweeps, lifting between strokes), then lifts away. The strokes are a
 * mask over /images/branding/mysignature.png, so the ink is the real signature.
 * Reduced-motion visitors see the finished signature with no pen.
 */

// Flat colours only: a blue pen.
const PEN_DETAIL = "#1e3a8a"; // the nib's slit and breather hole
const PEN_BARREL = "#2563eb";
const PEN_NIB = "#dbeafe";
const PEN_GRIP = "#60a5fa";
const PEN_BAND = "#93c5fd";
const SOFT = [0.4, 0, 0.2, 1];

// Timeline (seconds from scrolling into view)
const PEN_IN = 0.25;
const DRAW_DELAY = 0.3;
const DRAW = 1.6; // slower than the old transition's 0.95s, so the writing reads at footer size
const PEN_OUT = 0.25;
// The signature is small in the footer, so the pen is drawn larger than life to stay visible.
const PEN_SIZE = 1.8;

// Pen strokes traced over /images/branding/mysignature.png (1278 × 784), in the order
// the signature is written. They are drawn thick into a mask, so they only need to
// follow the ink roughly; the image itself supplies the exact shape.
const SIGNATURE_STROKES = [
  [
    [300, 265], [330, 215], [300, 170], [250, 160], [190, 190], [150, 260], [165, 330],
    [230, 380], [310, 385], [400, 370], [470, 340], [510, 300], [545, 240], [590, 130],
    [600, 40], [585, 20], [565, 40], [540, 120], [520, 230], [505, 320], [495, 420],
    [485, 500], [478, 600], [470, 700], [465, 765],
  ],
  [
    [700, 438], [600, 465], [510, 490], [440, 505], [350, 530], [250, 555], [150, 580],
    [50, 590], [15, 575], [40, 540], [100, 505], [170, 485], [240, 475], [300, 490],
    [350, 525], [400, 580], [440, 640], [460, 690],
  ],
  [
    [520, 350], [530, 440], [545, 455], [560, 400], [575, 360], [590, 400], [600, 430],
    [615, 400], [625, 345], [640, 400], [660, 405], [680, 380], [690, 330], [700, 325],
    [705, 355], [760, 355], [850, 335], [950, 315], [1060, 290], [1185, 262],
  ],
  [[1257, 244], [1259, 245]],
];
/** The cubic Bézier segments of a smooth curve through the points (Catmull-Rom). */
const curveSegments = (points) =>
  points.slice(0, -1).map((p1, i) => {
    const p0 = points[i - 1] ?? p1;
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    return [p1, c1, c2, p2];
  });

const smoothPath = (points) =>
  curveSegments(points).reduce(
    (d, [, c1, c2, p2]) => `${d} C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`,
    `M${points[0][0]} ${points[0][1]}`
  );

const bezierPoint = ([p0, p1, p2, p3], t) => {
  const u = 1 - t;
  const a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
  return [a * p0[0] + b * p1[0] + c * p2[0] + d * p3[0], a * p0[1] + b * p1[1] + c * p2[1] + d * p3[1]];
};

/*
 * Handwriting rhythm. A hand slows into tight curls and loops and speeds up along
 * straight sweeps, starts each stroke from rest and flicks off the end. Each stroke
 * is sampled into a fine polyline; the speed at every sample falls with how sharply
 * the line turns there, and each stroke's share of the draw time follows from that,
 * not from a fixed split.
 */
const SAMPLES_PER_SEGMENT = 24;
const CURL_SLOWDOWN = 45; // higher = slower through tight curves
const MIN_SPEED = 0.18; // fraction of full speed in the tightest curl
const START_RAMP = 70; // signature units the pen takes to get up to speed
const LIFT_PAUSE = 80; // time units the pen hovers before setting down again
const AIR_SPEED = 2.6; // the lifted pen moves this much faster than it writes
const TAP_TIME = 45; // a dot is a quick tap, not a stroke

const profileStroke = (points) => {
  const polyline = [points[0]];
  curveSegments(points).forEach((segment) => {
    for (let k = 1; k <= SAMPLES_PER_SEGMENT; k++) polyline.push(bezierPoint(segment, k / SAMPLES_PER_SEGMENT));
  });
  const count = polyline.length;
  const lengths = [0];
  for (let i = 1; i < count; i++) {
    lengths.push(lengths[i - 1] + Math.hypot(polyline[i][0] - polyline[i - 1][0], polyline[i][1] - polyline[i - 1][1]));
  }
  const total = lengths[count - 1];

  // Turning per unit length at each sample, smoothed over its neighbours.
  const bend = polyline.map((point, i) => {
    if (i === 0 || i === count - 1) return 0;
    const a = Math.atan2(point[1] - polyline[i - 1][1], point[0] - polyline[i - 1][0]);
    const b = Math.atan2(polyline[i + 1][1] - point[1], polyline[i + 1][0] - point[0]);
    const turn = Math.abs(Math.atan2(Math.sin(b - a), Math.cos(b - a)));
    return turn / Math.max(1e-6, (lengths[i + 1] - lengths[i - 1]) / 2);
  });
  const smoothBend = bend.map((_, i) => {
    const window = bend.slice(Math.max(0, i - 4), i + 5);
    return window.reduce((sum, value) => sum + value, 0) / window.length;
  });

  const speedAt = (i) => {
    const ramp = Math.min(1, lengths[i] / START_RAMP);
    const fromRest = 0.3 + 0.7 * ramp * ramp * (3 - 2 * ramp);
    return Math.max(MIN_SPEED, 1 / (1 + CURL_SLOWDOWN * smoothBend[i])) * fromRest;
  };
  const times = [0];
  for (let i = 1; i < count; i++) {
    const v = (speedAt(i - 1) + speedAt(i)) / 2;
    times.push(times[i - 1] + (lengths[i] - lengths[i - 1]) / v);
  }
  const duration = total < 5 ? TAP_TIME : times[count - 1];

  return {
    polyline,
    duration,
    start: polyline[0],
    end: polyline[count - 1],
    /** Share of the stroke's length inked after `share` of its time, and where the nib is. */
    at(share) {
      if (total < 5) return { inked: share, point: polyline[count - 1], heading: 0 };
      const target = share * times[count - 1];
      let lo = 0;
      let hi = count - 1;
      while (hi - lo > 1) {
        const mid = (lo + hi) >> 1;
        if (times[mid] <= target) lo = mid;
        else hi = mid;
      }
      const span = times[hi] - times[lo] || 1;
      const f = Math.min(1, Math.max(0, (target - times[lo]) / span));
      const point = [
        polyline[lo][0] + (polyline[hi][0] - polyline[lo][0]) * f,
        polyline[lo][1] + (polyline[hi][1] - polyline[lo][1]) * f,
      ];
      const heading = Math.atan2(polyline[hi][1] - polyline[lo][1], polyline[hi][0] - polyline[lo][0]);
      return { inked: (lengths[lo] + (lengths[hi] - lengths[lo]) * f) / total, point, heading };
    },
  };
};

const SIGNATURE_PATHS = SIGNATURE_STROKES.map(smoothPath);
const STROKE_PROFILES = SIGNATURE_STROKES.map(profileStroke);

// Lay the strokes and the lifted travel between them on one 0–1 timeline.
const STROKE_RANGES = (() => {
  const travel = STROKE_PROFILES.slice(1).map(
    (profile, i) =>
      LIFT_PAUSE +
      Math.hypot(profile.start[0] - STROKE_PROFILES[i].end[0], profile.start[1] - STROKE_PROFILES[i].end[1]) / AIR_SPEED
  );
  const total = STROKE_PROFILES.reduce((sum, profile) => sum + profile.duration, 0) + travel.reduce((a, b) => a + b, 0);
  let at = 0;
  return STROKE_PROFILES.map((profile, i) => {
    if (i > 0) at += travel[i - 1] / total;
    const range = [at, at + profile.duration / total];
    at = range[1];
    return range;
  });
})();

// How far the pen rises off the page when lifted (signature units), and its tilt.
const PEN_LIFT = [16, -44];
const PEN_ANGLE = 35;
const PEN_LEAN = 7; // degrees the pen leans into the direction it's moving
const penTransform = (x, y, lift, lean = 0) =>
  `translate(${x + PEN_LIFT[0] * lift} ${y + PEN_LIFT[1] * lift}) rotate(${lean}) scale(${1 + 0.08 * lift})`;
const PEN_START = penTransform(...SIGNATURE_STROKES[0][0], 1);
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

/** A fountain pen in flat colours, nib tip at (0, 0), tilted up and to the right. */
const Pen = () => (
  <g transform={`rotate(${PEN_ANGLE}) scale(${PEN_SIZE})`}>
    <rect x="-26" y="-330" width="52" height="204" rx="14" fill={PEN_BARREL} />
    <rect x="16" y="-318" width="10" height="110" rx="5" fill={PEN_GRIP} />
    <rect x="-26" y="-134" width="52" height="14" fill={PEN_BAND} />
    <rect x="-21" y="-120" width="42" height="52" rx="6" fill={PEN_GRIP} />
    <path d="M0 0 L-19 -70 L19 -70 Z" fill={PEN_NIB} />
    <path d="M0 -8 L0 -50" stroke={PEN_DETAIL} strokeWidth="5" strokeLinecap="round" />
    <circle cx="0" cy="-52" r="6" fill={PEN_DETAIL} />
  </g>
);

const SignatureStroke = ({ d, progress, range, profile }) => {
  const pathLength = useTransform(progress, (value) => {
    const share = (value - range[0]) / (range[1] - range[0]);
    return share <= 0 ? 0 : share >= 1 ? 1 : profile.at(share).inked;
  });
  // A zero-length dash still paints a round cap, so hide strokes that haven't started.
  const opacity = useTransform(pathLength, (value) => (value > 0 ? 1 : 0));
  return (
    <motion.path
      d={d}
      fill="none"
      stroke="white"
      strokeWidth={56}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ pathLength, opacity }}
    />
  );
};


/** Writes the signature with a pen once it scrolls into view. Size it with `className`. */
const SignatureDraw = ({ className = "" }) => {
  const reduceMotion = useReducedMotion();
  const rootRef = useRef(null);
  const penRef = useRef(null);
  const inView = useInView(rootRef, { once: true, amount: 0.8 });

  const progress = useMotionValue(reduceMotion ? 1 : 0);
  const penOpacity = useMotionValue(0);
  const penLift = useMotionValue(1);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = [
      animate(penOpacity, 1, { duration: PEN_IN, ease: SOFT }),
      animate(penLift, 0, { duration: PEN_IN, ease: SOFT }),
      animate(progress, 1, { duration: DRAW, delay: DRAW_DELAY, ease: "linear" }),
      animate(penLift, 1, { duration: PEN_OUT, delay: DRAW_DELAY + DRAW, ease: SOFT }),
      animate(penOpacity, 0, { duration: PEN_OUT, delay: DRAW_DELAY + DRAW, ease: SOFT }),
    ];
    return () => controls.forEach((control) => control.stop());
  }, [inView, reduceMotion, progress, penOpacity, penLift]);

  // The nib follows the tip of whichever stroke is being written. Between strokes it
  // lifts, glides to the next stroke's start and sets down again.
  const placePen = () => {
    const value = progress.get();
    const found = STROKE_RANGES.findIndex(([, end]) => value <= end);
    const index = found === -1 ? STROKE_RANGES.length - 1 : found;
    const [start, end] = STROKE_RANGES[index];
    let point;
    let lean = 0;
    let travelLift = 0;
    if (value < start && index > 0) {
      const previousEnd = STROKE_RANGES[index - 1][1];
      const t = (value - previousEnd) / (start - previousEnd);
      const from = STROKE_PROFILES[index - 1].end;
      const to = STROKE_PROFILES[index].start;
      const eased = easeInOut(t);
      point = [from[0] + (to[0] - from[0]) * eased, from[1] + (to[1] - from[1]) * eased];
      travelLift = Math.sin(Math.PI * t);
    } else {
      const share = Math.min(1, Math.max(0, (value - start) / (end - start)));
      const at = STROKE_PROFILES[index].at(share);
      point = at.point;
      lean = Math.cos(at.heading) * PEN_LEAN;
    }
    penRef.current?.setAttribute("transform", penTransform(point[0], point[1], Math.max(penLift.get(), travelLift), lean));
  };
  useMotionValueEvent(progress, "change", placePen);
  useMotionValueEvent(penLift, "change", placePen);

  return (
    <svg
      ref={rootRef}
      viewBox="0 0 1278 784"
      preserveAspectRatio="xMinYMid meet"
      overflow="visible"
      role="img"
      aria-label="Lennox Lewis signature"
      className={`block ${className}`}
    >
      <defs>
        <mask id="footer-signature-mask">
          {SIGNATURE_PATHS.map((d, index) => (
            <SignatureStroke
              key={index}
              d={d}
              progress={progress}
              range={STROKE_RANGES[index]}
              profile={STROKE_PROFILES[index]}
            />
          ))}
        </mask>
      </defs>
      <image href="/images/branding/mysignature.png" width="1278" height="784" mask="url(#footer-signature-mask)" />
      {!reduceMotion && (
        <motion.g style={{ opacity: penOpacity }}>
          <g ref={penRef} transform={PEN_START}>
            <Pen />
          </g>
        </motion.g>
      )}
    </svg>
  );
};

export default SignatureDraw;
