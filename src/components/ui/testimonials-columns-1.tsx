import { motion, useReducedMotion } from "motion/react";
import RatingStars from "./RatingStars";

export type TestimonialItem = {
  name: string;
  mentions: string;
  rating: number;
  review: string;
  imgPath: string;
  imageAlt?: string;
};

type TestimonialsColumnProps = {
  testimonials: TestimonialItem[];
  duration?: number;
  className?: string;
};

export function TestimonialsColumn({
  testimonials,
  duration = 15,
  className = "",
}: TestimonialsColumnProps) {
  const reduceMotion = useReducedMotion();

  if (testimonials.length === 0) return null;

  const items = reduceMotion ? testimonials : [...testimonials, ...testimonials];

  return (
    <div className={`min-w-0 flex-1 overflow-hidden ${className}`}>
      <motion.div
        initial={false}
        animate={reduceMotion ? undefined : { y: "-50%" }}
        transition={reduceMotion ? undefined : { duration, repeat: Infinity, ease: "linear", repeatType: "loop" }}
        className="flex flex-col gap-6 pb-6"
      >
        {items.map((testimonial, index) => {
          const duplicate = index >= testimonials.length;

          return (
            <article
              key={`${testimonial.name}-${index}`}
              aria-hidden={duplicate}
              className="w-full rounded-3xl border border-white/10 bg-[#16161b] p-6 shadow-lg shadow-primary/10 sm:p-8"
            >
              <RatingStars rating={testimonial.rating} sizeClassName="size-4" />
              <p className="mt-5 text-[15px] leading-relaxed text-white/85">{testimonial.review}</p>
              <div className="mt-6 flex items-center gap-3">
                <img
                  width={40}
                  height={40}
                  src={testimonial.imgPath}
                  alt={duplicate ? "" : testimonial.imageAlt ?? `Avatar for ${testimonial.name}`}
                  loading="lazy"
                  decoding="async"
                  className="size-10 rounded-full border border-white/10 object-cover"
                />
                <div className="min-w-0">
                  <p className="font-medium leading-5 tracking-tight text-white">{testimonial.name}</p>
                  <p className="mt-0.5 text-sm leading-5 text-white/60">{testimonial.mentions}</p>
                </div>
              </div>
            </article>
          );
        })}
      </motion.div>
    </div>
  );
}

export default TestimonialsColumn;
