import { useEffect, useId, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion, type Variants } from "framer-motion";
import NumberFlow from "@number-flow/react";
import { CheckCheck } from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TimelineContent } from "@/components/ui/timeline-animation";
import { VerticalCutReveal } from "@/components/ui/vertical-cut-reveal";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/utils";
import ContactChoices from "@/components/ContactChoices";
import { useDismiss } from "@/hooks/useDismiss";

export type PricingTier = {
  name: string;
  price: string; // "$1,200"
  description?: string;
  recommended?: boolean;
  features: string[];
  /** A project page: the card's button opens it instead of the contact form. */
  link?: string;
};

export type PricingService = {
  name: string;
  tiers: PricingTier[];
  pricingNote?: string;
};

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const toNumber = (price: string) => Number(price.replace(/[^0-9.]/g, ""));
const USD = { style: "currency", currency: "USD", maximumFractionDigits: 0 } as const;

// Blur-in from above, in sequence: heading text, switch, then each card. The filter is
// cleared at the end, as on the Work page, so nothing inside gets trapped by it.
const revealVariants: Variants = {
  hidden: { filter: "blur(10px)", y: -20, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: { delay: i * 0.15, duration: 0.5, ease: EASE_OUT },
    transitionEnd: { filter: "none" },
  }),
};

