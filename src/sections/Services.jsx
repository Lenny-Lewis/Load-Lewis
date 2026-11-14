import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { services } from "../constants";
import { track } from "../lib/analytics";

const REVEAL = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

const Services = () => {
  const reduceMotion = useReducedMotion();
  const reveal = {
    variants: REVEAL,
    initial: reduceMotion ? "visible" : "hidden",
    whileInView: "visible",
    viewport: { once: true, amount: 0.3 },
  };

  return (
    <section id="services" className="padding-x-lg mt-24 md:mt-32">
      <div className="mx-auto w-full max-w-[1180px]">
        <motion.h2
          className="mb-10 text-4xl font-semibold tracking-[-0.02em] text-white md:mb-14 md:text-6xl"
          {...reveal}
        >
          Services
        </motion.h2>

        <ul className="flex flex-col">
          {services.map(({ name, categories }) => (
            <motion.li
              key={name}
              className="flex flex-col gap-3 border-b border-white/10 py-5 lg:min-h-24 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:py-4"
              {...reveal}
            >
              <h3 className="text-2xl font-medium tracking-[-0.02em] text-white md:text-3xl">{name}</h3>
              <p className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-base tracking-[-0.02em] text-white-50 md:text-lg">
                {categories.map((category, index) => (
                  <Fragment key={category}>
                    {index > 0 && <span aria-hidden="true" className="size-1 rounded-full bg-white-50" />}
                    <span>{category}</span>
                  </Fragment>
                ))}
              </p>
            </motion.li>
          ))}
        </ul>

        <motion.div className="mt-8 flex justify-end" {...reveal}>
          <a
            href="#pricing"
            onClick={() => track("services_to_pricing")}
            className="group flex w-fit items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white"
          >
            See pricing
            <span className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
