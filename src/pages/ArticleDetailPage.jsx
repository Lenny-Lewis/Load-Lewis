import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, Check } from "lucide-react";
import { motion } from "framer-motion";
import { articles, moreArticlesInspo } from "../data/articles";
import ArticleFooter from "../components/ArticleFooter";
import ArticleNavPill from "../components/ArticleNavPill";

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

const ArticleSection = ({ section }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.45 }}
    className="w-full max-w-full space-y-4"
  >
    <h2
      className="font-semibold text-white tracking-[-0.02em] leading-[1.2]"
      style={{ fontSize: "clamp(1.75rem, 4vw, 3.25rem)" }}
    >
      {section.heading}
    </h2>

    {section.paragraphs?.map((p, pIdx) => {
      if (p.includes("Templyo.")) {
        const parts = p.split("Templyo.");
        return (
          <p
            key={pIdx}
            className="text-[18px] text-neutral-300 font-normal leading-[1.4] tracking-[-0.04em]"
          >
            {parts[0]}
            <a
              href="https://templyo.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 font-medium text-white hover:text-neutral-400 transition-colors"
            >
              Templyo.
            </a>
            {parts[1]}
          </p>
        );
      }

      return (
        <p
          key={pIdx}
          className="text-[18px] text-neutral-300 font-normal leading-[1.4] tracking-[-0.04em]"
        >
          {p}
        </p>
      );
    })}

    {section.bullets && (
      <ul className="space-y-2 my-1 pl-5 list-disc marker:text-neutral-400 text-neutral-300 text-[18px] leading-[1.4] tracking-[-0.04em]">
        {section.bullets.map((bullet, bIdx) => (
          <li key={bIdx}>{bullet}</li>
        ))}
      </ul>
    )}

    {section.outro && (
      <p className="text-[18px] text-neutral-300 font-normal leading-[1.4] tracking-[-0.04em] pt-1">
        {section.outro}
      </p>
    )}
  </motion.div>
);

const ArticleDetailPage = () => {
  const { slug } = useParams();
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const article = articles.find((a) => a.slug === slug || a.id === slug);

  if (!article) {
    return <Navigate to="/#thoughts" replace />;
  }

  const sections = article.sections ?? [];
  const earlySections = sections.slice(0, 4);
  const laterSections = sections.slice(4);

  const relatedArticles = [
    ...moreArticlesInspo.filter((item) => item.slug !== article.slug),
    ...articles
      .filter(
        (a) =>
          a.slug !== article.slug &&
          !moreArticlesInspo.some((m) => m.slug === a.slug)
      )
      .map((a) => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        date: a.date,
        image: a.image,
        desc: a.cardDesc || a.subtitle,
      })),
  ].slice(0, 3);

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
      <ArticleNavPill />
      <main id="article-section" className="w-full pt-[100px] md:pt-[140px] pb-16 md:pb-20">
        <div className="w-full max-w-[1080px] mx-auto px-5 md:px-0">
          {/* Header + hero — left column only, no newsletter */}
          <div className="w-full lg:w-[740px] text-left">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8"
            >
              <Link
                to="/#thoughts"
                className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-white font-medium transition-colors duration-200 group"
              >
                <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-1" />
                <span>Back to Thoughts</span>
              </Link>
            </motion.div>

            <motion.header
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mb-6 text-left"
            >
              <h1
                className="font-bold text-white tracking-[-0.02em] leading-none mb-4"
                style={{ fontSize: "clamp(2rem, 5.5vw, 4.5rem)" }}
              >
                {article.title}
              </h1>

              {article.subtitle && (
                <p className="text-[18px] text-neutral-400 font-normal leading-[1.4] tracking-[-0.04em] mb-5">
                  {article.subtitle}
                </p>
              )}

              <div className="flex items-center justify-between text-[16px] text-neutral-500 font-normal leading-[1.4] tracking-[-0.04em]">
                <span>{article.date}</span>
                <span>{article.readTime}</span>
              </div>
            </motion.header>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.1 }}
              className="relative w-full aspect-[740/430] rounded-[20px] overflow-hidden bg-neutral-900 mb-12 md:mb-14"
            >
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover grayscale contrast-125 brightness-95"
              />
            </motion.div>
          </div>

          {/*
            Sticky track: starts at first body heading, ends after last body section.
            Newsletter sticks while scrolling this block, then parks at its bottom.
            Text stays in the left 740px — nothing renders to the right of the form.
          */}
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between lg:gap-10">
            <article className="w-full lg:w-[740px] lg:max-w-[740px] lg:shrink-0 space-y-12 md:space-y-14 text-left min-w-0 overflow-x-clip">
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
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.15 }}
              >
                <NewsletterCard {...newsletterProps} />
              </motion.div>
            </aside>
          </div>

          {/* More Articles — outside sticky track */}
          <section className="mt-20 md:mt-24 text-left">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45 }}
              className="font-semibold text-white tracking-[-0.02em] leading-[1.2] mb-8 md:mb-10"
              style={{ fontSize: "clamp(1.75rem, 4vw, 3.25rem)" }}
            >
              More Articles
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {relatedArticles.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                >
                  <Link
                    to={`/article/${item.slug}`}
                    className="group relative h-[460px] w-full rounded-[20px] overflow-hidden bg-neutral-950 flex flex-col justify-end p-5 block"
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 brightness-90 group-hover:scale-105 transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent pointer-events-none" />

                    <div className="relative z-10 flex flex-col justify-end text-left">
                      <span className="text-[16px] text-[#faf7f3]/90 font-normal leading-[1.4] tracking-[-0.04em] mb-2">
                        {item.date}
                      </span>
                      <h3 className="text-[28px] font-medium tracking-[-0.02em] text-white leading-[1.2] mb-2">
                        {item.title}
                      </h3>
                      <p className="text-[16px] text-[#faf7f3]/80 leading-[1.4] tracking-[-0.04em] font-normal line-clamp-2">
                        {item.desc}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      </main>

      <ArticleFooter />
    </div>
  );
};

export default ArticleDetailPage;
