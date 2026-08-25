import { lazy, Suspense, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

import useInView from "../hooks/useInView";

const Spline = lazy(() => import("@splinetool/react-spline"));

const VideoLoadingState = () => (
  <div className="relative flex h-full min-h-[360px] w-full items-center justify-center overflow-hidden bg-black px-4">
    {/* Video Display Container */}
    <div className="relative flex w-full max-w-lg items-center justify-center overflow-hidden rounded-2xl bg-black">
      <video
        src="/Loading Animation 3.mp4"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="h-full w-full object-contain bg-black pointer-events-none"
      />
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
    <div ref={elementRef} className="relative h-full min-h-[420px] overflow-hidden bg-black">
      {isMobile ? (
        <VideoLoadingState />
      ) : shouldLoadScene ? (
        <Suspense fallback={<VideoLoadingState />}>
          <Spline
            scene={scene}
            className="h-full w-full"
            style={{
              width: "100%",
              height: "100%",
              transform: "scale(1.15) translateY(-3%)",
              transformOrigin: "center center",
            }}
          />
        </Suspense>
      ) : (
        <VideoLoadingState />
      )}
    </div>
  );
};

export default SplineRobotCard;


