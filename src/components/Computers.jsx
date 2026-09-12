import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, Preload, useGLTF } from "@react-three/drei";

import CanvasLoader from "../Loader";

const AXIS_LOCK_THRESHOLD = 10;

const Computers = ({ isMobile }) => {
  const computer = useGLTF("/desktop_pc/scene.gltf");

  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor='black' />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
        castShadow
        shadow-mapSize={1024}
      />
      <pointLight intensity={1} />
      <primitive
        object={computer.scene}
        scale={isMobile ? 0.7 : 0.75}
        position={isMobile ? [0, -3, -2.2] : [0, -3.25, -1.5]}
        rotation={[-0.01, -0.2, -0.1]}
      />
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

    // OrbitControls.connect() sets touch-action: none — keep pan-y sticky.
    const styleObserver = new MutationObserver(applyPanY);
    styleObserver.observe(el, { attributes: true, attributeFilter: ["style"] });

    let axis = null;
    let startX = 0;
    let startY = 0;
    let lastX = 0;

    const onPointerDownCapture = (event) => {
      if (event.pointerType !== "touch") return;

      // Run before OrbitControls so it never captures the pointer on touch.
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
        // Only claim the gesture when horizontal dominates.
        axis = Math.abs(dx) > Math.abs(dy) ? "h" : "v";
      }

      // Vertical (or scroll-dominant) → never rotate; let pan-y scroll the page.
      if (axis !== "h") return;

      // Horizontal rotate only — block browser back-swipe / competing gestures.
      event.preventDefault();

      const deltaX = event.clientX - lastX;
      lastX = event.clientX;
      if (deltaX === 0) return;

      // Match OrbitControls native speed: rotateLeft(2π * Δx / clientHeight).
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
    // Non-passive so we can preventDefault only after locking to horizontal.
    el.addEventListener("pointermove", onPointerMove, { passive: false });
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
      enableZoom={false}
      enablePan={false}
      enableDamping={false}
      maxPolarAngle={Math.PI / 2}
      minPolarAngle={Math.PI / 2}
    />
  );
};

const ComputersCanvas = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Add a listener for changes to the screen size
    const mediaQuery = window.matchMedia("(max-width: 768px)");

    // Set the initial value of the `isMobile` state variable
    setIsMobile(mediaQuery.matches);

    // Define a callback function to handle changes to the media query
    const handleMediaQueryChange = (event) => {
      setIsMobile(event.matches);
    };

    // Add the callback function as a listener for the media query
    mediaQuery.addEventListener("change", handleMediaQueryChange);

    // Remove the listener when the component is unmounted
    return () => {
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
    };
  }, []);

  return (
    <Canvas
      className="h-full w-full"
      style={{ width: "100%", height: "100%", touchAction: "pan-y" }}
      frameloop='demand'
      shadows
      dpr={[1, 2]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ preserveDrawingBuffer: true }}
      onCreated={({ gl }) => {
        gl.domElement.style.touchAction = "pan-y";
      }}
    >
      <Suspense fallback={<CanvasLoader />}>
        <ScrollSafeOrbitControls />
        <Computers isMobile={isMobile} />
      </Suspense>

      <Preload all />
    </Canvas>
  );
};

export default ComputersCanvas;
