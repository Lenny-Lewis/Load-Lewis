/**
 * Keeps the hero Spline scene alive across route changes.
 *
 * The scene is rendered once, by <PersistentSplineHost /> at the App level, into
 * a detached <div> ("host"). SplineRobotCard moves that host into its own slot
 * when it mounts and takes it out again when it unmounts (e.g. on /work). The
 * Spline app itself never unmounts, so returning to the home page shows the bot
 * instantly instead of downloading and rendering it again. While the host is
 * off the page the scene is paused with app.stop() so it costs nothing.
 */
import { lazy, Suspense, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { emit, getHost, store, subscribe } from "./persistentSplineStore";

const Spline = lazy(() => import("@splinetool/react-spline"));

const handleLoad = (app) => {
  store.app = app;
  store.loaded = true;
  const parent = store.host?.parentElement;
  if (parent) store.size = { width: parent.clientWidth, height: parent.clientHeight };
  // Loaded while the visitor is on another page: stay paused until shown.
  if (!store.host?.isConnected) app.stop?.();
  window.__HERO_3D_READY__ = true;
  window.dispatchEvent(new CustomEvent("hero-3d-ready"));
  emit();
};

/** Mount once near the root of the app (outside <Routes>). */
export const PersistentSplineHost = () => {
  useSyncExternalStore(subscribe, () => store.version, () => 0);
  const host = getHost();
  if (!store.scene || !host) return null;

  return createPortal(
    <Suspense fallback={null}>
      <Spline
        scene={store.scene}
        onLoad={handleLoad}
        className="h-full w-full"
        style={{
          width: "100%",
          height: "100%",
          ...store.style,
          opacity: store.loaded ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      />
    </Suspense>,
    host
  );
};
