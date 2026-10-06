/** Three simple vector shapes; CSS animates only transform and opacity. */

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
        <circle className="shape-loader__dot" r="3.2" cx="40" cy="8" />
      </svg>
    </div>

    {/* triangle */}
    <div className="shape-loader__item shape-loader__item--triangle">
      <svg viewBox="0 0 86 80" aria-hidden="true">
        <polygon className="shape-loader__shape" points="43 8 79 72 7 72" />
        <circle className="shape-loader__dot" r="3.2" cx="43" cy="8" />
      </svg>
    </div>

    {/* square */}
    <div className="shape-loader__item">
      <svg viewBox="0 0 80 80" aria-hidden="true">
        <rect className="shape-loader__shape" height="64" width="64" y="8" x="8" />
        <circle className="shape-loader__dot" r="3.2" cx="40" cy="8" />
      </svg>
    </div>
  </div>
);

export default ShapeLoader;
