import { useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { articles } from "../data/articles";
import SiteHalftoneFooter from "../components/SiteHalftoneFooter";
import SiteNavPill from "../components/SiteNavPill";
import ArticleCard from "../components/article/ArticleCard";
import RichText from "../components/article/RichText";
import { fadeUpInView, fadeUpOnLoad } from "../components/article/articleMotion";

/*
 * Layout, type scale and motion follow majd-portfolio.framer.website's article
 * page (kept on our dark theme):
 *   - 1080px column: 740px article on the left, 300px sticky newsletter right
 *   - title 52 → 62 → 72px bold, line-height 1; section headings 32 → 42 → 52px
 *     semibold, line-height 1.2; body 18px, line-height 1.4, -0.04em
 *     (breakpoints 810px and 1280px, as on Framer)
 *   - bold highlights inside paragraphs, a pull-quote after sections, tips
 *   - header and hero rise in on load; sections rise in as they scroll into view
 */

const BODY = "text-[18px] font-normal leading-[1.4] tracking-[-0.04em] text-neutral-300";

const NewsletterCard = ({ email, setEmail, subscribed, onSubmit }) => (
  <div className="article-newsletter w-full bg-[#111] rounded-[18px] p-5 text-left shadow-2xl">
    <h3
      className="text-[#faf7f3] leading-6 tracking-[-0.04em] font-semibold"
      style={{ fontSize: 20 }}
    >
      Join the newsletter
    </h3>
    <p
      className="mt-2 text-[#faf7f3]/80 leading-[1.4] tracking-[-0.04em] font-normal"
      style={{ fontSize: 16 }}
    >
      Be the first to read our articles.
    </p>

    {subscribed ? (
      <div className="flex items-center gap-2 mt-5 py-2 text-white text-sm font-medium">
        <Check className="size-4 text-emerald-400 shrink-0" />
        <span>You are subscribed. Thank you!</span>
      </div>
    ) : (
      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          autoComplete="email"
          className="article-newsletter__input w-full bg-transparent border-0 border-b border-white/25 rounded-none px-0 py-3 text-base text-[#faf7f3] placeholder:text-[#faf7f3]/30 outline-none focus:outline-none focus:ring-0 focus:border-white/50 transition-colors tracking-[-0.04em]"
        />
        <button
          type="submit"
          className="w-full py-3 rounded-[12px] bg-[#faf7f3] text-[#111] font-semibold text-base hover:bg-white transition-colors cursor-pointer text-center tracking-[-0.02em] focus:outline-none focus:ring-0"
        >
          Submit
        </button>
      </form>
    )}
  </div>
);

const Paragraph = ({ text, className = "" }) => {
  // Keeps the existing "Templyo." link in the first article's copy.
  if (text.includes("Templyo.")) {
    const [before, after] = text.split("Templyo.");
    return (
      <p className={`${BODY} ${className}`}>
        <RichText text={before} />
        <a
          href="https://templyo.com"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 font-medium text-white hover:text-neutral-400 transition-colors"
        >
          Templyo.
        </a>
        <RichText text={after} />
      </p>
    );
  }
  return (
    <p className={`${BODY} ${className}`}>
      <RichText text={text} />
    </p>
  );
};

const ArticleSection = ({ section }) => (
  <motion.div {...fadeUpInView()} className="w-full max-w-full">
    <h2 className="mb-6 text-[32px] font-semibold leading-[1.2] tracking-[-0.02em] text-white min-[810px]:text-[42px] min-[1280px]:text-[52px]">
      {section.heading}
    </h2>

    <div className="space-y-5">
      {section.paragraphs?.map((p, idx) => (
        <Paragraph key={idx} text={p} />
      ))}

      {section.bullets && (
        <ul className={`${BODY} space-y-1 pl-5`}>
          {section.bullets.map((bullet, idx) => (
            <li key={idx} className="relative">
              <span aria-hidden="true" className="absolute -left-5 text-neutral-400">•</span>
              <RichText text={bullet} />
            </li>
          ))}
        </ul>
      )}

      {section.outro && <Paragraph text={section.outro} />}

      {section.tip && (
        <p className={BODY}>
          <strong className="font-semibold text-white">Tip:</strong> <RichText text={section.tip} />
        </p>
      )}

      {section.quote && (
        <blockquote className={`${BODY} pt-3`}>
          “{section.quote.text}” –{" "}
          <strong className="font-semibold text-white not-italic">{section.quote.author}</strong>
        </blockquote>
      )}
    </div>
  </motion.div>
);

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const article = articles.find((a) => a.slug === slug || a.id === slug);

  if (!article) {
    return <Navigate to="/thoughts" replace />;
  }

  const sections = article.sections ?? [];
  const earlySections = sections.slice(0, 4);
  const laterSections = sections.slice(4);
  const relatedArticles = articles.filter((a) => a.slug !== article.slug).slice(0, 3);

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;
    setSubscribed(true);
    setEmail("");
  };

  const newsletterProps = {
    email,
    setEmail,
    subscribed,
    onSubmit: handleNewsletterSubmit,
  };

  return (
    <div className="article-detail-page w-full min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <SiteNavPill label="Article page navigation" />
      <main id="article-section" className="w-full pt-[140px] md:pt-[180px] pb-16 md:pb-20">
        <div className="w-full max-w-[1080px] mx-auto px-5 lg:px-0">
          {/* Title, subtitle, meta and hero: left 740px column, as on Majd's page */}
          <div className="w-full lg:w-[740px] text-left">
            <motion.header {...fadeUpOnLoad(0.15)} className="mb-8">
              <h1 className="mb-5 text-[52px] font-bold leading-none tracking-[-0.02em] text-white min-[810px]:text-[62px] min-[1280px]:text-[72px] max-[480px]:text-[40px]">
                {article.title}
              </h1>

              {article.subtitle && <p className={`${BODY} text-neutral-400`}>{article.subtitle}</p>}
            </motion.header>

            <motion.div {...fadeUpOnLoad(0.3)} className="mb-12 md:mb-16">
              <div className="mb-4 flex items-center justify-between text-[16px] font-normal leading-[1.4] tracking-[-0.04em] text-neutral-400">
                <span>{article.date}</span>
                <span>{article.readTime}</span>
              </div>
              <div className="relative w-full aspect-[740/430] rounded-[20px] overflow-hidden bg-neutral-900">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>

          {/*
            Sticky track: starts at the first body heading, ends after the last
            body section. The newsletter sticks while this block scrolls, then
            parks at its bottom. Text stays in the left 740px.
          */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between lg:gap-10">
            <article className="w-full lg:w-[740px] lg:max-w-[740px] lg:shrink-0 space-y-14 md:space-y-16 text-left min-w-0 overflow-x-clip">
              {earlySections.map((section, idx) => (
                <ArticleSection key={idx} section={section} />
              ))}

              {/* Mobile: newsletter after section 4 */}
              <div className="lg:hidden w-full max-w-[300px]">
                <NewsletterCard {...newsletterProps} />
              </div>

              {laterSections.map((section, idx) => (
                <ArticleSection key={idx + 4} section={section} />
              ))}
            </article>

            <aside className="hidden lg:block w-[300px] shrink-0 sticky top-28 self-start z-20">
              <motion.div {...fadeUpOnLoad(0.45)}>
                <NewsletterCard {...newsletterProps} />
              </motion.div>
            </aside>
          </div>

          {/* More Articles — outside the sticky track */}
          {relatedArticles.length > 0 && (
            <section className="mt-24 md:mt-32 text-left">
              <motion.h2
                {...fadeUpInView()}
                className="mb-8 md:mb-10 text-[32px] font-semibold leading-[1.2] tracking-[-0.02em] text-white min-[810px]:text-[42px] min-[1280px]:text-[52px]"
              >
                More Articles
              </motion.h2>

              <div className="grid grid-cols-1 gap-4 min-[810px]:grid-cols-2 min-[1080px]:grid-cols-3">
                {relatedArticles.map((item, idx) => (
                  <ArticleCard key={item.id} article={item} index={idx} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <SiteHalftoneFooter />
    </div>
  );
};

export default ArticleDetailPage;
