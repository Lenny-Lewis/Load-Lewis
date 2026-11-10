import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import SiteHalftoneFooter from "@/components/SiteHalftoneFooter";
import { Zap } from "lucide-react";
import HoverTextSlide from "@/components/ui/HoverTextSlide";
import GraphicDesignGrid from "@/components/GraphicDesignGrid";
import CompanyProfileGrid from "@/components/CompanyProfileGrid";
import { companyProfiles } from "../data/companyProfiles";
import ProjectGrid from "@/components/ProjectGrid";
import SiteNavPill from "@/components/SiteNavPill";
import { usePageRevealed } from "@/hooks/usePageRevealed";

const webProjects = [
  {
    id: 12,
    title: "Sham Project",
    desc: "An editorial creative-studio template with bold typography and a monochrome visual direction.",
    img: "/images/projects/web/ShamProject.avif",
    link: "https://victorious-actions-723983.framer.app/",
    caseStudy: "/work/sham-project",
    bg: "bg-[#E8E8E8]"
  },
  {
    id: 5,
    title: "Recueil",
    desc: "Find your scent one bottle at a time.",
    img: "/images/projects/web/Recueil_Perfume.png",
    link: "https://alert-apartment-762464.framer.app/",
    caseStudy: "/work/recueil",
    bg: "bg-[#FFE7EB]"
  },
  {
    id: 4,
    title: "Ageincy",
    desc: "A modern UI service platform for a startup.",
    img: "/images/projects/web/agenicy_project.png",
    link: "https://compassionate-time-092074.framer.app/",
    caseStudy: "/work/ageincy",
    bg: "bg-[#FFEFDB]"
  },
  {
    id: 3,
    title: "Latte Have",
    desc: "A modern landing page for a coffee shop.",
    img: "/images/projects/web/Latte_Project.png",
    link: "https://traditional-checklist-769919.framer.app/",
    caseStudy: "/work/latte-have",
    bg: "bg-[#1C1C21]"
  },
  {
    id: 7,
    title: "Pawello",
    desc: "A modern landing page for a pet care service.",
    img: "/images/projects/web/Pawello_Project.png",
    link: "https://pawello-tawny.vercel.app/",
    caseStudy: "/work/pawello",
    bg: "bg-[#FFE7EB]"
  },
  {
    id: 10,
    title: "NHM",
    desc: "A museum showcase for past and present artifacts.",
    img: "/images/projects/web/Neo_Museum-1.png",
    link: "https://nhm-xi.vercel.app/",
    caseStudy: "/work/nhm",
    bg: "bg-[#FFE7EB]"
  },
  {
    id: 11,
    title: "Lithos",
    desc: "A geology and mineralogy showcase.",
    img: "/images/projects/web/Lithos.webp",
    link: "https://lithos-blush.vercel.app/",
    caseStudy: "/work/lithos",
    bg: "bg-[#FFE7EB]"
  },
  {
    id: 2,
    title: "Mojito - Interactive GSAP Cocktails",
    desc: "An immersive 3D/GSAP animated cocktail website built with modern web animations and smooth transitions.",
    img: "/images/projects/web/Cocktail_Mojito.png",
    link: "https://gsap-cocktails-website-nine.vercel.app/",
    caseStudy: "/work/mojito",
    bg: "bg-[#0B1D13]"
  },
  {
    id: 8,
    title: "Vanguard",
    desc: "Design, disrupt and conquer",
    img: "/images/projects/web/Vanguard.webp",
    link: "https://vanguard-zeta-ruddy.vercel.app/",
    caseStudy: "/work/vanguard",
    bg: "bg-[#FFE7EB]"
  },
  {
    id: 1,
    title: "ZED Gaming",
    desc: "A cinematic gaming landing experience with bold typography, immersive visuals, and a metagame-inspired play economy.",
    img: "/images/projects/web/zed_gaming_mockup.png",
    link: "https://zed-gaming.vercel.app/",
    caseStudy: "/work/zed-gaming",
    bg: "bg-[#0A0612]"
  },
  {
    id: 9,
    title: "ConSentinel",
    desc: "A security platform for a startup.",
    img: "/images/projects/web/ConSentinel.png",
    link: "https://con-sentinel.vercel.app/",
    caseStudy: "/work/consentinel",
    bg: "bg-[#FFE7EB]"
  },
  {
    id: 6,
    title: "Zedos Technologies",
    desc: "AI & ML, digital systems and smart operations for East African teams, with an interactive 3D hero.",
    img: "/images/projects/web/zedos_technologies_showcase.png",
    link: "https://zedostechnologies.co.ke/",
    caseStudy: "/work/zedos-technologies",
    bg: "bg-[#0A0A0C]"
  }
];

