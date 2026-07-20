import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./components/NavBar";
import Footer from "./sections/Footer";
import HomePage from "./pages/HomePage";
import WorkPage from "./pages/WorkPage";
import { Analytics } from "@vercel/analytics/react";

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
  return (
    <>
      <ScrollToAnchor />
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/work" element={<WorkPage />} />
      </Routes>
      
      {/* Footer and Analytics remain on all pages */}
      <Footer />
      <Analytics />
    </>
  );
};

export default App;
