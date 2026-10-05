import { motion, useReducedMotion } from "framer-motion";

/**
 * MorphDotsIcon — three dots that morph into an X.
 *
 * A classic hamburger-to-X morph assumes three BARS: each bar is a rounded
 * rect that rotates ~45deg in place. Three DOTS can't do that — rotating a
 * circle leaves a circle, so there is nothing to read as a stroke. The dots
 * have to actually change shape.
 *
 * Approach: every dot is drawn as a 4-cubic-segment ellipse (an elongated
 * lozenge, rotated). Each shape is emitted with an identical command
 * skeleton (`M` + 4x`C` + `Z`), so the three states differ only in their
 * numbers. That lets Framer Motion interpolate the `d` attribute directly:
 *
 *   closed  three circles, r=2, centred at x = 6 / 12 / 18, y = 12
 *   open    the outer two have stretched into diagonal lozenges (18 long,
 *           2.6 thick) crossed at 45deg over the centre; the middle dot has
 *           shrunk to a point at the centre
 *
 * So the morph is real geometry, not a rotation plus a crossfade: the dots
 * smear into the strokes as they converge.
 */
const K = 0.5522847498307936; // circle-to-cubic approximation constant

/**
 * Builds a rotated elliptical lozenge as 4 cubic segments.
 * Always emits `M` + 4 `C` + `Z` so every state shares one skeleton.
 */
const lozenge = (cx, cy, rx, ry, rotationDeg) => {
  const rad = (rotationDeg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  // Control points of a 4-segment ellipse centred on the origin.
  const points = [
    [rx, 0],
    [rx, K * ry], [K * rx, ry], [0, ry],
    [-K * rx, ry], [-rx, K * ry], [-rx, 0],
    [-rx, -K * ry], [-K * rx, -ry], [0, -ry],
    [K * rx, -ry], [rx, -K * ry], [rx, 0],
  ].map(([x, y]) => [cx + x * cos - y * sin, cy + x * sin + y * cos]);

  const n = (v) => Math.round(v * 1000) / 1000;
  let d = `M${n(points[0][0])} ${n(points[0][1])}`;
  for (let i = 1; i <= 10; i += 3) {
    d += ` C${n(points[i][0])} ${n(points[i][1])} ${n(points[i + 1][0])} ${n(
      points[i + 1][1]
    )} ${n(points[i + 2][0])} ${n(points[i + 2][1])}`;
  }
  return `${d}Z`;
};

// Static geometry, computed once at module load.
const CLOSED = [
  lozenge(6, 12, 2, 2, 0),
  lozenge(12, 12, 2, 2, 0),
  lozenge(18, 12, 2, 2, 0),
];

const OPEN = [
  lozenge(12, 12, 9, 1.3, 45),   // outer-left  -> "\" stroke
  lozenge(12, 12, 0.001, 0.001, 0), // centre     -> shrinks to a point
  lozenge(12, 12, 9, 1.3, -45),  // outer-right -> "/" stroke
];

const MorphDotsIcon = ({ open = false }) => {
  const reduceMotion = useReducedMotion();

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
    >
      {CLOSED.map((closedD, index) => (
        <motion.path
          key={index}
          initial={false}
          animate={{ d: open ? OPEN[index] : closedD }}
          transition={
            reduceMotion
              ? { duration: 0 }
              : // Crisp and decisive: ~300ms, decelerating, no spring/bounce.
                { duration: 0.3, ease: [0.33, 1, 0.68, 1] }
          }
        />
      ))}
    </svg>
  );
};

export default MorphDotsIcon;