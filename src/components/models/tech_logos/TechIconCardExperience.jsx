import { Environment, Float, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import useInView from "../../../hooks/useInView";

const TechIconCardExperience = ({ model, isActive = false }) => {
  const scene = useGLTF(model.modelPath);
  const { elementRef, isInView } = useInView({
    rootMargin: "160px 0px",
    threshold: 0.2,
  });
  const shouldAnimate = isActive && isInView;

  useEffect(() => {
    if (model.name === "Interactive Developer") {
      scene.scene.traverse((child) => {
        if (child.isMesh) {
          if (child.name === "Object_5") {
            child.material = new THREE.MeshStandardMaterial({ color: "white" });
          }
        }
      });
    }
  }, [scene]);

  return (
    <div ref={elementRef} className="size-full">
      <Canvas
        dpr={[1, 1.2]}
        frameloop={shouldAnimate ? "always" : "demand"}
        gl={{ antialias: false, powerPreference: "low-power" }}
      >
        <ambientLight intensity={0.3} />
        <directionalLight position={[5, 5, 5]} intensity={1} />
        <spotLight
          position={[10, 15, 10]}
          angle={0.3}
          penumbra={1}
          intensity={2}
        />
        <Environment preset="city" />

        <Float
          speed={shouldAnimate ? 2.8 : 0}
          rotationIntensity={shouldAnimate ? 0.35 : 0}
          floatIntensity={shouldAnimate ? 0.5 : 0}
        >
          <group scale={model.scale} rotation={model.rotation}>
            <primitive object={scene.scene} />
          </group>
        </Float>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate={shouldAnimate}
          autoRotateSpeed={1.6}
        />
      </Canvas>
    </div>
  );
};

export default TechIconCardExperience;
