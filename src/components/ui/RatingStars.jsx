const RatingStars = ({ rating = 5, className = "", sizeClassName = "size-5" }) => {
  const value = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div role="img" aria-label={`${value} out of 5 stars`} className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: 5 }, (_, index) => (
        <img
          key={index}
          src="/images/star.png"
          alt=""
          aria-hidden="true"
          className={`${sizeClassName} ${index < value ? "opacity-100" : "opacity-25"}`}
        />
      ))}
    </div>
  );
};

export default RatingStars;
