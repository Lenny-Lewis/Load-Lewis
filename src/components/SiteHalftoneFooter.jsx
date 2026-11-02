import { useNavigate } from "react-router-dom";
import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer";

/**
 * The site's halftone footer, shared by the Work page and article pages so the
 * two stay identical.
 *
 * The underlying component renders plain <a> tags. Clicks are intercepted here
 * so internal links ("/…") use the router (no full page reload, so the hero's
 * Spline scene and app state survive) and external links open in a new tab.
 */
const columns = [
  {
    title: "Navigate",
    links: [
      { label: "Home", href: "/" },
      { label: "Work", href: "/work" },
      { label: "Experience", href: "/#experience" },
      { label: "Skills", href: "/#skills" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    title: "Social",
    links: [
      { label: "GitHub", href: "https://github.com/Lenny-Lewis" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/lennox-lewis-975642359" },
      { label: "Instagram", href: "https://www.instagram.com/thatboylewis" },
      { label: "X / Twitter", href: "https://x.com/thatboylewis" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "lennylewis6a6y@gmail.com", href: "mailto:lennylewis6a6y@gmail.com" },
      { label: "Start a project", href: "/#contact" },
    ],
  },
];

const SiteHalftoneFooter = () => {
  const navigate = useNavigate();

  const onClickCapture = (event) => {
    const anchor = event.target.closest?.("a[href]");
    if (!anchor || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const href = anchor.getAttribute("href");
    if (!href) return;

    if (href.startsWith("/")) {
      event.preventDefault();
      navigate(href);
    } else if (/^https?:\/\//.test(href)) {
      event.preventDefault();
      window.open(href, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="w-full" onClickCapture={onClickCapture}>
      <HalftoneWordmarkFooter
        wordmark="lennox"
        label="Lennox Lewis"
        meta={`©${new Date().getFullYear()} · Nairobi, Kenya`}
        columns={columns}
        rulePosition="top"
        palette={{ background: "#000000", ink: "#e9e4da", warm: "#cda144" }}
        fontFamily='"Mona Sans", "Helvetica Neue", Arial, sans-serif'
        fontWeight={800}
        height="clamp(420px, 52vw, 600px)"
      />
    </div>
  );
};

export default SiteHalftoneFooter;
