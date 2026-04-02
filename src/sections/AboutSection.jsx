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
              responsiveness, and real-world usability. He is currently a Year
              3 student at Kisii University while actively growing through
              project work and product delivery.
            </p>
            <p>
              He enjoys turning ideas into interfaces that feel polished and
              easy to use, and he works best on products that need thoughtful
              frontend execution backed by practical engineering decisions.
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
