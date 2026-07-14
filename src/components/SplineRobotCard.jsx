import { lazy, Suspense, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

import useInView from "../hooks/useInView";

const Spline = lazy(() => import("@splinetool/react-spline"));

const LoadingState = ({ message }) => (
  <div className="relative flex h-full min-h-[320px] items-center justify-center overflow-hidden px-6">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(255,255,255,0.16),transparent_18%),radial-gradient(circle_at_50%_12%,rgba(255,255,255,0.08),transparent_28%),radial-gradient(circle_at_72%_25%,rgba(96,165,250,0.14),transparent_24%)]" />
    <div className="absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_-40px_80px_rgba(0,0,0,0.55)]" />
    <div className="relative z-10 flex flex-col items-center gap-4 text-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/15 border-t-white/90" />
      <div className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.35em] text-white/45">
          Loading 3D
        </p>
        <p className="text-sm text-white/65">{message}</p>
      </div>
    </div>
  </div>
);

const SplineRobotCard = ({ scene }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { elementRef, isInView } = useInView({
    rootMargin: "180px 0px",
    threshold: 0.15,
  });
  const [shouldHydrate, setShouldHydrate] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShouldHydrate(true), 180);
    return () => window.clearTimeout(timer);
  }, []);

  const shouldLoadScene = shouldHydrate && isInView && !isMobile;

  return (
    <div ref={elementRef} className="relative h-full min-h-[420px] overflow-hidden">
      {shouldLoadScene ? (
        <Suspense
          fallback={<LoadingState message="Initializing the Spline scene." />}
        >
          <Spline
            scene={scene}
            className="h-full w-full"
            style={{
              width: "100%",
              height: "100%",
              transform: "scale(1.08) translateY(1%)",
              transformOrigin: "center center",
            }}
          />
        </Suspense>
      ) : (
        <LoadingState
          message={
            isMobile
              ? "The scene stays simplified on mobile to keep the page responsive."
              : "The scene loads after the hero is in view."
          }
        />
      )}
    </div>
  );
};

export default SplineRobotCard;
