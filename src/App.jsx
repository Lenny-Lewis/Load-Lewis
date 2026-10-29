import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import Navbar from "./components/NavBar";
import WhatsAppFloatingButton from "./components/WhatsAppFloatingButton";
import Footer from "./sections/Footer";
import HomePage from "./pages/HomePage";
import WorkPage from "./pages/WorkPage";
import CommentsPage from "./pages/CommentsPage";
import ArticleDetailPage from "./pages/ArticleDetailPage";
import Preloader from "./components/Preloader";
import { Analytics } from "@vercel/analytics/react";

const ScrollToAnchor = () => {
  const location = useLocation();

  // Instant hash jumps before paint — prevents hero flash when returning to /#thoughts
  useLayoutEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
      return;
    }

    const id = location.hash.slice(1);
    let cancelled = false;
    let attempts = 0;

    const jumpToHash = () => {
      if (cancelled) return true;
      const element = document.getElementById(id);
      if (!element) return false;
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
  }, [location.pathname, location.hash]);

  return null;
};

const App = () => {
  const location = useLocation();
  const isWorkPage = location.pathname === "/work";
  const isCommentsPage = location.pathname === "/comments";
  const isArticlePage = location.pathname.startsWith("/article");
  const isHomePage = location.pathname === "/";
  const [showPreloader, setShowPreloader] = useState(() => {
    if (typeof window !== "undefined") {
      return !sessionStorage.getItem("hasSeenPreloader");
    }
    return true;
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
    sessionStorage.setItem("hasSeenPreloader", "true");
  };

  return (
    <>
      {showPreloader && <Preloader onComplete={handlePreloaderComplete} waitForScenes={isHomePage} />}
      <ScrollToAnchor />
      {!isCommentsPage && <Navbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<WorkPage />} />
        <Route path="/comments" element={<CommentsPage />} />
        <Route path="/article/:slug" element={<ArticleDetailPage />} />
      </Routes>
      {!isCommentsPage && !isArticlePage && <WhatsAppFloatingButton />}
      {!isWorkPage && !isCommentsPage && !isArticlePage && <Footer />}
      <Analytics />
    </>
  );
};

export default App;
