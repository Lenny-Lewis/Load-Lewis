import { Routes, Route, useLocation } from "react-router-dom";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Navbar from "./components/NavBar";
import WhatsAppFloatingButton from "./components/WhatsAppFloatingButton";
import Footer from "./sections/Footer";
import HomePage from "./pages/HomePage";
import WorkPage from "./pages/WorkPage";
import Preloader from "./components/Preloader";
import { Analytics } from "@vercel/analytics/react";
import { SceneLoadingProvider } from "./context/SceneLoadingContext";

const ScrollToAnchor = () => {
  const location = useLocation();
  
  useEffect(() => {
    if (location.hash) {
      const element = document.getElementById(location.hash.slice(1));
      if (element) {
        // Use setTimeout to ensure DOM has painted before scrolling
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  return null;
};

const App = () => {
  const location = useLocation();
  const isWorkPage = location.pathname === "/work";
  const [loadingPhase, setLoadingPhase] = useState("assets");
  const [showInitialLoader, setShowInitialLoader] = useState(() =>
    typeof window === "undefined" || !sessionStorage.getItem("hasSeenPreloader")
  );
  const [scene1Ready, setScene1Ready] = useState(false);
  const scene1StartedAt = useRef(0);
  const scene1Marked = useRef(false);
  // Keep scroll locked through the curtain's exit; the loader calls its exit
  // callback only after AnimatePresence has removed the animated overlay.
  const preloaderActive = showInitialLoader;

  useEffect(() => {
    if (preloaderActive) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [preloaderActive]);

  // Wait only for the first-view font, SVG imagery, and entry stylesheet.
  useEffect(() => {
    if (loadingPhase !== "assets") return undefined;
    let cancelled = false;
    const waitForPaint = () => new Promise((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(resolve));
    });
    const waitForStyles = () => Promise.all(
      [...document.querySelectorAll('link[rel="stylesheet"]')].map((link) => {
        if (link.sheet) return Promise.resolve();
        return new Promise((resolve) => {
          let settled = false;
          const finish = () => {
            if (settled) return;
            settled = true;
            window.clearTimeout(timeout);
            link.removeEventListener("load", finish);
            link.removeEventListener("error", finish);
            resolve();
          };
          const timeout = window.setTimeout(finish, 1500);
          link.addEventListener("load", finish, { once: true });
          link.addEventListener("error", finish, { once: true });
        });
      })
    );
    const criticalImages = [...document.querySelectorAll("#hero img")].map((image) =>
      typeof image.decode === "function" ? image.decode().catch(() => undefined) : Promise.resolve()
    );

    Promise.allSettled([
      document.fonts?.ready ?? Promise.resolve(),
      waitForStyles(),
      ...criticalImages,
    ]).then(waitForPaint).then(() => {
      if (!cancelled) setLoadingPhase(isWorkPage ? "done" : "scene1");
    });

    return () => { cancelled = true; };
  }, [loadingPhase, isWorkPage]);

  // Bound the hero wait so a failed remote scene cannot hold the page curtain.
  useEffect(() => {
    if (loadingPhase !== "scene1") return undefined;
    scene1StartedAt.current = Date.now();
    const timeout = window.setTimeout(() => setLoadingPhase("scene2"), 6000);
    return () => window.clearTimeout(timeout);
  }, [loadingPhase]);

  const markScene1Ready = useCallback(() => {
    if (scene1Marked.current) return;
    scene1Marked.current = true;
    setScene1Ready(true);
    const startedAt = scene1StartedAt.current || Date.now();
    const remaining = Math.max(0, 500 - (Date.now() - startedAt));
    window.setTimeout(() => {
      setLoadingPhase((phase) => phase === "scene1" ? "scene2" : phase);
    }, remaining);
  }, []);

  const markScene2Ready = useCallback(() => setLoadingPhase("done"), []);
  const handlePreloaderExit = useCallback(() => {
    sessionStorage.setItem("hasSeenPreloader", "true");
    setShowInitialLoader(false);
  }, []);

  const sceneLoadingValue = useMemo(() => ({
    phase: loadingPhase,
    scene1Ready,
    markScene1Ready,
    markScene2Ready,
  }), [loadingPhase, scene1Ready, markScene1Ready, markScene2Ready]);

  return (
    <SceneLoadingProvider value={sceneLoadingValue}>
      <>
        {showInitialLoader && (
          <Preloader phase={loadingPhase} onExitComplete={handlePreloaderExit} />
        )}
        <ScrollToAnchor />
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
        </Routes>
        <WhatsAppFloatingButton />
        {!isWorkPage && <Footer />}
        <Analytics />
      </>
    </SceneLoadingProvider>
  );
};

export default App;
