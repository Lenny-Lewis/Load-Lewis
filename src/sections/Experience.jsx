import { expCards } from "../constants";
import TitleHeader from "../components/TitleHeader";
import DishOrbitCarousel from "../components/ui/dish-orbit-carousel";

const MONTHS = /\b(January|February|March|April|June|July|August|September|October|November|December)\b/g;

// "January 2023 - Present" -> "Jan 2023 – Present" so it fits the eyebrow.
const shortDate = (date) =>
  date.replace(MONTHS, (month) => month.slice(0, 3)).replace(/\s*-\s*/, " – ");

// Defined once, outside the component: the carousel re-runs its swap when this
// array changes identity.
const roles = expCards.map((card, index) => {
  // "Full Stack Developer" -> thin "Full Stack" over heavy "Developer".
  const words = card.title.split("—")[0].trim().split(" ");
  const subtitle = words.pop();

  return {
    title: words.join(" "),
    subtitle,
    image: `/images/experience/plates/${card.plate}.svg`,
    alt: card.plateAlt,
    eyebrow: shortDate(card.date),
    badge: String(index + 1).padStart(2, "0"),
    heading: card.companyName,
    subheading: card.subheading,
    description: card.review,
    details: card.responsibilities,
    accent: card.lineColor,
  };
});

// Caps the carousel's scale. 54.17vw is its 960 x 520 design ratio, so narrower
// screens get no empty space above and below it.
const CAROUSEL_HEIGHT = "min(560px, 54.17vw, 85svh)";

const Experience = () => {
  return (
    <section id="experience" className="experience-section md:mt-40 mt-20">
      <div className="px-5 md:px-20">
        <TitleHeader title="My Career Path" />
      </div>

      <div className="dark mt-10 md:mt-14 [--color-background:#000]">
        <DishOrbitCarousel
          dishes={roles}
          height={CAROUSEL_HEIGHT}
          labels={{
            region: "Career path",
            pager: "Choose a stage",
            previous: "Previous stage",
            next: "Next stage",
            details: "Highlights",
            item: "Stage",
          }}
        />
      </div>
    </section>
  );
};

export default Experience;
