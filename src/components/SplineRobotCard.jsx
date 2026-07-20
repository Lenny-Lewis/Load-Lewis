import { lazy, Suspense, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

import useInView from "../hooks/useInView";

const Spline = lazy(() => import("@splinetool/react-spline"));

const mobileRobotImage = {
  src: "/images/spline-robot-fallback.png",
  alt: "A sleek humanoid robot glowing with electric blue and gold accents",
};

const LoadingState = ({ message }) => (
  <div className="relative flex h-full min-h-[320px] items-center justify-center overflow-hidden px-6">
    {/* Background glow and shadow */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_12%,rgba(0,229,255,0.08),transparent_25%),radial-gradient(circle_at_50%_50%,rgba(205,161,68,0.03),transparent_40%)]" />
    <div className="absolute inset-0 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),inset_0_-40px_80px_rgba(0,0,0,0.55)]" />
    
    <div className="relative z-10 flex flex-col items-center gap-8 text-center">
      {/* Arcane/Futuristic Spinner */}
      <div className="relative flex items-center justify-center h-28 w-28">
        {/* Outer Gold Hex-Ring */}
        <div className="absolute h-full w-full rounded-full border-2 border-dashed border-[#cda144]/60 animate-[spin_8s_linear_infinite]" />
        
        {/* Middle Electric Blue Ring */}
        <div className="absolute h-20 w-20 rounded-full border-[3px] border-transparent border-l-[#00e5ff] border-r-[#00e5ff] opacity-80 shadow-[0_0_15px_#00e5ff,inset_0_0_10px_#00e5ff] animate-[spin_3s_linear_infinite_reverse]" />
        
        {/* Inner Arcane Geometric Shapes */}
        <div className="absolute h-10 w-10 border border-[#cda144]/80 animate-[spin_4s_linear_infinite]" />
        <div className="absolute h-10 w-10 border border-[#cda144]/80 animate-[spin_4s_linear_infinite_reverse]" />
        
        {/* Core Magic Glow */}
        <div className="absolute h-3 w-3 rounded-full bg-white shadow-[0_0_15px_#00e5ff,0_0_30px_#00e5ff,0_0_45px_#00e5ff] animate-pulse" />
      </div>

      <div className="space-y-2">
        <p className="text-[12px] font-bold uppercase tracking-[0.4em] text-[#00e5ff] drop-shadow-[0_0_8px_rgba(0,229,255,0.6)]">
          Loading 3D
        </p>
        <p className="text-sm text-white/70 max-w-[250px]">{message}</p>
      </div>
    </div>
  </div>
);

const MobileRobotCard = () => (
  <div className="relative flex h-full min-h-[420px] overflow-hidden rounded-none">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_18%,rgba(255,255,255,0.18),transparent_24%),radial-gradient(circle_at_68%_26%,rgba(75,85,99,0.24),transparent_20%),linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.72))]" />
    <img
      src={mobileRobotImage.src}
      alt={mobileRobotImage.alt}
      className="h-full w-full object-cover object-center scale-[1.04] brightness-90 contrast-110"
      loading="lazy"
      decoding="async"
    />
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
        <MobileRobotCard />
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
