import React, { Suspense, useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF, Stars, Sparkles } from "@react-three/drei";
import { useMediaQuery } from "react-responsive";

import CanvasLoader from "../Loader";
import useInView from "../hooks/useInView";

const AXIS_LOCK_THRESHOLD = 10;

const Earth = () => {
  const earth = useGLTF("./planet/scene.gltf");

  useEffect(() => {
    if (earth?.scene) {
      window.__CONTACT_3D_READY__ = true;
      window.dispatchEvent(new CustomEvent("contact-3d-ready"));
    }
  }, [earth]);

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

// Touch: horizontal rotates only; vertical stays free for page scroll.
const ScrollSafeOrbitControls = () => {
  const controlsRef = useRef(null);
  const { gl, invalidate } = useThree();

  useEffect(() => {
    const el = gl.domElement;

    const applyPanY = () => {
      if (el.style.touchAction !== "pan-y") {
        el.style.touchAction = "pan-y";
      }
    };
    applyPanY();

    // OrbitControls sets touch-action: none when it connects. Keep vertical
    // touch gestures available to the browser so the page can still scroll.
    const styleObserver = new MutationObserver(applyPanY);
    styleObserver.observe(el, { attributes: true, attributeFilter: ["style"] });

    let axis = null;
    let startX = 0;
    let startY = 0;
    let lastX = 0;

    const onPointerDownCapture = (event) => {
      if (event.pointerType !== "touch") return;

      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }

      startX = lastX = event.clientX;
      startY = event.clientY;
      axis = null;
      applyPanY();
    };

    const onPointerMove = (event) => {
      if (event.pointerType !== "touch") return;

      const controls = controlsRef.current;
      if (!controls) return;

      const dx = event.clientX - startX;
      const dy = event.clientY - startY;

      if (axis === null) {
        if (
          Math.abs(dx) < AXIS_LOCK_THRESHOLD &&
          Math.abs(dy) < AXIS_LOCK_THRESHOLD
        ) {
          return;
        }
        axis = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
      }

      if (axis !== "h") return;

      const deltaX = event.clientX - lastX;
      lastX = event.clientX;
      if (deltaX === 0) return;

      const angle = (2 * Math.PI * deltaX) / el.clientHeight;
      controls.setAzimuthalAngle(controls.getAzimuthalAngle() - angle);
      invalidate();
    };

    const onPointerUp = (event) => {
      if (event.pointerType !== "touch") return;

      axis = null;
      if (controlsRef.current) {
        controlsRef.current.enabled = true;
      }
      applyPanY();
    };

    el.addEventListener("pointerdown", onPointerDownCapture, { capture: true });
    // `touch-action: pan-y` handles gesture ownership in CSS. A passive
    // listener lets vertical scrolling stay entirely on the compositor thread.
    el.addEventListener("pointermove", onPointerMove, { passive: true });
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);

    return () => {
      styleObserver.disconnect();
      el.removeEventListener("pointerdown", onPointerDownCapture, {
        capture: true,
      });
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
    };
  }, [gl, invalidate]);

  return (
    <OrbitControls
      ref={controlsRef}
      domElement={gl.domElement}
      autoRotate
      enableZoom={false}
      maxPolarAngle={Math.PI / 2}
      minPolarAngle={Math.PI / 2}
    />
  );
};

const EarthCanvas = () => {
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const { elementRef, isInView } = useInView({
    rootMargin: "200px 0px",
    threshold: 0.05,
  });

  const shouldRender = isMobile || isInView;

  return (
    <div ref={elementRef} className="w-full h-full min-h-[350px] relative bg-black">
      {shouldRender ? (
        <Canvas
          style={{ touchAction: "pan-y" }}
          shadows
          frameloop="always"
          dpr={[1, 2]}
          gl={{ preserveDrawingBuffer: true }}
          onCreated={({ gl }) => {
            gl.domElement.style.touchAction = "pan-y";
          }}
          camera={{
            fov: 45,
            near: 0.1,
            far: 200,
            position: [-4, 3, 6],
          }}
        >
          <Suspense fallback={<CanvasLoader />}>
            <ScrollSafeOrbitControls />

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
        <div className="w-full h-full" aria-label="Loading" role="status" />
      )}
    </div>
  );
};

export default EarthCanvas;


