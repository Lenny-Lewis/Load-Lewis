import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { navLinks, resumeLinks } from "../constants";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const isWorkPage = location.pathname === '/work';

  useEffect(() => {
    // create an event listener for when the user scrolls
    const handleScroll = () => {
      // check if the user has scrolled down at least 10px
      // if so, set the state to true
      const isScrolled = window.scrollY > 10;
      setScrolled(isScrolled);
    };

    // add the event listener to the window
    window.addEventListener("scroll", handleScroll);

    // cleanup the event listener when the component is unmounted
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (isWorkPage) {
    return (
      <motion.header 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-8 left-1/2 -translate-x-1/2 z-[100]"
      >
        <div className="flex items-center justify-between w-64 bg-[#111] border border-white/10 rounded-full pl-5 pr-2 py-2 shadow-2xl relative">
          <Link to="/" className="text-white font-bold text-lg">
            Lennox Lewis
          </Link>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-black transition-colors"
            aria-label="Quick Links Menu"
          >
            <motion.svg 
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              width="20" height="20" viewBox="0 0 24 24" fill="currentColor"
            >
              <path d="M6 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
            </motion.svg>
          </motion.button>

          <AnimatePresence>
            {isMenuOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-16 left-0 w-full bg-[#0F0F13] border border-white/10 rounded-3xl p-2 shadow-2xl flex flex-col gap-1 z-50 origin-top"
              >
                <Link 
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="px-4 py-2 text-sm text-white-50 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium"
                >
                  Home
                </Link>
                {navLinks.map(({ link, name }) => (
                  <Link 
                    key={name}
                    to={link}
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 text-sm text-white-50 hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium"
                  >
                    {name}
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.header>
    );
  }

  return (
    <header className={`navbar ${scrolled ? "scrolled" : "not-scrolled"}`}>
      <div className="inner">
        <Link to="/#hero" className="logo">
          Lennox Lewis
        </Link>

        <nav className="desktop">
          <ul>
            {navLinks.map(({ link, name }) => (
              <li key={name} className="group">
                <Link to={link}>
                  <span>{name}</span>
                  <span className="underline" />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-actions">
          <a
            href={resumeLinks.resume}
            download
            className="resume-btn group"
          >
            <div className="inner">
              <span>Download Resume</span>
            </div>
          </a>

          <Link to="/#contact" className="contact-btn group">
            <div className="inner">
              <span>Contact me</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default NavBar;
