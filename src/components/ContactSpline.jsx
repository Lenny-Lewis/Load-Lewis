import { lazy, memo, Suspense, useCallback, useEffect, useState } from "react";
import { useMediaQuery } from "react-responsive";
import useInView from "../hooks/useInView";
import useDeviceTier from "../hooks/useDeviceTier";
import { useSceneLoading } from "../context/SceneLoadingContext";
import ScenePoster from "./ScenePoster";

const Spline = lazy(() => import("@splinetool/react-spline"));
const EarthCanvas = lazy(() => import("../canvas/Earth"));

const ContactSpline = memo(function ContactSpline({
  scene = "https://prod.spline.design/qgLe0tGeLUHJysaL/scene.splinecode",
  className = "",
}) {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const tier = useDeviceTier();
  const { scene1Ready, markScene2Ready } = useSceneLoading();
  const { elementRef, isInView } = useInView({ rootMargin: "220px 0px", threshold: 0.05 });
  const [didStartScene, setDidStartScene] = useState(false);
  const [sceneLoaded, setSceneLoaded] = useState(false);
  const [sceneInstance, setSceneInstance] = useState(null);
  const shouldShowPoster = isMobile && tier === "low" && scene1Ready && isInView;
  const shouldLoadScene = scene1Ready && (isInView || (didStartScene && !isMobile)) &&
    !(isMobile && tier === "low");

  useEffect(() => {
    if (scene1Ready && isInView && !(isMobile && tier === "low")) {
      setDidStartScene(true);
    }
  }, [scene1Ready, isInView, isMobile, tier]);

  const handleLoad = useCallback((instance) => {
    setSceneLoaded(true);
    if (instance) setSceneInstance(instance);
    markScene2Ready();
  }, [markScene2Ready]);

  // The low-tier vector poster is the complete lightweight version of scene two.
  useEffect(() => {
    if (shouldShowPoster) markScene2Ready();
  }, [shouldShowPoster, markScene2Ready]);

  useEffect(() => {
    const update = () => {
      if (document.visibilityState !== "visible" || !isInView) sceneInstance?.stop?.();
      else if (isInView) sceneInstance?.play?.();
    };
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, [sceneInstance, isInView]);

  return (
    <div
      ref={elementRef}
      className={`relative flex h-full min-h-[350px] w-full items-center justify-center overflow-hidden rounded-3xl bg-black ${className}`}
    >
      {shouldShowPoster ? (
        <ScenePoster kind="earth" label="Illustration of planet Earth" />
      ) : shouldLoadScene && isMobile ? (
        <Suspense fallback={<div className="h-full min-h-[350px] w-full bg-black" />}>
          <EarthCanvas onLoaded={handleLoad} />
        </Suspense>
      ) : shouldLoadScene ? (
        <>
          {!sceneLoaded && <div className="absolute inset-0 z-10 bg-black" aria-hidden="true" />}
          <Suspense fallback={null}>
            <Spline
              scene={scene}
              onLoad={handleLoad}
              className="h-full w-full"
              style={{
                width: "100%",
                height: "100%",
                opacity: sceneLoaded ? 1 : 0,
                transition: "opacity 0.45s ease-out",
              }}
            />
          </Suspense>
        </>
      ) : (
        <div className="h-full min-h-[350px] w-full bg-black" aria-hidden="true" />
      )}
    </div>
  );
});

export default ContactSpline;
