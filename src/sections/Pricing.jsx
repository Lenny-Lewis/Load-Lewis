import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { services } from "../constants";

const EASE = [0.16, 1, 0.3, 1];
const TIER_LINK =
  "rounded-lg bg-white/10 px-4 py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary hover:text-primary-foreground";

const TierCard = ({ tier }) => (
  <article
    className={`card-dark relative flex flex-col rounded-xl p-6 md:p-7 ${tier.recommended ? "border-primary/70" : ""}`}
  >
    {tier.recommended && (
      <span className="absolute right-5 top-5 rounded-full bg-primary/20 px-2.5 py-1 text-xs font-medium text-white">
        Recommended
      </span>
    )}
    <h3 className="pr-24 text-lg font-semibold leading-snug text-white">{tier.name}</h3>
    <p className="mt-4 flex items-baseline gap-1.5 text-white">
      <span className="text-sm text-white-50">From</span>
      <span className="text-4xl font-semibold tracking-[-0.02em]">{tier.price}</span>
    </p>
    <ul className="mb-6 mt-6 flex flex-1 flex-col gap-3">
      {tier.features.map((feature) => (
        <li key={feature} className="flex items-start gap-2.5 text-[15px] leading-snug text-white-50">
          <Check aria-hidden="true" className="mt-0.5 size-4 flex-none text-primary" strokeWidth={2.5} />
          <span>{feature}</span>
        </li>
      ))}
    </ul>
    {tier.link ? (
      <Link to={tier.link} className={TIER_LINK}>
        View project
      </Link>
    ) : (
      <a href="#contact" className={TIER_LINK}>
        Get started
      </a>
    )}
  </article>
);

const Pricing = () => {
  const reduceMotion = useReducedMotion();
  const [selectedName, setSelectedName] = useState(services[0].name);
  const selected = services.find((service) => service.name === selectedName);
  const initial = reduceMotion ? false : { opacity: 0, y: 20 };

  return (
    <section id="pricing" className="padding-x-lg mt-24 md:mt-32">
      <div className="mx-auto w-full max-w-[1280px]">
        <motion.div
          initial={initial}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <h2 className="text-4xl font-semibold tracking-[-0.02em] text-white md:text-6xl">Pricing</h2>
          <p className="mt-4 max-w-2xl text-base text-white-50 md:text-lg">
            Choose a service, then the level that fits your project. The more advanced the build, the
            higher the tier.
          </p>

          <div role="group" aria-label="Choose a service" className="mt-8 flex flex-wrap gap-2">
            {services.map(({ name }) => (
              <button
                key={name}
                type="button"
                aria-pressed={name === selectedName}
                onClick={() => setSelectedName(name)}
                className={`cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary ${
                  name === selectedName
                    ? "bg-primary text-primary-foreground"
                    : "bg-white/10 text-white-50 hover:text-white"
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </motion.div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={selectedName}
            className={`mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 ${
              selected.tiers.length === 4 ? "xl:grid-cols-4" : "lg:grid-cols-3"
            }`}
            initial={initial}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: -10 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            {selected.tiers.map((tier) => (
              <TierCard key={tier.name} tier={tier} />
            ))}
          </motion.div>
        </AnimatePresence>

        <p className="mt-6 text-sm text-white-50">
          {selected.pricingNote ?? "Starting prices in USD. Your final quote depends on the project."}
        </p>
      </div>
    </section>
  );
};

export default Pricing;
