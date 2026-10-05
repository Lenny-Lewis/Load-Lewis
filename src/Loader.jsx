import { Html } from "@react-three/drei";

const CanvasLoader = () => {
  return (
    <Html
      as="div"
      center
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span className="canvas-loader"></span>
      <span className="sr-only" role="status">Loading</span>
    </Html>
  );
};

export default CanvasLoader;
