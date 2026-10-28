import { useMemo, useState } from "react";

import { expCards } from "../constants";
import TitleHeader from "../components/TitleHeader";
import AgenticFactory3D from "../components/ui/agentic-factory-3d";

const Experience = () => {
  const [activeStation, setActiveStation] = useState(0);
  const careerStations = useMemo(
    () =>
      expCards.map((card) => ({
        id: card.title,
        title: card.title,
        organization:
          card.companyName || card.title.split("—").at(-1)?.trim() || "Career stage",
        date: card.date,
        summary: card.responsibilities.join(" "),
        color: card.lineColor,
      })),
    []
  );

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
      <AgenticFactory3D
        height="min(90svh, 920px)"
        className="experience-factory-full mt-12 md:mt-16"
        stations={careerStations}
        activeStation={activeStation}
        onStation={setActiveStation}
      />
    </section>
  );
};

export default Experience;
