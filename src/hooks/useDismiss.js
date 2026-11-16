import { useEffect } from "react";

/** Closes an open choice list on a click outside `ref` or on Escape, returning focus to its button. */
export const useDismiss = (open, setOpen, ref) => {
  useEffect(() => {
    if (!open) return;

    const closeOnOutsideClick = (event) => {
      if (!ref.current?.contains(event.target)) setOpen(false);
    };
    const closeOnEscape = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        ref.current?.querySelector("button[aria-expanded]")?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [open, setOpen, ref]);
};
