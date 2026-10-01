import { counterItems } from "../constants";
import { SlotMachineNumber } from "./ui/SlotReel";

const AnimatedCounter = () => {
  return (
    <div id="counter" className="padding-x-lg xl:mt-0 mt-32">
      <div className="mx-auto grid-4-cols">
        {counterItems.map((item, index) => (
          <div
            key={index}
            className="flex min-h-48 flex-col justify-between rounded-lg bg-zinc-900 p-7 sm:p-10"
          >
            <SlotMachineNumber
              value={item.value}
              suffix={item.suffix}
              className="counter-number text-5xl font-bold leading-none text-white-50"
              suffixClassName="text-3xl font-bold leading-none sm:text-4xl"
            />
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
