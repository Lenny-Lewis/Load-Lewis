// A green hang tag for for-sale projects. Its parent must be `relative`; the string ties to the top edge.
const PriceTag = ({ price }) => (
  <span
    role="img"
    aria-label={`For sale, ${price}`}
    className="pointer-events-none absolute right-6 top-0 z-10 flex origin-top -rotate-[9deg] flex-col items-center"
  >
    <span aria-hidden="true" className="h-3.5 w-px bg-white/70" />
    <span
      aria-hidden="true"
      className="relative rounded-md bg-[#22c55e] px-3 pb-1.5 pt-4 text-sm font-semibold leading-none tabular-nums text-[#052e16] shadow-[0_8px_18px_rgba(0,0,0,0.35)]"
    >
      <span className="absolute left-1/2 top-1.5 size-1.5 -translate-x-1/2 rounded-full bg-[#052e16]/50" />
      {price}
    </span>
  </span>
);

export default PriceTag;
