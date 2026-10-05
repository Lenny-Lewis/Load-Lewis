import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Link } from "react-router-dom";
import TitleHeader from "../components/TitleHeader";
import ProjectGrid from "../components/ProjectGrid";

gsap.registerPlugin(ScrollTrigger);

const webProjects = [
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
    id: 2,
    title: "Mojito - Interactive GSAP Cocktails",
    desc: "An immersive 3D/GSAP animated cocktail website built with modern web animations and smooth transitions.",
    img: "/images/Cocktail_Mojito.png",
    link: "https://gsap-cocktails-website-nine.vercel.app/",
    bg: "bg-[#0B1D13]"
  },
  {
    id: 7,
    title: "Pawello",
    desc: "A modern landing page for a pet care service.",
    img: "/images/Pawello_Project.png", 
    link: "https://tedious-backgrounds-421163.framer.app/",
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
          <h2 className="text-2xl md:text-4xl font-bold uppercase tracking-wide">
            Featured Projects
          </h2>
          <Link 
            to="/work"
            className="group flex items-center gap-2 text-white-50 hover:text-white transition-colors text-xs md:text-sm font-semibold tracking-wider uppercase"
          >
            View More 
            <span className="transform transition-transform group-hover:translate-x-1 group-hover:-translate-y-1">↗</span>
          </Link>
        </div>
      </div>
      
      {/* Grid Content — sizing lives in the shared ProjectGrid */}
      <div className="w-full max-w-7xl mx-auto mt-6">
        <ProjectGrid projects={webProjects} />
      </div>
    </section>
  );
};

export default AppShowcase;
