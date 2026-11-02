/**
 * Renders article text with **bold** highlights, as on Majd's articles where
 * key phrases inside a paragraph are set in a heavier, brighter weight.
 */
const RichText = ({ text }) => {
  if (!text) return null;
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, index) =>
    part.startsWith("**") && part.endsWith("**") ? (
      <strong key={index} className="font-semibold text-white">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
};

export default RichText;
