/**
 * Renders a company profile's text as an article, keeping the document's
 * tables, cards and steps. Sizes follow the sawad.framer.website article page.
 */
const MUTED = "text-[#998f8f]";
const BODY = `text-lg leading-[1.4] ${MUTED}`;
const CARD = "card-dark rounded-xl p-5";

const COLUMNS = { 2: "sm:grid-cols-2", 3: "sm:grid-cols-3" };

const Heading = ({ eyebrow, text }) => (
  <div className="mt-10 first:mt-0">
    {eyebrow && <p className="mb-2 text-base font-medium italic text-[var(--profile-accent)]">{eyebrow}</p>}
    <h2 className="text-3xl font-bold leading-[1.2] text-white md:text-[38px]">{text}</h2>
  </div>
);

const LabelledList = ({ items }) => (
  <ul className={`m-0 flex list-none flex-col gap-3 p-0 ${BODY}`}>
    {items.map(({ label, text }) => (
      <li key={label} className="flex gap-3">
        <span aria-hidden="true" className="mt-[9px] size-2 flex-none rounded-full bg-[var(--profile-accent)]" />
        <span>
          <strong className="font-semibold text-white">{label}:</strong> {text}
        </span>
      </li>
    ))}
  </ul>
);

const Table = ({ rows }) => (
  <dl className="card-dark m-0 overflow-hidden rounded-xl">
    {rows.map(({ label, value }) => (
      <div key={label} className="grid gap-1 border-b border-white/10 p-4 last:border-b-0 sm:grid-cols-[210px_1fr] sm:gap-5">
        <dt className="text-base font-semibold leading-[1.4] text-white">{label}</dt>
        <dd className="m-0 text-base leading-[1.4] text-[#998f8f]">{value}</dd>
      </div>
    ))}
  </dl>
);

const BLOCKS = {
  heading: Heading,
  text: ({ text }) => <p className={BODY}>{text}</p>,
  quote: ({ text }) => (
    <blockquote className="m-0 border-l-4 border-[var(--profile-accent)] pl-5 text-xl font-medium italic leading-[1.4] text-white">
      {text}
    </blockquote>
  ),
  signature: ({ name, role }) => (
    <p className="text-base leading-[1.4]">
      <strong className="block font-semibold text-white">{name}</strong>
      <span className={`italic ${MUTED}`}>{role}</span>
    </p>
  ),
  stats: ({ items }) => (
    <dl className="m-0 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map(({ value, label }) => (
        <div key={label} className={`${CARD} flex flex-col`}>
          <dd className="order-first m-0 text-3xl font-bold text-[var(--profile-accent)]">{value}</dd>
          <dt className={`mt-2 text-sm leading-[1.3] ${MUTED}`}>{label}</dt>
        </div>
      ))}
    </dl>
  ),
  callouts: ({ items }) => (
    <div className="flex flex-col gap-3">
      {items.map(({ title, text }) => (
        <div key={title} className={`${CARD} border-l-4 border-l-[var(--profile-accent)]`}>
          <h3 className="text-lg font-semibold text-white">{title}</h3>
          <p className={`mt-2 ${BODY}`}>{text}</p>
        </div>
      ))}
    </div>
  ),
  cards: ({ items, columns }) => (
    <div className={`grid grid-cols-1 gap-3 ${COLUMNS[columns]}`}>
      {items.map(({ number, title, text }) => (
        <div key={title} className={CARD}>
          <h3 className="text-base font-semibold leading-[1.3] text-white">
            {number && <span className="mr-2 text-[var(--profile-accent)]">{number}</span>}
            {title}
          </h3>
          <p className={`mt-2 text-base leading-[1.4] ${MUTED}`}>{text}</p>
        </div>
      ))}
    </div>
  ),
  list: LabelledList,
  table: Table,
  image: ({ src, alt }) => (
    <img src={src} alt={alt} loading="lazy" decoding="async" className="h-auto w-full rounded-[20px]" />
  ),
};

const ProfileBlocks = ({ blocks }) => (
  <div className="flex flex-col gap-5">
    {blocks.map(({ type, ...block }, index) => {
      const Block = BLOCKS[type];
      return <Block key={index} {...block} />;
    })}
  </div>
);

export default ProfileBlocks;
