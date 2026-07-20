import { lazy, Suspense, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

import useInView from "../hooks/useInView";

const Spline = lazy(() => import("@splinetool/react-spline"));

const LoadingState = () => (
  <div className="relative flex h-full min-h-[320px] items-center justify-center overflow-hidden px-6">
    <div className="relative z-10 flex flex-col items-center gap-10 text-center">
      {/* Arcane/Futuristic Spinner - Scaled Up */}
      <div className="relative flex items-center justify-center h-40 w-40">
        {/* Outer Gold Hex-Ring */}
        <div className="absolute h-full w-full rounded-full border-2 border-dashed border-[#cda144]/60 animate-[spin_8s_linear_infinite]" />
        
        {/* Middle Electric Blue Ring */}
        <div className="absolute h-28 w-28 rounded-full border-[3px] border-transparent border-l-[#00e5ff] border-r-[#00e5ff] opacity-80 shadow-[0_0_15px_#00e5ff,inset_0_0_10px_#00e5ff] animate-[spin_3s_linear_infinite_reverse]" />
        
        {/* Inner Arcane Geometric Shapes */}
        <div className="absolute h-16 w-16 border border-[#cda144]/80 animate-[spin_4s_linear_infinite]" />
        <div className="absolute h-16 w-16 border border-[#cda144]/80 animate-[spin_4s_linear_infinite_reverse]" />
        
        {/* Core Magic Glow */}
        <div className="absolute h-4 w-4 rounded-full bg-white shadow-[0_0_15px_#00e5ff,0_0_30px_#00e5ff,0_0_45px_#00e5ff] animate-pulse" />
      </div>

      <div className="space-y-2">
        <p className="text-[14px] md:text-[16px] font-bold uppercase tracking-[0.4em] text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">
          LOAD LEWIS
        </p>
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
      {isMobile ? (
        <LoadingState message="The scene stays simplified on mobile to keep the page responsive." />
      ) : shouldLoadScene ? (
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
          message="The scene loads after the hero is in view."
        />
      )}
    </div>
  );
};

export default SplineRobotCard;
