import { memo, Suspense, useEffect, useRef } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import usePageVisible from "../hooks/usePageVisible";

const AXIS_LOCK_THRESHOLD = 10;

const Computers = memo(function Computers({ onLoaded }) {
  // Meshopt decoder support is already enabled by Drei's useGLTF defaults.
  const computer = useGLTF("/desktop_pc/scene-optimized.glb");

  useEffect(() => {
    if (computer?.scene) onLoaded?.();
  }, [computer, onLoaded]);

  return (
    <mesh>
      <hemisphereLight intensity={0.15} groundColor='black' />
      <spotLight
        position={[-20, 50, 10]}
        angle={0.12}
        penumbra={1}
        intensity={1}
      />
      <pointLight intensity={1} />
      <primitive
        object={computer.scene}
        scale={0.7}
        position={[0, -3, -2.2]}
        rotation={[-0.01, -0.2, -0.1]}
      />
    </mesh>
  );
});

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

    // OrbitControls.connect(gl.domElement) sets touch-action: none on the
    // canvas — keep pan-y sticky. (domElement prop below avoids the R3F
    // wrapper / events.connected, which would leave an ancestor at none and
    // defeat pan-y via CSS touch-action intersection.)
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
      // Bind to the canvas, not R3F's events.connected wrapper, so
      // touch-action: none from connect() stays on the element we re-set to pan-y.
      domElement={gl.domElement}
      enableZoom={false}
      enablePan={false}
      enableDamping={false}
      maxPolarAngle={Math.PI / 2}
      minPolarAngle={Math.PI / 2}
    />
  );
};

const ComputersCanvas = ({ onLoaded }) => {
  const pageVisible = usePageVisible();
  return (
    <Canvas
      className="h-full w-full"
      style={{ width: "100%", height: "100%", touchAction: "pan-y" }}
      frameloop={pageVisible ? "demand" : "never"}
      // Mid-tier mobile profile: cap pixel ratio and skip costly shadow maps.
      dpr={[1, 1.5]}
      camera={{ position: [20, 3, 5], fov: 25 }}
      gl={{ antialias: false, preserveDrawingBuffer: false, powerPreference: "low-power" }}
      onCreated={({ gl }) => {
        gl.domElement.style.touchAction = "pan-y";
      }}
    >
      <Suspense fallback={null}>
        <ScrollSafeOrbitControls />
        <Computers onLoaded={onLoaded} />
      </Suspense>
    </Canvas>
  );
};

export default memo(ComputersCanvas);
