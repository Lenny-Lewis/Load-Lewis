import { Testimonial } from "../components/ui/design-testimonial";
import { testimonials } from "../constants";
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
      <Testimonial testimonials={testimonials} />
      <Thoughts />
      <Contact />
    </>
  );
};

export default HomePage;