const ServiceSwitch = ({
  services,
  selected,
  onSelect,
}: {
  services: PricingService[];
  selected: string;
  onSelect: (name: string) => void;
}) => (
  <div role="group" aria-label="Choose a service" className="flex flex-wrap gap-1">
    {services.map(({ name }) => {
      const active = name === selected;
      return (
        <button
          key={name}
          type="button"
          aria-pressed={active}
          onClick={() => onSelect(name)}
          className={cn(
            "relative h-10 cursor-pointer rounded-full px-4 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:h-11 sm:px-5",
            active ? "text-primary-foreground" : "text-white-50 hover:text-white"
          )}
        >
          {active && (
            <motion.span
              layoutId="pricing-service-switch"
              className="absolute inset-0 rounded-full bg-primary"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <span className="relative">{name}</span>
        </button>
      );
    })}
  </div>
);

const TierCard = ({
  tier,
  service,
  open,
  onToggle,
  choicesId,
}: {
  tier: PricingTier;
  service: string;
  open: boolean;
  onToggle: () => void;
  choicesId: string;
}) => {
  const popular = Boolean(tier.recommended);
  const button = cn(
    "block w-full cursor-pointer rounded-xl p-4 text-center text-lg font-semibold transition-[filter,transform] hover:brightness-110 active:scale-[0.99]",
    popular
      ? "bg-primary text-primary-foreground"
      : "border border-white/10 bg-gradient-to-t from-neutral-900 to-neutral-700 text-white shadow-lg shadow-black/50"
  );

  return (
    <Card
      className={cn(
        "relative flex h-full flex-col justify-between rounded-xl pt-4",
        popular
          ? "z-10 border-transparent bg-[#150e26] text-white ring-2 ring-primary lg:scale-105"
          : "border-none bg-transparent text-white shadow-none"
      )}
    >
      <CardContent className="pt-0">
        <div className="space-y-2 pb-3">
          {popular && (
            <span className="inline-block rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
              Recommended
            </span>
          )}
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm text-white-50">From</span>
            <NumberFlow value={toNumber(tier.price)} format={USD} className="text-4xl font-semibold tracking-[-0.02em]" />
          </div>
        </div>

        <h3 className="mb-2 text-2xl font-semibold leading-snug tracking-[-0.02em]">{tier.name}</h3>
        {tier.description && <p className="mb-4 text-sm text-white-50">{tier.description}</p>}

        <div className="space-y-3 border-t border-white/10 pt-4">
          <h4 className="mb-3 text-base font-medium">What's included:</h4>
          <ul className="space-y-2">
            {tier.features.map((feature) => (
              <li key={feature} className="flex items-start">
                <span
                  className={cn(
                    "mr-3 mt-0.5 grid size-6 flex-none place-content-center rounded-full border",
                    popular ? "border-primary/60 bg-primary/25 text-white" : "border-white/30 bg-white/5 text-white"
                  )}
                >
                  <CheckCheck aria-hidden="true" className="size-4" />
                </span>
                <span className="text-sm leading-6 text-white/80">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
      <CardFooter className="pt-4">
        {tier.link ? (
          <Link
            to={tier.link}
            className={button}
            onClick={() => track("pricing_view_project", { pricing_service: service, pricing_tier: tier.name })}
          >
            View project
          </Link>
        ) : (
          <button
            type="button"
            aria-expanded={open}
            aria-controls={choicesId}
            className={button}
            onClick={() => {
              if (!open) track("pricing_get_started", { pricing_service: service, pricing_tier: tier.name });
              onToggle();
            }}
          >
            Get started
          </button>
        )}
      </CardFooter>
    </Card>
  );
};

/**
 * A card and, below it, the ways to reach Lennox once "Get started" is pressed. The two
 * sit in rows shared across the grid, so opening one card's choices pushes the page
 * down without moving the other cards' buttons.
 */
const TierSlot = ({ tier, service, index, timelineRef }: { tier: PricingTier; service: string; index: number; timelineRef: React.RefObject<HTMLDivElement | null> }) => {
  const [open, setOpen] = useState(false);
  const choicesId = useId();
  const slotRef = useRef<HTMLDivElement>(null);
  useDismiss(open, setOpen, slotRef);
  // Cards are reused across services (so prices count), so close the choices when the service changes.
  useEffect(() => setOpen(false), [service]);

  const message = `Hi Lennox, I'm interested in the ${tier.name} (${service}), starting from ${tier.price}.`;

  return (
    <TimelineContent
      as="div"
      ref={slotRef}
      animationNum={index + 3}
      timelineRef={timelineRef}
      customVariants={revealVariants}
      className="row-span-2 grid grid-rows-subgrid gap-0"
    >
      <TierCard tier={tier} service={service} open={open} onToggle={() => setOpen((value) => !value)} choicesId={choicesId} />
      {!tier.link && (
        <div className="px-6">
          <ContactChoices
            id={choicesId}
            open={open}
            label={`How to get started with ${tier.name}`}
            message={message}
            subject={`${tier.name}: ${service}`}
            source="pricing"
            tags={{ pricing_service: service, pricing_tier: tier.name }}
          />
        </div>
      )}
    </TimelineContent>
  );
};

export default function PricingSection({ services }: { services: PricingService[] }) {
  const [selectedName, setSelectedName] = useState(services[0].name);
  const selected = services.find((service) => service.name === selectedName) ?? services[0];
  const pricingRef = useRef<HTMLDivElement>(null);
  const inView = useInView(pricingRef, { once: true, amount: 0.15 });
  const reduceMotion = useReducedMotion();

  const selectService = (name: string) => {
    setSelectedName(name);
    track("pricing_service_select", { pricing_service: name });
  };

  return (
    <div ref={pricingRef} className="relative mx-auto w-full max-w-[1280px]">
      <div className="mb-8">
        <h2 className="mb-4 text-4xl font-semibold tracking-[-0.02em] text-white md:text-6xl">
          {reduceMotion ? (
            "Plans & Pricing"
          ) : (
            <VerticalCutReveal
              splitBy="words"
              staggerDuration={0.15}
              staggerFrom="first"
              reverse
              autoStart={inView}
              containerClassName="justify-start"
              transition={{ type: "spring", stiffness: 250, damping: 40 }}
            >
              Plans & Pricing
            </VerticalCutReveal>
          )}
        </h2>
        <TimelineContent
          as="p"
          animationNum={1}
          timelineRef={pricingRef}
          customVariants={revealVariants}
          className="max-w-2xl text-base text-white-50 md:text-lg"
        >
          Choose a service, then the level that fits your project. The more advanced the build, the higher the tier.
        </TimelineContent>
      </div>

      <TimelineContent as="div" animationNum={2} timelineRef={pricingRef} customVariants={revealVariants}>
        <ServiceSwitch services={services} selected={selectedName} onSelect={selectService} />
      </TimelineContent>

      <div
        className={cn(
          "mt-8 grid grid-cols-1 gap-4 rounded-2xl bg-gradient-to-b from-white/[0.06] to-white/[0.02] p-2 sm:p-3 md:grid-cols-2",
          selected.tiers.length === 4 ? "xl:grid-cols-4" : "lg:grid-cols-3"
        )}
      >
        {/* Cards are keyed by position, so switching services counts each price to its new value. */}
        {selected.tiers.map((tier, index) => (
          <TierSlot key={index} tier={tier} service={selectedName} index={index} timelineRef={pricingRef} />
        ))}
      </div>

      <p className="mt-6 text-sm text-white-50">
        {selected.pricingNote ?? "Starting prices in USD. Your final quote depends on the project."}
      </p>
    </div>
  );
}
