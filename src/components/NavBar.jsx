import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

import { navLinks, resumeLinks } from "../constants";
import HoverTextSlide from "./ui/HoverTextSlide";

const NavBar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isWorkPage = location.pathname === "/work";
  const isArticlePage = location.pathname.startsWith("/article");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Work + article pages mount their own nav pills (WorkNavPill / ArticleNavPill)
  if (isWorkPage || isArticlePage) {
    return null;
  }

  return (
    <header className={`navbar ${scrolled ? "scrolled" : "not-scrolled"}`}>
      <div className="inner">
        <Link to="/#hero" className="logo group">
          <HoverTextSlide text="Lennox Lewis" />
        </Link>

        <nav className="desktop">
          <ul>
            {navLinks.map(({ link, name }) => (
              <li key={name} className="group">
                <Link to={link}>
                  <HoverTextSlide text={name} />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="nav-actions">
          <a href={resumeLinks.resume} download className="resume-btn group">
            <div className="inner">
              <HoverTextSlide text="Download Resume" />
            </div>
          </a>

          <Link to="/#contact" className="contact-btn group">
            <div className="inner">
              <HoverTextSlide text="Contact me" />
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
