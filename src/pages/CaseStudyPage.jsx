import { Fragment } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import SiteHalftoneFooter from "../components/SiteHalftoneFooter";
import SiteNavPill from "../components/SiteNavPill";
import PriceTag from "../components/ui/PriceTag";
import { caseStudies, caseStudyPath } from "../data/caseStudies";

const panelStyle = (study) => ({
  background: `linear-gradient(135deg, ${study.panel[0]}, ${study.panel[1]})`,
});

// A brand-coloured panel with a page screenshot inset, running off the bottom edge.
const Panel = ({ study, src, alt = "", className, insetClassName, eager = false, children }) => (
  <div className={`relative w-full overflow-hidden rounded-[20px] ${className}`} style={panelStyle(study)}>
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={`absolute left-1/2 h-auto max-w-none -translate-x-1/2 rounded-t-[14px] shadow-[0_18px_50px_rgba(0,0,0,0.35)] ${insetClassName}`}
    />
    {children}
  </div>
);

const LargePanel = ({ study, image, eager }) => (
  <Panel
    study={study}
    src={image.src}
    alt={image.alt}
    eager={eager}
    className="aspect-[1080/742]"
    insetClassName={image.wide ? "top-[6.5%] w-[88%]" : "top-[6.5%] w-[78%]"}
  />
);

// A finished 2:1 composite of tilted phone screens.
const TiltedShowcase = ({ image }) => (
  <img
    src={image.src}
    alt={image.alt}
    width={2160}
    height={1080}
    loading="lazy"
    decoding="async"
    className="h-auto w-full rounded-[20px]"
  />
);

// A diagonal grid of phone screens beside real text. The image is transparent, so the panel colour
// shows through, and the text stays live so it's readable on phones and the button works.
const GridShowcase = ({ image }) => (
  <div className="flex w-full flex-col overflow-hidden rounded-[20px] bg-[#101927] md:flex-row md:items-center">
    <img
      src={image.src}
      alt={image.alt}
      width={1300}
      height={1240}
      loading="lazy"
      decoding="async"
      className="aspect-[3/2] h-auto w-full object-cover md:aspect-auto md:w-[60%] md:flex-none"
    />
    <div className="flex flex-col items-center gap-3 px-5 pb-8 pt-3 text-center md:gap-4 md:px-8 md:py-8">
      <GraduationCap className="size-8 text-white md:size-10" aria-hidden="true" />
      <div>
        <h3 className="text-2xl font-semibold leading-[1.2] tracking-[-0.02em] text-white md:text-3xl">{image.title}</h3>
        <p className="mt-1 text-sm leading-[1.4] tracking-[-0.04em] text-white/50 md:text-base">{image.byline}</p>
      </div>
      <p className="text-base leading-[1.4] tracking-[-0.04em] text-white md:text-lg">{image.text}</p>
      <Link
        to="/#contact"
        className="mt-2 w-fit rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
      >
        {image.cta} →
      </Link>
    </div>
  </div>
);

