import React, { Suspense, useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Preload, useTexture, Stars, Sparkles } from "@react-three/drei";
import * as THREE from "three";

import CanvasLoader from "../Loader";
import useInView from "../hooks/useInView";

const RealisticEarth = () => {
  const earthRef = useRef();
  const cloudsRef = useRef();

  const [colorMap, bumpMap, cloudsMap, specMap] = useTexture([
    "/models/59-earth/textures/earth albedo.jpg",
    "/models/59-earth/textures/earth bump.jpg",
    "/models/59-earth/textures/clouds earth.png",
    "/models/59-earth/textures/earth land ocean mask.png",
  ]);

  useFrame((state, delta) => {
    if (earthRef.current) {
      earthRef.current.rotation.y += delta * 0.12;
    }
    if (cloudsRef.current) {
      cloudsRef.current.rotation.y += delta * 0.16;
    }
  });

  return (
    <group scale={2.6}>
      {/* Main Earth Sphere */}
      <mesh ref={earthRef}>
        <sphereGeometry args={[1, 36, 36]} />
        <meshStandardMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.04}
          roughnessMap={specMap}
          roughness={0.65}
          metalness={0.1}
        />
      </mesh>

      {/* Realistic Atmosphere Cloud Layer */}
      <mesh ref={cloudsRef} scale={1.018}>
        <sphereGeometry args={[1, 36, 36]} />
        <meshStandardMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.7}
          blending={THREE.NormalBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Soft Atmosphere Outer Blue Halo Glow */}
      <mesh scale={1.04}>
        <sphereGeometry args={[1, 36, 36]} />
        <meshBasicMaterial
          color="#4ca6ff"
          transparent={true}
          opacity={0.14}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
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
    rootMargin: "250px 0px",
    threshold: 0.05,
  });

  return (
    <div ref={elementRef} className="w-full h-full min-h-[350px] relative bg-black">
      {isInView ? (
        <Canvas
          shadows={false}
          frameloop="always"
          dpr={[1, 1.5]}
          gl={{ preserveDrawingBuffer: true, antialias: true, powerPreference: "high-performance" }}
          camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [-4, 3, 6],
          }}
        >
          <ambientLight intensity={1.5} />
          <directionalLight position={[6, 4, 5]} intensity={2.8} />
          <directionalLight position={[-6, -3, -5]} intensity={0.4} color="#3b82f6" />
          <pointLight position={[10, 10, 10]} intensity={1.0} />

          <Suspense fallback={<CanvasLoader />}>
            <OrbitControls
              autoRotate
              autoRotateSpeed={0.5}
              enableZoom={false}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
            />

            {/* Background Static Stars */}
            <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />

            {/* Floating Particles */}
            <Sparkles count={80} scale={15} size={2} speed={0.4} opacity={0.6} color="#62e0ff" />
            <Sparkles count={50} scale={20} size={1.5} speed={0.2} opacity={0.4} color="#ffffff" />

            {/* Shooting Stars */}
            <ShootingStar speed={35} />
            <ShootingStar speed={45} />

            <RealisticEarth />

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


