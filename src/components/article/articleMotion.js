/**
 * Motion settings for the article pages, taken from majd-portfolio.framer.website:
 * elements start 20px low and transparent, then rise on a bounce-free spring
 * lasting 1.6s. Framer's site waits ~1s for its page transition; ours has no
 * transition, so the on-load delays here are shorter.
 */
export const articleSpring = { type: "spring", bounce: 0, duration: 1.6 };

/** On page load (header, hero image). */
export const fadeUpOnLoad = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { ...articleSpring, delay },
});

/** When scrolled into view (body sections, cards). */
export const fadeUpInView = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "0px 0px -60px 0px" },
  transition: { ...articleSpring, delay },
});
