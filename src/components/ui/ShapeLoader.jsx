/**
 * ShapeLoader — three outlined shapes (circle, triangle, square) that draw
 * themselves in while a red dot travels around each outline.
 *
 * The travelling dot is driven by <animateMotion> with an inline `path`, NOT an
 * <mpath> reference: `mpath href` silently fails to animate in Chromium (the
 * dot just sits at its origin), while the inline path form works everywhere.
 * The path strings mirror the outline geometry exactly, so each dot tracks its
 * own shape at any size.
 *
 * Purely presentational: no props, no state. The caller decides when to show
 * and hide it. Styling (stroke, dot colour, dash values, keyframes) lives in
 * index.css under `.shape-loader`.
 */

// Outline geometry, mirrored for the motion paths.
const CIRCLE_PATH = "M8,40 a32,32 0 1,0 64,0 a32,32 0 1,0 -64,0";
const TRIANGLE_PATH = "M43,8 L79,72 L7,72 Z";
const RECT_PATH = "M8,8 L72,8 L72,72 L8,72 Z";

const ShapeLoader = ({ className = "" }) => (
  <div
    className={`shape-loader flex items-center justify-center gap-6 sm:gap-8 ${className}`}
    role="status"
    aria-label="Loading 3D assets"
  >
    {/* circle */}
    <div className="shape-loader__item">
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <circle className="shape-loader__shape" r="32" cy="40" cx="40" />
        <circle className="shape-loader__dot" r="3.2">
          <animateMotion dur="4s" repeatCount="indefinite" path={CIRCLE_PATH} />
        </circle>
      </svg>
    </div>

    {/* triangle */}
    <div className="shape-loader__item shape-loader__item--triangle">
      <svg viewBox="0 0 86 80" aria-hidden="true">
        <polygon className="shape-loader__shape" points="43 8 79 72 7 72" />
        <circle className="shape-loader__dot" r="3.2">
          <animateMotion dur="4s" repeatCount="indefinite" path={TRIANGLE_PATH} />
        </circle>
      </svg>
    </div>

    {/* square */}
    <div className="shape-loader__item">
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <rect className="shape-loader__shape" height="64" width="64" y="8" x="8" />
        <circle className="shape-loader__dot" r="3.2">
          <animateMotion dur="4s" repeatCount="indefinite" path={RECT_PATH} />
        </circle>
      </svg>
    </div>
  </div>
);

export default ShapeLoader;
