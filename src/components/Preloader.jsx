import { useEffect, useState } from "react";
import GreetingPreloader from "./ui/components-preloaders-greetings";

const Preloader = ({ phase, onExitComplete }) => {
  const [mobile, setMobile] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches
  );

  useEffect(() => {
    const query = window.matchMedia("(max-width: 768px)");
    const update = () => setMobile(query.matches);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return (
    <GreetingPreloader
      visible={phase === "assets" || phase === "scene1"}
      mobile={mobile}
      onExitComplete={onExitComplete}
    />
  );
};

export default Preloader;
