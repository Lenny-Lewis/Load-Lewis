import { lazy, memo, Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "react-responsive";
import useInView from "../hooks/useInView";
import useDeviceTier from "../hooks/useDeviceTier";
import { useSceneLoading } from "../context/SceneLoadingContext";
import ScenePoster from "./ScenePoster";

const Spline = lazy(() => import("@splinetool/react-spline"));
const ComputersCanvas = lazy(() => import("./Computers"));

function scheduleIdle(callback) {
  if ("requestIdleCallback" in window) {
    const id = window.requestIdleCallback(callback, { timeout: 1200 });
    return () => window.cancelIdleCallback(id);
  }
  const id = window.setTimeout(callback, 120);
  return () => window.clearTimeout(id);
}

const SplineRobotCard = memo(function SplineRobotCard({ scene }) {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const tier = useDeviceTier();
  const { phase, markScene1Ready } = useSceneLoading();
  const { elementRef, isInView } = useInView({ rootMargin: "180px 0px", threshold: 0.05 });
  const [shouldLoadScene, setShouldLoadScene] = useState(false);
  const [isSceneLoaded, setIsSceneLoaded] = useState(false);
  const [sceneInstance, setSceneInstance] = useState(null);
  const paintFrame = useRef(null);
  const settleFrame = useRef(null);

  // Start scene one only after critical assets, a paint, and an idle slot.
  useEffect(() => {
    if (phase === "assets" || !isInView || (isMobile && tier === "low")) return undefined;
    return scheduleIdle(() => setShouldLoadScene(true));
  }, [phase, isInView, isMobile, tier]);

  // Low-tier mobile gets an intrinsic-size vector poster instead of a WebGL context.
  useEffect(() => {
    if (phase !== "assets" && isInView && isMobile && tier === "low") markScene1Ready();
  }, [phase, isInView, isMobile, tier, markScene1Ready]);

  // Keep Spline's canvas allocated, but stop its runtime when offscreen or hidden.
  useEffect(() => {
    const update = () => {
      if (document.visibilityState !== "visible" || !isInView) sceneInstance?.stop?.();
      else sceneInstance?.play?.();
    };
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, [sceneInstance, isInView]);

  useEffect(() => () => {
    if (paintFrame.current !== null) window.cancelAnimationFrame(paintFrame.current);
    if (settleFrame.current !== null) window.cancelAnimationFrame(settleFrame.current);
  }, []);

  const handleLoad = useCallback((instance) => {
    setIsSceneLoaded(true);
    if (instance) setSceneInstance(instance);
    // Let the scene's first visible frame land before scene two can begin.
    paintFrame.current = window.requestAnimationFrame(() => {
      settleFrame.current = window.requestAnimationFrame(markScene1Ready);
    });
  }, [markScene1Ready]);

  return (
    <div ref={elementRef} className="relative h-full min-h-[420px] overflow-hidden bg-black">
      {isMobile && tier === "low" ? (
        <ScenePoster kind="computer" label="Illustration of a desktop computer" />
      ) : shouldLoadScene && isMobile && isInView ? (
        <>
          <link rel="preload" as="fetch" href="/desktop_pc/scene.gltf" crossOrigin="anonymous" />
          <link rel="preload" as="fetch" href="/desktop_pc/scene.bin" crossOrigin="anonymous" />
          <Suspense fallback={<div className="h-full min-h-[360px] w-full bg-black" />}>
            <ComputersCanvas onLoaded={handleLoad} />
          </Suspense>
        </>
      ) : shouldLoadScene ? (
        <div className="relative h-full w-full">
          {!isSceneLoaded && <div className="absolute inset-0 z-10 bg-black" aria-hidden="true" />}
          <link rel="preload" as="fetch" href={scene} crossOrigin="anonymous" />
          <Suspense fallback={null}>
            <Spline
              scene={scene}
              onLoad={handleLoad}
              className="h-full w-full"
              style={{
                width: "100%",
                height: "100%",
                transform: "scale(1.15) translateY(-3%)",
                transformOrigin: "center center",
                opacity: isSceneLoaded ? 1 : 0,
                transition: "opacity 0.45s ease-out",
              }}
            />
          </Suspense>
        </div>
      ) : (
        <div className="h-full min-h-[360px] w-full bg-black" aria-hidden="true" />
      )}
    </div>
  );
});

export default SplineRobotCard;
