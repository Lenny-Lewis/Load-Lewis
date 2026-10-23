import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { testimonials } from "../constants";
import TestimonialsColumn from "../components/ui/testimonials-columns-1";
import RatingStars from "../components/ui/RatingStars";
import { Button } from "../components/ui/button";

const CommentsPage = () => {
  const firstColumn = testimonials.slice(0, 3);
  const secondColumn = testimonials.slice(3, 6);
  const thirdColumn = testimonials.slice(6, 9);

  return (
    <main className="min-h-screen px-5 pb-24 pt-24 md:px-10 md:pt-28">
      <div className="mx-auto w-full max-w-6xl">
        <Button asChild variant="ghost" className="-ml-3 text-white/70 hover:text-white">
          <Link to="/#feedback">
            <ChevronLeft className="me-1 opacity-70" size={16} aria-hidden="true" />
            Back
          </Link>
        </Button>

        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-5xl">
            What my Clients say
          </h1>
          <p className="mt-4 text-base leading-relaxed text-white/65 sm:text-lg">
            See what my customers say about me.
          </p>
        </div>

        <div className="mt-12 space-y-5 md:hidden">
          {testimonials.map(({ name, mentions, rating, review, imgPath, imageAlt }) => (
            <article key={name} className="rounded-3xl border border-white/10 bg-[#16161b] p-6">
              <RatingStars rating={rating} sizeClassName="size-4" />
              <p className="mt-5 text-[15px] leading-relaxed text-white/85">{review}</p>
              <div className="mt-6 flex items-center gap-3">
                <img src={imgPath} alt={imageAlt ?? `Avatar for ${name}`} className="size-10 rounded-full object-cover" />
                <div>
                  <p className="text-sm font-semibold text-white">{name}</p>
                  <p className="text-xs text-white/50">{mentions}</p>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="relative mt-12 hidden max-h-[740px] grid-cols-3 justify-center gap-6 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_10%,black_90%,transparent)] md:grid">
          <TestimonialsColumn testimonials={firstColumn} duration={22} />
          <TestimonialsColumn testimonials={secondColumn} duration={27} />
          <TestimonialsColumn testimonials={thirdColumn} duration={24} />
        </div>

      </div>
    </main>
  );
};

export default CommentsPage;
