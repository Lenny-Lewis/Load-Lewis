import Feedback from "../sections/Feedback";
import Thoughts from "../sections/Thoughts";
import Contact from "../sections/Contact";
import TechStack from "../sections/TechStack";
import Experience from "../sections/Experience";
import Hero from "../sections/Hero";
import ShowcaseSection from "../sections/ShowcaseSection";
import LogoShowcase from "../sections/LogoShowcase";
import FeatureCards from "../sections/FeatureCards";
import Services from "../sections/Services";
import Pricing from "../sections/Pricing";

const HomePage = () => {
  return (
    <>
      <Hero />
      <ShowcaseSection />
      <LogoShowcase />
      <FeatureCards />
      <Services />
      <Experience />
      <TechStack />
      <Feedback />
      <Thoughts />
      <Pricing />
      <Contact />
    </>
  );
};

export default HomePage;
