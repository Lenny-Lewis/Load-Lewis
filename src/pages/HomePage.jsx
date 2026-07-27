import Testimonials from "../sections/Testimonials";
import Contact from "../sections/Contact";
import TechStack from "../sections/TechStack";
import Experience from "../sections/Experience";
import Hero from "../sections/Hero";
import ShowcaseSection from "../sections/ShowcaseSection";
import LogoShowcase from "../sections/LogoShowcase";
import FeatureCards from "../sections/FeatureCards";

const HomePage = () => {
  return (
    <>
      <Hero />
      <ShowcaseSection />
      <LogoShowcase />
      <FeatureCards />
      <Experience />
      <TechStack />
      <Testimonials />
      <Contact />
    </>
  );
};

export default HomePage;
