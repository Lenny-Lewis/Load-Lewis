import { memo, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import usePageVisible from "../hooks/usePageVisible";

const Earth = memo(function Earth({ onLoaded }) {
  const { scene } = useGLTF("/planet/scene.gltf");

  useEffect(() => {
    if (scene) onLoaded?.();
  }, [scene, onLoaded]);

  return <primitive object={scene} scale={2.5} position-y={0} rotation-y={0} />;
});

// Demand rendering keeps the static Earth idle between user interactions.
const EarthCanvas = memo(function EarthCanvas({ onLoaded }) {
  const pageVisible = usePageVisible();

  return (
    <Canvas
      frameloop={pageVisible ? "demand" : "never"}
      dpr={[1, 1.5]}
      gl={{ antialias: false, preserveDrawingBuffer: false, powerPreference: "low-power" }}
      camera={{ fov: 45, near: 0.1, far: 200, position: [-4, 3, 6] }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[4, 3, 5]} intensity={1.2} />
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          enableDamping={false}
          autoRotate={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 2}
        />
        <Earth onLoaded={onLoaded} />
      </Suspense>
    </Canvas>
  );
});

export default EarthCanvas;
