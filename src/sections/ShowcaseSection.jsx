import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";
import TitleHeader from "../components/TitleHeader";

gsap.registerPlugin(ScrollTrigger);

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
  }
];

const AppShowcase = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray(".framer-card");
    
    const trigger = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top bottom-=100",
      once: true,
      onEnter: () => {
        gsap.fromTo(
          sectionRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }
        );

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
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <section id="work" ref={sectionRef} className="w-full flex-col-center section-padding pb-20">
      
      <div className="w-full max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
        <div className="flex w-full justify-between items-center">
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-wide">
            Featured Projects
          </h2>
          <Link 
            to="/work"
            className="group flex items-center gap-2 text-white-50 hover:text-white transition-colors text-sm md:text-base font-semibold tracking-wider uppercase"
          >
            View More 
            <span className="transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
          </Link>
        </div>
      </div>
      
      {/* Grid Content */}
      <div className="w-full max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16 mt-6">
        {webProjects.map((project) => (
          <a
            key={project.id}
            href={project.link || "#"}
            target={project.link ? "_blank" : "_self"}
            rel="noreferrer"
            className="framer-card group flex flex-col gap-5 block cursor-pointer"
          >
            <div className={`w-full aspect-[4/3] rounded-3xl overflow-hidden relative flex items-center justify-center ${project.bg}`}>
              <img
                src={project.img}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                onError={(e) => {
                  e.target.onerror = null; 
                  e.target.src = "https://placehold.co/800x600/282732/d9ecff?text=Project+Preview";
                }}
              />
              <div className="absolute inset-0 border border-white/5 rounded-3xl pointer-events-none"></div>
            </div>
            
            <div className="flex flex-col gap-2 px-2">
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
        ))}
      </div>
    </section>
  );
};

export default AppShowcase;