const mobileProjects = [
  {
    id: "m1",
    title: "KSU RTMS",
    desc: "A mobile app and website that manage final-year student projects from the first proposal to final completion.",
    img: "/images/mobile_apps/rtms/cover.webp",
    caseStudy: "/work/ksu-rtms",
    bg: "bg-[#0F1A2A]"
  }
];

/**
 * Graphics Design pieces.
 *
 * `width`/`height` are the intrinsic pixel dimensions of the ORIGINAL asset —
 * they let the browser reserve the frame before load and render the lightbox at
 * the true ratio. `thumb` drives the grid frame and `full` drives the expanded
 * view.
 */
const graphicProjects = [
  {
    id: "g11",
    title: "Ferrari: Born to Dominate",
    desc: "High-performance automotive campaign poster.",
    width: 1024,
    height: 1536,
    thumb: "/images/graphics_design/signed/ferrari_signed.png",
    full: "/images/graphics_design/signed/ferrari_signed.png"
  },
  {
    id: "g7",
    title: "Muskalam Fragrance",
    desc: "Luxury oud fragrance brand ad.",
    width: 1086,
    height: 1448,
    thumb: "/images/graphics_design/signed/Muskalam_Luxury_Fragrance_Ad_signed.png",
    full: "/images/graphics_design/signed/Muskalam_Luxury_Fragrance_Ad_signed.png"
  },
  {
    id: "g18",
    title: "Iconic by Design",
    desc: "Nike Air Jordan lifestyle campaign poster.",
    width: 1024,
    height: 1536,
    thumb: "/images/graphics_design/signed/Iconic_By_Design_signed.png",
    full: "/images/graphics_design/signed/Iconic_By_Design_signed.png"
  },
  {
    id: "g5",
    title: "DualSense Precision in Blue",
    desc: "PlayStation controller product ad.",
    width: 1122,
    height: 1402,
    thumb: "/images/graphics_design/signed/DualSense_Precision_in_Blue_signed.png",
    full: "/images/graphics_design/signed/DualSense_Precision_in_Blue_signed.png"
  },
  {
    id: "g23",
    title: "Naturally Ahead",
    desc: "Adidas footwear campaign poster.",
    width: 1101,
    height: 1428,
    thumb: "/images/graphics_design/signed/adidas_ahead_signed.png",
    full: "/images/graphics_design/signed/adidas_ahead_signed.png"
  },
  {
    id: "g12",
    title: "Rolex: Timeless by Nature",
    desc: "Luxury watch campaign poster.",
    width: 1024,
    height: 1536,
    thumb: "/images/graphics_design/signed/rolex_signed.png",
    full: "/images/graphics_design/signed/rolex_signed.png"
  },
  {
    id: "g20",
    title: "Elevate Your Game",
    desc: "Nike basketball footwear campaign poster.",
    width: 1024,
    height: 1536,
    thumb: "/images/graphics_design/signed/nike_elevate_signed.png",
    full: "/images/graphics_design/signed/nike_elevate_signed.png"
  },
  {
    id: "g9",
    title: "Beats by Dre",
    desc: "Wireless headphones product poster.",
    width: 1024,
    height: 1536,
    thumb: "/images/graphics_design/signed/BeatsbyDre_signed.jpg",
    full: "/images/graphics_design/signed/BeatsbyDre_signed.jpg"
  },
  {
    id: "g17",
    title: "Step Into a Bigger World",
    desc: "Adidas comfort footwear campaign poster.",
    width: 1024,
    height: 1536,
    thumb: "/images/graphics_design/signed/Step_Into_a_Bigger_World_signed.png",
    full: "/images/graphics_design/signed/Step_Into_a_Bigger_World_signed.png"
  },
  {
    id: "g16",
    title: "Mashujaa Day",
    desc: "Commemorative Mashujaa Day celebration poster.",
    width: 1121,
    height: 1403,
    thumb: "/images/graphics_design/signed/Mashujaa_day Poster.jpeg",
    full: "/images/graphics_design/signed/Mashujaa_day Poster.jpeg"
  },
  {
    id: "g22",
    title: "Classics Live Longer",
    desc: "Adidas Classics footwear campaign poster.",
    width: 1024,
    height: 1536,
    thumb: "/images/graphics_design/signed/adidas_classics_signed.png",
    full: "/images/graphics_design/signed/adidas_classics_signed.png"
  },
  {
    id: "g10",
    title: "iPhone Duo",
    desc: "Foldable phone concept poster.",
    width: 1024,
    height: 1536,
    thumb: "/images/graphics_design/signed/iPhoneDuo_signed.jpg",
    full: "/images/graphics_design/signed/iPhoneDuo_signed.jpg"
  },
  {
    id: "g21",
    title: "Bigger Moves Same Energy",
    desc: "Flow Pushers footwear campaign poster.",
    width: 1024,
    height: 1536,
    thumb: "/images/graphics_design/signed/flowpushers_signed.png",
    full: "/images/graphics_design/signed/flowpushers_signed.png"
  },
  {
    id: "g4",
    title: "Wild Winter",
    desc: "Arcade Premium Winter Game Poster",
    width: 1122,
    height: 1402,
    thumb: "/images/graphics_design/signed/Gaming_Poster_signed.jpg",
    full: "/images/graphics_design/signed/Gaming_Poster_signed.jpg"
  },
  {
    id: "g19",
    title: "Nike SB Blazer Low",
    desc: "Nike skate footwear campaign poster.",
    width: 1024,
    height: 1536,
    thumb: "/images/graphics_design/signed/nike_sb_signed.png",
    full: "/images/graphics_design/signed/nike_sb_signed.png"
  },
  {
    id: "g15",
    title: "Wireless Earbuds",
    desc: "Product campaign poster for next-generation wireless earbuds.",
    width: 1024,
    height: 1536,
    thumb: "/images/graphics_design/signed/Pods.jpeg",
    full: "/images/graphics_design/signed/Pods.jpeg"
  },
  {
    id: "g6",
    title: "Impossible Angle",
    desc: "Nike running campaign poster.",
    width: 1024,
    height: 1536,
    thumb: "/images/graphics_design/signed/Impossible_Angle__Defy_Perspective_signed.png",
    full: "/images/graphics_design/signed/Impossible_Angle__Defy_Perspective_signed.png"
  },
  {
    id: "g2",
    title: "Boss Dark Elegance",
    desc: "High-end brand aesthetic concept.",
    width: 1340,
    height: 1675,
    thumb: "/images/graphics_design/signed/boss_dark_elegance_signed.png",
    full: "/images/graphics_design/signed/boss_dark_elegance_signed.png"
  },
  {
    id: "g14",
    title: "Crocs Campaign",
    desc: "Lifestyle campaign poster for Crocs footwear.",
    width: 736,
    height: 1104,
    thumb: "/images/graphics_design/signed/Crocks_Poster.jpeg",
    full: "/images/graphics_design/signed/Crocks_Poster.jpeg"
  },
  {
    id: "g13",
    title: "Naviforce Watch",
    desc: "Dramatic product campaign for a Naviforce watch.",
    width: 1024,
    height: 1536,
    thumb: "/images/graphics_design/signed/naviforce_signed.png",
    full: "/images/graphics_design/signed/naviforce_signed.png"
  },
  {
    id: "g1",
    title: "Crocks Poster",
    desc: "Promotional digital poster design.",
    width: 5647,
    height: 8000,
    thumb: "/images/graphics_design/signed/crocks_poster_signed.png",
    full: "/images/graphics_design/signed/crocks_poster_signed.png"
  },
  {
    id: "g8",
    title: "Villagio Customer Service",
    desc: "Villagio company customer service week poster.",
    width: 2160,
    height: 2700,
    thumb: "/images/graphics_design/signed/Customer_Service_Week_1080x1350_signed.png",
    full: "/images/graphics_design/signed/Customer_Service_Week_1080x1350_signed.png"
  }
];

