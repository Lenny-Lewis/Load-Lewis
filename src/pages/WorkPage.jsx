import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { motion, useReducedMotion } from "framer-motion";
import { Link } from "react-router-dom";
import { Footer } from "@/components/ui/modem-animated-footer";
import { Icons } from "@/components/ui/icons";
import { Mail, Code2 } from "lucide-react";
import HoverTextSlide from "@/components/ui/HoverTextSlide";
import GraphicDesignGrid from "@/components/GraphicDesignGrid";
import ProjectGrid from "@/components/ProjectGrid";
import WorkNavPill from "./WorkNavPill";

const webProjects = [
  {
    id: 12,
    title: "Sham Project",
    desc: "An editorial creative-studio template with bold typography and a monochrome visual direction.",
    img: "/images/ShamProject.avif",
    link: "https://victorious-actions-723983.framer.app/",
    bg: "bg-[#E8E8E8]"
  },
  {
    id: 5,
    title: "Recueil",
    desc: "Find your scent one bottle at a time.",
    img: "/images/Recueil_Perfume.png",
    link: "https://alert-apartment-762464.framer.app/",
    bg: "bg-[#FFE7EB]"
  },
  {
    id: 4,
    title: "Ageincy",
    desc: "A modern UI service platform for a startup.",
    img: "/images/agenicy_project.png",
    link: "https://compassionate-time-092074.framer.app/",
    bg: "bg-[#FFEFDB]"
  },
  {
    id: 3,
    title: "Latte Have",
    desc: "A modern landing page for a coffee shop.",
    img: "/images/Latte_Project.png",
    link: "https://traditional-checklist-769919.framer.app/",
    bg: "bg-[#1C1C21]"
  },
  {
    id: 7,
    title: "Pawello",
    desc: "A modern landing page for a pet care service.",
    img: "/images/Pawello_Project.png", 
    link: "https://tedious-backgrounds-421163.framer.app/",
    bg: "bg-[#FFE7EB]"
  },
  {
    id: 10,
    title: "NHM",
    desc: "A museum showcase for past and present artifacts.",
    img: "/images/Neo_Museum-1.png",
    link: "https://nhm-xi.vercel.app/",
    bg: "bg-[#FFE7EB]"
  },
  {
    id: 11,
    title: "Lithos",
    desc: "A geology and mineralogy showcase.",
    img: "/images/Lithos.webp",
    link: "https://lithos-blush.vercel.app/",
    bg: "bg-[#FFE7EB]"
  },
  {
    id: 2,
    title: "Mojito - Interactive GSAP Cocktails",
    desc: "An immersive 3D/GSAP animated cocktail website built with modern web animations and smooth transitions.",
    img: "/images/Cocktail_Mojito.png",
    link: "https://gsap-cocktails-website-nine.vercel.app/",
    bg: "bg-[#0B1D13]"
  },
  {
    id: 8,
    title: "Vanguard",
    desc: "Design, disrupt and conquer",
    img: "/images/Vanguard.webp",
    link: "https://vanguard-zeta-ruddy.vercel.app/",
    bg: "bg-[#FFE7EB]"
  },
  {
    id: 1,
    title: "ZED Gaming",
    desc: "A cinematic gaming landing experience with bold typography, immersive visuals, and a metagame-inspired play economy.",
    img: "/images/zed_gaming_mockup.png",
    link: "https://zed-gaming.vercel.app/",
    bg: "bg-[#0A0612]"
  },
  {
    id: 9,
    title: "ConSentinel",
    desc: "A security platform for a startup.",
    img: "/images/ConSentinel.png",
    link: "https://con-sentinel.vercel.app/",
    bg: "bg-[#FFE7EB]"
  },
  {
    id: 6,
    title: "Zedos Technologies",
    desc: "Corporate website and digital solutions platform.",
    img: "/images/zed-os.mp4",
    mediaType: "video",
    poster: "/images/zedos_technologies_portfolio.png",
    link: "http://zedostechnologies.co.ke/",
    bg: "bg-[#FFE7EB]"
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
    id: "g9",
    title: "Beats by Dre",
    desc: "Wireless headphones product poster.",
    width: 1024,
    height: 1536,
    thumb: "/images/graphics_design/signed/BeatsbyDre_signed.jpg",
    full: "/images/graphics_design/signed/BeatsbyDre_signed.jpg"
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
    id: "g6",
    title: "Impossible Angle",
    desc: "Nike running campaign poster.",
    width: 1024,
    height: 1536,
    thumb: "/images/graphics_design/signed/Impossible_Angle__Defy_Perspective_signed.png",
    full: "/images/graphics_design/signed/Impossible_Angle__Defy_Perspective_signed.png"
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
    id: "g15",
    title: "Wireless Earbuds",
    desc: "Product campaign poster for next-generation wireless earbuds.",
    width: 1024,
    height: 1536,
    thumb: "/images/graphics_design/signed/Pods.jpeg",
    full: "/images/graphics_design/signed/Pods.jpeg"
  },
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
    id: "g4",
    title: "Wild Winter",
    desc: "Arcade Premium Winter Game Poster",
    width: 1122,
    height: 1402,
    thumb: "/images/graphics_design/signed/Gaming_Poster_signed.jpg",
    full: "/images/graphics_design/signed/Gaming_Poster_signed.jpg"
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
    id: "g7",
    title: "Muskalam Fragrance",
    desc: "Luxury oud fragrance brand ad.",
    width: 1086,
    height: 1448,
    thumb: "/images/graphics_design/signed/Muskalam_Luxury_Fragrance_Ad_signed.png",
    full: "/images/graphics_design/signed/Muskalam_Luxury_Fragrance_Ad_signed.png"
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
    id: "g13",
    title: "Naviforce Watch",
    desc: "Dramatic product campaign for a Naviforce watch.",
    width: 1024,
    height: 1536,
    thumb: "/images/graphics_design/signed/naviforce_signed.png",
    full: "/images/graphics_design/signed/naviforce_signed.png"
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
    id: "g3",
    title: "Zara Perfume",
    desc: "Explode view zara!!",
    width: 1214,
    height: 1295,
    thumb: "/images/graphics_design/signed/Zara_Perfume_signed.jpg",
    full: "/images/graphics_design/signed/Zara_Perfume_signed.jpg"
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

const WorkPage = () => {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState("other"); // 'other', 'graphics'
  const [introReady, setIntroReady] = useState(false);

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

  useEffect(() => {
    // The Graphics Design tab renders its own Framer Motion `whileInView`
    // reveal, so GSAP only drives the web-projects cards here. Running both on
    // the same nodes would have them fighting over `transform`/`opacity`.
    if (activeTab !== "other") return;

    const cards = gsap.utils.toArray(".framer-card-work");
    
    gsap.fromTo(
      cards,
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        stagger: 0.1,
        overwrite: "auto",
      }
    );
  }, [activeTab]);

  // The Graphics Design tab has its own grid + lightbox component, so this
  // list only backs the web-projects tab.
  const displayedProjects = activeTab === "other" ? webProjects : [];

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white pt-32 overflow-x-hidden">
      <WorkNavPill />
      <section ref={containerRef} className="w-full flex-col-center section-padding">
        
        <div className="w-full max-w-7xl mx-auto mb-16 flex flex-col gap-10">
          <Link 
            to="/"
            className="group flex items-center gap-2 text-white-50 hover:text-[#cda144] transition-colors w-fit text-sm font-semibold tracking-wider uppercase"
          >
            <span className="transform transition-transform group-hover:-translate-x-1">←</span>
            <HoverTextSlide text="Back to Home" />
          </Link>
          
          <div className="flex flex-col gap-6 mt-4 md:mt-12">
            <h1 className="text-5xl md:text-6xl lg:text-[5.5rem] font-bold tracking-tighter leading-none text-white">
              <WorkIntroWords text="My Brightest Creations" ready={introReady} delay={0.1} stagger={0.1} />
            </h1>
            <p className="text-white-50 text-lg md:text-xl max-w-2xl leading-relaxed">
              <WorkIntroWords text="A showcase of my latest projects, highlighting thoughtful design, clear strategy, and impactful results." ready={introReady} delay={0.35} stagger={0.05} />
            </p>
          </div>
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-4 md:gap-8 border-b border-white/10 pb-4 mt-8">
            <button 
              onClick={() => setActiveTab("other")}
              className={`group text-lg md:text-xl font-medium transition-colors ${activeTab === 'other' ? 'text-white border-b-2 border-[#cda144] pb-2 -mb-[18px]' : 'text-white-50 hover:text-white pb-2 -mb-[18px]'}`}
            >
              <HoverTextSlide text="All Projects" />
            </button>
            <button 
              onClick={() => setActiveTab("graphics")}
              className={`group text-lg md:text-xl font-medium transition-colors ${activeTab === 'graphics' ? 'text-white border-b-2 border-[#cda144] pb-2 -mb-[18px]' : 'text-white-50 hover:text-white pb-2 -mb-[18px]'}`}
            >
              <HoverTextSlide text="Graphics Design" />
            </button>
          </div>
        </div>
        
        {/* Grid Content */}
        {activeTab === "graphics" ? (
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
        ) : (
          <div className="w-full max-w-7xl mx-auto">
            {displayedProjects.length > 0 ? (
              <ProjectGrid
                projects={displayedProjects}
                cardClassName="framer-card-work"
              />
            ) : (
              <div className="py-20 flex flex-col items-center justify-center border border-white/5 rounded-3xl bg-white/5">
                <h3 className="text-2xl font-bold text-white-50">Coming Soon</h3>
                <p className="text-white/40 mt-2">
                  Exciting new machine learning projects are in the works.
                </p>
              </div>
            )}
          </div>
        )}
      </section>

      <Footer
        brandName="Lennox Lewis"
        brandDescription="Full-Stack & 3D Web Developer crafting high-performance, immersive digital experiences."
        creatorName="Lennox Lewis"
        creatorUrl="https://www.lennoxlewis.co.ke/"
        brandIcon={<Code2 className="w-8 sm:w-10 md:w-14 h-8 sm:h-10 md:h-14 text-background drop-shadow-lg" />}
        socialLinks={[
          {
            icon: <Icons.instagram className="w-5 h-5 text-[#FF0069]" />,
            href: "https://www.instagram.com/thatboylewis",
            label: "Instagram",
            className: "text-[#FF0069]",
          },
          {
            icon: <Icons.gitHub className="w-5 h-5 text-white fill-current" />,
            href: "https://github.com/Lenny-Lewis",
            label: "GitHub",
          },
          {
            icon: <Icons.twitter className="w-5 h-5 text-white fill-current" />,
            href: "https://x.com/thatboylewis",
            label: "Twitter",
          },
          {
            icon: <Icons.linkedin className="w-5 h-5 text-[#0A66C2] fill-current" />,
            href: "https://www.linkedin.com/in/lennox-lewis-975642359",
            label: "LinkedIn",
            className: "text-[#0A66C2]",
          },
          {
            icon: <Mail className="w-5 h-5 text-white" />,
            href: "mailto:lennoxlewis.dev@gmail.com",
            label: "Email",
          },
        ]}
        navLinks={[
          { label: "Home", href: "/" },
          { label: "Work", href: "/#work" },
          { label: "Experience", href: "/#experience" },
          { label: "Contact", href: "/#contact" },
        ]}
      />
    </div>
  );
};

export default WorkPage;
