import PricingSection from "../components/ui/pricing-section-3";
import { services } from "../constants";

const Pricing = () => (
  <section id="pricing" className="padding-x-lg mt-24 md:mt-32">
    <PricingSection services={services} />
  </section>
);

export default Pricing;
