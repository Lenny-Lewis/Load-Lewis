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
    img: "/images/projects/web/Vanguard.webp",
    link: "https://vanguard-zeta-ruddy.vercel.app/",
    caseStudy: "/work/vanguard",
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
    id: 7,
    title: "Pawello",
    desc: "A modern landing page for a pet care service.",
    img: "/images/projects/web/Pawello_Project.png",
    link: "https://pawello-tawny.vercel.app/",
    caseStudy: "/work/pawello",
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
      
      <div className="w-full max-w-[1176px] mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-5">
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
      <div className="w-full max-w-[1176px] mx-auto mt-6">
        <ProjectGrid projects={webProjects} />
      </div>
    </section>
  );
};

export default AppShowcase;
