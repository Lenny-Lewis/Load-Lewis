import { useLayoutEffect, useRef, useState } from "react";
import { Router, UNSAFE_createBrowserHistory as createBrowserHistory } from "react-router-dom";
import { animate, motion, useMotionValue, useMotionTemplate } from "framer-motion";
import { PageRevealContext } from "@/hooks/usePageRevealed";

/**
 * Page-to-page transition in the style of the Work page's tab switch:
 *
 *   out      the old page blurs out in place (6px, 0.2s, ease-in)
 *   swap     the new page mounts underneath while the screen is dark
 *   in       the new page comes into focus from a 10px blur (0.5s, ease-out)
 *
 * The blur is a full-screen veil with a backdrop filter rather than a filter on the
 * page itself: a filter on the page would make fixed elements (the nav pill, the
 * WhatsApp button) jump, because it changes what they're positioned against.
 *
 * It replaces BrowserRouter: the router keeps rendering the old location until the
 * screen is dark, so every link, back/forward and hash link to another page goes
 * through it without touching individual links. It only plays when moving between
 * the site's top-level areas (see siteArea); moving within an area, such as opening
 * a project from Work or an article from Thoughts, swaps instantly, as do hash or
 * query changes on the same page. Reduced-motion visitors always get an instant swap.
 */

// The same timing as the Work page's tab panels.
const OUT = { blur: 6, duration: 0.2, ease: "easeIn" };
const IN = { blur: 10, duration: 0.5, ease: [0.22, 1, 0.36, 1] };
const PAGE_BACKGROUND = "0 0 0"; // the site's black, as RGB for the veil

const nextFrame = () => new Promise((resolve) => requestAnimationFrame(() => resolve()));

/**
 * The top-level area ("tab") a path belongs to. The transition plays only when this
 * changes, so browsing projects or articles inside one area stays instant.
 */
const AREA_PREFIXES = [
  ["work", ["/work"]],
  ["thoughts", ["/thoughts", "/article"]],
  ["comments", ["/comments"]],
];
const siteArea = (pathname) =>
  AREA_PREFIXES.find(([, prefixes]) =>
    prefixes.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))
  )?.[0] ?? "home";

const prefersReducedMotion = () => window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;

const BlurVeil = ({ blur, dark }) => {
  const backdropFilter = useMotionTemplate`blur(${blur}px)`;
  const backgroundColor = useMotionTemplate`rgb(${PAGE_BACKGROUND} / ${dark})`;
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-auto fixed inset-0 z-[300]"
      style={{ backdropFilter, WebkitBackdropFilter: backdropFilter, backgroundColor }}
    />
  );
};

export const PageTransitionRouter = ({ children }) => {
  const historyRef = useRef(null);
  if (historyRef.current == null) {
    historyRef.current = createBrowserHistory({ window, v5Compat: true });
  }
  const history = historyRef.current;

  const [shown, setShown] = useState({ action: history.action, location: history.location });
  const [veiled, setVeiled] = useState(false);
  const [revealed, setRevealed] = useState(true);

  const shownRef = useRef(shown);
  const latestRef = useRef(shown);
  const runningRef = useRef(false);

  const blur = useMotionValue(0);
  const dark = useMotionValue(0);

  const show = (update) => {
    shownRef.current = update;
    setShown(update);
  };

  const runTransition = async () => {
    runningRef.current = true;
    blur.set(0);
    dark.set(0);
    setRevealed(false);
    setVeiled(true);

    // The old page blurs out.
    await Promise.all([
      animate(blur, OUT.blur, { duration: OUT.duration, ease: OUT.ease }),
      animate(dark, 1, { duration: OUT.duration, ease: OUT.ease }),
    ]);

    // Swap while the screen is dark, and let the new page lay out and scroll first.
    show(latestRef.current);
    await nextFrame();
    await nextFrame();

    // The new page comes into focus.
    blur.set(IN.blur);
    setRevealed(true);
    await Promise.all([
      animate(blur, 0, { duration: IN.duration, ease: IN.ease }),
      animate(dark, 0, { duration: IN.duration, ease: IN.ease }),
    ]);

    setVeiled(false);
    runningRef.current = false;
    handleLocation(latestRef.current); // catch a navigation made mid-transition
  };

  const handleLocation = (update) => {
    latestRef.current = update;
    if (runningRef.current) return; // picked up at the swap or when the transition ends
    if (update.location === shownRef.current.location) return;
    if (siteArea(update.location.pathname) === siteArea(shownRef.current.location.pathname) || prefersReducedMotion()) {
      show(update);
      return;
    }
    runTransition();
  };

  const handleRef = useRef(handleLocation);
  handleRef.current = handleLocation;
  useLayoutEffect(() => history.listen((update) => handleRef.current(update)), [history]);

  return (
    <PageRevealContext.Provider value={revealed}>
      <Router location={shown.location} navigationType={shown.action} navigator={history}>
        {children}
      </Router>
      {veiled && <BlurVeil blur={blur} dark={dark} />}
    </PageRevealContext.Provider>
  );
};
