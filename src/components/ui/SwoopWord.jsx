import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import HoverTextSlide from "./HoverTextSlide";

/**
 * SwoopWord — per-letter cinematic entrance for the quick-links slideover.
 *
 * ── The wave ───────────────────────────────────────────────────────────────
 * Each letter runs the same two-phase arc as the old word-level version:
 *
 *   x         [72, 0, 0]     off to the right -> arrives at rest
 *   y         [25, -18, 0]   below rest       -> ABOVE rest -> rest
 *   opacity   [0, 1, 1]
 *
 * only the timing differs per letter:
 *
 *   delay_i    = delayStep * i                       (starts sweep left->right)
 *   duration_i = BASE_DURATION - falloff * i          (later letters run faster)
 *   settle_i   = delay_i + duration_i  = BASE - i*(falloff - delayStep)
 *
 * Because falloff > delayStep, settle_i strictly decreases with i, so the
 * word resolves RIGHT-TO-LEFT: the last letter lands first. That crossing is
 * the whole effect.
 *
 *   falloff  = (BASE_DURATION - MIN_DURATION) / (letterCount - 1)
 *   delayStep = min(NOMINAL_DELAY_STEP, falloff * 0.6)
 *
 * Two constraints shape those formulas:
 *  - falloff must exceed delayStep, or the finish order doesn't reverse.
 *  - falloff is scaled so the LAST letter still lasts MIN_DURATION. Without
 *    the floor a 10-letter word would push its trailing letters down to ~95ms,
 *    too fast for the arc to read. This is why "Experience" ends up with a
 *    10.7ms step instead of 22ms — a longer word has less duration to spend.
 *
 * Because delay_0 = 0 and duration_0 = BASE, the whole word is always settled
 * in exactly BASE_DURATION regardless of length.
 *
 * ── Why two layers ─────────────────────────────────────────────────────────
 * HoverTextSlide clips its content (`h-[1.3em] overflow-hidden`) so the hover
 * duplicate can hide. Letter spans inside that box would be clipped by their
 * own arc — an 18.2px box cannot contain a 25px travel, so letters would pop
 * in and out. Widening the box fixes the entrance but breaks the hover slide.
 *
 * So the letters live in an unclipped layer that carries the entrance, and the
 * untouched HoverTextSlide sits absolutely on top, revealed on hover. Both
 * render the identical string, so the crossfade is imperceptible and the hover
 * behaviour is byte-for-byte what it was.
 */

const BASE_DURATION = 0.46;   // s — also the whole word's settle time
const MIN_DURATION = 0.3;     // s — keeps the arc legible on the last letter
const NOMINAL_DELAY_STEP = 0.022; // s — 22ms between adjacent letters

const WORD_STAGGER = 0.05;    // s — between menu items
const BASE_DELAY = 0.08;      // s — lets the panel land before the words move

const X_KEYFRAMES = [72, 0, 0];
const Y_KEYFRAMES = [25, -18, 0];
const OPACITY_KEYFRAMES = [0, 1, 1];

// 62% of each letter's timeline to the apex, 38% down to rest.
// easeOutExpo launching up, easeInOut settling down.
const TIMES = [0, 0.62, 1];
const EASE = [
  [0.16, 1, 0.3, 1],
  [0.45, 0, 0.55, 1],
];

const timing = (letterCount) => {
  const steps = Math.max(1, letterCount - 1);
  const falloff = (BASE_DURATION - MIN_DURATION) / steps;
  return { falloff, delayStep: Math.min(NOMINAL_DELAY_STEP, falloff * 0.6) };
};

const SwoopWord = ({ word, index = 0 }) => {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const letters = Array.from(word);

  // Reduced motion: fade only, no positional movement, hover slide untouched.
  if (reduceMotion) {
    return (
      <motion.span
        className="inline-block leading-[1.3em] select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      >
        <HoverTextSlide text={word} />
      </motion.span>
    );
  }

  const { falloff, delayStep } = timing(letters.length);
  const wordDelay = BASE_DELAY + index * WORD_STAGGER;

  return (
    <span
      className="relative inline-block leading-[1.3em] select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Layer 1 — per-letter entrance. No overflow clipping, so the arc shows
          in full.

          Crossfaded by React state rather than `group-hover:` classes: Framer
          writes `opacity` inline on the letters for the whole entrance, and an
          inline value outranks any stylesheet rule, so a CSS-only crossfade
          fought the animation and never took effect.

          aria-hidden: each letter is its own text node, so exposing this layer
          would announce "H o m e". Layer 2 carries the accessible name. */}
      <motion.span
        aria-hidden="true"
        className="inline-block"
        animate={{ opacity: hovered ? 0 : 1 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        {letters.map((char, i) => (
          <motion.span
            key={`${char}-${i}`}
            initial={{
              x: X_KEYFRAMES[0],
              y: Y_KEYFRAMES[0],
              opacity: OPACITY_KEYFRAMES[0],
            }}
            animate={{
              x: X_KEYFRAMES,
              y: Y_KEYFRAMES,
              opacity: OPACITY_KEYFRAMES,
            }}
            transition={{
              duration: Math.max(MIN_DURATION, BASE_DURATION - falloff * i),
              delay: wordDelay + delayStep * i,
              times: TIMES,
              ease: EASE,
            }}
            // inline-block with no margin/gap and no whitespace between the
            // spans, so spacing stays the font's natural advance width.
            className="inline-block will-change-transform"
          >
            {char}
          </motion.span>
        ))}
      </motion.span>

      {/* Layer 2 — the original hover slide, in its own clip box. This is the
          accessible copy of the word; HoverTextSlide already marks its
          duplicate aria-hidden, so the name resolves cleanly. */}
      <motion.span
        className="absolute top-0 left-0"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      >
        <HoverTextSlide text={word} />
      </motion.span>
    </span>
  );
};

export default SwoopWord;