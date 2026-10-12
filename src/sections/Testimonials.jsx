import { testimonials } from "../constants";
import TitleHeader from "../components/TitleHeader";
import ScrollReelTestimonials from "../components/ui/scroll-reel-testimonials";

const reelTestimonials = testimonials.map((testimonial) => ({
  quote: testimonial.review ?? testimonial.quote ?? "",
  author: testimonial.name ?? testimonial.author ?? "",
  image: testimonial.imgPath,
  alt: testimonial.imageAlt ?? `Image for ${testimonial.name}`,
  mentions: testimonial.mentions,
}));

const Testimonials = () => {
  return (
    <section id="testimonials" className="flex-center section-padding">
      <div className="w-full h-full md:px-10 px-5">
        <TitleHeader
          title="What People Say About My Work"
          sub="Feedback on selected websites and posters"
        />

        <div className="mt-16 flex justify-center">
          <ScrollReelTestimonials testimonials={reelTestimonials} className="mx-auto" />
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
