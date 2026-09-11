import { lazy, Suspense, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

import useInView from "../hooks/useInView";
import Loader from "./ui/3d-box-loader-animation";

const Spline = lazy(() => import("@splinetool/react-spline"));

const VideoLoadingState = () => (
  <div className="relative flex h-full min-h-[360px] w-full items-center justify-center overflow-hidden bg-black px-4">
    {/* Video Display Container */}
    <div className="relative flex w-full max-w-lg items-center justify-center overflow-hidden rounded-2xl bg-black">
      <video
        src="/Loading animation 5.mp4"
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

const BoxLoadingState = () => (
  <div className="relative flex h-full min-h-[420px] w-full items-center justify-center overflow-hidden bg-black px-4 z-10">
    <Loader />
  </div>
);

const SplineRobotCard = ({ scene }) => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { elementRef, isInView } = useInView({
    rootMargin: "180px 0px",
    threshold: 0.15,
  });
  const [shouldHydrate, setShouldHydrate] = useState(false);
  const [isSplineLoaded, setIsSplineLoaded] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setShouldHydrate(true), 180);
    return () => window.clearTimeout(timer);
  }, []);

  const shouldLoadScene = shouldHydrate && isInView && !isMobile;

  const handleSplineLoad = () => {
    setIsSplineLoaded(true);
  };

  return (
    <div ref={elementRef} className="relative h-full min-h-[420px] overflow-hidden bg-black">
      {isMobile ? (
        <VideoLoadingState />
      ) : shouldLoadScene ? (
        <div className="relative h-full w-full">
          {!isSplineLoaded && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black transition-opacity duration-500">
              <Loader />
            </div>
          )}
          <Suspense fallback={<BoxLoadingState />}>
            <Spline
              scene={scene}
              onLoad={handleSplineLoad}
              className="h-full w-full"
              style={{
                width: "100%",
                height: "100%",
                transform: "scale(1.15) translateY(-3%)",
                transformOrigin: "center center",
                opacity: isSplineLoaded ? 1 : 0,
                transition: "opacity 0.5s ease-in-out",
              }}
            />
          </Suspense>
        </div>
      ) : (
        <BoxLoadingState />
      )}
    </div>
  );
};

export default SplineRobotCard;



