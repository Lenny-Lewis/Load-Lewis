import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";

// Register GSAP Plugins safely
if (typeof window !== "undefined") {
  gsap.registerPlugin(CustomEase);
}

export interface NavItem {
  label: string;
  href?: string;
  to?: string;
  shape?: string | number;
}

export interface SterlingGateKineticNavProps {
  brandName?: string;
  brandHref?: string;
  items?: NavItem[];
}

const defaultItems: NavItem[] = [
  { label: "About us", href: "#", shape: "1" },
  { label: "Our work", href: "#", shape: "2" },
  { label: "Services", href: "#", shape: "3" },
  { label: "Blog", href: "#", shape: "4" },
  { label: "Contact us", href: "#", shape: "5" },
];

export function Component({
  brandName = "Lennox Lewis",
  brandHref = "/",
  items = defaultItems,
}: SterlingGateKineticNavProps = {}) {
  // We need a ref for the parent container to scope GSAP
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  // Glassy header background (as on Vanguard): off over the hero, on once the
  // hero has scrolled up past the header. Pages without a #hero fall back to
  // "scrolled at least one screen height".
  const [isPastHero, setIsPastHero] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const hero = document.getElementById("hero");
      const header = containerRef.current?.querySelector(".header");
      const headerBottom = header?.getBoundingClientRect().bottom ?? 0;
      setIsPastHero(
        hero
          ? hero.getBoundingClientRect().bottom <= headerBottom
          : window.scrollY >= window.innerHeight
      );
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // Initial Setup & Hover Effects
  useEffect(() => {
    if (!containerRef.current) return;

    // Create custom easing
    try {
      if (!gsap.parseEase("main")) {
        CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
        gsap.defaults({ ease: "main", duration: 0.7 });
      }
    } catch (e) {
      console.warn("CustomEase failed to load, falling back to default.", e);
      gsap.defaults({ ease: "power2.out", duration: 0.7 });
    }

    const ctx = gsap.context(() => {
      // 1. Arrow Animation (Safe check)
      const arrowLine = document.querySelector(".arrow-line");
      if (arrowLine) {
        const pathLength = (arrowLine as SVGPathElement).getTotalLength();
        gsap.set(arrowLine, { strokeDasharray: pathLength, strokeDashoffset: pathLength });
        const arrowTl = gsap.timeline({ repeat: -1, repeatDelay: 0.8 });
        arrowTl
          .to(arrowLine, { strokeDashoffset: 0, duration: 1, ease: "power2.out" })
          .to({}, { duration: 1.2 })
          .to(arrowLine, { strokeDashoffset: -pathLength, duration: 0.6, ease: "power2.in" })
          .set(arrowLine, { strokeDashoffset: pathLength });
      }

      // 2. Shape Hover
      const menuItems = containerRef.current!.querySelectorAll(".menu-list-item[data-shape]");
      const shapesContainer = containerRef.current!.querySelector(".ambient-background-shapes");

      menuItems.forEach((item) => {
        const shapeIndex = item.getAttribute("data-shape");
        const shape = shapesContainer ? shapesContainer.querySelector(`.bg-shape-${shapeIndex}`) : null;

        if (!shape) return;

        const shapeEls = shape.querySelectorAll(".shape-element");

        const onEnter = () => {
          if (shapesContainer) {
            shapesContainer.querySelectorAll(".bg-shape").forEach((s) => s.classList.remove("active"));
          }
          shape.classList.add("active");

          gsap.fromTo(
            shapeEls,
            { scale: 0.5, opacity: 0, rotation: -10 },
            { scale: 1, opacity: 1, rotation: 0, duration: 0.6, stagger: 0.08, ease: "back.out(1.7)", overwrite: "auto" }
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
      if (containerRef.current) {
        const menuItems = containerRef.current.querySelectorAll(".menu-list-item[data-shape]");
        menuItems.forEach((item: any) => item._cleanup && item._cleanup());
      }
    };
  }, [items]);

  // Menu Open/Close Animation
  // One timeline is built for opening; closing plays the same timeline in
  // reverse, so every step of the open animation is undone in reverse order.
  const menuTl = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      const root = containerRef.current!;
      const navWrap = root.querySelector(".nav-overlay-wrapper");
      const menu = root.querySelector(".menu-content");
      const overlay = root.querySelector(".overlay");
      const bgPanels = root.querySelectorAll(".backdrop-layer");
      const menuLinks = root.querySelectorAll(".nav-link");
      const fadeTargets = root.querySelectorAll("[data-menu-fade]");
      const innerClose = root.querySelector(".menu-close-btn");

      const menuButton = root.querySelector(".nav-close-btn");
      const menuButtonTexts = menuButton ? Array.from(menuButton.querySelectorAll("p")) : [];
      const menuButtonIcon = menuButton?.querySelector(".menu-button-icon") ?? null;

      const tl = gsap.timeline({
        paused: true,
        onReverseComplete: () => navWrap?.setAttribute("data-nav", "closed"),
      });

      tl.set(navWrap, { display: "block" })
        .set(menu, { xPercent: 0 }, "<");
      if (menuButtonTexts.length) tl.fromTo(menuButtonTexts, { yPercent: 0 }, { yPercent: -100, stagger: 0.2 });
      if (menuButtonIcon) tl.fromTo(menuButtonIcon, { rotate: 0 }, { rotate: 315 }, "<");
      tl.fromTo(overlay, { autoAlpha: 0 }, { autoAlpha: 1 }, "<")
        .fromTo(bgPanels, { xPercent: 101 }, { xPercent: 0, stagger: 0.12, duration: 0.575 }, "<")
        .fromTo(menuLinks, { yPercent: 140, rotate: 10 }, { yPercent: 0, rotate: 0, stagger: 0.05 }, "<+=0.35");
      if (fadeTargets.length) {
        tl.fromTo(fadeTargets, { autoAlpha: 0, yPercent: 50 }, { autoAlpha: 1, yPercent: 0, stagger: 0.04 }, "<+=0.2");
      }
      if (innerClose) {
        tl.fromTo(innerClose, { autoAlpha: 0, yPercent: -40 }, { autoAlpha: 1, yPercent: 0, duration: 0.5 }, "<");
      }

      menuTl.current = tl;
    }, containerRef);

    return () => {
      menuTl.current = null;
      ctx.revert();
    };
  }, [items]);

  useEffect(() => {
    const tl = menuTl.current;
    const navWrap = containerRef.current?.querySelector(".nav-overlay-wrapper");
    if (!tl) return;
    if (isMenuOpen) {
      navWrap?.setAttribute("data-nav", "open");
      tl.play();
    } else if (tl.progress() > 0) {
      tl.reverse();
    }
  }, [isMenuOpen]);

  // Prevent background scroll when open
  useEffect(() => {
    if (!isMenuOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isMenuOpen]);

  // keydown Escape handling
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isMenuOpen]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div ref={containerRef} className="sterling-gate-nav">
      <div className="site-header-wrapper">
        <header className={`header${isPastHero ? " is--glass" : ""}`}>
          <div className="container is--full">
            <nav className="nav-row" aria-label="Main Navigation">
              {brandHref?.startsWith("/") ? (
                <Link to={brandHref} aria-label={brandName || "home"} className="nav-logo-row w-inline-block" onClick={closeMenu}>
                  {brandName && <span className="nav-logo-text">{brandName}</span>}
                </Link>
              ) : (
                <a href={brandHref || "#"} aria-label={brandName || "home"} className="nav-logo-row w-inline-block" onClick={closeMenu}>
                  {brandName && <span className="nav-logo-text">{brandName}</span>}
                </a>
              )}
              <div className="nav-row__right">
                {/* Menu Button */}
                <button
                  type="button"
                  className="nav-close-btn"
                  onClick={toggleMenu}
                  aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                  aria-expanded={isMenuOpen}
                  style={{ pointerEvents: "auto" }}
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

      <section className="fullscreen-menu-container">
        <div data-nav="closed" className="nav-overlay-wrapper">
          <div className="overlay" onClick={closeMenu}></div>
          <nav className="menu-content" aria-label="Kinetic Navigation Menu">
            <button type="button" className="nav-close-btn menu-close-btn" onClick={closeMenu} aria-label="Close menu">
              <span className="p-large">Close</span>
              <span className="icon-wrap" aria-hidden="true">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="none" className="menu-close-icon">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              </span>
            </button>
            <div className="menu-bg">
              <div className="backdrop-layer first"></div>
              <div className="backdrop-layer second"></div>
              <div className="backdrop-layer"></div>

              {/* Abstract shapes container */}
              <div className="ambient-background-shapes" aria-hidden="true">
                {/* Shape 1: Floating circles */}
                <svg className="bg-shape bg-shape-1" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="80" cy="120" r="40" fill="rgba(99,102,241,0.22)" />
                  <circle className="shape-element" cx="300" cy="80" r="60" fill="rgba(139,92,246,0.18)" />
                  <circle className="shape-element" cx="200" cy="300" r="80" fill="rgba(236,72,153,0.15)" />
                  <circle className="shape-element" cx="350" cy="280" r="30" fill="rgba(99,102,241,0.22)" />
                </svg>

                {/* Shape 2: Wave pattern */}
                <svg className="bg-shape bg-shape-2" viewBox="0 0 400 400" fill="none">
                  <path
                    className="shape-element"
                    d="M0 200 Q100 100, 200 200 T 400 200"
                    stroke="rgba(99,102,241,0.28)"
                    strokeWidth="60"
                    fill="none"
                  />
                  <path
                    className="shape-element"
                    d="M0 280 Q100 180, 200 280 T 400 280"
                    stroke="rgba(139,92,246,0.22)"
                    strokeWidth="40"
                    fill="none"
                  />
                </svg>

                {/* Shape 3: Grid dots */}
                <svg className="bg-shape bg-shape-3" viewBox="0 0 400 400" fill="none">
                  <circle className="shape-element" cx="50" cy="50" r="8" fill="rgba(99,102,241,0.4)" />
                  <circle className="shape-element" cx="150" cy="50" r="8" fill="rgba(139,92,246,0.4)" />
                  <circle className="shape-element" cx="250" cy="50" r="8" fill="rgba(236,72,153,0.4)" />
                  <circle className="shape-element" cx="350" cy="50" r="8" fill="rgba(99,102,241,0.4)" />
                  <circle className="shape-element" cx="100" cy="150" r="12" fill="rgba(139,92,246,0.35)" />
                  <circle className="shape-element" cx="200" cy="150" r="12" fill="rgba(236,72,153,0.35)" />
                  <circle className="shape-element" cx="300" cy="150" r="12" fill="rgba(99,102,241,0.35)" />
                  <circle className="shape-element" cx="50" cy="250" r="10" fill="rgba(236,72,153,0.4)" />
                  <circle className="shape-element" cx="150" cy="250" r="10" fill="rgba(99,102,241,0.4)" />
                  <circle className="shape-element" cx="250" cy="250" r="10" fill="rgba(139,92,246,0.4)" />
                  <circle className="shape-element" cx="350" cy="250" r="10" fill="rgba(236,72,153,0.4)" />
                  <circle className="shape-element" cx="100" cy="350" r="6" fill="rgba(99,102,241,0.4)" />
                  <circle className="shape-element" cx="200" cy="350" r="6" fill="rgba(139,92,246,0.4)" />
                  <circle className="shape-element" cx="300" cy="350" r="6" fill="rgba(236,72,153,0.4)" />
                </svg>

                {/* Shape 4: Organic blobs */}
                <svg className="bg-shape bg-shape-4" viewBox="0 0 400 400" fill="none">
                  <path
                    className="shape-element"
                    d="M100 100 Q150 50, 200 100 Q250 150, 200 200 Q150 250, 100 200 Q50 150, 100 100"
                    fill="rgba(99,102,241,0.18)"
                  />
                  <path
                    className="shape-element"
                    d="M250 200 Q300 150, 350 200 Q400 250, 350 300 Q400 250, 350 300 Q300 350, 250 300 Q200 250, 250 200"
                    fill="rgba(236,72,153,0.15)"
                  />
                </svg>

                {/* Shape 5: Diagonal lines */}
                <svg className="bg-shape bg-shape-5" viewBox="0 0 400 400" fill="none">
                  <line className="shape-element" x1="0" y1="100" x2="300" y2="400" stroke="rgba(99,102,241,0.22)" strokeWidth="30" />
                  <line className="shape-element" x1="100" y1="0" x2="400" y2="300" stroke="rgba(139,92,246,0.18)" strokeWidth="25" />
                  <line className="shape-element" x1="200" y1="0" x2="400" y2="200" stroke="rgba(236,72,153,0.15)" strokeWidth="20" />
                </svg>
              </div>
            </div>

            <div className="menu-content-wrapper">
              <ul className="menu-list">
                {items.map((item, index) => {
                  const shapeNum = item.shape || (index % 5) + 1;
                  const isFade = index === 3;
                  const isRouterLink = Boolean(item.to);

                  return (
                    <li key={item.label} className="menu-list-item" data-shape={shapeNum}>
                      {isRouterLink ? (
                        <Link to={item.to!} className="nav-link w-inline-block" onClick={closeMenu}>
                          <p className="nav-link-text" data-menu-fade={isFade ? true : undefined}>
                            {item.label}
                          </p>
                          <div className="nav-link-hover-bg"></div>
                        </Link>
                      ) : (
                        <a href={item.href || "#"} className="nav-link w-inline-block" onClick={closeMenu}>
                          <p className="nav-link-text" data-menu-fade={isFade ? true : undefined}>
                            {item.label}
                          </p>
                          <div className="nav-link-hover-bg"></div>
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </nav>
        </div>
      </section>
    </div>
  );
}

export default Component;
