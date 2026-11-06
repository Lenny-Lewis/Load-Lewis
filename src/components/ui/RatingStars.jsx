const RatingStars = ({ rating, className = "", sizeClassName = "size-5" }) => {
  // Reviews without a rating show no stars rather than an assumed score.
  if (rating === undefined) return null;

  const value = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div role="img" aria-label={`${value} out of 5 stars`} className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: 5 }, (_, index) => (
        <img
          key={index}
          src="/images/ui/star.png"
          alt=""
          aria-hidden="true"
          className={`${sizeClassName} ${index < value ? "opacity-100" : "opacity-25"}`}
        />
      ))}
    </div>
  );
};

export default RatingStars;
