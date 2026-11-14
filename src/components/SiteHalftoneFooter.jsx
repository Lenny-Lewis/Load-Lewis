import { useNavigate } from "react-router-dom";
import HalftoneWordmarkFooter from "@/components/ui/halftone-wordmark-footer";
import { socialImgs } from "../constants";
import { track } from "../lib/analytics";

/**
 * The site's halftone footer, shared by every page that has a footer so they
 * all stay identical.
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
      { label: "Services", href: "/#services" },
      { label: "Pricing", href: "/#pricing" },
      { label: "Experience", href: "/#experience" },
      { label: "Skills", href: "/#skills" },
      { label: "Contact", href: "/#contact" },
    ],
  },
  {
    title: "Social",
    content: (
      <div className="socials">
        {socialImgs.map(({ name, url, imgPath }) => (
          <a key={name} href={url} target="_blank" rel="noopener noreferrer" className={`icon ${name}-icon`}>
            <img src={imgPath} alt={name} />
          </a>
        ))}
      </div>
    ),
  },
  {
    title: "Contact",
    links: [
      { label: "lennylewis6a6y@gmail.com", href: "mailto:lennylewis6a6y@gmail.com" },
      { label: "Start a project", href: "/#contact" },
    ],
  },
];

const SignOff = () => (
  <div className="mt-3">
    <p>© {new Date().getFullYear()} Lennox Lewis. All rights reserved.</p>
    <img
      src="/images/branding/mysignature.png"
      alt="Lennox Lewis signature"
      loading="lazy"
      className="mt-2 h-12 w-24 object-contain object-left"
    />
  </div>
);

const SiteHalftoneFooter = () => {
  const navigate = useNavigate();

  const onClickCapture = (event) => {
    const anchor = event.target.closest?.("a[href]");
    if (!anchor || event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const href = anchor.getAttribute("href");
    if (!href) return;

    if (href.startsWith("mailto:")) track("email_click", { email_source: "site_footer" });

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
        meta="Nairobi, Kenya"
        brandExtra={<SignOff />}
        columns={columns}
        rulePosition="top"
        palette={{ background: "#000000", ink: "#e9e4da", warm: "#8b5cf6" }}
        fontFamily='"Archivo", "Helvetica Neue", Arial, sans-serif'
        fontWeight={800}
        height="clamp(540px, 52vw, 640px)"
      />
    </div>
  );
};

export default SiteHalftoneFooter;
