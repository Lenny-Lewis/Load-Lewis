import { useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

/**
 * Shared-element lightbox for the Graphics Design grid.
 *
 * Sizing contract: the caller supplies the piece's intrinsic `width`/`height`
 * so the browser knows the true ratio before a byte of the image arrives. The
 * artwork is rendered `w-auto h-auto` with max-width/max-height constraints,
 * which makes the UA shrink it proportionally to fit — the *full* piece is
 * always visible here, never the 4/5 crop the grid frame uses.
 *
 * Backdrop and content are siblings rather than parent/child on purpose:
 * `backdrop-filter` blurs what is *behind* an element, but keeping the
 * caption outside the filtered subtree guarantees the description stays
 * crisp and un-dimmed regardless of engine quirks.
 */
const GraphicLightbox = ({ project, onClose, onExited }) => {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef(null);
  const isOpen = Boolean(project);

  // Lock background scroll while open, restoring the *previous* inline value
  // so we never clobber App.jsx's preloader scroll lock.
  useEffect(() => {
    if (!isOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  // Escape to close.
  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Move focus into the dialog on open (WAI-ARIA dialog pattern). The close
  // button is the first tabbable child, so Tab lands there naturally.
  useEffect(() => {
    if (!isOpen) return undefined;
    const frame = window.requestAnimationFrame(() => dialogRef.current?.focus());
    return () => window.cancelAnimationFrame(frame);
  }, [isOpen]);

  // Reduced motion => no layout/shared-element morph, no crossfade.
  const layoutId = project && !reduceMotion ? `graphic-frame-${project.id}` : undefined;
  const fade = reduceMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: [0.16, 1, 0.3, 1] };

  return (
    <AnimatePresence onExitComplete={onExited}>
      {isOpen && (
        /* The overlay *is* the dialog, so the close button lives inside its
           accessibility subtree — Tab can never reach anything outside it. */
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${project.title} — enlarged view`}
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={fade}
          /* Anything that isn't the artwork itself dismisses: the backdrop, the
             gutter around the frame, and the caption block. On mobile the
             content column spans ~94vw, so this is the tap-outside target. */
          onClick={(event) => {
            if (!event.target.closest("[data-lightbox-artwork]")) onClose();
          }}
          /* Focus trap. Without it Tab escapes to page links behind the
             overlay, which makes `aria-modal="true"` a lie for screen readers.
             The only tab stop in here is the close button, so Tab parks on it
             instead of walking into the blurred content behind. */
          onKeyDown={(event) => {
            if (event.key !== "Tab") return;
            const root = dialogRef.current;
            if (!root) return;
            const focusables = root.querySelectorAll(
              'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
            );
            if (focusables.length === 0) {
              event.preventDefault();
              root.focus();
              return;
            }
            const first = focusables[0];
            const last = focusables[focusables.length - 1];
            const active = document.activeElement;
            const outside = !root.contains(active) || active === root;
            if (event.shiftKey ? active === first || outside : active === last || outside) {
              event.preventDefault();
              (event.shiftKey ? last : first).focus();
            }
          }}
          className="fixed inset-0 z-[200] flex cursor-zoom-out items-center justify-center p-4 outline-none sm:p-6"
        >
          {/* Blur + dim everything behind (grid, navbar, footer, FAB). */}
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-black/85 backdrop-blur-md supports-[backdrop-filter]:bg-black/75"
          />

          <div className="relative z-10 flex max-h-full w-full max-w-[min(94vw,1200px)] cursor-default flex-col items-center gap-5 sm:gap-7">
            <motion.div
              layoutId={layoutId}
              data-lightbox-artwork
              className="relative flex max-h-[68vh] w-full items-center justify-center overflow-hidden rounded-2xl sm:max-h-[76vh] lg:max-h-[80vh]"
            >
              <img
                src={project.full}
                width={project.width}
                height={project.height}
                alt={`${project.title} — ${project.desc}`}
                decoding="async"
                draggable={false}
                className="h-auto max-h-[68vh] w-auto max-w-full select-none object-contain sm:max-h-[76vh] lg:max-h-[80vh]"
              />
            </motion.div>

            <div className="w-full max-w-2xl px-1 text-center">
              <h3 className="text-xl font-bold tracking-tight text-white sm:text-2xl md:text-3xl">
                {project.title}
              </h3>
              {project.desc && (
                <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-white-50 sm:text-base">
                  {project.desc}
                </p>
              )}
            </div>
          </div>

          <motion.button
            type="button"
            aria-label={`Close enlarged view of ${project.title}`}
            onClick={onClose}
            initial={{ opacity: 0, scale: reduceMotion ? 1 : 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reduceMotion ? 1 : 0.85 }}
            transition={reduceMotion ? { duration: 0 } : { duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="absolute right-4 top-4 z-20 flex size-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-[#111] text-white shadow-2xl transition-colors hover:bg-white hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#cda144] sm:right-8 sm:top-8"
          >
            <X className="size-5" aria-hidden="true" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GraphicLightbox;