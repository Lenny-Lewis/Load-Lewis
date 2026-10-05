/**
 * ShapeLoader — three geometric shapes (circle, triangle, square) that draw
 * themselves in, hold, and fade out. Purely presentational: it takes no props
 * and owns no state, so the caller decides when to show and hide it.
 *
 * Styling note: the shapes are CSS-only and rely on the keyframes defined in
 * index.css (`pathTriangle`, `dotTriangle`, `pathRect`, `dotRect`,
 * `pathCircle`) plus the `.shape-loader` rules that supply stroke-dasharray and
 * transform-box. Those rules live in the stylesheet because the animations
 * are shared, not because they are global requirements.
 */
const ShapeLoader = ({ className = "" }) => (
  <div
    className={`shape-loader flex items-center justify-center gap-6 sm:gap-8 ${className}`}
    role="status"
    aria-label="Loading"
  >
    {/* circle */}
    <div className="shape-loader__item">
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <circle r="32" cy="40" cx="40" />
      </svg>
    </div>

    {/* triangle */}
    <div className="shape-loader__item shape-loader__item--triangle">
      <svg viewBox="0 0 86 80" aria-hidden="true">
        <polygon points="43 8 79 72 7 72" />
      </svg>
    </div>

    {/* square */}
    <div className="shape-loader__item">
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <rect height="64" width="64" y="8" x="8" />
      </svg>
    </div>
  </div>
);

export default ShapeLoader;
