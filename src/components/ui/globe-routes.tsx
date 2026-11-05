"use client";
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/*
 * Airline-style routes: from one hub, a glowing line shoots along the great
 * circle to each destination, and a ring pulses where it lands. Faint lines keep
 * the whole network visible between flights. Render this inside the globe's
 * spinning group so the routes turn with the Earth.
 */

export interface GlobeLocation {
  lat: number;
  lng: number;
  label?: string;
}

export interface GlobeRoutesConfig {
  /** Where every route starts */
  origin: GlobeLocation;
  destinations: GlobeLocation[];
  color?: string;
}

const CYCLE_SECONDS = 7; // one flight, plus the wait until the next on this route
const FLIGHT_SHARE = 0.62; // the part of the cycle the line is moving
const TAIL = 0.42; // length of the glowing part, as a share of the route
const SEGMENTS = 72;
const MAX_DELTA = 0.1; // rendering pauses off-screen, so a delta can be huge

/** Same mapping as the globe's Earth texture. */
export function locationToVector(lat: number, lng: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta),
  );
}

/** Great-circle path, lifted off the surface; longer routes fly higher. */
function routeCurve(from: GlobeLocation, to: GlobeLocation, radius: number) {
  const a = locationToVector(from.lat, from.lng, 1);
  const b = locationToVector(to.lat, to.lng, 1);
  const angle = a.angleTo(b);
  const lift = 0.05 + 0.32 * (angle / Math.PI);
  const sinAngle = Math.sin(angle) || 1;
  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= SEGMENTS; i++) {
    const t = i / SEGMENTS;
    const point = a
      .clone()
      .multiplyScalar(Math.sin((1 - t) * angle) / sinAngle)
      .add(b.clone().multiplyScalar(Math.sin(t * angle) / sinAngle))
      .normalize();
    points.push(point.multiplyScalar(radius * (1.002 + lift * Math.sin(Math.PI * t))));
  }
  return new THREE.CatmullRomCurve3(points);
}

const VERTEX = `
  varying float vAlong;
  void main() {
    vAlong = uv.x;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// uHead is the tip of the moving line. Behind it the glow fades over uTail, and
// the tip itself runs close to white.
const FRAGMENT = `
  uniform vec3 uColor;
  uniform float uHead;
  uniform float uTail;
  uniform float uBase;
  varying float vAlong;
  void main() {
    float glow = vAlong > uHead ? 0.0 : smoothstep(uHead - uTail, uHead, vAlong);
    float alpha = max(glow, uBase);
    gl_FragColor = vec4(mix(uColor, vec3(1.0), pow(glow, 5.0) * 0.85), alpha);
    #include <colorspace_fragment>
  }
`;

function Route({
  from,
  to,
  radius,
  color,
  offset,
  animate,
}: {
  from: GlobeLocation;
  to: GlobeLocation;
  radius: number;
  color: THREE.Color;
  offset: number;
  animate: boolean;
}) {
  const geometry = useMemo(
    () => new THREE.TubeGeometry(routeCurve(from, to, radius), SEGMENTS, radius * 0.0055, 6, false),
    [from, to, radius],
  );
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: VERTEX,
        fragmentShader: FRAGMENT,
        uniforms: {
          uColor: { value: color },
          // Held still, the whole route simply shows as a steady line.
          uHead: { value: animate ? 0 : 2 },
          uTail: { value: animate ? TAIL : 0.001 },
          uBase: { value: animate ? 0.13 : 0.45 },
        },
        transparent: true,
        depthWrite: false,
        toneMapped: false,
        blending: THREE.AdditiveBlending,
      }),
    [color, animate],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  useEffect(() => () => material.dispose(), [material]);

  const landing = useMemo(() => {
    const position = locationToVector(to.lat, to.lng, radius * 1.003);
    const quaternion = new THREE.Quaternion().setFromUnitVectors(
      new THREE.Vector3(0, 0, 1),
      position.clone().normalize(),
    );
    return { position, quaternion };
  }, [to, radius]);

  const ring = useRef<THREE.Mesh>(null);
  const ringMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const clock = useRef(offset * CYCLE_SECONDS);

  useFrame((_, delta) => {
    if (!animate) return;
    clock.current += Math.min(delta, MAX_DELTA);
    const phase = (clock.current % CYCLE_SECONDS) / CYCLE_SECONDS;
    const head = (phase / FLIGHT_SHARE) * (1 + TAIL);
    material.uniforms.uHead.value = head;
    // Starts as the tip lands, then spreads and fades while the tail drains away.
    const pulse = Math.min(Math.max((head - 1) / 0.75, 0), 1);
    if (ring.current && ringMaterial.current) {
      const showing = head >= 1 && pulse < 1;
      ring.current.visible = showing;
      if (showing) {
        ring.current.scale.setScalar(1 + pulse * 3.2);
        ringMaterial.current.opacity = (1 - pulse) * 0.9;
      }
    }
  });

  return (
    <>
      <mesh geometry={geometry} material={material} />
      {/* The destination dot */}
      <mesh position={landing.position} quaternion={landing.quaternion}>
        <circleGeometry args={[radius * 0.012, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
      <mesh ref={ring} position={landing.position} quaternion={landing.quaternion} visible={false}>
        <ringGeometry args={[radius * 0.016, radius * 0.021, 32]} />
        <meshBasicMaterial
          ref={ringMaterial}
          color={color}
          transparent
          depthWrite={false}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

/** The hub: a brighter dot with a steady outgoing pulse. */
function Hub({
  location,
  radius,
  color,
  animate,
}: {
  location: GlobeLocation;
  radius: number;
  color: THREE.Color;
  animate: boolean;
}) {
  const { position, quaternion } = useMemo(() => {
    const point = locationToVector(location.lat, location.lng, radius * 1.004);
    return {
      position: point,
      quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), point.clone().normalize()),
    };
  }, [location, radius]);
  const ring = useRef<THREE.Mesh>(null);
  const ringMaterial = useRef<THREE.MeshBasicMaterial>(null);
  const clock = useRef(0);

  useFrame((_, delta) => {
    if (!animate || !ring.current || !ringMaterial.current) return;
    clock.current += Math.min(delta, MAX_DELTA);
    const pulse = (clock.current % 2.4) / 2.4;
    ring.current.scale.setScalar(1 + pulse * 3);
    ringMaterial.current.opacity = (1 - pulse) * 0.8;
  });

  return (
    <>
      <mesh position={position} quaternion={quaternion}>
        <circleGeometry args={[radius * 0.021, 24]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <mesh ref={ring} position={position} quaternion={quaternion} visible={animate}>
        <ringGeometry args={[radius * 0.026, radius * 0.032, 40]} />
        <meshBasicMaterial
          ref={ringMaterial}
          color={color}
          transparent
          depthWrite={false}
          toneMapped={false}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

export function GlobeRoutes({
  routes,
  radius,
  animate,
}: {
  routes: GlobeRoutesConfig;
  radius: number;
  animate: boolean;
}) {
  const color = useMemo(() => new THREE.Color(routes.color ?? "#cda144"), [routes.color]);
  return (
    <>
      <Hub location={routes.origin} radius={radius} color={color} animate={animate} />
      {routes.destinations.map((destination, index) => (
        <Route
          key={`${destination.lat},${destination.lng}`}
          from={routes.origin}
          to={destination}
          radius={radius}
          color={color}
          // Golden-ratio spacing, so flights set off in an irregular, busy rhythm.
          offset={(index * 0.618034) % 1}
          animate={animate}
        />
      ))}
    </>
  );
}

export default GlobeRoutes;
