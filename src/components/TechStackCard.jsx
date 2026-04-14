import { useState } from "react";

import TechIconCardExperience from "./models/tech_logos/TechIconCardExperience";

const TechStackCard = ({ techStackIcon }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="card-border tech-card overflow-hidden group xl:rounded-full rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="tech-card-animated-bg" />
      <div className="tech-card-content">
        <div className="tech-icon-wrapper">
          <TechIconCardExperience model={techStackIcon} isActive={isHovered} />
        </div>
        <div className="padding-x w-full">
          <p>{techStackIcon.name}</p>
        </div>
      </div>
    </div>
  );
};

export default TechStackCard;
