import React, { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, Stars, Sparkles } from "@react-three/drei";

import CanvasLoader from "../Loader";
import useInView from "../hooks/useInView";

const Earth = () => {
  const earth = useGLTF("./planet/scene.gltf");

  return (
    <primitive object={earth.scene} scale={2.5} position-y={0} rotation-y={0} />
  );
};

const ShootingStar = ({ speed = 30 }) => {
  const meshRef = useRef();
  const initialPosition = useMemo(
    () => [
      (Math.random() - 0.5) * 40 + 20,
      (Math.random() - 0.5) * 20 + 20,
      (Math.random() - 0.5) * -40 - 10,
    ],
    []
  );

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.position.x -= delta * speed;
      meshRef.current.position.y -= delta * (speed * 0.5);
      meshRef.current.position.z += delta * (speed * 0.3);

      if (meshRef.current.position.y < -20 || meshRef.current.position.x < -30) {
        meshRef.current.position.set(
          (Math.random() - 0.5) * 40 + 30,
          (Math.random() - 0.5) * 20 + 30,
          (Math.random() - 0.5) * -40 - 10
        );
      }
    }
  });

  return (
    <mesh ref={meshRef} position={initialPosition} rotation={[0, 0, Math.PI / 3]}>
      <cylinderGeometry args={[0.015, 0.04, 2.5, 4]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
    </mesh>
  );
};

const EarthCanvas = () => {
  const { elementRef, isInView } = useInView({
    rootMargin: "200px 0px",
    threshold: 0.05,
  });

  return (
    <div ref={elementRef} className="w-full h-full min-h-[350px] relative bg-black">
      {isInView ? (
        <Canvas
          shadows
          frameloop="always"
          dpr={[1, 2]}
          gl={{ preserveDrawingBuffer: true }}
          camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [-4, 3, 6],
          }}
        >
          <Suspense fallback={<CanvasLoader />}>
            <OrbitControls
              autoRotate
              enableZoom={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />

            {/* Background Static Stars */}
            <Stars radius={100} depth={50} count={4000} factor={4} saturation={0} fade speed={1} />

            {/* Floating Particles (Sparkles) */}
            <Sparkles count={150} scale={15} size={2} speed={0.4} opacity={0.6} color="#62e0ff" />
            <Sparkles count={100} scale={20} size={1.5} speed={0.2} opacity={0.4} color="#ffffff" />

            {/* Shooting Stars */}
            <ShootingStar speed={35} />
            <ShootingStar speed={45} />
            <ShootingStar speed={25} />

            <Earth />

            <Preload all />
          </Suspense>
        </Canvas>
      ) : (
        <div className="w-full h-full flex items-center justify-center text-white/40 text-xs">
          Loading 3D Scene...
        </div>
      )}
    </div>
  );
};

export default EarthCanvas;



