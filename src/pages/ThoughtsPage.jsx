import { motion } from "framer-motion";
import { articles } from "../data/articles";
import SiteHalftoneFooter from "../components/SiteHalftoneFooter";
import SiteNavPill from "../components/SiteNavPill";
import ArticleCard from "../components/article/ArticleCard";
import { fadeUpOnLoad } from "../components/article/articleMotion";

/*
 * All articles, laid out like majd-portfolio.framer.website/blog: a large
 * heading and short intro in the 1080px column, then every article as a tall
 * image card in a 3-column grid with 16px gaps (2 columns on tablets, 1 on
 * phones). Uses the article pages' dark theme, type and motion.
 */
const ThoughtsPage = () => (
  <div className="article-detail-page w-full min-h-screen bg-black text-white selection:bg-white selection:text-black">
    <SiteNavPill label="Articles navigation" />
    <main id="thoughts-index" className="w-full pt-[140px] md:pt-[180px] pb-20 md:pb-28">
      <div className="w-full max-w-[1080px] mx-auto px-5 lg:px-0">
        <motion.header {...fadeUpOnLoad(0.15)} className="mb-12 md:mb-16 max-w-[560px] text-left">
          <h1 className="mb-5 text-[52px] font-bold leading-none tracking-[-0.02em] text-white min-[810px]:text-[62px] min-[1280px]:text-[72px] max-[480px]:text-[44px]">
            My Latest Thoughts
          </h1>
          <p className="max-w-[460px] text-[18px] font-normal leading-[1.4] tracking-[-0.04em] text-neutral-400">
            Ideas and lessons from building websites, AI products and interactive 3D. Each
            article looks at how thoughtful design and engineering make digital work clearer,
            faster and more memorable.
          </p>
        </motion.header>

        <div className="grid grid-cols-1 gap-4 min-[810px]:grid-cols-2 min-[1080px]:grid-cols-3">
          {articles.map((article, idx) => (
            <ArticleCard key={article.id} article={article} index={idx} />
          ))}
        </div>
      </div>
    </main>

    <SiteHalftoneFooter />
  </div>
);

export default ThoughtsPage;
