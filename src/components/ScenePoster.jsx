const ScenePoster = ({ kind, label }) => (
  <div
    className="flex h-full min-h-[360px] w-full items-center justify-center overflow-hidden bg-[radial-gradient(ellipse_at_center,_#27212f_0%,_#09090b_70%)]"
    role="img"
    aria-label={label}
  >
    <svg width="640" height="420" viewBox="0 0 640 420" aria-hidden="true">
      {kind === "computer" ? (
        <g fill="none" stroke="#d8bd82" strokeOpacity=".8" strokeWidth="5" strokeLinejoin="round">
          <path d="M155 95h330v215H155z" />
          <path d="M205 310l-24 49h278l-24-49M255 359h130" />
          <path d="M185 125h270v155H185z" strokeOpacity=".25" />
        </g>
      ) : (
        <g>
          <circle cx="320" cy="210" r="132" fill="#79c8dc" fillOpacity=".12" />
          <circle cx="320" cy="210" r="112" fill="#376a83" stroke="#a1e6f1" strokeOpacity=".6" strokeWidth="3" />
          <path d="M250 115c-28 34-39 72-32 111 6 38 26 73 59 93l29-28-9-34 22-22-14-25 15-30-19-23-7-34-44-8zm105 1 12 31 35 8 7 35 25 25-19 28-31 3-15 27-33-8-10-33 23-25-8-31 19-22-5-38z" fill="#87d5dc" fillOpacity=".7" />
        </g>
      )}
    </svg>
  </div>
);

export default ScenePoster;
