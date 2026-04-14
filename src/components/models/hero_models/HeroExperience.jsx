import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMediaQuery } from "react-responsive";
import { Room } from "./Room";
import HeroLights from "./HeroLights";
import Particles from "./Particles";
import { Suspense } from "react";
import useInView from "../../../hooks/useInView";

const HeroExperience = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isTablet = useMediaQuery({ query: "(max-width: 1024px)" });
  const { elementRef, isInView } = useInView({
    rootMargin: "200px 0px",
    threshold: 0.15,
  });
  const shouldAnimate = isInView && !isMobile;

  return (
    <div ref={elementRef} className="size-full">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        dpr={isMobile ? 1 : [1, 1.25]}
        frameloop={shouldAnimate ? "always" : "demand"}
        gl={{ antialias: !isMobile, powerPreference: "low-power" }}
      >
        <ambientLight intensity={0.2} color="#1a1a40" />
        {!isMobile && (
          <OrbitControls
            enablePan={false}
            enableZoom={!isTablet}
            enabled={isInView}
            maxDistance={20}
            minDistance={5}
            minPolarAngle={Math.PI / 5}
            maxPolarAngle={Math.PI / 2}
          />
        )}

        <Suspense fallback={null}>
          <HeroLights />
          {shouldAnimate && <Particles count={60} />}
          <group
            scale={isMobile ? 0.7 : 1}
            position={[0, -3.5, 0]}
            rotation={[0, -Math.PI / 4, 0]}
          >
            <Room enableEffects={shouldAnimate} />
          </group>
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroExperience;
