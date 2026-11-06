import { motion, useReducedMotion } from "framer-motion";
import { logoIconsList, testimonials } from "../constants";
import RatingStars from "../components/ui/RatingStars";

const EASE = [0.4, 0, 0.2, 1];
const tween = (delay) => ({ type: "tween", duration: 0.6, delay, ease: EASE });

// The section pops up first, then the avatars ripple in from the rightmost one.
const SECTION_SPRING = { type: "spring", stiffness: 500, damping: 100, mass: 1 };
const AVATAR_ENTRANCES = [
  { x: -5, delay: 0.7 },
  { x: -10, delay: 0.6 },
  { x: -15, delay: 0.5 },
  { x: -5, delay: 0.4 },
  { x: -5, delay: 0.3 },
];
const RATING_DELAY = 0.2;
const LOGOS_DELAY = 0.6;

const ratings = testimonials.flatMap(({ rating }) => (rating === undefined ? [] : [rating]));
const averageRating = ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;

// Plays once when half of the element is on screen; no animation with reduced motion.
const useReveal = () => {
  const reduceMotion = useReducedMotion();

  return (initial, transition) =>
    reduceMotion
      ? {}
      : {
          initial,
          whileInView: { opacity: 1, x: 0, scale: 1 },
          viewport: { once: true, amount: 0.5 },
          transition,
        };
};

// The track holds two identical groups and slides by half its width, so the loop is seamless.
const LogoGroup = ({ duplicate = false }) => (
  <ul className="logo-ticker__group" aria-hidden={duplicate || undefined}>
    {logoIconsList.map((icon) => (
      <li key={icon.name} className="flex flex-none items-center gap-2.5">
        <img src={icon.imgPath} alt="" draggable="false" className="size-7 max-w-none object-contain" />
        <span className="text-base font-medium text-white">{icon.name}</span>
      </li>
    ))}
  </ul>
);

const ReviewsBadge = () => {
  const reveal = useReveal();

  return (
    <a
      href="#feedback"
      aria-label="View my testimonials"
      className="flex flex-none flex-col items-center gap-2 min-[810px]:w-[284px] min-[810px]:flex-row min-[810px]:gap-4"
    >
      <span className="flex flex-none pl-2.5" aria-hidden="true">
        {testimonials.slice(0, AVATAR_ENTRANCES.length).map((testimonial, index) => (
          <motion.img
            key={testimonial.name}
            src={testimonial.imgPath}
            alt=""
            className="-ml-2.5 size-8 rounded-full object-cover ring-2 ring-black"
            {...reveal({ opacity: 0, x: AVATAR_ENTRANCES[index].x }, tween(AVATAR_ENTRANCES[index].delay))}
          />
        ))}
      </span>
      <motion.span
        className="flex flex-col items-center gap-1.5 min-[810px]:items-start"
        {...reveal({ opacity: 0, x: 20 }, tween(RATING_DELAY))}
      >
        <RatingStars rating={averageRating} sizeClassName="size-3" />
        <span className="text-sm text-white/90">{testimonials.length} client reviews</span>
      </motion.span>
    </a>
  );
};

const LogoShowcase = () => {
  const reveal = useReveal();

  return (
    <section
      aria-label="Tools I work with"
      className="flex flex-col items-center px-4 py-12 md:px-6 md:pb-8 md:pt-16 xl:px-8 xl:py-20"
    >
      <motion.div
        className="flex w-full max-w-[1440px] flex-col items-center gap-6"
        {...reveal({ opacity: 0, scale: 0.5 }, SECTION_SPRING)}
      >
        <p className="text-sm font-medium uppercase tracking-[0.12em] text-white">
          Tools I work with
        </p>

        <div className="flex w-full flex-col items-center gap-16 py-8 min-[810px]:flex-row min-[810px]:gap-6">
          <ReviewsBadge />

          {/* The fade sits on its own wrapper so the ticker keeps its resting 70% opacity. */}
          <motion.div
            className="w-full min-w-0 flex-1"
            {...reveal({ opacity: 0.001 }, tween(LOGOS_DELAY))}
          >
            <div className="logo-ticker opacity-70">
              <div className="logo-ticker__track">
                <LogoGroup />
                <LogoGroup duplicate />
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default LogoShowcase;
