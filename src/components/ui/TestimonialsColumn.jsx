import RatingStars from "./RatingStars";

const TestimonialsColumn = ({ testimonials, duration = 20, className = "" }) => {
  const renderCards = (duplicate = false) =>
    testimonials.map(({ name, review, mentions, imgPath, imageAlt, rating }, index) => (
      <article
        key={`${name}-${index}-${duplicate ? "copy" : "original"}`}
        className="rounded-3xl border border-white/10 bg-[#16161b] p-5 shadow-[0_14px_40px_rgba(0,0,0,0.18)] sm:p-6"
      >
        <RatingStars rating={rating} sizeClassName="size-4" />
        <p className="mt-5 text-[15px] leading-relaxed text-white/85">{review}</p>
        <div className="mt-6 flex items-center gap-3">
          <img
            src={imgPath}
            alt={duplicate ? "" : imageAlt ?? `Avatar for ${name}`}
            loading="eager"
            className="size-10 shrink-0 rounded-full border border-white/10 bg-[#25252c] object-cover"
          />
          <div className="min-w-0">
            <p className="text-sm font-semibold leading-5 text-white">{name}</p>
            <p className="text-xs leading-5 text-white/50">{mentions}</p>
          </div>
        </div>
      </article>
    ));

  return (
    <div className={`testimonials-column min-w-0 ${className}`}>
      <div
        className="testimonials-column-track flex flex-col gap-6 pb-6"
        style={{ animationDuration: `${duration}s` }}
      >
        <div className="flex flex-col gap-6">{renderCards()}</div>
        <div aria-hidden="true" className="testimonials-column-duplicate flex flex-col gap-6">
          {renderCards(true)}
        </div>
      </div>
    </div>
  );
};

export default TestimonialsColumn;