const workTabs = [
  { id: "web", label: "Web Apps" },
  { id: "mobile", label: "Mobile Apps" },
  { id: "graphics", label: "Graphics Design" },
  { id: "profiles", label: "Company Profiles" },
  { id: "current", label: "Current Projects" },
];

// Tab switch: the old panel blurs out in place, then the new one comes into focus
// with the same blur-in the page heading uses.
const EASE_OUT = [0.22, 1, 0.36, 1];
const tabPanelVariants = {
  hidden: { opacity: 0, filter: "blur(10px)", y: 10 },
  // The filter is cleared once the blur ends: any leftover filter would trap the
  // graphics lightbox (position: fixed) inside this panel instead of the viewport.
  shown: {
    opacity: 1,
    filter: "blur(0px)",
    y: 0,
    transition: { duration: 0.5, ease: EASE_OUT },
    transitionEnd: { filter: "none" },
  },
  gone: { opacity: 0, filter: "blur(6px)", transition: { duration: 0.2, ease: "easeIn" } },
};
const tabUnderlineSpring = { type: "spring", bounce: 0, duration: 0.5 };

const WorkIntroWords = ({ text, ready, delay, stagger }) => {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return text;

  const words = text.split(" ");
  return words.map((word, index) => (
    <span key={index}>
      <motion.span
        initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
        animate={ready ? { opacity: 1, filter: "blur(0px)", y: 0 } : { opacity: 0, filter: "blur(10px)", y: 10 }}
        transition={{ duration: 0.7, delay: delay + index * stagger, ease: [0.22, 1, 0.36, 1] }}
        className="inline-block"
      >
        {word}
      </motion.span>
      {index < words.length - 1 ? " " : null}
    </span>
  ));
};

