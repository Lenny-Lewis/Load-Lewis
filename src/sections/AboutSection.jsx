import { aboutHighlights, resumeLinks } from "../constants";

const AboutSection = () => {
  return (
    <section id="about" className="section-padding">
      <div className="w-full md:px-10 px-5">
        <div className="about-layout">
          <div className="about-story card-border">
            <p className="about-kicker">About Lennox</p>
            <h2>
              A frontend-focused builder with strong product instincts and an
              eye for clean user experiences.
            </h2>
            <p>
              Lennox Lewis Odhiambo is a developer based in Kenya who builds
              web and mobile experiences with attention to clarity,
              responsiveness, and real-world usability while actively growing
              through product work and project delivery.
            </p>
            <p>
              He enjoys turning ideas into interfaces that feel polished,
              easy to use, and technically sound.
            </p>
            <div className="about-actions">
              <a href={resumeLinks.resume} download className="about-action primary">
                Download Resume
              </a>
              <a href={resumeLinks.cv} download className="about-action secondary">
                Download CV
              </a>
            </div>
          </div>

          <div className="about-grid">
            {aboutHighlights.map((item) => (
              <article key={item.title} className="about-card card-border">
                <p className="about-kicker">{item.title}</p>
                <h3>{item.value}</h3>
                <p>{item.desc}</p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
