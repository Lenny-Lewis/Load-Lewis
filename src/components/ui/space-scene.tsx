"use client";
import { useMemo, useRef } from "react";
import type { ReactNode } from "react";
import { useFrame } from "@react-three/fiber";
import { Stars, useTexture } from "@react-three/drei";
import * as THREE from "three";

/*
 * Space around the 3D globe: stars, plus the Moon in orbit.
 * Laid out for a globe of radius 2. In the orbit the Earth sits towards -x,
 * so that is the way the Moon's near side faces.
 */

// NASA CGI Moon Kit (LRO colour map and elevation).
const MOON_MAP = "/images/contact/globe/moon-color.jpg";
const MOON_ELEVATION = "/images/contact/globe/moon-elevation.jpg";

// Rendering pauses off-screen, so the first frame back can report a huge delta.
const MAX_DELTA = 0.1;

function Moon() {
  const [map, elevation] = useTexture([MOON_MAP, MOON_ELEVATION]);
  useMemo(() => {
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
  }, [map]);
  // Turned half way so the near side faces the Earth; the orbit keeps it tidally locked.
  return (
    <mesh rotation={[0, Math.PI, 0]}>
      <sphereGeometry args={[0.3, 64, 48]} />
      <meshStandardMaterial map={map} bumpMap={elevation} bumpScale={1.2} roughness={1} metalness={0} />
    </mesh>
  );
}

/** Carries its child round the globe on a tilted circle. Speed in radians per second. */
function Orbit({
  radius,
  tilt,
  speed,
  start,
  children,
}: {
  radius: number;
  tilt: [number, number];
  speed: number;
  start: number;
  children: ReactNode;
}) {
  const arm = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (arm.current) arm.current.rotation.y += speed * Math.min(delta, MAX_DELTA);
  });
  return (
    <group rotation={[tilt[0], 0, tilt[1]]}>
      <group ref={arm} rotation={[0, start, 0]}>
        <group position={[radius, 0, 0]}>{children}</group>
      </group>
    </group>
  );
}

export function SpaceScene({ radius = 2, animate = true }: { radius?: number; animate?: boolean }) {
  const pace = animate ? 1 : 0;
  return (
    <group scale={radius / 2}>
      <Stars radius={60} depth={40} count={3500} factor={3} saturation={0} fade speed={pace * 0.6} />

      <Orbit radius={3.2} tilt={[0.2, 0.35]} speed={pace * 0.16} start={0.9}>
        <Moon />
      </Orbit>
    </group>
  );
}

export default SpaceScene;
