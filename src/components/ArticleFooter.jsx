import { Link } from "react-router-dom";
import HoverTextSlide from "./ui/HoverTextSlide";

const quickLinks = [
  { name: "Home", to: "/" },
  { name: "Work", to: "/#work" },
  { name: "Experience", to: "/#experience" },
  { name: "Skills", to: "/#skills" },
  { name: "Contact", to: "/#contact" },
];

const ArticleFooter = () => {
  return (
    <footer className="article-footer relative w-full overflow-hidden border-t border-white/10 bg-[#0a0a0a]">
      {/* Film grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-[1080px] px-5 md:px-0 pt-16 md:pt-[72px] pb-40 md:pb-48">
        <div className="grid grid-cols-1 gap-14 md:grid-cols-[1.15fr_1fr_1fr] md:gap-10 lg:gap-16 items-start">
          {/* Tagline — stacked heavy display like Majd */}
          <div className="text-left">
            <h2
              className="font-semibold text-[#faf7f3] tracking-[-0.02em] leading-[1.02] max-w-[320px]"
              style={{ fontSize: "clamp(2.25rem, 4.2vw, 3rem)" }}
            >
              Scaling
              <br />
              Start-ups for
              <br />
              Growth.
            </h2>
          </div>

          {/* Quick links — white framed pills, two-row wrap */}
          <div className="text-left">
            <p
              className="text-[#faf7f3] font-medium mb-5 leading-none tracking-[-0.01em]"
              style={{ fontSize: 22 }}
            >
              /Quick links
            </p>
            <div className="flex flex-wrap gap-2 max-w-[280px]">
              {quickLinks.map(({ name, to }) => (
                <Link
                  key={name}
                  to={to}
                  className="group inline-flex items-center justify-center rounded-[8px] border border-black/5 bg-[#faf7f3] px-3.5 py-[7px] text-[14px] font-medium text-[#111] shadow-[0_0_0_1px_rgba(255,255,255,0.04)] transition-colors hover:bg-white"
                >
                  <HoverTextSlide text={name} />
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div className="text-left">
            <p
              className="text-[#faf7f3] font-medium mb-5 leading-none tracking-[-0.01em]"
              style={{ fontSize: 22 }}
            >
              /Contact
            </p>
            <a
              href="mailto:lennylewis6a6y@gmail.com"
              className="group inline-flex text-[18px] text-[#faf7f3] font-normal leading-[1.4] tracking-[-0.04em] hover:text-white transition-colors break-all"
            >
              <HoverTextSlide text="lennylewis6a6y@gmail.com" />
            </a>
          </div>
        </div>
      </div>

      {/* Oversized watermark */}
      <div
        aria-hidden="true"
        className="pointer-events-none select-none absolute inset-x-0 bottom-0 flex justify-center overflow-hidden leading-none"
      >
        <span
          className="font-bold tracking-[-0.02em] text-[#faf7f3]/[0.08] translate-y-[28%]"
          style={{ fontSize: "clamp(6rem, 22vw, 26rem)" }}
        >
          LEWIS
        </span>
      </div>
    </footer>
  );
};

export default ArticleFooter;
