import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Navbar from "./components/NavBar";
import WhatsAppFloatingButton from "./components/WhatsAppFloatingButton";
import SiteHalftoneFooter from "./components/SiteHalftoneFooter";
import HomePage from "./pages/HomePage";
import WorkPage from "./pages/WorkPage";
import CaseStudyPage from "./pages/CaseStudyPage";
import CompanyProfilePage from "./pages/CompanyProfilePage";
import CommentsPage from "./pages/CommentsPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import ThoughtsPage from "./pages/ThoughtsPage";
import Preloader from "./components/Preloader";
import TabTitle from "./components/TabTitle";
import { PersistentSplineHost } from "./components/PersistentSpline";
import { Analytics } from "@vercel/analytics/react";

const prefersReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

const ScrollToAnchor = () => {
  const location = useLocation();
  const previousPathRef = useRef(location.pathname);
  // Pre-filled links re-run the scroll on every click, even to the hash already in the address.
  const prefillKey = location.state?.message ? location.key : null;

  // Instant hash jumps before paint — prevents hero flash when returning to /#thoughts
  useLayoutEffect(() => {
    const samePage = previousPathRef.current === location.pathname;
    previousPathRef.current = location.pathname;
    if (!location.hash) {
      window.scrollTo(0, 0);
      return;
    }

    const id = location.hash.slice(1);
    // A link that pre-fills the contact form, clicked on this same page, glides down to it.
    // Everything else jumps instantly, so arriving from another page shows no scroll.
    const glide = samePage && Boolean(prefillKey) && !prefersReducedMotion();
    let cancelled = false;
    let attempts = 0;

    const jumpToHash = () => {
      if (cancelled) return true;
      const element = document.getElementById(id);
      if (!element) return false;
      if (glide) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
        return true;
      }
      const prev = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      element.scrollIntoView({ behavior: "auto", block: "start" });
      document.documentElement.style.scrollBehavior = prev;
      return true;
    };

    if (jumpToHash()) return;

    const tryAgain = () => {
      if (cancelled) return;
      if (jumpToHash() || attempts++ > 30) return;
      requestAnimationFrame(tryAgain);
    };
    requestAnimationFrame(tryAgain);

    return () => {
      cancelled = true;
    };
  }, [location.pathname, location.hash, prefillKey]);

  return null;
};

const App = () => {
  const location = useLocation();
  const isWorkPage = location.pathname === "/work";
  // Work, project, article and Thoughts pages place the footer themselves.
  const isCaseStudyPage = location.pathname.startsWith("/work/");
  const isCommentsPage = location.pathname === "/comments";
  // Article pages and the all-articles page share the article layout (own nav pill + footer).
  const isArticlePage =
    location.pathname.startsWith("/article") || location.pathname === "/thoughts";
  const isHomePage = location.pathname === "/";
  // The intro plays once per browser session; reloads skip it.
  const [showPreloader, setShowPreloader] = useState(() => {
    try {
      return sessionStorage.getItem("hasSeenPreloader") !== "true";
    } catch {
      return true;
    }
  });

  useEffect(() => {
    if (showPreloader) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [showPreloader]);

  const handlePreloaderComplete = () => {
    setShowPreloader(false);
    try {
      sessionStorage.setItem("hasSeenPreloader", "true");
    } catch {
      // Storage unavailable (private mode); the intro will simply replay.
    }
  };

  return (
    <>
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} waitForScenes={isHomePage} />}
      {/* Hero Spline scene, kept alive across route changes */}
      <PersistentSplineHost />
      <ScrollToAnchor />
      <TabTitle />
      {!isCommentsPage && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/work/:slug" element={<CaseStudyPage />} />
        <Route path="/work/company-profiles/:slug" element={<CompanyProfilePage />} />
        <Route path="/comments" element={<CommentsPage />} />
        <Route path="/thoughts" element={<ThoughtsPage />} />
        <Route path="/article/:slug" element={<ArticleDetailPage />} />
      </Routes>
      {!isCommentsPage && !isArticlePage && <WhatsAppFloatingButton />}
      {!isWorkPage && !isCaseStudyPage && !isCommentsPage && !isArticlePage && (
        <div className="pt-20 md:pt-28">
          <SiteHalftoneFooter />
        </div>
      )}
      <Analytics />
    </>
  );
};

export default App;
