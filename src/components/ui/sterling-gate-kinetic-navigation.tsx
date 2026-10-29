import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

const menuLinks = [
  { label: "Home", to: "/", shape: "1" },
  { label: "Work", to: "/work", shape: "2" },
  { label: "Experience", to: "/#experience", shape: "3" },
  { label: "Skills", to: "/#skills", shape: "4" },
  { label: "Thoughts", to: "/#thoughts", shape: "5" },
  { label: "Contact", to: "/#contact", shape: "1" },
];

export function Component() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Close overlay on route/hash change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname, location.hash]);

  // Lock body scroll while open
  useEffect(() => {
    if (!isMenuOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!containerRef.current) return;

    try {
      if (!gsap.parseEase("main")) {
        CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
        gsap.defaults({ ease: "main", duration: 0.7 });
      }
    } catch {
      gsap.defaults({ ease: "power2.out", duration: 0.7 });
    }

    const ctx = gsap.context(() => {
      const menuItems = containerRef.current!.querySelectorAll(
        ".menu-list-item[data-shape]"
      );
      const shapesContainer = containerRef.current!.querySelector(
        ".ambient-background-shapes"
      );

      menuItems.forEach((item) => {
        const shapeIndex = item.getAttribute("data-shape");
        const shape = shapesContainer
          ? shapesContainer.querySelector(`.bg-shape-${shapeIndex}`)
          : null;
        if (!shape) return;

        const shapeEls = shape.querySelectorAll(".shape-element");

        const onEnter = () => {
          if (shapesContainer) {
            shapesContainer
              .querySelectorAll(".bg-shape")
              .forEach((s) => s.classList.remove("active"));
          }
          shape.classList.add("active");
          gsap.fromTo(
            shapeEls,
            { scale: 0.5, opacity: 0, x: -10 },
            {
              scale: 1,
              opacity: 1,
              x: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: "back.out(1.7)",
              overwrite: "auto",
            }
          );
        };

        const onLeave = () => {
          gsap.to(shapeEls, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => shape.classList.remove("active"),
            overwrite: "auto",
          });
        };

        item.addEventListener("mouseenter", onEnter);
        item.addEventListener("mouseleave", onLeave);
        (item as HTMLElement & { _cleanup?: () => void })._cleanup = () => {
          item.removeEventListener("mouseenter", onEnter);
          item.removeEventListener("mouseleave", onLeave);
        };
      });
    }, containerRef);

    return () => {
      ctx.revert();
      containerRef.current
        ?.querySelectorAll(".menu-list-item[data-shape]")
        .forEach((item) => {
          const el = item as HTMLElement & { _cleanup?: () => void };
          el._cleanup?.();
        });
    };
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const navWrap = containerRef.current!.querySelector(".nav-overlay-wrapper");
      const menu = containerRef.current!.querySelector(".menu-content");
      const overlay = containerRef.current!.querySelector(".overlay");
      const bgPanels = containerRef.current!.querySelectorAll(".backdrop-layer");
      const links = containerRef.current!.querySelectorAll(".nav-link");
      const fadeTargets = containerRef.current!.querySelectorAll("[data-menu-fade]");
      const menuButton = containerRef.current!.querySelector(".nav-close-btn");
      const menuButtonTexts = menuButton?.querySelectorAll("p");
      const menuButtonIcon = menuButton?.querySelector(".menu-button-icon");

      const tl = gsap.timeline();

      if (isMenuOpen) {
        navWrap?.setAttribute("data-nav", "open");
        tl.set(navWrap, { display: "block" })
          .set(menu, { xPercent: 0 }, "<")
          .fromTo(menuButtonTexts, { yPercent: 0 }, { yPercent: -100, stagger: 0.2 })
          .fromTo(menuButtonIcon, { rotate: 0 }, { rotate: 315 }, "<")
          .fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
          .fromTo(
            bgPanels,
            { xPercent: 101 },
            { xPercent: 0, stagger: 0.12, duration: 0.575 },
            "<"
          )
          .fromTo(
            links,
            { yPercent: 140, rotate: 10 },
            { yPercent: 0, rotate: 0, stagger: 0.05 },
            "<+=0.35"
          );

        if (fadeTargets.length) {
          tl.fromTo(
            fadeTargets,
            { autoAlpha: 0, yPercent: 50 },
            { autoAlpha: 1, yPercent: 0, stagger: 0.04, clearProps: "all" },
            "<+=0.2"
          );
        }
      } else {
        navWrap?.setAttribute("data-nav", "closed");
        tl.to(overlay, { autoAlpha: 0 })
          .to(menu, { xPercent: 120 }, "<")
          .to(menuButtonTexts, { yPercent: 0 }, "<")
          .to(menuButtonIcon, { rotate: 0 }, "<")
          .set(navWrap, { display: "none" });
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isMenuOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div ref={containerRef} className="sterling-gate-nav">
      <div className="site-header-wrapper">
        <header className="header">
          <div className="container is--full">
            <nav className="nav-row" aria-label="Primary">
              <Link
                to="/"
                aria-label="Lennox Lewis home"
                className="nav-logo-row w-inline-block"
                onClick={closeMenu}
              >
                <span className="nav-logo-text">Lennox Lewis</span>
              </Link>
              <div className="nav-row__right">
                <button
                  type="button"
                  className="nav-toggle-label"
                  onClick={toggleMenu}
                  aria-expanded={isMenuOpen}
                  aria-controls="sterling-gate-menu"
                >
                  <span className="toggle-text">Menu</span>
                </button>

                <button
                  type="button"
                  className="nav-close-btn"
                  onClick={toggleMenu}
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isMenuOpen}
                  aria-controls="sterling-gate-menu"
                >
                  <div className="menu-button-text">
                    <p className="p-large">Menu</p>
                    <p className="p-large">Close</p>
                  </div>
                  <div className="icon-wrap">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="100%"
                      viewBox="0 0 16 16"
                      fill="none"
                      className="menu-button-icon"
                      aria-hidden="true"
                    >
                      <path
                        d="M7.33333 16L7.33333 -3.2055e-07L8.66667 -3.78832e-07L8.66667 16L7.33333 16Z"
                        fill="currentColor"
                      />
                      <path
                        d="M16 8.66667L-2.62269e-07 8.66667L-3.78832e-07 7.33333L16 7.33333L16 8.66667Z"
                        fill="currentColor"
                      />
                      <path
                        d="M6 7.33333L7.33333 7.33333L7.33333 6C7.33333 6.73637 6.73638 7.33333 6 7.33333Z"
                        fill="currentColor"
                      />
                      <path
                        d="M10 7.33333L8.66667 7.33333L8.66667 6C8.66667 6.73638 9.26362 7.33333 10 7.33333Z"
                        fill="currentColor"
                      />
                      <path
                        d="M6 8.66667L7.33333 8.66667L7.33333 10C7.33333 9.26362 6.73638 8.66667 6 8.66667Z"
                        fill="currentColor"
                      />
                      <path
                        d="M10 8.66667L8.66667 8.66667L8.66667 10C8.66667 9.26362 9.26362 8.66667 10 8.66667Z"
                        fill="currentColor"
                      />
                    </svg>
                  </div>
                </button>
              </div>
            </nav>
          </div>
        </header>
      </div>

      <section className="fullscreen-menu-container" aria-hidden={!isMenuOpen}>
        <div
          id="sterling-gate-menu"
          data-nav="closed"
          className="nav-overlay-wrapper"
        >
          <div className="overlay" onClick={closeMenu} />
          <nav className="menu-content" aria-label="Site menu">
            <div className="menu-bg">
              <div className="backdrop-layer first" />
              <div className="backdrop-layer second" />
              <div className="backdrop-layer" />

              <div className="ambient-background-shapes" aria-hidden="true">
                <svg className="bg-shape bg-shape-1" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="80" cy="120" r="40" fill="rgba(205,161,68,0.18)" />
                  <circle className="shape-element" cx="300" cy="80" r="60" fill="rgba(250,247,243,0.08)" />
                  <circle className="shape-element" cx="200" cy="300" r="80" fill="rgba(205,161,68,0.1)" />
                  <circle className="shape-element" cx="350" cy="280" r="30" fill="rgba(250,247,243,0.12)" />
                </svg>

                <svg className="bg-shape bg-shape-2" viewBox="0 0 400 400" fill="none">
                  <path
                    className="shape-element"
                    d="M0 200 Q100 100, 200 200 T 400 200"
                    stroke="rgba(205,161,68,0.22)"
                    strokeWidth="60"
                    fill="none"
                  />
                  <path
                    className="shape-element"
                    d="M0 280 Q100 180, 200 280 T 400 280"
                    stroke="rgba(250,247,243,0.12)"
                    strokeWidth="40"
                    fill="none"
                  />
                </svg>

                <svg className="bg-shape bg-shape-3" viewBox="0 0 400 400" fill="none">
                  {[
                    [50, 50, 8],
                    [150, 50, 8],
                    [250, 50, 8],
                    [350, 50, 8],
                    [100, 150, 12],
                    [200, 150, 12],
                    [300, 150, 12],
                    [50, 250, 10],
                    [150, 250, 10],
                    [250, 250, 10],
                    [350, 250, 10],
                    [100, 350, 6],
                    [200, 350, 6],
                    [300, 350, 6],
                  ].map(([cx, cy, r], i) => (
                    <circle
                      key={i}
                      className="shape-element"
                      cx={cx}
                      cy={cy}
                      r={r}
                      fill="rgba(205,161,68,0.28)"
                    />
                  ))}
                </svg>

                <svg className="bg-shape bg-shape-4" viewBox="0 0 400 400" fill="none">
                  <path
                    className="shape-element"
                    d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100"
                    fill="rgba(205,161,68,0.12)"
                  />
                  <path
                    className="shape-element"
                    d="M250 200 Q300 150, 350 200 Q380 250, 350 300 Q300 350, 250 300 Q200 250, 250 200"
                    fill="rgba(250,247,243,0.08)"
                  />
                </svg>

                <svg className="bg-shape bg-shape-5" viewBox="0 0 400 400" fill="none">
                  <line className="shape-element" x1="0" y1="100" x2="300" y2="400" stroke="rgba(205,161,68,0.15)" strokeWidth="30" />
                  <line className="shape-element" x1="100" y1="0" x2="400" y2="300" stroke="rgba(250,247,243,0.1)" strokeWidth="25" />
                  <line className="shape-element" x1="200" y1="0" x2="400" y2="200" stroke="rgba(205,161,68,0.12)" strokeWidth="20" />
                </svg>
              </div>
            </div>

            <div className="menu-content-wrapper">
              <ul className="menu-list">
                {menuLinks.map(({ label, to, shape }) => (
                  <li key={label} className="menu-list-item" data-shape={shape}>
                    <Link
                      to={to}
                      className="nav-link w-inline-block"
                      onClick={closeMenu}
                    >
                      <p className="nav-link-text" data-menu-fade={label === "Thoughts" ? true : undefined}>
                        {label}
                      </p>
                      <div className="nav-link-hover-bg" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}

export default Component;