const TextSections = ({ sections }) => (
  <div className="flex w-full max-w-[740px] flex-col gap-10">
    {sections.map(({ heading, paragraphs }) => (
      <div key={heading}>
        <h2 className="text-3xl font-semibold leading-[1.2] tracking-[-0.02em] text-white md:text-[52px]">{heading}</h2>
        <div className="mt-5 flex flex-col gap-5">
          {paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-lg leading-[1.4] tracking-[-0.04em] text-white">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    ))}
  </div>
);

const Result = ({ result }) => (
  <figure className="m-0 w-full max-w-[740px]">
    <h2 className="text-3xl font-semibold leading-[1.2] tracking-[-0.02em] text-white md:text-[52px]">The Result</h2>
    <blockquote className="m-0 mt-5 text-2xl font-medium leading-[1.3] tracking-[-0.02em] text-white md:text-[32px]">
      “{result.outcome}”
    </blockquote>
    <p className="mt-5 text-lg leading-[1.4] tracking-[-0.04em] text-white/80">“{result.review}”</p>
    <figcaption className="mt-5 text-base leading-[1.4] tracking-[-0.04em] text-white/50">
      {result.attribution}
    </figcaption>
  </figure>
);

const Quotes = ({ quotes }) => (
  <div className="flex w-full max-w-[740px] flex-col gap-10">
    <h2 className="text-3xl font-semibold leading-[1.2] tracking-[-0.02em] text-white md:text-[52px]">
      From the People Testing It
    </h2>
    {quotes.map(({ text, attribution }) => (
      <figure key={attribution} className="m-0">
        <blockquote className="m-0 text-2xl font-medium leading-[1.3] tracking-[-0.02em] text-white md:text-[32px]">
          “{text}”
        </blockquote>
        <figcaption className="mt-5 text-base leading-[1.4] tracking-[-0.04em] text-white/50">{attribution}</figcaption>
      </figure>
    ))}
  </div>
);

const DetailItem = ({ label, value }) => (
  <div>
    <dt className="text-base leading-[1.4] tracking-[-0.04em] text-white/50">{label}</dt>
    <dd className="mt-1 text-lg leading-[1.4] tracking-[-0.04em] text-white">{value}</dd>
  </div>
);

const Separator = () => (
  <span aria-hidden="true" className="self-end text-xl leading-[1.2] text-[#999]">
    /
  </span>
);

const ProjectDetails = ({ study }) => (
  <dl className="flex flex-wrap items-end gap-x-5 gap-y-3">
    {study.details.map((detail, index) => (
      <Fragment key={detail.label}>
        {index > 0 && <Separator />}
        <DetailItem {...detail} />
      </Fragment>
    ))}
    {study.price && (
      <>
        <Separator />
        <DetailItem label="Price" value={study.price} />
      </>
    )}
    {study.sold && (
      <>
        <Separator />
        <DetailItem label="Status" value="Sold" />
      </>
    )}
    {study.liveUrl && (
      <>
        <Separator />
        <a
          href={study.liveUrl}
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-2.5 text-lg leading-[1.4] tracking-[-0.04em] text-white"
        >
          Live Link
          <span className="grid size-7 place-items-center rounded-lg border border-white text-sm transition-colors group-hover:bg-white group-hover:text-black">
            ↗
          </span>
        </a>
      </>
    )}
  </dl>
);

const BuyLink = ({ message, children }) => (
  <Link
    to="/#contact"
    state={{ message }}
    className="group flex w-fit flex-none items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white"
  >
    {children}
    <span className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
  </Link>
);

const SaleOptions = ({ study }) => (
  <div className="flex w-full flex-col gap-8">
    <div>
      <p className="text-base tracking-[-0.04em] text-white/50">Available to buy</p>
      <p className="mt-3 max-w-2xl text-lg leading-[1.4] tracking-[-0.04em] text-white">{study.saleNote}</p>
    </div>
    <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
      {study.saleOptions.map((option) => (
        <div key={option.name} className="flex flex-col gap-3 border-t border-white/20 pt-5">
          <h3 className="text-xl font-medium leading-[1.2] tracking-[-0.02em] text-white">{option.name}</h3>
          <div>
            <p className="text-4xl font-semibold tracking-[-0.02em] text-white">{option.price}</p>
            <p className="mt-1 text-base tracking-[-0.04em] text-white/50">{option.term}</p>
          </div>
          <p className="text-lg leading-[1.4] tracking-[-0.04em] text-white">{option.note}</p>
          <div className="mt-auto pt-2">
            <BuyLink message={`Hi Lennox, I'd like to buy ${study.title} (${option.name.toLowerCase()}).`}>
              Choose this option
            </BuyLink>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const MoreProjects = ({ current }) => {
  const index = caseStudies.indexOf(current);
  const next = [1, 2].map((step) => caseStudies[(index + step) % caseStudies.length]);

  return (
    // A div, not a section: the global `section { width: 100dvw }` rule would break out of the column.
    <div className="mt-[50px] flex w-full flex-col gap-10">
      <h2 className="text-5xl font-semibold leading-none tracking-[-0.02em] text-white md:text-[68px]">More Projects</h2>
      <div className="grid grid-cols-1 gap-4 min-[810px]:grid-cols-2">
        {next.map((study) => (
          <Link key={study.slug} to={caseStudyPath(study.slug)} className="group flex flex-col gap-2.5">
            <Panel
              study={study}
              src={study.hero.src}
              className="aspect-[532/367] transition-transform duration-500 group-hover:scale-[1.01]"
              insetClassName={study.hero.wide ? "top-[8%] w-[90%]" : "top-[8%] w-[82%]"}
            >
              {study.sold ? <PriceTag sold /> : study.price && <PriceTag price={study.price} />}
            </Panel>
            <div>
              <h3 className="text-[32px] font-medium leading-[1.2] tracking-[-0.02em] text-white">{study.title}</h3>
              <p className="text-base leading-[1.4] tracking-[-0.04em] text-white">{study.category}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

const CaseStudyPage = () => {
  const { slug } = useParams();
  const reduceMotion = useReducedMotion();
  const study = caseStudies.find((item) => item.slug === slug);

  if (!study) return <Navigate to="/work" replace />;

  return (
    <>
      <SiteNavPill label="Project page navigation" />
      <main className="w-full overflow-x-hidden bg-black px-5 pb-20 pt-32 md:px-8 md:pb-28 md:pt-40">
        <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-10">
          <motion.header
            className="flex w-full flex-col gap-10"
            initial={reduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <h1 className="text-5xl font-bold leading-none tracking-[-0.02em] text-white md:text-[72px]">{study.title}</h1>

            <div className="mt-2 flex flex-col gap-8 md:mt-20 lg:flex-row lg:items-end lg:justify-between">
              <div className="flex flex-col items-start gap-5">
              <Link
                to={study.backTo ?? "/work"}
                aria-label="Back to all projects"
                className="group flex items-center gap-2.5 text-lg leading-[1.4] tracking-[-0.04em] text-white"
              >
                <span className="grid size-7 place-items-center rounded-lg border border-white text-sm transition-colors group-hover:bg-white group-hover:text-black">
                  ←
                </span>
                Back
              </Link>
              <ProjectDetails study={study} />
            </div>
              <p className="w-full text-lg leading-[1.4] tracking-[-0.04em] text-white lg:w-[456px] lg:flex-none">
                {study.summary}
              </p>
            </div>

            <LargePanel study={study} image={study.hero} eager />
          </motion.header>

          <TextSections sections={study.intro} />

          {study.showcase ? (
            <TiltedShowcase image={study.showcase.tilted} />
          ) : (
            <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 md:gap-10">
              {study.gallery.map((image) => (
                <Panel
                  key={image.src}
                  study={study}
                  src={image.src}
                  alt={image.alt}
                  className="aspect-[4/3]"
                  insetClassName="top-[6%] w-[86%]"
                />
              ))}
            </div>
          )}

          <TextSections sections={study.body} />

          {study.showcase ? (
            <GridShowcase image={study.showcase.grid} />
          ) : (
            <LargePanel study={study} image={study.feature} />
          )}

          <TextSections sections={study.outro} />

        {study.result && <Result result={study.result} />}

          {study.quotes && <Quotes quotes={study.quotes} />}

          {study.saleOptions && <SaleOptions study={study} />}

          <MoreProjects current={study} />
        </div>
      </main>
      <SiteHalftoneFooter />
    </>
  );
};

export default CaseStudyPage;
