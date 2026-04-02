import Testimonials from "./sections/Testimonials";
import Footer from "./sections/Footer";
import Contact from "./sections/Contact";
import TechStack from "./sections/TechStack";
import Experience from "./sections/Experience";
import Hero from "./sections/Hero";
import ShowcaseSection from "./sections/ShowcaseSection";
import LogoShowcase from "./sections/LogoShowcase";
import FeatureCards from "./sections/FeatureCards";
import PortfolioChatbot from "./sections/PortfolioChatbot";
import Navbar from "./components/NavBar";
import AboutSection from "./sections/AboutSection";

const App = () => (
  <>
    <Navbar />
    <Hero />
    <AboutSection />
    <ShowcaseSection />
    <LogoShowcase />
    <FeatureCards />
    <Experience />
    <TechStack />
    <PortfolioChatbot />
    <Testimonials />
    <Contact />
    <Footer />
  </>
);

export default App;
