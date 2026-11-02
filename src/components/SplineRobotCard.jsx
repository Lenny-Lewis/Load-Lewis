import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";

import useInView from "../hooks/useInView";
import ComputersCanvas from "./Computers";
import Loader from "./ui/3d-box-loader-animation";
import {
  attachSpline,
  detachSpline,
  requestSplineScene,
  useSplineLoaded,
} from "./persistentSplineStore";

// Size and position of the robot inside its card.
const SPLINE_STYLE = {
  transform: "scale(1.25) translate(4%, -8%)",
  transformOrigin: "center center",
};

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
  const slotRef = useRef(null);
  const isSplineLoaded = useSplineLoaded();
  const [shouldHydrate, setShouldHydrate] = useState(false);
  // Once the scene has been in view, keep it on the page. Removing it on
  // scroll-out made it download and render again every time it came back.
  const [hasEnteredView, setHasEnteredView] = useState(false);

  useEffect(() => {
    if (isInView) setHasEnteredView(true);
  }, [isInView]);

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

  // Already loaded on an earlier visit to this page: show it straight away.
  const shouldLoadScene =
    !isMobile && (isSplineLoaded || (shouldHydrate && (isInView || hasEnteredView)));

  // The scene lives at the App level (see PersistentSpline) so it survives
  // route changes; this card only lends it a place on the page.
  useLayoutEffect(() => {
    if (!shouldLoadScene) return undefined;
    requestSplineScene(scene, SPLINE_STYLE);
    attachSpline(slotRef.current);
    return () => detachSpline();
  }, [shouldLoadScene, scene]);

  return (
    <div ref={elementRef} className="relative h-full w-full min-h-[480px] lg:min-h-full [clip-path:inset(-100vh_0_0_0)] bg-black flex items-center justify-center">
      {isMobile ? (
        <div className="h-full min-h-[360px] w-full" style={{ touchAction: "pan-y" }}>
          <ComputersCanvas />
        </div>
      ) : shouldLoadScene ? (
        <div className="relative h-full w-full flex items-center justify-center">
          {!isSplineLoaded && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black transition-opacity duration-500">
              <Loader />
            </div>
          )}
          <div ref={slotRef} className="h-full w-full" />
        </div>
      ) : (
        <BoxLoadingState />
      )}
    </div>
  );
};

export default SplineRobotCard;
