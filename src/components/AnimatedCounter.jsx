import { counterItems } from "../constants";
import { CountUp } from "./ui/count-up";

const AnimatedCounter = () => {
  return (
    <div id="counter" className="padding-x-lg xl:mt-0 mt-32">
      <div className="mx-auto grid-4-cols">
        {counterItems.map((item, index) => (
          <div
            key={index}
            className="flex min-h-48 flex-col justify-between rounded-lg bg-zinc-900 p-7 sm:p-10"
          >
            <div className="flex items-baseline gap-1 text-white-50">
              <CountUp
                to={item.value}
                duration={2.5}
                digitEffect="blur"
                className="counter-number text-5xl font-bold leading-none tabular-nums"
              />
              <span className="text-3xl font-bold leading-none sm:text-4xl">
                {item.suffix}
              </span>
            </div>
            <div className="mt-6 text-lg leading-tight text-white-50">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnimatedCounter;
