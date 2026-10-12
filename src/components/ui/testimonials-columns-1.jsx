import React from "react";
import { motion } from "motion/react";
import RatingStars from "./RatingStars";

const TestimonialsColumn = ({ testimonials, duration = 10, className = "" }) => (
  <div className={`min-w-0 overflow-hidden ${className}`}>
    <motion.div
      animate={{ translateY: "-50%" }}
      transition={{ duration, repeat: Infinity, ease: "linear", repeatType: "loop" }}
      className="flex flex-col gap-6 pb-6"
    >
      {[0, 1].map((copy) => (
        <React.Fragment key={copy}>
          {testimonials.map(({ review, imgPath, name, mentions, rating, imageAlt }, index) => (
            <article
              className="w-full max-w-sm rounded-3xl border border-white/10 bg-[#16161b] p-6 shadow-lg shadow-primary/10"
              key={`${copy}-${name}-${index}`}
              aria-hidden={copy === 1}
            >
              <RatingStars rating={rating} sizeClassName="size-4" />
              <p className="mt-5 text-[15px] leading-relaxed text-white/85">{review}</p>
              <div className="mt-6 flex items-center gap-3">
                <img
                  width={40}
                  height={40}
                  src={imgPath}
                  alt={copy === 1 ? "" : imageAlt ?? `Avatar for ${name}`}
                  className="size-10 rounded-full border border-white/10 object-cover"
                />
                <div className="flex min-w-0 flex-col">
                  <div className="font-medium leading-5 tracking-tight">{name}</div>
                  <div className="truncate text-sm leading-5 tracking-tight text-white/60">{mentions}</div>
                </div>
              </div>
            </article>
          ))}
        </React.Fragment>
      ))}
    </motion.div>
  </div>
);

export default TestimonialsColumn;