const ProjectProgressOverlay = ({ project, progress }) => {
  const reduceMotion = useReducedMotion();

  return (
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
      <div
        role="progressbar"
        aria-label={`${project} progress`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
        className="flex flex-col items-center"
      >
        <div className="flex flex-col items-center">
          <div className="h-2 w-9 rounded-t-md border border-b-0 border-white/70 bg-white/30 backdrop-blur-lg" />
          <div className="relative h-32 w-20 rounded-2xl border-2 border-white/70 bg-white/15 p-1.5 shadow-[0_12px_30px_rgba(0,0,0,0.35)] backdrop-blur-lg">
            <div className="relative h-full w-full overflow-hidden rounded-xl bg-black/20">
              <motion.div
                initial={reduceMotion ? false : { height: 0 }}
                animate={{ height: `${progress}%` }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-x-0 bottom-0 overflow-hidden rounded-b-xl bg-gradient-to-t from-[#0b8f5a] via-[#22c55e] to-[#86efac] shadow-[0_0_24px_rgba(34,197,94,0.55)]"
              >
                <motion.div
                  animate={reduceMotion ? undefined : { opacity: [0.35, 0.9, 0.35] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute inset-0 bg-white/25"
                />
              </motion.div>
              <motion.div
                animate={reduceMotion ? undefined : { opacity: [1, 0.55, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 flex items-center justify-center"
              >
                <Zap className="h-8 w-8 fill-white text-white drop-shadow-lg" aria-hidden="true" />
              </motion.div>
              <span className="absolute inset-x-0 bottom-1 z-10 text-center text-xl font-black tabular-nums text-white" style={{ textShadow: "0 2px 6px rgba(0,0,0,0.9)" }}>
                {progress}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const WorkPage = () => {
  const containerRef = useRef(null);
  const tabPanelRef = useRef(null);
  const reduceMotion = useReducedMotion();
  const { search } = useLocation();
  const [activeTab, setActiveTab] = useState(() => {
    const requested = new URLSearchParams(search).get("tab");
    return workTabs.some(({ id }) => id === requested) ? requested : "web";
  });
  const [introReady, setIntroReady] = useState(false);
  // Arriving from another page, the intro and first panel wait until the transition uncovers them.
  const pageRevealed = usePageRevealed();

  useEffect(() => {
    const root = document.getElementById("root");
    const showIntro = () => {
      if (!root?.querySelector('aside[aria-label="Loading portfolio"]')) {
        setIntroReady(true);
        observer.disconnect();
      }
    };
    const observer = new MutationObserver(showIntro);
    if (root) observer.observe(root, { childList: true });
    showIntro();
    return () => observer.disconnect();
  }, []);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Staggers the web and mobile project cards in as their panel arrives. The Graphics
  // Design tab renders its own Framer Motion `whileInView` reveal, so GSAP stays off
  // it; running both on the same nodes would have them fighting over transform/opacity.
  const revealCards = (variant) => {
    if (variant !== "shown" || (activeTab !== "web" && activeTab !== "mobile")) return;
    const cards = gsap.utils.toArray(".framer-card-work", tabPanelRef.current);
    gsap.fromTo(
      cards,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.6, ease: "power2.out", stagger: 0.1, overwrite: "auto" }
    );
  };

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white pt-32 overflow-x-hidden">
      <SiteNavPill label="Work page navigation" />
      <section ref={containerRef} className="w-full flex-col-center section-padding pb-20 md:pb-28">
        
        <div className="w-full max-w-7xl mx-auto mb-16 flex flex-col gap-10">
          <Link 
            to="/"
            className="group flex items-center gap-2 text-white-50 hover:text-[#8b5cf6] transition-colors w-fit text-sm font-semibold tracking-wider uppercase"
          >
            <span className="transform transition-transform group-hover:-translate-x-1">←</span>
            <HoverTextSlide text="Back to Home" />
          </Link>
          
          <div className="flex flex-col gap-6 mt-4 md:mt-12">
            <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-bold tracking-tighter leading-none text-white">
              <WorkIntroWords text="My Brightest Creations" ready={introReady && pageRevealed} delay={0.1} stagger={0.1} />
            </h1>
            <p className="text-white-50 text-lg md:text-xl max-w-2xl leading-relaxed">
              <WorkIntroWords text="A showcase of my latest projects, highlighting thoughtful design, clear strategy, and impactful results." ready={introReady && pageRevealed} delay={0.35} stagger={0.05} />
            </p>
          </div>
          
          {/* Tabs */}
          <div role="group" aria-label="Project categories" className="mt-8 grid grid-cols-2 gap-2 sm:gap-3 md:flex md:flex-wrap md:gap-8 md:border-b md:border-white/10 md:pb-4">
            {workTabs.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                aria-pressed={activeTab === id}
                onClick={() => setActiveTab(id)}
                className={`group relative min-h-12 rounded-xl border px-2 py-3 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#8b5cf6] sm:text-base md:min-h-0 md:rounded-none md:border-0 md:border-b-2 md:border-transparent md:px-0 md:py-0 md:text-xl ${activeTab === id ? 'border-[#8b5cf6]/50 bg-[#8b5cf6]/15 text-white md:bg-transparent md:pb-2 md:-mb-[18px]' : 'border-white/10 bg-white/5 text-white-50 hover:bg-white/10 hover:text-white md:bg-transparent md:pb-2 md:-mb-[18px] md:hover:bg-transparent'}`}
              >
                <HoverTextSlide text={label} />
                {activeTab === id && (
                  <motion.span
                    layoutId="work-tab-underline"
                    aria-hidden="true"
                    transition={reduceMotion ? { duration: 0 } : tabUnderlineSpring}
                    className="absolute inset-x-0 -bottom-[2px] hidden h-[2px] bg-[#8b5cf6] md:block"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
        
        {/* Grid Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            ref={tabPanelRef}
            variants={tabPanelVariants}
            initial={reduceMotion ? false : "hidden"}
            animate={pageRevealed ? "shown" : "hidden"}
            exit={reduceMotion ? undefined : "gone"}
            onAnimationStart={revealCards}
            className="w-full"
          >
            {activeTab === "profiles" ? (
              <div className="w-full max-w-7xl mx-auto">
                <CompanyProfileGrid profiles={companyProfiles} />
              </div>
            ) : activeTab === "graphics" ? (
              <div className="w-full max-w-7xl mx-auto">
                {graphicProjects.length > 0 ? (
                  <GraphicDesignGrid projects={graphicProjects} />
                ) : (
                  <div className="py-20 flex flex-col items-center justify-center border border-white/5 rounded-3xl bg-white/5">
                    <h3 className="text-2xl font-bold text-white-50">Coming Soon</h3>
                    <p className="text-white/40 mt-2">Exciting new graphic design projects are in the works.</p>
                  </div>
                )}
              </div>
            ) : activeTab === "web" ? (
              <div className="w-full max-w-7xl mx-auto">
                <ProjectGrid projects={webProjects} cardClassName="framer-card-work" />
              </div>
            ) : activeTab === "current" ? (
              <div className="w-full max-w-7xl mx-auto grid grid-cols-1 gap-5 md:grid-cols-2">
                <figure className="group flex flex-col gap-5">
                  <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-[#c9d0ed]">
                    <img
                      src="/images/projects/current/roam-project-template.png"
                      alt="Roam travel app screens"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    />
                    <ProjectProgressOverlay project="Roam" progress={28} />
                  </div>
                  <figcaption className="px-2">
                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#8b5cf6] transition-colors duration-300">Roam</h3>
                    <p className="mt-2 text-white-50 text-sm md:text-base leading-relaxed">
                      A modern travel app for discovering destinations and booking stays.
                    </p>
                  </figcaption>
                </figure>
                <figure className="group flex flex-col gap-5">
                  <a
                    href="https://github.com/Lenny-Lewis/KSU-RTMS"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View KSU RTMS on GitHub"
                    className="block rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8b5cf6]"
                  >
                    <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-[#25292b]">
                      <img
                        src="/images/projects/current/ksu-rtms-project-template.png"
                        alt="Kisii University project management system preview"
                        loading="lazy"
                        decoding="async"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                        style={{ maskImage: "linear-gradient(to bottom, transparent 6%, black 13%, black 87%, transparent 94%)" }}
                      />
                      <ProjectProgressOverlay project="KSU RTMS" progress={88} />
                    </div>
                  </a>
                  <figcaption className="px-2">
                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#8b5cf6] transition-colors duration-300">KSU RTMS</h3>
                    <p className="mt-2 text-white-50 text-sm md:text-base leading-relaxed">
                      A project management system for Kisii University.
                    </p>
                  </figcaption>
                </figure>
                <figure className="group flex flex-col gap-5">
                  <a
                    href="https://github.com/Lenny-Lewis/Cindi"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View Cindi on GitHub"
                    className="block rounded-3xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#8b5cf6]"
                  >
                    <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden bg-[#d8d8d8] flex items-center justify-center">
                      <img
                        src="/images/projects/current/Cindi_Project.png"
                        alt="Cindi project preview"
                        loading="lazy"
                        decoding="async"
                        width="397"
                        height="258"
                        className="w-full max-w-[397px] h-auto [clip-path:inset(10px_12px)] group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                      />
                      <ProjectProgressOverlay project="Cindi" progress={12} />
                    </div>
                  </a>
                  <figcaption className="px-2">
                    <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#8b5cf6] transition-colors duration-300">Cindi</h3>
                    <p className="mt-2 text-white-50 text-sm md:text-base leading-relaxed">
                      An agentic, modern AI assistant — a female Jarvis.
                    </p>
                  </figcaption>
                </figure>
              </div>
            ) : (
              <div className="w-full max-w-7xl mx-auto">
                <ProjectGrid projects={mobileProjects} cardClassName="framer-card-work" />
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </section>

      <SiteHalftoneFooter />
    </div>
  );
};

export default WorkPage;
