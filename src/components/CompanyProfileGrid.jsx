import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const pageSrc = (profile, page) =>
  `/images/company-profiles/${profile.slug}/page-${String(page).padStart(2, "0")}.webp`;

const pageNumbers = (profile) => Array.from({ length: profile.pages }, (_, index) => index + 1);

// Full-screen reader: the pages scroll like a document.
const ProfileViewer = ({ profile, onClose }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus();

    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [onClose]);

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-label={`${profile.title} company profile`}
      tabIndex={-1}
      className="fixed inset-0 z-[200] overflow-y-auto bg-black/90 px-4 py-16 outline-none backdrop-blur-md sm:px-6"
      onClick={(event) => {
        if (!event.target.closest("img")) onClose();
      }}
    >
      <button
        type="button"
        aria-label={`Close ${profile.title} company profile`}
        onClick={onClose}
        className="fixed right-4 top-4 z-10 flex size-11 cursor-pointer items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:right-8 sm:top-8"
      >
        <X className="size-5" aria-hidden="true" />
      </button>

      <div className="mx-auto flex w-full max-w-[800px] flex-col gap-4">
        {pageNumbers(profile).map((page) => (
          <img
            key={page}
            src={pageSrc(profile, page)}
            alt={`${profile.title} company profile, page ${page} of ${profile.pages}`}
            width={1075}
            height={1520}
            loading={page === 1 ? "eager" : "lazy"}
            decoding="async"
            className="h-auto w-full rounded-lg"
          />
        ))}
      </div>
    </div>
  );
};

const CompanyProfileGrid = ({ profiles }) => {
  const [activeSlug, setActiveSlug] = useState(null);
  const triggers = useRef({});
  const active = profiles.find((profile) => profile.slug === activeSlug);

  const close = () => {
    triggers.current[activeSlug]?.focus();
    setActiveSlug(null);
  };

  return (
    <>
      <div className="mx-auto grid w-full max-w-[1176px] grid-cols-1 gap-4 min-[810px]:grid-cols-2">
        {profiles.map((profile) => (
          <button
            key={profile.slug}
            ref={(node) => {
              triggers.current[profile.slug] = node;
            }}
            type="button"
            onClick={() => setActiveSlug(profile.slug)}
            className="group flex cursor-pointer flex-col gap-2.5 rounded-[20px] text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <span
              className="relative block aspect-[4/3] w-full overflow-hidden rounded-[20px]"
              style={{ background: `linear-gradient(135deg, ${profile.panel[0]}, ${profile.panel[1]})` }}
            >
              <img
                src={pageSrc(profile, 1)}
                alt=""
                loading="lazy"
                decoding="async"
                className="absolute left-1/2 top-[7%] h-auto w-[62%] max-w-none -translate-x-1/2 rounded-t-lg shadow-[0_18px_50px_rgba(0,0,0,0.4)] transition-transform duration-500 group-hover:-translate-y-1 motion-reduce:transition-none"
              />
            </span>
            <span className="block">
              <span className="block text-[28px] font-medium leading-[1.2] tracking-[-0.02em] text-white transition-colors duration-300 group-hover:text-primary min-[810px]:text-[30px] xl:text-[32px]">
                {profile.title}
              </span>
              <span className="block text-base leading-[1.4] text-white-50">
                {profile.desc} · {profile.pages} pages
              </span>
            </span>
          </button>
        ))}
      </div>

      {active && <ProfileViewer profile={active} onClose={close} />}
    </>
  );
};

export default CompanyProfileGrid;
