import { useEffect, useState } from "react";

const readDeviceTier = () => {
  if (typeof window === "undefined") return "high";

  const nav = window.navigator;
  const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cores = nav.hardwareConcurrency || 8;
  const memory = nav.deviceMemory || 8;
  const saveData = Boolean(nav.connection?.saveData);

  if (
    reducedMotion ||
    saveData ||
    cores <= 4 ||
    memory <= 4
  ) {
    return "low";
  }
  if (coarsePointer || cores <= 6 || memory <= 6) return "mid";
  return "high";
};

export default function useDeviceTier() {
  const [tier, setTier] = useState(readDeviceTier);

  useEffect(() => {
    const media = window.matchMedia("(pointer: coarse)");
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const connection = window.navigator.connection;
    const update = () => setTier(readDeviceTier());
    media.addEventListener("change", update);
    motion.addEventListener("change", update);
    connection?.addEventListener?.("change", update);
    window.addEventListener("pageshow", update);
    return () => {
      media.removeEventListener("change", update);
      motion.removeEventListener("change", update);
      connection?.removeEventListener?.("change", update);
      window.removeEventListener("pageshow", update);
    };
  }, []);

  return tier;
}
