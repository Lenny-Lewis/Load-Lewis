import Feedback from "../sections/Feedback";
import Thoughts from "../sections/Thoughts";
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
      <Feedback />
      <Thoughts />
      <Contact />
    </>
  );
};

export default HomePage;
