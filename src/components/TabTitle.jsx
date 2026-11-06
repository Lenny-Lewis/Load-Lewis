import { useEffect } from "react";
import { matchPath, useLocation } from "react-router-dom";
import { articles } from "../data/articles";
import { caseStudies } from "../data/caseStudies";

const NAME = "Lennox";

const sectionTitle = (section) => `${NAME} | ${section}`;

const PAGE_TITLES = {
  "/work": sectionTitle("Work"),
  "/thoughts": sectionTitle("Thoughts"),
  "/comments": sectionTitle("Feedback"),
};

// Homepage sections, by element id. Sections without an entry keep the previous title.
const HOME_SECTIONS = {
  hero: NAME,
  work: sectionTitle("Work"),
  services: sectionTitle("Services"),
  experience: sectionTitle("Career"),
  skills: sectionTitle("Skills"),
  feedback: sectionTitle("Feedback"),
  thoughts: sectionTitle("Thoughts"),
  pricing: sectionTitle("Pricing"),
  contact: sectionTitle("Contact"),
};

const pageTitle = (pathname) => {
  const slug = matchPath("/article/:slug", pathname)?.params.slug;
  const article = articles.find((item) => item.slug === slug || item.id === slug);
  if (article) return `${article.title} - ${NAME}`;

  const studySlug = matchPath("/work/:slug", pathname)?.params.slug;
  const study = caseStudies.find((item) => item.slug === studySlug);
  return study ? `${study.title} - ${NAME}` : PAGE_TITLES[pathname] ?? NAME;
};

// Keeps the browser tab's title in step with the page, and on the homepage,
// with whichever section is crossing the middle of the screen.
const TabTitle = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    document.title = pageTitle(pathname);
    if (pathname !== "/" || typeof IntersectionObserver === "undefined") return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const entering = entries.find((entry) => entry.isIntersecting);
        if (entering) document.title = HOME_SECTIONS[entering.target.id];
      },
      { rootMargin: "-50% 0px -50% 0px" }
    );

    Object.keys(HOME_SECTIONS)
      .map((id) => document.getElementById(id))
      .filter(Boolean)
      .forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [pathname]);

  return null;
};

export default TabTitle;
