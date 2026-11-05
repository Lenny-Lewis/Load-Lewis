import { expCards } from "../constants";
import TitleHeader from "../components/TitleHeader";
import DishOrbitCarousel from "../components/ui/dish-orbit-carousel";

const MONTHS = /\b(January|February|March|April|June|July|August|September|October|November|December)\b/g;

// "January 2023 - Present" -> "Jan 2023 – Present" so it fits the eyebrow.
const shortDate = (date) =>
  date.replace(MONTHS, (month) => month.slice(0, 3)).replace(/\s*-\s*/, " – ");

// One slug per role, in the same order as expCards. Art lives in
// /public/images/experience/plates.
const SLUGS = ["hostinger", "docker", "photoshop", "microsoft", "appwrite", "kemri"];

// Defined once, outside the component: the carousel re-runs its swap when this
// array changes identity.
const roles = expCards.map((card, index) => {
  // "Full Stack Developer" -> thin "Full Stack" over heavy "Developer".
  const words = card.title.split("—")[0].trim().split(" ");
  const subtitle = words.pop();

  return {
    title: words.join(" "),
    subtitle,
    image: `/images/experience/plates/${SLUGS[index]}.svg`,
    alt: `${card.companyName} logo`,
    eyebrow: shortDate(card.date),
    badge: String(index + 1).padStart(2, "0"),
    heading: card.companyName,
    description: card.review,
    details: card.responsibilities,
    accent: card.lineColor,
  };
});

const Experience = () => {
  return (
    <section id="experience" className="experience-section md:mt-40 mt-20">
      <div className="px-5 md:px-20">
        <TitleHeader
          title="Professional Work Experience"
          sub={
            <>
              <img src="/images/experience/workoverview.png" alt="" aria-hidden="true" />
              <span>My Career Overview</span>
            </>
          }
        />
      </div>

      <div className="dark mt-10 md:mt-14 [--color-background:#000]">
        <DishOrbitCarousel
          dishes={roles}
          labels={{
            region: "Professional work experience",
            pager: "Choose a role",
            previous: "Previous role",
            next: "Next role",
            details: "Responsibilities",
            item: "Role",
          }}
        />
      </div>
    </section>
  );
};

export default Experience;
