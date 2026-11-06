import { Link, Navigate, useParams } from "react-router-dom";
import ProfileBlocks from "../components/ProfileBlocks";
import SiteHalftoneFooter from "../components/SiteHalftoneFooter";
import SiteNavPill from "../components/SiteNavPill";
import { companyProfiles, PREVIEW_PAGES } from "../data/companyProfiles";

const CompanyProfilePage = () => {
  const { slug } = useParams();
  const profile = companyProfiles.find((item) => item.slug === slug);

  if (!profile) return <Navigate to="/work?tab=profiles" replace />;

  return (
    <>
      <SiteNavPill label="Company profile navigation" />
      <main className="w-full bg-black px-5 pb-20 pt-32 md:pb-28 md:pt-40" style={{ "--profile-accent": profile.accent }}>
        <article className="mx-auto w-full max-w-[920px]">
          <Link
            to="/work?tab=profiles"
            className="group mb-6 flex w-fit items-center gap-2.5 text-lg leading-[1.4] tracking-[-0.04em] text-white"
          >
            <span className="grid size-7 place-items-center rounded-lg border border-white text-sm transition-colors group-hover:bg-white group-hover:text-black">
              ←
            </span>
            Back
          </Link>

          <img
            src={profile.cover.src}
            alt={profile.cover.alt}
            width={1840}
            height={876}
            className="aspect-[21/10] h-auto w-full rounded-[20px] object-cover object-bottom"
          />

          <div className="mt-4 flex items-center justify-between text-base leading-[1.4] text-[#998f8f]">
            <span>{profile.date}</span>
            <span>{profile.pages} pages</span>
          </div>
          <h1 className="mt-4 text-4xl font-bold leading-[1.2] text-white md:text-[50px]">{profile.title}</h1>

          <div className="mt-10">
            <ProfileBlocks blocks={profile.content} />
          </div>

          <div className="mt-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <p className="text-lg leading-[1.4] text-white">
              You've read {PREVIEW_PAGES} of {profile.pages} pages.
            </p>
            <Link
              to="/#contact"
              state={{ message: `Hi Lennox, I'd like to request the full ${profile.title} company profile.` }}
              className="group flex w-fit flex-none items-center gap-2 text-sm font-semibold uppercase tracking-wider text-white"
            >
              Request full profile
              <span className="transition-transform group-hover:-translate-y-1 group-hover:translate-x-1">↗</span>
            </Link>
          </div>
        </article>
      </main>
      <SiteHalftoneFooter />
    </>
  );
};

export default CompanyProfilePage;
