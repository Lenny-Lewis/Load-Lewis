import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { Router, UNSAFE_createBrowserHistory as createBrowserHistory } from "react-router-dom";
import { animate, motion, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion";
import { PageRevealContext } from "@/hooks/usePageRevealed";

/**
 * Page-to-page transition modelled on landonorris.com (OFF+BRAND), measured from
 * their live code and a frame-by-frame screen recording, restyled for this site:
 *
 *   cover    a bold slanted "L" bursts out from the centre in flat dark purple
 *            until it fills the screen (theirs: half of the LN logo in lime)
 *   loader   a pen drops in and writes the signature from scratch, stroke by
 *            stroke, lifting between strokes, then lifts away
 *   swap     the new page mounts underneath 1000ms after the click (their v$ = 1000)
 *   hold     ~450ms later the pen lifts away and the signature collapses
 *            (theirs: H$ fires 500ms after enter)
 *   reveal   the same "L" opens as a cut-out window onto the new page and grows
 *            until the page is fully uncovered
 *
 * It replaces BrowserRouter: the router keeps rendering the old location until the
 * screen is covered, so every link, back/forward and hash link to another page goes
 * through it without touching individual links. It only plays when moving between
 * the site's top-level areas (see siteArea); moving within an area, such as opening
 * a project from Work or an article from Thoughts, swaps instantly, as do hash or
 * query changes on the same page. Reduced-motion visitors always get an instant swap.
 */

// Flat colours only: no gradients anywhere in the overlay.
const PURPLE = "#4c1d95";
const PEN_BARREL = "#ffffff";
const PEN_NIB = "#ede9fe";
const PEN_GRIP = "#c4b5fd";
const PEN_BAND = "#a78bfa";
// The L's growth is exponential, so a sharp ease (like the site's 0.65,0.05,0,1)
// made it explode at the end. This one starts gently and lands softly.
const WIPE_EASE = [0.45, 0.05, 0.25, 1];
const SOFT = [0.4, 0, 0.2, 1];

// Timeline (ms from the click)
const COVER_MS = 600;
const SWAP_AT_MS = 1000; // Lando's: the old page leaves exactly 1000ms after the click
const PEN_IN_AT_MS = 120;
const PEN_IN_MS = 250;
const SIGNATURE_DELAY_MS = 300;
const SIGNATURE_DRAW_MS = 950;
const PEN_OUT_MS = 200;
const REVEAL_AT_MS = 1450; // Lando's uncover starts ~1500ms after the click
const SIGNATURE_COLLAPSE_MS = 250;
const REVEAL_OVERLAP_MS = 100; // the cut-out starts opening while the signature fades
const REVEAL_MS = 550; // fully uncovered at ~2.1s, Lando's at ~2.0s

// The "L" lives in a 100×100 box, drawn at L_BASE of the viewBox at scale 1, and
// grows around a point inside its solid corner so that, scaled far enough, the
// solid part alone covers the whole screen (11 units of clearance × 0.08 × 110
// ≈ 97 > 71, the centre-to-corner distance of the 100×100 viewBox).
const L_PATH = "M34 8 L56 8 L46 68 L82 68 L79 90 L21 90 Z";
const L_ORIGIN = [36, 79];
const L_BASE = 0.08;
const COVER_SCALE = [0.5, 110];
const HOLE_SCALE = [0.4, 110];

/** Grows exponentially between two scales, so the burst reads evenly at every size. */
const expScale = ([from, to]) => (t) => from * Math.pow(to / from, t);
const lTransform = (scale) =>
  `translate(50 50) scale(${L_BASE * scale}) translate(${-L_ORIGIN[0]} ${-L_ORIGIN[1]})`;

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

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
/**
 * The top-level area ("tab") a path belongs to. The overlay plays only when this
 * changes, so browsing projects or articles inside one area stays instant.
 */
const AREA_PREFIXES = [
  ["work", ["/work"]],
  ["thoughts", ["/thoughts", "/article"]],
  ["comments", ["/comments"]],
];
const siteArea = (pathname) =>
  AREA_PREFIXES.find(([, prefixes]) =>
    prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  )?.[0] ?? "home";

const prefersReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

/** A fountain pen in flat colours, nib tip at (0, 0), tilted up and to the right. */
const Pen = () => (
  <g transform={`rotate(${PEN_ANGLE})`}>
    <rect x="-26" y="-330" width="52" height="204" rx="14" fill={PEN_BARREL} />
    <rect x="16" y="-318" width="10" height="110" rx="5" fill={PEN_GRIP} />
    <rect x="-26" y="-134" width="52" height="14" fill={PEN_BAND} />
    <rect x="-21" y="-120" width="42" height="52" rx="6" fill={PEN_GRIP} />
    <path d="M0 0 L-19 -70 L19 -70 Z" fill={PEN_NIB} />
    <path d="M0 -8 L0 -50" stroke={PURPLE} strokeWidth="5" strokeLinecap="round" />
    <circle cx="0" cy="-52" r="6" fill={PURPLE} />
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

const TransitionOverlay = ({
  mode,
  coverT,
  holeT,
  signatureProgress,
  signatureScale,
  signatureOpacity,
  penOpacity,
  penLift,
}) => {
  const id = useId();
  const maskId = `${id}-wipe`;
  const signatureMaskId = `${id}-signature`;
  const covering = mode === "cover";
  const lRef = useRef(null);
  const coverTransform = useTransform(coverT, (t) => lTransform(expScale(COVER_SCALE)(t)));
  const holeTransform = useTransform(holeT, (t) => lTransform(expScale(HOLE_SCALE)(t)));
  const activeTransform = covering ? coverTransform : holeTransform;

  // Written straight to the attribute each frame; React only sets the starting value.
  useMotionValueEvent(activeTransform, "change", (value) => lRef.current?.setAttribute("transform", value));

  // The pen's nib follows the tip of whichever stroke is being written. Between
  // strokes it lifts, glides to the next stroke's start and sets down again.
  const penRef = useRef(null);
  const placePen = () => {
    const progress = signatureProgress.get();
    const found = STROKE_RANGES.findIndex(([, end]) => progress <= end);
    const index = found === -1 ? STROKE_RANGES.length - 1 : found;
    const [start, end] = STROKE_RANGES[index];
    let point;
    let lean = 0;
    let travelLift = 0;
    if (progress < start && index > 0) {
      const previousEnd = STROKE_RANGES[index - 1][1];
      const t = (progress - previousEnd) / (start - previousEnd);
      const from = STROKE_PROFILES[index - 1].end;
      const to = STROKE_PROFILES[index].start;
      const eased = easeInOut(t);
      point = [from[0] + (to[0] - from[0]) * eased, from[1] + (to[1] - from[1]) * eased];
      travelLift = Math.sin(Math.PI * t);
    } else {
      const share = Math.min(1, Math.max(0, (progress - start) / (end - start)));
      const at = STROKE_PROFILES[index].at(share);
      point = at.point;
      lean = Math.cos(at.heading) * PEN_LEAN;
    }
    penRef.current?.setAttribute(
      "transform",
      penTransform(point[0], point[1], Math.max(penLift.get(), travelLift), lean)
    );
  };
  useMotionValueEvent(signatureProgress, "change", placePen);
  useMotionValueEvent(penLift, "change", placePen);

  return (
    <div aria-hidden="true" className="pointer-events-auto fixed inset-0 z-[300]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        <defs>
          {/* Covering: purple shows only inside the L. Revealing: everywhere except the L. */}
          <mask id={maskId}>
            <rect x="-1" y="-1" width="102" height="102" fill={covering ? "black" : "white"} />
            <path ref={lRef} d={L_PATH} fill={covering ? "white" : "black"} transform={activeTransform.get()} />
          </mask>
        </defs>
        <rect x="-1" y="-1" width="102" height="102" fill={PURPLE} mask={`url(#${maskId})`} />
      </svg>

      <motion.div
        className="absolute left-1/2 top-1/2 w-[clamp(150px,18vw,260px)] -translate-x-1/2 -translate-y-1/2"
        style={{ scale: signatureScale, opacity: signatureOpacity }}
      >
        <svg viewBox="0 0 1278 784" overflow="visible" className="block h-auto w-full">
          <defs>
            <mask id={signatureMaskId}>
              {SIGNATURE_PATHS.map((d, index) => (
                <SignatureStroke
                  key={index}
                  d={d}
                  progress={signatureProgress}
                  range={STROKE_RANGES[index]}
                  profile={STROKE_PROFILES[index]}
                />
              ))}
            </mask>
          </defs>
          <image
            href="/images/branding/mysignature.png"
            width="1278"
            height="784"
            mask={`url(#${signatureMaskId})`}
          />
          <motion.g style={{ opacity: penOpacity }}>
            <g ref={penRef} transform={PEN_START}>
              <Pen />
            </g>
          </motion.g>
        </svg>
      </motion.div>
    </div>
  );
};

export const PageTransitionRouter = ({ children }) => {
  const historyRef = useRef(null);
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory({ window, v5Compat: true });
  }
  const history = historyRef.current;

  const [shown, setShown] = useState({ action: history.action, location: history.location });
  const [mode, setMode] = useState("idle"); // idle | cover | reveal
  const [revealed, setRevealed] = useState(true);

  const shownRef = useRef(shown);
  const latestRef = useRef(shown);
  const runningRef = useRef(false);

  const coverT = useMotionValue(0);
  const holeT = useMotionValue(0);
  const signatureProgress = useMotionValue(0);
  const signatureScale = useMotionValue(1);
  const signatureOpacity = useMotionValue(1);
  const penOpacity = useMotionValue(0);
  const penLift = useMotionValue(1);

  const show = (update) => {
    shownRef.current = update;
    setShown(update);
  };

  const runTransition = async () => {
    runningRef.current = true;
    const start = performance.now();
    const until = (ms) => wait(Math.max(0, ms - (performance.now() - start)));

    coverT.set(0);
    holeT.set(0);
    signatureProgress.set(0);
    signatureScale.set(1);
    signatureOpacity.set(1);
    penOpacity.set(0);
    penLift.set(1);
    setRevealed(false);
    setMode("cover");

    animate(coverT, 1, { duration: COVER_MS / 1000, ease: WIPE_EASE });
    // The pen drops in onto the first stroke, writes, then lifts away.
    animate(penOpacity, 1, { duration: PEN_IN_MS / 1000, delay: PEN_IN_AT_MS / 1000, ease: SOFT });
    animate(penLift, 0, { duration: PEN_IN_MS / 1000, delay: PEN_IN_AT_MS / 1000, ease: SOFT });
    animate(signatureProgress, 1, {
      duration: SIGNATURE_DRAW_MS / 1000,
      delay: SIGNATURE_DELAY_MS / 1000,
      ease: "linear",
    });

    await until(SWAP_AT_MS);
    show(latestRef.current);

    await until(SIGNATURE_DELAY_MS + SIGNATURE_DRAW_MS);
    animate(penLift, 1, { duration: PEN_OUT_MS / 1000, ease: SOFT });
    animate(penOpacity, 0, { duration: PEN_OUT_MS / 1000, ease: SOFT });

    await until(REVEAL_AT_MS);
    animate(signatureScale, 0.6, { duration: SIGNATURE_COLLAPSE_MS / 1000, ease: SOFT });
    animate(signatureOpacity, 0, { duration: SIGNATURE_COLLAPSE_MS / 1000, ease: SOFT });
    await until(REVEAL_AT_MS + REVEAL_OVERLAP_MS);

    setMode("reveal");
    setRevealed(true);
    await animate(holeT, 1, { duration: REVEAL_MS / 1000, ease: WIPE_EASE });

    setMode("idle");
    runningRef.current = false;
    handleLocation(latestRef.current); // catch a navigation made mid-transition
  };

  const handleLocation = (update) => {
    latestRef.current = update;
    if (runningRef.current) return; // picked up at the swap or when the reveal ends
    if (update.location === shownRef.current.location) return;
    if (siteArea(update.location.pathname) === siteArea(shownRef.current.location.pathname) || prefersReducedMotion()) {
      show(update);
      return;
    }
    runTransition();
  };

  const handleRef = useRef(handleLocation);
  handleRef.current = handleLocation;
  useLayoutEffect(() => history.listen((update) => handleRef.current(update)), [history]);

  // Warm the cache so the signature is ready the first time the overlay shows.
  useEffect(() => {
    new Image().src = "/images/branding/mysignature.png";
  }, []);

  return (
    <PageRevealContext.Provider value={revealed}>
      <Router location={shown.location} navigationType={shown.action} navigator={history}>
        {children}
      </Router>
      {mode !== "idle" && (
        <TransitionOverlay
          mode={mode}
          coverT={coverT}
          holeT={holeT}
          signatureProgress={signatureProgress}
          signatureScale={signatureScale}
          signatureOpacity={signatureOpacity}
          penOpacity={penOpacity}
          penLift={penLift}
        />
      )}
    </PageRevealContext.Provider>
  );
};
