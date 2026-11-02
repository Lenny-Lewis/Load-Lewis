import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeUpInView } from "./articleMotion";

/**
 * Tall image card used on the all-articles page and under "More Articles",
 * sized like Majd's blog cards: 460px tall, 20px corners, date / title /
 * description pinned to the bottom over a dark gradient.
 */
const ArticleCard = ({ article, index = 0 }) => (
  <motion.div {...fadeUpInView((index % 3) * 0.1)}>
    <Link
      to={`/article/${article.slug}`}
      className="group relative flex h-[460px] w-full flex-col justify-end overflow-hidden rounded-[20px] bg-neutral-950 p-5"
    >
      <img
        src={article.image}
        alt={article.title}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:scale-105"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />

      <div className="relative z-10 flex flex-col text-left">
        <span className="mb-2 text-[16px] font-normal leading-[1.4] tracking-[-0.04em] text-[#faf7f3]/90">
          {article.date}
        </span>
        <h3 className="mb-2 text-[28px] font-medium leading-[1.2] tracking-[-0.02em] text-white min-[810px]:text-[30px] min-[1280px]:text-[32px]">
          {article.title}
        </h3>
        <p className="line-clamp-2 text-[16px] font-normal leading-[1.4] tracking-[-0.04em] text-[#faf7f3]/80">
          {article.cardDesc || article.subtitle}
        </p>
      </div>
    </Link>
  </motion.div>
);

export default ArticleCard;
