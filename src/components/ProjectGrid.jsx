/**
 * ProjectGrid — shared work-project grid used by BOTH the homepage Showcase
 * section and the Work page's "All Projects" tab.
 *
 * Why one component: these two grids were previously near-identical inline JSX
 * that had already drifted apart (Showcase used `gap-10 lg:gap-16`, Work used
 * `gap-4 md:gap-10 lg:gap-16`, and only Work handled video). Centralising the
 * sizing means the next change lands in one place and can't diverge again.
 *
 * Layout (kept deliberately separate from the graphic-design grid, which is a
 * portrait poster layout and must stay 4/5):
 *   - container max-width: the site-wide `max-w-7xl` (1280px), matching the
 *     header and footer rather than introducing a second width token
 *   - 1 column mobile, 2 columns from md up
 *   - card frame: `aspect-[4/3]` with `object-cover`, so every mockup fills its
 *     cell edge to edge with no letterbox gaps.
 *
 * Why 4/3 and not 3/2: these mockups are overwhelmingly 4/3 (Mojito, Pawello,
 * Latte, Agenicy and Recueil are all exactly 1600x1200 / 1920x1440). At 3/2 the
 * taller box forced `object-cover` to trim 9-17% off the top and bottom, which
 * sliced straight through the mockups' own embedded navbars. Matching the
 * dominant source ratio at 4/3 reduces that to ~0-2% for most projects.
 *
 * A few outliers remain and will always lose a sliver, since one fixed frame
 * cannot fit every export: ZED Gaming is 1.25 and loses ~6% top/bottom, Vanguard
 * and Lithos 1.35 and NHM 1.3675 lose ~1-2.5% off the sides. `object-cover`
 * is kept deliberately: a filled grid reads better than letterboxed bands, and
 * the crop is confined to mockup margins rather than the artwork itself.
 *   - gap: `gap-5` (20px), consistent at every breakpoint
 *
 * `cardClassName` carries the reveal hook, because the two call sites drive
 * different animation strategies: Showcase uses GSAP ScrollTrigger via
 * `.framer-card`, Work re-runs a GSAP tween on tab change via
 * `.framer-card-work`.
 */
const ProjectGrid = ({
  projects,
  cardClassName = "framer-card",
  allowVideo = true,
}) => {
  if (!projects || projects.length === 0) return null;

  return (
    <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2">
      {projects.map((project) => (
        <a
          key={project.id}
          href={project.link || "#"}
          target={project.link ? "_blank" : "_self"}
          rel="noreferrer"
          className={`${cardClassName} group flex flex-col gap-5 block cursor-pointer`}
        >
          <div
            className={`w-full aspect-[4/3] rounded-3xl overflow-hidden relative flex items-center justify-center ${
              project.bg || "bg-[#141417]"
            }`}
          >
            {allowVideo && project.mediaType === "video" ? (
              <video
                src={project.img}
                poster={project.poster}
                aria-label={`${project.title} preview`}
                autoPlay
                muted
                loop
                playsInline
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
              />
            ) : (
              <img
                src={project.img}
                alt={project.title}
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src =
                    "https://placehold.co/800x600/282732/d9ecff?text=Project+Preview";
                }}
              />
            )}
            <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none" />
          </div>

          <div className="flex flex-col gap-2 px-2">
            <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#cda144] transition-colors duration-300">
              {project.title}
            </h3>
            {project.desc && (
              <p className="text-white-50 text-sm md:text-base leading-relaxed">
                {project.desc}
              </p>
            )}
          </div>
        </a>
      ))}
    </div>
  );
};

export default ProjectGrid;