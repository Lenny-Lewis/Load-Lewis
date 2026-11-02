import { useState } from "react";

import { expCards } from "../constants";
import TitleHeader from "../components/TitleHeader";
import SkateDeckRail from "../components/ui/skate-deck-rail";
import SushiConveyorMenu from "../components/ui/sushi-conveyor-menu";
import BlurInWords from "../components/ui/BlurInWords";

const MONTHS = /\b(January|February|March|April|June|July|August|September|October|November|December)\b/g;

// "January 2023 - Present" -> "Jan 2023 – Present" so it fits tags and chips.
const shortDate = (date) =>
  date.replace(MONTHS, (month) => month.slice(0, 3)).replace(/\s*-\s*/, " – ");

// One slug per role, in the same order as expCards. Deck art lives in
// /public/images/experience/decks, plate art in /public/images/experience/plates.
const SLUGS = ["hostinger", "docker", "photoshop", "microsoft", "appwrite", "kemri"];
// Plate ring colour (theme chart-1…5) per role, matched to each brand colour.
const PLATE_TIERS = [1, 3, 3, 4, 2, 5];

const roles = expCards.map((card, index) => ({
  id: `${SLUGS[index] ?? index}-${index}`,
  slug: SLUGS[index],
  name: card.title.split("—")[0].trim(),
  company: card.companyName,
  date: shortDate(card.date),
  description: card.review,
  details: card.responsibilities,
}));

const decks = roles.map((role) => ({
  id: role.id,
  name: role.name,
  series: role.company,
  tag: role.date,
  description: role.description,
  details: role.details,
  image: `/images/experience/decks/${role.slug}.svg`,
}));

const plates = roles.map((role, index) => ({
  id: role.id,
  name: role.name,
  company: role.company,
  subtitle: role.company,
  price: role.date,
  tier: PLATE_TIERS[index] ?? 1,
  description: role.description,
  details: role.details,
  image: `/images/experience/plates/${role.slug}.svg`,
}));

// Shown on the left when a role reaches the belt's mid point. Keyed by index so
// the word animation replays for each new role.
const renderMidPoint = (plate, index) => (
  <div key={plate.id} className="flex flex-col gap-3">
    <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground lg:text-sm">
      <BlurInWords text={`${String(index + 1).padStart(2, "0")} / ${String(plates.length).padStart(2, "0")} · ${plate.price}`} stagger={0.04} />
    </p>
    <h3 className="text-3xl font-semibold leading-tight text-white xl:text-4xl">
      <BlurInWords text={plate.name} delay={0.1} stagger={0.1} />
    </h3>
    <p className="text-base font-medium text-white-50 lg:text-lg">
      <BlurInWords text={plate.company} delay={0.25} stagger={0.1} />
    </p>
    <p className="text-base leading-relaxed text-white/70 lg:text-lg">
      <BlurInWords text={plate.description} delay={0.35} stagger={0.03} />
    </p>
  </div>
);

// Temporary while comparing layouts: /?exp=rail shows the deck rail,
// anything else shows the conveyor belt.
const pickVariant = () => {
  if (typeof window === "undefined") return "belt";
  return new URLSearchParams(window.location.search).get("exp") === "rail" ? "rail" : "belt";
};

const Experience = () => {
  const [variant] = useState(pickVariant);

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

      <div className="dark mt-10 md:mt-14">
        {variant === "rail" ? (
          <SkateDeckRail
            items={decks}
            caption="Hover along the rail to face a role. Click it to open the details."
            labels={{ graphic: "Front", grip: "Back", close: "Close", open: "Open" }}
            autoplay
            aria-label="Professional work experience"
            className="bg-black!"
          />
        ) : (
          <SushiConveyorMenu
            items={plates}
            legend={{}}
            renderCenter={renderMidPoint}
            caption="Hover to stop the belt, flick to spin it, pick a role to see the details."
            labels={{ add: "", close: "Close", previous: "Previous role", next: "Next role", pause: "Pause belt", front: "Front", back: "Back" }}
            autoplay
            aria-label="Professional work experience"
            className="bg-black!"
          />
        )}
      </div>
    </section>
  );
};

export default Experience;
