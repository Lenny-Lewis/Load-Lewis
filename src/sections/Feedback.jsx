import { testimonials } from "../constants";
import TestimonialGlobe from "../components/ui/testimonial-globe";

// Longitude of the first review shown (Zed OS Tech CEO, Kisumu).
const START_LNG = 26;
// Degrees travelled westward from the start, so the reviews run once round the globe.
const westOfStart = ({ lng }) => (START_LNG - lng + 360) % 360;

// In map order, every step is under 180 degrees and the globe's shortest turn is
// always the same way, so it never swings back. New reviews slot in automatically.
const items = [...testimonials].sort((a, b) => westOfStart(a) - westOfStart(b)).map((testimonial, index) => ({
  id: `review-${index}`,
  quote: testimonial.review,
  name: testimonial.name,
  role: testimonial.mentions,
  city: testimonial.city,
  country: testimonial.country,
  lat: testimonial.lat,
  lng: testimonial.lng,
  image: testimonial.imgPath,
  rating: testimonial.rating,
}));

const Feedback = () => (
  <TestimonialGlobe
    id="feedback"
    items={items}
    heading="Feedback"
    autoplay
    interval={6000}
    size={600}
    className="bg-black! py-16 md:py-24"
  />
);

export default Feedback;
