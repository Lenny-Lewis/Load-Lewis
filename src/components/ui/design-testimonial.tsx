import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import RatingStars from "./RatingStars";
import type { TestimonialItem } from "./testimonials-columns-1";

type TestimonialProps = {
  testimonials: TestimonialItem[];
};

export function Testimonial({ testimonials }: TestimonialProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { damping: 25, stiffness: 200 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 200 });
  const numberX = useTransform(springX, [-200, 200], [-20, 20]);
  const numberY = useTransform(springY, [-200, 200], [-10, 10]);

  useEffect(() => {
    if (reduceMotion || paused || testimonials.length < 2) return;
    const timer = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % testimonials.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [activeIndex, paused, reduceMotion, testimonials.length]);

  if (testimonials.length === 0) return null;

  const current = testimonials[activeIndex % testimonials.length];
  const ticker = testimonials.map((item) => item.name).join("  •  ");

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set(event.clientX - (rect.left + rect.width / 2));
    mouseY.set(event.clientY - (rect.top + rect.height / 2));
  };

  const goNext = () => setActiveIndex((index) => (index + 1) % testimonials.length);
  const goPrev = () => setActiveIndex((index) => (index - 1 + testimonials.length) % testimonials.length);

  return (
    <section id="feedback" aria-labelledby="feedback-heading" className="relative w-full overflow-hidden bg-black px-5 py-24 md:px-10 md:py-28">
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => {
          setPaused(false);
          mouseX.set(0);
          mouseY.set(0);
        }}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
        }}
        className="relative mx-auto w-full max-w-5xl"
      >
        <h2 id="feedback-heading" className="text-center text-3xl font-bold tracking-tighter text-white sm:text-4xl lg:text-5xl">
          Feedback
        </h2>

        <div className="relative mt-14 min-h-[420px] sm:mt-16">
          <motion.div
            aria-hidden="true"
            className="pointer-events-none absolute -left-4 top-1/2 -translate-y-1/2 select-none text-[clamp(11rem,36vw,28rem)] font-bold leading-none tracking-tighter text-white/[0.035] sm:-left-10"
            style={reduceMotion ? undefined : { x: numberX, y: numberY }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={activeIndex}
                initial={reduceMotion ? false : { opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={reduceMotion ? undefined : { opacity: 0, scale: 1.1, filter: "blur(10px)" }}
                transition={{ duration: reduceMotion ? 0 : 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="block"
              >
                {String(activeIndex + 1).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </motion.div>

          <div className="relative flex">
            <div className="hidden shrink-0 flex-col items-center justify-center border-r border-white/15 pr-10 sm:flex md:pr-16">
              <span className="text-xs font-mono uppercase tracking-widest text-white/50" style={{ writingMode: "vertical-rl" }}>
                Feedback
              </span>
              <div className="relative mt-8 h-32 w-px bg-white/15">
                <motion.div
                  className="absolute left-0 top-0 w-full bg-primary"
                  animate={{ height: `${((activeIndex + 1) / testimonials.length) * 100}%` }}
                  transition={{ duration: reduceMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
                />
              </div>
            </div>

            <div className="min-w-0 flex-1 py-6 sm:pl-10 sm:py-12 md:pl-16">
              <div className="relative mb-10 min-h-[170px] sm:mb-12 sm:min-h-[150px]">
                <AnimatePresence mode="wait">
                  <motion.blockquote
                    key={`quote-${activeIndex}`}
                    initial={reduceMotion ? false : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduceMotion ? undefined : { opacity: 0 }}
                    transition={{ duration: reduceMotion ? 0 : 0.25 }}
                    className="text-3xl font-light leading-[1.15] tracking-tight text-white sm:text-4xl md:text-5xl"
                  >
                    {current.review.split(" ").map((word, index) => (
                      <motion.span
                        key={`${word}-${index}`}
                        className="mr-[0.3em] inline-block"
                        initial={reduceMotion ? false : { opacity: 0, y: 20, rotateX: 90 }}
                        animate={{ opacity: 1, y: 0, rotateX: 0 }}
                        exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
                        transition={{ duration: reduceMotion ? 0 : 0.5, delay: reduceMotion ? 0 : index * 0.035, ease: [0.22, 1, 0.36, 1] }}
                      >
                        {word}
                      </motion.span>
                    ))}
                  </motion.blockquote>
                </AnimatePresence>
              </div>

              <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`author-${activeIndex}`}
                    initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={reduceMotion ? undefined : { opacity: 0, y: -20 }}
                    transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : 0.1 }}
                    className="flex items-center gap-4"
                  >
                    <div className="h-px w-6 bg-white sm:w-8" />
                    <img
                      src={current.imgPath}
                      alt={current.imageAlt ?? `Avatar for ${current.name}`}
                      width={48}
                      height={48}
                      className="size-12 rounded-full border border-white/15 object-cover"
                    />
                    <div>
                      <p className="font-medium text-white">{current.name}</p>
                      <RatingStars rating={current.rating} sizeClassName="size-3.5" />
                    </div>
                  </motion.div>
                </AnimatePresence>

                <div className="flex items-center gap-3 sm:gap-4">
                  <motion.button
                    type="button"
                    onClick={goPrev}
                    aria-label="Previous featured testimonial"
                    whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                    className="group grid size-12 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-primary/70 hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <ArrowLeft className="size-5" aria-hidden="true" />
                  </motion.button>
                  <motion.button
                    type="button"
                    onClick={goNext}
                    aria-label="Next featured testimonial"
                    whileTap={reduceMotion ? undefined : { scale: 0.95 }}
                    className="group grid size-12 place-items-center rounded-full border border-white/20 text-white transition-colors hover:border-primary/70 hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                  >
                    <ArrowRight className="size-5" aria-hidden="true" />
                  </motion.button>
                  <span className="ml-1 text-sm tabular-nums text-white/50">{activeIndex + 1} / {testimonials.length}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div aria-hidden="true" className="pointer-events-none mt-12 overflow-hidden text-5xl font-bold tracking-tight text-white/[0.08] sm:text-6xl">
          <motion.div
            className="flex w-max whitespace-nowrap"
            animate={reduceMotion ? undefined : { x: ["0%", "-50%"] }}
            transition={reduceMotion ? undefined : { duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <span className="shrink-0 pr-8">{ticker}  •  </span>
            <span className="shrink-0 pr-8">{ticker}  •  </span>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
