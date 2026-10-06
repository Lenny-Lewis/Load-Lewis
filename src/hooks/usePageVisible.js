import { useEffect, useState } from "react";

export default function usePageVisible() {
  const [visible, setVisible] = useState(() =>
    typeof document === "undefined" || document.visibilityState === "visible"
  );

  useEffect(() => {
    const update = () => setVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  return visible;
}
