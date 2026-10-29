import { Link } from "react-router-dom";
import { articles } from "../data/articles";

const Thoughts = () => {
  // First 2 articles for the 3-column grid
  const featuredArticles = articles.slice(0, 2);

  return (
    <section id="thoughts" className="relative w-full bg-black text-white py-16 md:py-24 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-5 md:px-10">
        {/* Section Header */}
        <div className="mb-8 md:mb-12 text-left">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white">
            Thoughts
          </h2>
        </div>

        {/* 3-Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch">
          {/* Card 1 & 2: Article Cards (compact height) */}
          {featuredArticles.map((article) => (
            <Link
              key={article.id}
              to={`/article/${article.slug}`}
              className="group relative h-[380px] sm:h-[410px] md:h-[430px] rounded-3xl overflow-hidden cursor-pointer border border-white/10 bg-neutral-950 shadow-xl hover:border-white/30 transition-all duration-500 flex flex-col justify-end"
            >
              {/* Monochrome Atmospheric Image */}
              <img
                src={article.image}
                alt={article.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
              />

              {/* Gradient overlay for contrast */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent group-hover:via-black/50 transition-colors duration-500 pointer-events-none" />

              {/* Card Meta & Typography pinned to bottom */}
              <div className="relative z-10 p-5 sm:p-7 flex flex-col justify-end text-left">
                <span className="text-xs sm:text-sm text-neutral-300 font-normal tracking-wide">
                  {article.date}
                </span>

                <h3 className="text-lg sm:text-xl md:text-[22px] font-medium tracking-tight text-white leading-snug mt-1.5 mb-1.5 group-hover:text-neutral-100 transition-colors">
                  {article.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-300/85 leading-relaxed font-normal line-clamp-2">
                  {article.cardDesc}
                </p>
              </div>
            </Link>
          ))}

          {/* Card 3: Grey Grainy Editorial Statement Card */}
          <div
            className="relative h-[380px] sm:h-[410px] md:h-[430px] rounded-3xl overflow-hidden border border-white/10 bg-[#121215] text-white p-6 sm:p-8 flex flex-col justify-between group shadow-xl transition-all duration-500 hover:border-white/25"
            style={{
              backgroundImage: `
                radial-gradient(circle at 50% 25%, rgba(255, 255, 255, 0.035) 0%, rgba(0, 0, 0, 0.6) 100%),
                url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.09'/%3E%3C/svg%3E")
              `,
              backgroundBlendMode: "screen, normal"
            }}
          >
            {/* Top / Main Statement */}
            <div className="pt-2 sm:pt-3 text-left relative z-10">
              <h3 className="text-xl sm:text-2xl lg:text-[27px] font-normal leading-[1.3] text-white tracking-tight">
                See how we shape brands with clarity and craft— explore our blog
              </h3>
            </div>

            {/* Bottom Button matching inspo */}
            <div className="pt-6 text-left relative z-10">
              <Link
                to="/work"
                className="inline-flex items-center gap-2 text-xs sm:text-sm text-neutral-300 hover:text-white transition-colors duration-200 group/btn"
              >
                <span>View All Work</span>
                <span className="inline-flex items-center justify-center size-5 rounded border border-white/30 text-xs transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5">
                  ↗
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Thoughts;
