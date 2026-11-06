import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { companyProfilePath } from "../data/companyProfiles";

const CompanyProfileGrid = ({ profiles }) => (
  <div className="mx-auto flex w-full max-w-[696px] flex-col">
    {profiles.map((profile) => (
      <Link key={profile.slug} to={companyProfilePath(profile.slug)} className="group relative block px-4 py-[30px]">
        <ArrowUpRight
          aria-hidden="true"
          className="absolute right-4 top-[30px] size-5 text-primary transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
        />
        <h3 className="max-w-[480px] text-[26px] font-semibold leading-[1.2] text-white transition-colors duration-300 group-hover:text-primary">
          {profile.title}
        </h3>
        <p className="mt-3.5 max-w-[480px] text-base leading-[1.4] text-[#998f8f]">{profile.excerpt}</p>
        <div className="mt-5 flex items-center justify-between text-base leading-[1.1] text-[#998f8f]">
          <span>{profile.date}</span>
          <span>{profile.pages} pages</span>
        </div>
      </Link>
    ))}
  </div>
);

export default CompanyProfileGrid;
