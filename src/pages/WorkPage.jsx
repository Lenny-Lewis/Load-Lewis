import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import { Footer } from "@/components/ui/modem-animated-footer";
import { Icons } from "@/components/ui/icons";
import { Mail, Code2 } from "lucide-react";
import HoverTextSlide from "@/components/ui/HoverTextSlide";
import GraphicDesignGrid from "@/components/GraphicDesignGrid";

const webProjects = [
  {
    id: 1,
    title: "ZED Gaming",
    desc: "A cinematic gaming landing experience with bold typography, immersive visuals, and a metagame-inspired play economy.",
    img: "/images/zed_gaming_mockup.png",
    link: "https://zed-gaming.vercel.app/",
    bg: "bg-[#0A0612]"
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
    id: 3,
    title: "Latte Have",
    desc: "A modern landing page for a coffee shop.",
    img: "/images/Latte_Project.png",
    link: "https://traditional-checklist-769919.framer.app/",
    bg: "bg-[#1C1C21]"
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
    id: 5,
    title: "Recueil",
    desc: "Find your scent one bottle at a time.",
    img: "/images/Recueil_Perfume.png",
    link: "https://alert-apartment-762464.framer.app/",
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
    id: 8,
    title: "Vanguard",
    desc: "Design, disrupt and conquer",
    img: "/images/Vanguard.webp", 
    link: "https://vanguard-zeta-ruddy.vercel.app/",
    bg: "bg-[#FFE7EB]"
  },
  {
    id: 9,
    title: "ConSentinel",
    desc: "A secuirty platform for a startup.",
    img: "/images/ConSentinel.png", 
    link: "https://con-sentinel.vercel.app/",
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
  }
];

/**
 * Graphics Design pieces.
 *
 * `width`/`height` are the intrinsic pixel dimensions of the ORIGINAL asset —
 * they let the browser reserve the frame before load and render the lightbox at
 * the true ratio. `thumb` drives the grid frame, `full` drives the expanded
 * view; both are WebP derivatives generated from the originals (originals are
 * left untouched on disk). `thumbW`/`fullW` are the real widths of those
 * derivatives and feed the srcset `w` descriptors — hardcoding them caused the
 * browser to pick the wrong candidate.
 */
const graphicProjects = [
  {
    id: "g1",
    title: "Crocks Poster",
    desc: "Promotional digital poster design.",
    width: 7547,
    height: 10691,
    thumb: "/images/graphics_design/crocks_poster_thumb.webp",
    full: "/images/graphics_design/crocks_poster_full.webp",
    thumbW: 706,
    fullW: 1553
  },
  {
    id: "g2",
    title: "Boss Dark Elegance",
    desc: "High-end brand aesthetic concept.",
    width: 1340,
    height: 1675,
    thumb: "/images/graphics_design/boss_dark_elegance_thumb.webp",
    full: "/images/graphics_design/boss_dark_elegance_full.webp",
    thumbW: 800,
    fullW: 1760
  },
  {
    id: "g3",
    title: "Zara Perfume",
    desc: "Explode view zara!!",
    width: 1214,
    height: 1295,
    thumb: "/images/graphics_design/Zara_Perfume_thumb.webp",
    full: "/images/graphics_design/Zara_Perfume_full.webp",
    thumbW: 937,
    fullW: 2062
  },
  {
    id: "g4",
    title: "Wild Winter",
    desc: "Arcade Premium Winter Game Poster",
    width: 1122,
    height: 1402,
    thumb: "/images/graphics_design/Gaming_Poster_thumb.webp",
    full: "/images/graphics_design/Gaming_Poster_full.webp",
    thumbW: 800,
    fullW: 1761
  },
  {
    id: "g5",
    title: "DualSense Precision in Blue",
    desc: "PlayStation controller product ad.",
    width: 1122,
    height: 1402,
    thumb: "/images/graphics_design/dualsense_precision_blue_thumb.webp",
    full: "/images/graphics_design/dualsense_precision_blue_full.webp",
    thumbW: 800,
    fullW: 1122
  },
  {
    id: "g6",
    title: "Impossible Angle",
    desc: "Nike running campaign poster.",
    width: 1024,
    height: 1536,
    thumb: "/images/graphics_design/impossible_angle_thumb.webp",
    full: "/images/graphics_design/impossible_angle_full.webp",
    thumbW: 667,
    fullW: 1024
  },
  {
    id: "g7",
    title: "Muskalam Fragrance",
    desc: "Luxury oud fragrance brand ad.",
    width: 1086,
    height: 1448,
    thumb: "/images/graphics_design/muskalam_fragrance_thumb.webp",
    full: "/images/graphics_design/muskalam_fragrance_full.webp",
    thumbW: 750,
    fullW: 1086
  }
];

const WorkPage = () => {
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState("other"); // 'other', 'graphics'

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
              My Brightest Creations
            </h1>
            <p className="text-white-50 text-lg md:text-xl max-w-2xl leading-relaxed">
              A showcase of my latest projects, highlighting thoughtful design, clear strategy, and impactful results.
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
        <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-10 lg:gap-16">
          {displayedProjects.length > 0 ? (
            displayedProjects.map((project) => (
              <a
                key={project.id}
                href={project.link || "#"}
                target={project.link ? "_blank" : "_self"}
                rel="noreferrer"
                className="framer-card-work group flex flex-col gap-5 block cursor-pointer"
              >
                <div className={`w-full aspect-[4/3] rounded-3xl overflow-hidden relative flex items-center justify-center ${project.bg || 'bg-[#141417]'}`}>
                  {project.mediaType === "video" ? (
                    <video
                      src={project.img}
                      poster={project.poster}
                      aria-label={`${project.title} preview`}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    />
                  ) : (
                    <img
                      src={project.img}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://placehold.co/800x600/282732/d9ecff?text=Project+Preview";
                      }}
                    />
                  )}
                  <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none"></div>
                </div>
                
                <div className="flex flex-col gap-2 px-2 w-full">
                  <h3 className="text-xl md:text-2xl font-bold text-white group-hover:text-[#cda144] transition-colors duration-300">
                    {project.title}
                  </h3>
                  {project.desc && (
                    <p className="text-white-50 text-sm md:text-base leading-relaxed">
                      {project.desc}
                    </p>
                  )}
                </div>
              </a>
            ))
          ) : (
            <div className="col-span-1 md:col-span-2 py-20 flex flex-col items-center justify-center border border-white/5 rounded-3xl bg-white/5">
              <h3 className="text-2xl font-bold text-white-50">Coming Soon</h3>
              <p className="text-white/40 mt-2">Exciting new machine learning projects are in the works.</p>
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
