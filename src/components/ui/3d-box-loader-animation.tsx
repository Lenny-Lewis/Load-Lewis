import React from 'react';

interface LoaderProps {
  primaryColor?: string;
  primaryLight?: string;
  maskBg?: string;
}

// A compact CSS indicator keeps the loading state visible without running the
// old eight-cube perspective animation (and its animated gradients/filters).
const Loader: React.FC<LoaderProps> = ({ primaryColor = "#ffffff" }) => (
  <div
    className="box-loader"
    role="status"
    aria-label="Loading 3D scene"
    style={{ "--box-loader-color": primaryColor } as React.CSSProperties}
  >
    <span />
    <span />
    <span />
  </div>
);

export default Loader;
