const TitleHeader = ({ title, sub, badgeClassName = "" }) => {
  return (
    <div className="section-title flex flex-col items-center gap-4 md:gap-5">
      {sub ? (
        <div className={`hero-badge ${badgeClassName}`.trim()}>
          <div className="hero-badge-copy">{sub}</div>
        </div>
      ) : null}
      <div>
        <h1 className="font-semibold md:text-5xl text-2xl text-center">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default TitleHeader;
