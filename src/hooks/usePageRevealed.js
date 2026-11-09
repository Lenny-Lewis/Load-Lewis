import { createContext, useContext } from "react";

export const PageRevealContext = createContext(true);

/**
 * False while a page transition still covers the screen (see PageTransition.jsx).
 * Entrance animations that run on mount should wait for true, or they play hidden.
 */
export const usePageRevealed = () => useContext(PageRevealContext);
