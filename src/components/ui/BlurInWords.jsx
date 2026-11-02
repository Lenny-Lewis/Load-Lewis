import { motion, useReducedMotion } from "framer-motion";

/**
 * Word-by-word blur-in, matching the Work page intro (WorkIntroWords).
 * Give it a new `key` to replay the animation.
 */
const BlurInWords = ({ text, delay = 0, stagger = 0.05 }) => {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return text;

  const words = text.split(" ");
  return words.map((word, index) => (
    <span key={index}>
      <motion.span
        initial={{ opacity: 0, filter: "blur(10px)", y: 10 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 0.7, delay: delay + index * stagger, ease: [0.22, 1, 0.36, 1] }}
        className="inline-block"
      >
        {word}
      </motion.span>
      {index < words.length - 1 ? " " : null}
    </span>
  ));
};

export default BlurInWords;
