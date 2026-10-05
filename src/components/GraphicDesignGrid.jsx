import { useCallback, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import GraphicLightbox from "@/components/GraphicLightbox";

const EASE_OUT = [0.16, 1, 0.3, 1];

/**
 * Uniform grid for the Graphics Design pieces.
 *
 * Every frame is an identical `aspect-[4/5]` box with `object-cover`, so
 * posters with different intrinsic ratios (4:5, A-series, ~15:16) all fill
 * their cell identically, centre-cropped, with no distortion. The fixed
 * aspect ratio reserves the frame's space up front, so nothing reflows when
 * the image lands — plus explicit width/height give the browser the intrinsic
 * ratio before the fetch completes.
 *
 * Columns: 2 (mobile) / 3 (tablet) / 4 (desktop).
 */
const GraphicDesignGrid = ({ projects }) => {
  const reduceMotion = useReducedMotion();
  const [activeId, setActiveId] = useState(null);

  // Triggers are tracked by id in a Map, not via a single conditional `ref`.
  // A conditional ref detaches as soon as activeId clears, which happens
  // *before* the exit animation finishes — so focus return would find null.
  const triggerNodes = useRef(new Map());
  const lastOpenedId = useRef(null);

  const activeProject = projects.find((item) => item.id === activeId) ?? null;

  const handleOpen = useCallback((project) => {
    lastOpenedId.current = project.id;
    setActiveId(project.id);
  }, []);

  // Focus returns to the originating thumbnail only after the close
  // animation finishes, so it never lands behind a still-visible backdrop.
  const handleClose = useCallback(() => setActiveId(null), []);
  const handleExited = useCallback(() => {
    const node = triggerNodes.current.get(lastOpenedId.current);
    if (node && document.contains(node)) node.focus();
  }, []);

  const registerTrigger = useCallback(
    (id) => (element) => {
      if (element) triggerNodes.current.set(id, element);
      else triggerNodes.current.delete(id);
    },
    []
  );

  // Warm the cache on intent so the expanded view paints instantly.
  const preload = useCallback((src) => {
    if (!src) return;
    const image = new Image();
    image.src = src;
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 28 },
    visible: (index) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.55,
        ease: EASE_OUT,
        delay: reduceMotion ? 0 : Math.min(index, 8) * 0.08,
      },
    }),
  };

  return (
    <>
      <div className="grid w-full grid-cols-2 gap-5 md:grid-cols-3 md:gap-8 lg:grid-cols-4 lg:gap-10">
        {projects.map((project, index) => (
          <motion.button
            key={project.id}
            ref={registerTrigger(project.id)}
            type="button"
            onClick={() => handleOpen(project)}
            onPointerEnter={() => preload(project.full)}
            onFocus={() => preload(project.full)}
            aria-haspopup="dialog"
            custom={index}
            initial={reduceMotion ? "visible" : "hidden"}
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={cardVariants}
            className="group flex cursor-pointer flex-col gap-4 text-left focus-visible:outline-none"
          >
            <motion.div
              layoutId={reduceMotion ? undefined : `graphic-frame-${project.id}`}
              className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-[#141417] ring-1 ring-white/5 transition-[box-shadow] duration-500 ease-out group-hover:shadow-[0_18px_50px_rgba(0,0,0,0.55)] group-hover:ring-[#cda144]/40 group-focus-visible:ring-2 group-focus-visible:ring-[#cda144]"
            >
              <img
                src={project.thumb}
                srcSet={`${project.thumb} ${project.thumbW}w, ${project.full} ${project.fullW}w`}
                sizes="(min-width: 1280px) 290px, (min-width: 1024px) 24vw, (min-width: 768px) 32vw, 46vw"
                width={project.width}
                height={project.height}
                alt={project.title}
                loading="lazy"
                decoding="async"
                draggable={false}
                className="size-full object-cover object-center transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
              />

              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-inset ring-white/10"
              />
            </motion.div>

            <div className="flex flex-col gap-1.5 px-1">
              <h3 className="text-base font-bold text-white transition-colors duration-300 group-hover:text-[#cda144] md:text-lg">
                {project.title}
              </h3>
              {project.desc && (
                <p className="text-sm leading-relaxed text-white-50">{project.desc}</p>
              )}
            </div>
          </motion.button>
        ))}
      </div>

      <GraphicLightbox
        project={activeProject}
        onClose={handleClose}
        onExited={handleExited}
      />
    </>
  );
};

export default GraphicDesignGrid;