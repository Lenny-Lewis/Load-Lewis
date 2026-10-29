import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import HoverTextSlide from "@/components/ui/HoverTextSlide";
import MorphDotsIcon from "@/components/ui/MorphDotsIcon";

const links = [
  { label: "Home", to: "/" },
  { label: "Work", to: "/#work" },
  { label: "Experience", to: "/#experience" },
  { label: "Skills", to: "/#skills" },
  { label: "Contact", to: "/#contact" },
];

export default function ArticleNavPill() {
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

  return (
    <>
      <style>{`#root:has(#article-nav-pill) > header { display: none; }`}</style>
      <motion.nav
        id="article-nav-pill"
        ref={navRef}
        aria-label="Article page navigation"
        initial={false}
        animate={{ height: isOpen ? "auto" : 60 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 220, damping: 26 }
        }
        className="fixed top-6 left-1/2 z-[110] w-[320px] max-w-[calc(100vw-32px)] -translate-x-1/2 overflow-hidden rounded-[20px] bg-[#111] font-[family-name:var(--font-article)] shadow-2xl"
        style={{ fontFamily: "var(--font-article), Archivo, sans-serif" }}
      >
        <div className="flex h-[60px] items-center justify-between pl-4 pr-2">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="group text-[20px] font-bold tracking-tight text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <HoverTextSlide text="Lennox Lewis" />
          </Link>
          <button
            type="button"
            aria-label={isOpen ? "Close menu" : "Open menu"}
            aria-expanded={isOpen}
            aria-controls="article-nav-menu"
            onClick={() => setIsOpen((open) => !open)}
            className="flex h-9 w-11 items-center justify-center rounded-lg bg-white text-[#111] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <MorphDotsIcon open={isOpen} />
          </button>
        </div>

        <div
          id="article-nav-menu"
          aria-hidden={!isOpen}
          inert={!isOpen}
          className="flex flex-col items-start gap-2 px-3 pb-3 pt-1"
        >
          {links.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              onClick={() => setIsOpen(false)}
              className="group inline-flex w-auto items-center justify-center rounded-[8px] border border-black/5 bg-[#faf7f3] px-3.5 py-[7px] text-[14px] font-medium text-[#111] shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-colors hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <HoverTextSlide text={label} />
            </Link>
          ))}
        </div>
      </motion.nav>
    </>
  );
}
