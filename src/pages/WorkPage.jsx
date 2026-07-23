import { useRef, useState, useEffect } from "react";
import { gsap } from "gsap";
import { Link } from "react-router-dom";
import TitleHeader from "../components/TitleHeader";

const webProjects = [
  {
    id: 1,
    title: "Ryde - On-Demand Rides",
    desc: "An app built with React Native, Expo, & TailwindCSS for a fast, user-friendly experience.",
    img: "/images/project1.png",
    link: "https://ryde-gamma.vercel.app/",
    bg: "bg-[#1C1C21]"
  },
  {
    id: 2,
    title: "The Library Management Platform",
    desc: "A full-stack library platform for seamless book borrowing and tracking.",
    img: "/images/project2.png",
    link: "https://potter-library.vercel.app/",
    bg: "bg-[#FFEFDB]"
  },
  {
    id: 3,
    title: "YG Directory",
    desc: "A modern startup showcase application.",
    img: "/images/project3.png",
    link: "https://yg-directory.vercel.app/",
    bg: "bg-[#FFE7EB]"
  },
  {
    id: 4,
    title: "Zedos Technologies",
    desc: "Corporate website and digital solutions platform.",
    img: "/images/zedos.png", 
    link: "http://zedostechnologies.co.ke/",
    bg: "bg-[#FFE7EB]",
    paddingClass: "p-0 sm:p-2 md:p-4 lg:p-6",
    contain: true
  }
];

const graphicProjects = [
  {
    id: 'g1',
    title: "Crocks Poster",
    desc: "Promotional digital poster design.",
    img: "/images/graphics_design/crocks_poster.png",
    bg: "bg-transparent"
  },
  {
    id: 'g2',
    title: "Boss Dark Elegance",
    desc: "High-end brand aesthetic concept.",
    img: "/images/graphics_design/boss_dark_elegance.png",
    bg: "bg-transparent"
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

  let displayedProjects = [];
  if (activeTab === "other") displayedProjects = webProjects;
  else if (activeTab === "graphics") displayedProjects = graphicProjects;

  return (
    <div className="w-full min-h-screen bg-[#050505] text-white pt-32 pb-20 overflow-x-hidden">
      <section ref={containerRef} className="w-full flex-col-center section-padding">
        
        <div className="w-full max-w-7xl mx-auto mb-16 flex flex-col gap-10">
          <Link 
            to="/"
            className="group flex items-center gap-2 text-white-50 hover:text-[#cda144] transition-colors w-fit text-sm font-semibold tracking-wider uppercase"
          >
            <span className="transform transition-transform group-hover:-translate-x-1">←</span>
            Back to Home
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
              className={`text-lg md:text-xl font-medium transition-colors ${activeTab === 'other' ? 'text-white border-b-2 border-[#cda144] pb-2 -mb-[18px]' : 'text-white-50 hover:text-white pb-2 -mb-[18px]'}`}
            >
              Other Projects
            </button>
            <button 
              onClick={() => setActiveTab("graphics")}
              className={`text-lg md:text-xl font-medium transition-colors ${activeTab === 'graphics' ? 'text-white border-b-2 border-[#cda144] pb-2 -mb-[18px]' : 'text-white-50 hover:text-white pb-2 -mb-[18px]'}`}
            >
              Graphics Design
            </button>
          </div>
        </div>
        
        {/* Grid Content */}
        <div className={`w-full max-w-7xl mx-auto grid ${activeTab === 'graphics' ? 'grid-cols-2' : 'grid-cols-1 md:grid-cols-2'} gap-4 md:gap-10 lg:gap-16`}>
          {displayedProjects.length > 0 ? (
            displayedProjects.map((project) => (
              <a
                key={project.id}
                href={project.link || "#"}
                target={project.link ? "_blank" : "_self"}
                rel="noreferrer"
                className="framer-card-work group flex flex-col gap-5 block cursor-pointer"
              >
                <div className={`${activeTab === 'graphics' ? 'w-[85%] mx-auto aspect-[3/4]' : 'w-full aspect-[4/3] rounded-3xl overflow-hidden'} relative flex items-center justify-center ${project.bg} ${project.paddingClass || ''}`}>
                  <img
                    src={project.img}
                    alt={project.title}
                    className={`w-full h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] ${activeTab === 'graphics' || project.contain ? 'object-contain group-hover:scale-105' : 'object-cover group-hover:scale-105'}`}
                    onError={(e) => {
                      e.target.onerror = null; 
                      e.target.src = "https://placehold.co/800x600/282732/d9ecff?text=Project+Preview";
                    }}
                  />
                  {activeTab !== 'graphics' && (
                    <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none"></div>
                  )}
                </div>
                
                <div className={`flex flex-col gap-2 px-2 ${activeTab === 'graphics' ? 'w-[85%] mx-auto' : 'w-full'}`}>
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
      </section>

      {/* Quick Links Section */}
      <section className="w-full max-w-7xl mx-auto section-padding mt-32 border-t border-white/10 pt-20">
        <h3 className="text-3xl font-bold mb-10">Quick Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Link to="/" className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#cda144]/50 transition-colors">
            <h4 className="text-xl font-bold text-white group-hover:text-[#cda144] transition-colors">Home Page</h4>
            <p className="text-white-50 mt-2">Return to the main landing page.</p>
          </Link>
          <Link to="/#experience" className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#cda144]/50 transition-colors">
            <h4 className="text-xl font-bold text-white group-hover:text-[#cda144] transition-colors">Experience</h4>
            <p className="text-white-50 mt-2">View my professional work history.</p>
          </Link>
          <Link to="/#contact" className="group p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-[#cda144]/50 transition-colors">
            <h4 className="text-xl font-bold text-white group-hover:text-[#cda144] transition-colors">Contact Me</h4>
            <p className="text-white-50 mt-2">Let's build something amazing together.</p>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default WorkPage;
