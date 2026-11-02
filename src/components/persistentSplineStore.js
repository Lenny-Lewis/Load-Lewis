/** Shared state for the persistent hero Spline scene (see PersistentSpline.jsx). */
import { useSyncExternalStore } from "react";

export const store = {
  scene: null,
  style: undefined,
  loaded: false,
  app: null,
  host: null,
  size: { width: 0, height: 0 },
  version: 0,
  listeners: new Set(),
};

export const emit = () => {
  store.version += 1;
  store.listeners.forEach((listener) => listener());
};

export const subscribe = (listener) => {
  store.listeners.add(listener);
  return () => store.listeners.delete(listener);
};

export const getHost = () => {
  if (!store.host && typeof document !== "undefined") {
    const host = document.createElement("div");
    host.style.cssText = "position:relative;width:100%;height:100%;";
    store.host = host;
  }
  return store.host;
};

/** Ask for the scene to be loaded (first call starts the download). */
export const requestSplineScene = (scene, style) => {
  if (store.scene === scene && store.style === style) return;
  store.scene = scene;
  store.style = style;
  emit();
};

/** Put the live scene into `container` and resume it. */
export const attachSpline = (container) => {
  const host = getHost();
  if (!container || !host) return;
  if (host.parentNode !== container) container.appendChild(host);
  if (store.app) {
    const { clientWidth: width, clientHeight: height } = container;
    if (width && height && (width !== store.size.width || height !== store.size.height)) {
      store.size = { width, height };
      store.app.setSize?.(width, height);
    }
    store.app.play?.();
  }
};

/** Take the scene off the page and pause it, keeping it in memory. */
export const detachSpline = () => {
  store.app?.stop?.();
  store.host?.remove();
};

export const useSplineLoaded = () =>
  useSyncExternalStore(subscribe, () => store.loaded, () => false);
