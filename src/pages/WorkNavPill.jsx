import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import HoverTextSlide from "@/components/ui/HoverTextSlide";
import MorphDotsIcon from "@/components/ui/MorphDotsIcon";

const links = [
  { label: "Home", to: "/" },
  { label: "About", to: "/#experience" },
  { label: "Services", to: "/#skills" },
  { label: "Work", to: "/work" },
  { label: "Contact", to: "/#contact" },
];

function RollingLinkText({ text }) {
  return (
    <span aria-hidden="true" className="inline-flex leading-[1.2em]">
      {Array.from(text).map((letter, index) => (
        <span key={index} className="inline-block h-[1.2em] overflow-hidden">
          <span
            className="flex flex-col transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-1/2 group-focus-visible:-translate-y-1/2 motion-reduce:transform-none"
            style={{ transitionDelay: `${index * 30}ms` }}
          >
            <span>{letter === " " ? "\u00a0" : letter}</span>
            <span>{letter === " " ? "\u00a0" : letter}</span>
          </span>
        </span>
      ))}
    </span>
  );
}

export default function WorkNavPill() {
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
      <style>{`#root:has(#work-nav-pill) > header { display: none; }`}</style>
      <motion.nav
        id="work-nav-pill"
        ref={navRef}
        aria-label="Work page navigation"
        initial={false}
        animate={{ height: isOpen ? "auto" : 60 }}
        transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 220, damping: 26 }}
        className="fixed top-6 left-1/2 z-[110] w-[320px] max-w-[calc(100vw-32px)] -translate-x-1/2 overflow-hidden rounded-[20px] bg-[#111] font-sans shadow-2xl"
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
            aria-label="Open menu"
            aria-expanded={isOpen}
            aria-controls="work-nav-menu"
            onClick={() => setIsOpen((open) => !open)}
            className="flex h-9 w-11 items-center justify-center rounded-lg bg-white text-[#111] transition-transform hover:scale-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <MorphDotsIcon open={isOpen} />
          </button>
        </div>
        <div
          id="work-nav-menu"
          aria-hidden={!isOpen}
          inert={!isOpen}
          className="flex flex-col gap-2.5 px-2 pb-3 pt-2"
        >
          {links.map(({ label, to }) => (
            <Link
              key={label}
              to={to}
              aria-label={label}
              onClick={() => setIsOpen(false)}
              className="group block rounded-xl px-4 py-2 text-base text-white transition-colors hover:bg-white/10 focus-visible:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
            >
              <RollingLinkText text={label} />
            </Link>
          ))}
        </div>
      </motion.nav>
    </>
  );
}
