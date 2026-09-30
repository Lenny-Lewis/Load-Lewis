import { lazy, Suspense, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";

import useInView from "../hooks/useInView";
import ComputersCanvas from "./Computers";
import Loader from "./ui/3d-box-loader-animation";

const Spline = lazy(() => import("@splinetool/react-spline"));

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
    const timer = window.setTimeout(() => setShouldHydrate(true), 100);
    return () => window.clearTimeout(timer);
  }, []);

  // For mobile devices, dispatch ready event once canvas is mounted
  useEffect(() => {
    if (isMobile) {
      const timer = window.setTimeout(() => {
        window.__HERO_3D_READY__ = true;
        window.dispatchEvent(new CustomEvent("hero-3d-ready"));
      }, 500);
      return () => window.clearTimeout(timer);
    }
  }, [isMobile]);

  const shouldLoadScene = shouldHydrate && (isInView || true) && !isMobile;

  const handleSplineLoad = () => {
    setIsSplineLoaded(true);
    window.__HERO_3D_READY__ = true;
    window.dispatchEvent(new CustomEvent("hero-3d-ready"));
  };

  return (
    <div ref={elementRef} className="relative h-full min-h-[420px] overflow-hidden bg-black">
      {isMobile ? (
        <div className="h-full min-h-[360px] w-full" style={{ touchAction: "pan-y" }}>
          <ComputersCanvas />
        </div>
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



