"use client";
import { useMemo, useRef, useState } from "react";
import type { ReactNode, RefObject } from "react";
import { useFrame } from "@react-three/fiber";
import type { ThreeEvent } from "@react-three/fiber";
import { Stars, useCursor, useTexture } from "@react-three/drei";
import * as THREE from "three";

/*
 * Space around the 3D globe: stars, plus the Moon in orbit. Laid out for a globe
 * of radius 2. In the orbit the Earth sits towards -x, so that is the way the
 * Moon's near side faces. The Moon's refs let the globe swap it into focus.
 */

// NASA CGI Moon Kit (LRO colour map and elevation).
const MOON_MAP = "/images/contact/globe/moon-color.jpg";
const MOON_ELEVATION = "/images/contact/globe/moon-elevation.jpg";
export const MOON_RADIUS = 0.3;

// Rendering pauses off-screen, so the first frame back can report a huge delta.
const MAX_DELTA = 0.1;
// Clicks further than this many pixels from the press were really drags.
const CLICK_SLOP = 6;

function Moon({ focused, onSelect }: { focused: boolean; onSelect: () => void }) {
  const [map, elevation] = useTexture([MOON_MAP, MOON_ELEVATION]);
  useMemo(() => {
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 8;
  }, [map]);

  const [hovered, setHovered] = useState(false);
  useCursor(hovered && !focused);

  const handleClick = (event: ThreeEvent<MouseEvent>) => {
    event.stopPropagation();
    if (event.delta <= CLICK_SLOP) onSelect();
  };
  const handlers = {
    onClick: handleClick,
    onPointerOver: (event: ThreeEvent<PointerEvent>) => {
      event.stopPropagation();
      setHovered(true);
    },
    onPointerOut: () => setHovered(false),
  };

  // Turned half way so the near side faces the Earth; the orbit keeps it tidally locked.
  return (
    <>
      <mesh rotation={[0, Math.PI, 0]} {...handlers}>
        <sphereGeometry args={[MOON_RADIUS, 96, 64]} />
        <meshStandardMaterial map={map} bumpMap={elevation} bumpScale={1.2} roughness={1} metalness={0} />
      </mesh>
      {/* Far away the Moon is a small target, so give it a larger invisible one. */}
      {!focused && (
        <mesh visible={false} {...handlers}>
          <sphereGeometry args={[MOON_RADIUS * 1.7, 12, 8]} />
        </mesh>
      )}
    </>
  );
}

/** Carries the Moon round the globe on a tilted circle. Speed in radians per second. */
function Orbit({
  radius,
  tilt,
  speed,
  start,
  anchorRef,
  children,
}: {
  radius: number;
  tilt: [number, number];
  speed: number;
  start: number;
  anchorRef: RefObject<THREE.Group | null>;
  children: ReactNode;
}) {
  const arm = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (arm.current) arm.current.rotation.y += speed * Math.min(delta, MAX_DELTA);
  });
  return (
    <group rotation={[tilt[0], 0, tilt[1]]}>
      <group ref={arm} rotation={[0, start, 0]}>
        <group ref={anchorRef} position={[radius, 0, 0]}>
          {children}
        </group>
      </group>
    </group>
  );
}

export function Starfield({ animate = true }: { animate?: boolean }) {
  return <Stars radius={60} depth={40} count={3500} factor={3} saturation={0} fade speed={animate ? 0.6 : 0} />;
}

export function MoonOrbit({
  animate = true,
  focused,
  onSelect,
  anchorRef,
  sizeRef,
}: {
  animate?: boolean;
  focused: boolean;
  onSelect: () => void;
  /** Sits at the Moon's centre, for measuring where it is */
  anchorRef: RefObject<THREE.Group | null>;
  /** Scaled by the globe as the Moon comes into focus */
  sizeRef: RefObject<THREE.Group | null>;
}) {
  return (
    <Orbit radius={3.2} tilt={[0.2, 0.35]} speed={animate ? 0.16 : 0} start={0.9} anchorRef={anchorRef}>
      <group ref={sizeRef}>
        <Moon focused={focused} onSelect={onSelect} />
      </group>
    </Orbit>
  );
}
