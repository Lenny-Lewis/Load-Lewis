import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import MorphDotsIcon from "@/components/ui/MorphDotsIcon";

/**
 * Floating nav pill for the Work, article and all-articles pages, matching the
 * one on majd-portfolio.framer.website (measured frame by frame):
 *
 *   closed   320 × 60, #111, 20px corners, fixed 30px from the top
 *   open     the pill grows to fit the links on a bounce-free spring (~0.7s);
 *            links fade in while sliding 16px from the left, ~0.1s apart
 *   close    links disappear at once and the pill shrinks back to 60px
 *   hover    link and logo letters roll up one after another (~35ms apart)
 *   button   44 × 36 cream button, greys on hover, dots morph into an X
 */

const links = [
  { label: "Home", to: "/" },
  { label: "Work", to: "/work" },
  { label: "Experience", to: "/#experience" },
  { label: "Thoughts", to: "/thoughts" },
  { label: "Contact", to: "/#contact" },
];

const CLOSED_HEIGHT = 60;
const pillSpring = { type: "spring", bounce: 0, duration: 0.7 };

/** Letters roll up and a copy rolls in from below, staggered per letter. */
function RollingText({ text }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" className="inline-flex leading-[1.2em]">
        {Array.from(text).map((letter, index) => (
          <span key={index} className="inline-block h-[1.2em] overflow-hidden">
            <span
              className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1/2 group-focus-visible:-translate-y-1/2 motion-reduce:transition-none"
              style={{ transitionDelay: `${index * 35}ms` }}
            >
              <span>{letter === " " ? " " : letter}</span>
              <span>{letter === " " ? " " : letter}</span>
            </span>
          </span>
        ))}
      </span>
    </>
  );
}

export default function SiteNavPill({ label = "Site navigation" }) {
  const [isOpen, setIsOpen] = useState(false);
  const navRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isOpen) return;

    const closeOnOutsideClick = (event) => {
      if (!navRef.current?.contains(event.target)) setIsOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        navRef.current?.querySelector("button")?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  const close = () => setIsOpen(false);

  return (
    <>
      {/* Hide the site's main header while this pill is on the page. */}
      <style>{`#root:has(#site-nav-pill) > header { display: none; }`}</style>
      <motion.nav
        id="site-nav-pill"
        ref={navRef}
        aria-label={label}
        initial={false}
        animate={{ height: isOpen ? "auto" : CLOSED_HEIGHT }}
        transition={reduceMotion ? { duration: 0 } : pillSpring}
        className="fixed left-1/2 top-[30px] z-[110] w-[320px] max-w-[calc(100vw-32px)] -translate-x-1/2 overflow-hidden rounded-[20px] bg-[#111] shadow-2xl"
        style={{ fontFamily: "var(--font-article), Archivo, sans-serif" }}
      >
        <div className={`px-4 pt-3 ${isOpen ? "pb-5" : "pb-3"}`}>
          <div className="flex h-9 items-center justify-between">
            <Link
              to="/"
              onClick={close}
              className="group text-[22px] font-semibold tracking-[-0.04em] text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
            >
              <RollingText text="Lennox Lewis" />
            </Link>
            <button
              type="button"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
              aria-controls="site-nav-menu"
              onClick={() => setIsOpen((open) => !open)}
              className="flex h-9 w-11 items-center justify-center rounded-[8px] bg-[#faf7f3] text-[#111] transition-colors duration-300 hover:bg-[#e3e1dd] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <MorphDotsIcon open={isOpen} />
            </button>
          </div>

          {/* Links only exist while open, so closing removes them at once. */}
          {isOpen && (
            <div id="site-nav-menu" className="mt-5 flex flex-col items-start gap-2.5">
              {links.map(({ label: linkLabel, to }, index) => (
                <motion.div
                  key={linkLabel}
                  initial={reduceMotion ? false : { opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ type: "spring", bounce: 0, duration: 0.5, delay: 0.1 + index * 0.1 }}
                >
                  <Link
                    to={to}
                    onClick={close}
                    className="group inline-flex h-[35px] items-center rounded-[8px] bg-[#faf7f3] px-4 text-[18px] font-medium tracking-[-0.04em] text-[#111] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                  >
                    <RollingText text={linkLabel} />
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.nav>
    </>
  );
}
