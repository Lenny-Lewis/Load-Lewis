"use client";

import * as React from "react";
import { createPortal } from "react-dom";

export type DishTier = 1 | 2 | 3 | 4 | 5;

export interface ConveyorDish {
  id: string;
  /** Accessible name, chip text and dialog title. */
  name: string;
  /** One or two sentences for the caption and the dialog. */
  description?: string;
  /** Price text such as "$4.20", shown on the chip, the caption and the dialog. */
  price: string;
  /** Price tier 1–5. Kaiten plates are colour-coded by price, so the tier is drawn as the plate ring in chart colour 1–5. */
  tier?: DishTier;
  /** Top-down photo of the plate, centred on a transparent square canvas. */
  image: string;
  /** Secondary line (e.g. a company) shown in the dialog header and on the plate's underside. */
  subtitle?: string;
  /** Short facts such as the piece count or allergens, listed as chips in the dialog. */
  details?: string[];
}

export interface SushiConveyorMenuLabels {
  add: string;
  close: string;
  previous: string;
  next: string;
  /** Accessible name of the pause toggle. */
  pause?: string;
  /** Dialog face toggle labels. */
  front?: string;
  back?: string;
}

export interface SushiConveyorMenuProps extends React.ComponentProps<"section"> {
  items: ConveyorDish[];
  eyebrow?: string;
  heading?: string;
  /** Shown under the belt while no plate is picked out. */
  caption?: string;
  /** Call to action rendered under the caption. */
  action?: React.ReactNode;
  /** Cruise speed of the belt in px/s, measured on the front lane. */
  speed?: number;
  /** Stops the belt (controlled). */
  paused?: boolean;
  onPausedChange?: (paused: boolean) => void;
  /** Brings one plate after another to the front and lifts it, until the visitor interacts. */
  autoplay?: boolean;
  /** Milliseconds between autoplay plates. */
  interval?: number;
  /** Index of the lifted plate (controlled). */
  active?: number | null;
  onActiveChange?: (index: number | null) => void;
  onOpenChange?: (index: number | null) => void;
  /** Called by the dialog's add button. */
  onAdd?: (item: ConveyorDish) => void;
  /** Price label per tier for the legend. Derived from the items when omitted. */
  legend?: { [tier: number]: string };
  labels?: SushiConveyorMenuLabels;
  /** Rendered beside the belt (left on wide screens, under it otherwise) for the plate at the front mid point, or the lifted plate. Replaces the caption. */
  renderCenter?: (item: ConveyorDish, index: number) => React.ReactNode;
}

const SPACING = 1.35;
const CURVE = 0.95;
const BAND = 1.22;
const TILT = 0.8;
const SLAT = 0.34;
const LIFT_Y = -6;
const LIFT_SCALE = 0.08;
const BACK_SHADE = 0.15;
const CHIP_ROOM = 34;
const WIDE = 1024;
const HOLD = 1400;
const RUN = 0;
const SEEK = 1;
const DRAG = 2;
const DEFAULT_LABELS: SushiConveyorMenuLabels = { add: "Add to order", close: "Close", previous: "Previous plate", next: "Next plate", pause: "Pause belt" };
const TIERS = [
  { ring: "border-chart-1", dot: "bg-chart-1" },
  { ring: "border-chart-2", dot: "bg-chart-2" },
  { ring: "border-chart-3", dot: "bg-chart-3" },
  { ring: "border-chart-4", dot: "bg-chart-4" },
  { ring: "border-chart-5", dot: "bg-chart-5" },
] as const;
const THEME =
  "[--belt:color-mix(in_oklab,var(--color-foreground)_78%,var(--color-background))] dark:[--belt:color-mix(in_oklab,var(--color-foreground)_9%,var(--color-background))] " +
  "[--belt-side:color-mix(in_oklab,var(--color-foreground)_92%,var(--color-background))] dark:[--belt-side:color-mix(in_oklab,var(--color-foreground)_4%,var(--color-background))] " +
  "[--rail:color-mix(in_oklab,var(--color-muted-foreground)_45%,white)] dark:[--rail:color-mix(in_oklab,var(--color-muted-foreground)_72%,var(--color-background))] " +
  "[--island:color-mix(in_oklab,var(--color-muted-foreground)_16%,var(--color-background))] dark:[--island:color-mix(in_oklab,var(--color-foreground)_6%,var(--color-background))] " +
  "[--island-low:color-mix(in_oklab,var(--color-muted-foreground)_27%,var(--color-background))] dark:[--island-low:color-mix(in_oklab,var(--color-foreground)_4%,var(--color-background))] " +
  "[--island-wall:color-mix(in_oklab,var(--color-muted-foreground)_42%,var(--color-background))] dark:[--island-wall:color-mix(in_oklab,var(--color-foreground)_2%,var(--color-background))]";

type Geo = {
  width: number; height: number; d: number; r: number; s: number; l: number; pitch: number; n: number;
  kb: number; cx: number; ym: number; a: number; b: number; band: number; slats: number; side: number; edgeTop: number;
};
type Point = { x: number; z: number; nx: number; nz: number; tx: number; tz: number };
type Sim = {
  offset: number; v: number; mode: number; target: number;
  lift: number[]; vlift: number[]; z: number[]; lane: string[];
  raf: number; last: number; visible: boolean; init: boolean; touched: boolean; l: number; center: number; published: string;
  px: number; py: number; inside: boolean; lock: boolean; lockX: number; lockY: number;
};

function makeSim(): Sim {
  return { offset: 0, v: 0, mode: RUN, target: 0, lift: [], vlift: [], z: [], lane: [], raf: 0, last: 0, visible: true, init: false, touched: false, l: 0, center: -1, published: "", px: 0, py: 0, inside: false, lock: false, lockX: 0, lockY: 0 };
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function tierStyle(tier: number | undefined) {
  return TIERS[clamp(Math.round(tier ?? 1), 1, 5) - 1] ?? TIERS[0];
}

/** Position on the stadium loop. u is arc length on the belt, the front lane runs right to left and the back lane left to right. */
function along(g: Geo, u: number): Point {
  const { s, r } = g;
  let t = ((u % g.l) + g.l) % g.l;
  if (t < s) return { x: s / 2 - t, z: r, nx: 0, nz: 1, tx: -1, tz: 0 };
  t -= s;
  const arc = Math.PI * r;
  if (t < arc) {
    const f = t / r;
    const sin = Math.sin(f);
    const cos = Math.cos(f);
    return { x: -s / 2 - r * sin, z: r * cos, nx: -sin, nz: cos, tx: -cos, tz: -sin };
  }
  t -= arc;
  if (t < s) return { x: -s / 2 + t, z: -r, nx: 0, nz: -1, tx: 1, tz: 0 };
  t -= s;
  const f = Math.min(Math.PI, t / r);
  const sin = Math.sin(f);
  const cos = Math.cos(f);
  return { x: s / 2 + r * sin, z: -r * cos, nx: sin, nz: -cos, tx: cos, tz: sin };
}

/** Perspective-ish projection: the back lane shrinks to kb and the depth axis is foreshortened by TILT. */
function project(g: Geo, x: number, z: number) {
  const k = g.a + g.b * z;
  return { x: g.cx + x * k, y: g.ym + TILT * (g.a * z + (g.b * z * z) / 2), k };
}

function makeGeo(width: number, n: number, d: number, kb: number): Geo {
  const l = Math.max(1, n) * SPACING * d;
  const r = Math.min(CURVE * d, l / (2 * Math.PI));
  const s = Math.max(0, (l - 2 * Math.PI * r) / 2);
  const g: Geo = { width, height: 0, d, r, s, l, pitch: l / Math.max(1, n), n: Math.max(1, n), kb, cx: width / 2, ym: 0, a: (1 + kb) / 2, b: (1 - kb) / (2 * r), band: BAND * d, slats: Math.max(10, Math.round(l / (SLAT * d))), side: Math.max(3, d * 0.07), edgeTop: 0 };
  let top = Infinity;
  let bottom = -Infinity;
  let edge = Infinity;
  for (let j = 0; j < 120; j++) {
    const p = along(g, (j / 120) * l);
    const rim = project(g, p.x + (p.nx * g.band) / 2, p.z + (p.nz * g.band) / 2);
    const plate = project(g, p.x, p.z);
    const half = (plate.k * d * TILT) / 2;
    edge = Math.min(edge, rim.y);
    top = Math.min(top, rim.y, plate.y + (LIFT_Y / 100) * half * 2 - half * (1 + LIFT_SCALE) - CHIP_ROOM);
    bottom = Math.max(bottom, rim.y + g.side + d * 0.06, plate.y + half + d * 0.08);
  }
  g.ym = Math.ceil(-top) + 2;
  g.height = Math.ceil(bottom - top) + 4;
  g.edgeTop = edge + g.ym;
  return g;
}

function halfSpan(g: Geo) {
  let span = 0;
  for (let j = 0; j < 120; j++) {
    const p = along(g, (j / 120) * g.l);
    const rim = project(g, p.x + (p.nx * g.band) / 2, p.z + (p.nz * g.band) / 2);
    const plate = project(g, p.x, p.z);
    span = Math.max(span, Math.abs(rim.x - g.cx) + 3, Math.abs(plate.x - g.cx) + (plate.k * g.d * (1 + LIFT_SCALE)) / 2);
  }
  return span;
}

function edgePath(g: Geo, offset: number) {
  let d = "";
  const steps = 168;
  for (let j = 0; j < steps; j++) {
    const p = along(g, (j / steps) * g.l);
    const q = project(g, p.x + p.nx * offset, p.z + p.nz * offset);
    d += `${j ? "L" : "M"}${q.x.toFixed(1)} ${q.y.toFixed(1)}`;
  }
  return `${d}Z`;
}

/** Crescent slat seams across the belt, redrawn every frame so they travel with the plates (and round the curves). */
function slatPath(g: Geo, offset: number, shift: number) {
  const half = g.band * 0.46;
  const pitch = g.l / g.slats;
  const bulge = pitch * 0.2;
  let d = "";
  for (let j = 0; j < g.slats; j++) {
    const p = along(g, offset + shift + j * pitch);
    const inner = project(g, p.x - p.nx * half, p.z - p.nz * half);
    const outer = project(g, p.x + p.nx * half, p.z + p.nz * half);
    const mid = project(g, p.x + p.tx * bulge, p.z + p.tz * bulge);
    d += `M${inner.x.toFixed(1)} ${inner.y.toFixed(1)}Q${(2 * mid.x - (inner.x + outer.x) / 2).toFixed(1)} ${(2 * mid.y - (inner.y + outer.y) / 2).toFixed(1)} ${outer.x.toFixed(1)} ${outer.y.toFixed(1)}`;
  }
  return d;
}

function pose(g: Geo, offset: number, i: number) {
  const p = along(g, offset - i * g.pitch);
  const q = project(g, p.x, p.z);
  return { x: q.x, y: q.y, k: q.k, depth: (p.z + g.r) / (2 * g.r) };
}

function centerOf(g: Geo, offset: number) {
  return ((Math.round((offset - g.s / 2) / g.pitch) % g.n) + g.n) % g.n;
}

function legendEntries(items: ConveyorDish[], legend: { [tier: number]: string } | undefined) {
  const out = [] as { tier: number; label: string }[];
  for (let tier = 1; tier <= 5; tier++) {
    const label = legend ? legend[tier] : items.find((item) => (item.tier ?? 1) === tier)?.price;
    if (label) out.push({ tier, label });
  }
  return out;
}

function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function SushiConveyorMenu({
  items,
  eyebrow,
  heading,
  caption,
  action,
  speed = 26,
  paused: pausedProp,
  onPausedChange,
  autoplay = false,
  interval = 3000,
  active: activeProp,
  onActiveChange,
  onOpenChange,
  onAdd,
  legend,
  renderCenter,
  labels = DEFAULT_LABELS,
  className,
  ref,
  ...rest
}: SushiConveyorMenuProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const count = items.length;
  const sectionRef = React.useRef(null as HTMLElement | null);
  const stageRef = React.useRef(null as HTMLDivElement | null);
  const beltRef = React.useRef(null as HTMLDivElement | null);
  const seamRef = React.useRef(null as SVGPathElement | null);
  const glintRef = React.useRef(null as SVGPathElement | null);
  const plates = React.useRef([] as (HTMLButtonElement | null)[]);
  const lifts = React.useRef([] as (HTMLSpanElement | null)[]);
  const shades = React.useRef([] as (HTMLSpanElement | null)[]);
  const shadows = React.useRef([] as (HTMLSpanElement | null)[]);
  const anchors = React.useRef([] as (HTMLSpanElement | null)[]);
  const sim = React.useRef(makeSim());
  const pointer = React.useRef({ id: -1, index: -1, x: 0, y: 0, moved: false, start: 0, lane: 1, lastX: 0, lastT: 0, v: 0 });
  const pendingOpen = React.useRef(-1);
  const returnFocus = React.useRef(null as number | null);
  const autoActive = React.useRef(null as number | null);
  const autoLast = React.useRef(null as number | null);
  const [size, setSize] = React.useState({ section: 0, stage: 0 });
  const [innerActive, setInnerActive] = React.useState(null as number | null);
  const [innerPaused, setInnerPaused] = React.useState(false);
  const [openIndex, setOpenIndex] = React.useState(null as number | null);
  const [lifted, setLifted] = React.useState(null as number | null);
  const [reduced, setReduced] = React.useState(() => typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [playing, setPlaying] = React.useState(autoplay);
  const [center, setCenter] = React.useState(0);
  const [failed, setFailed] = React.useState({} as { [id: string]: boolean });

  const requested = activeProp !== undefined ? activeProp : innerActive;
  const active = requested !== null && requested >= 0 && requested < count ? requested : null;
  const paused = pausedProp ?? innerPaused;
  const wide = size.section >= WIDE;
  const narrow = size.section > 0 && size.section < 480;
  const kb = narrow ? 0.6 : 0.68;

  const geo = React.useMemo(() => {
    if (!size.stage || count === 0) return null;
    const span = halfSpan(makeGeo(1000, count, 100, kb)) / 100;
    const cap = wide ? 185 : clamp(size.section * 0.16, 96, 170);
    const fit = (size.stage - 8) / (2 * span);
    return makeGeo(size.stage, count, Math.round(clamp(fit, Math.min(96, cap), cap)), kb);
  }, [size.stage, size.section, count, kb, wide]);

  const live = React.useRef({
    geo: null as Geo | null, active: null as number | null, paused: false, reduced: false, open: false, count: 0, speed: 26,
    activeControlled: false, pausedControlled: false,
    onActiveChange: undefined as ((index: number | null) => void) | undefined,
    onPausedChange: undefined as ((value: boolean) => void) | undefined,
    onOpenChange: undefined as ((index: number | null) => void) | undefined,
    onAdd: undefined as ((item: ConveyorDish) => void) | undefined,
  });
  live.current = {
    geo, active, paused, reduced, open: openIndex !== null, count, speed: Math.max(0, speed),
    activeControlled: activeProp !== undefined, pausedControlled: pausedProp !== undefined,
    onActiveChange, onPausedChange, onOpenChange, onAdd,
  };

  const setSectionRef = React.useCallback((node: HTMLElement | null) => {
    sectionRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  }, [ref]);

  const paintPlate = React.useCallback((i: number) => {
    const L = live.current;
    const g = L.geo;
    const s = sim.current;
    const button = plates.current[i];
    if (!g || !button) return;
    const q = pose(g, s.offset, i);
    const e = s.lift[i] ?? 0;
    button.style.transform = `translate3d(${(q.x - g.d / 2).toFixed(2)}px,${(q.y - (g.d * TILT) / 2).toFixed(2)}px,0) scale(${q.k.toFixed(4)})`;
    const z = i === L.active ? 2000 : 100 + Math.round(q.y);
    if (s.z[i] !== z) { s.z[i] = z; button.style.zIndex = String(z); }
    const lane = q.depth >= 0.5 ? "front" : "back";
    if (s.lane[i] !== lane) { s.lane[i] = lane; button.dataset.lane = lane; }
    const lift = lifts.current[i];
    if (lift) lift.style.transform = `translateY(${(LIFT_Y * e).toFixed(3)}%) scale(${(1 + LIFT_SCALE * e).toFixed(4)})`;
    const shade = shades.current[i];
    if (shade) shade.style.opacity = (BACK_SHADE * clamp(1 - q.depth, 0, 1) * (1 - 0.7 * clamp(e, 0, 1))).toFixed(3);
    const shadow = shadows.current[i];
    if (shadow) {
      shadow.style.transform = `translate3d(0,${(g.d * TILT * 0.05 * e).toFixed(2)}px,0) scale(${(1 + 0.14 * e).toFixed(3)})`;
      shadow.style.opacity = (1 - 0.5 * clamp(e, 0, 1)).toFixed(3);
    }
    const anchor = anchors.current[i];
    if (anchor) anchor.style.transform = `scale(${(1 / (q.k * (1 + LIFT_SCALE * e))).toFixed(4)})`;
  }, []);

  const paintBelt = React.useCallback(() => {
    const L = live.current;
    const g = L.geo;
    const s = sim.current;
    if (!g) return;
    seamRef.current?.setAttribute("d", slatPath(g, s.offset, 0));
    glintRef.current?.setAttribute("d", slatPath(g, s.offset, -Math.max(1.4, g.d * 0.024)));
    const v = (Math.abs(s.v) < 0.005 ? 0 : s.v).toFixed(2);
    if (v !== s.published) { s.published = v; beltRef.current?.style.setProperty("--belt-v", v); }
    const c = centerOf(g, s.offset);
    if (c !== s.center) { s.center = c; setCenter(c); }
  }, []);

  const paintAll = React.useCallback(() => {
    for (let i = 0; i < live.current.count; i++) paintPlate(i);
    paintBelt();
  }, [paintPlate, paintBelt]);

  const hitTest = React.useCallback((px: number, py: number) => {
    const L = live.current;
    const g = L.geo;
    const s = sim.current;
    if (!g) return null;
    let best = null as number | null;
    let bestY = -Infinity;
    for (let i = 0; i < L.count; i++) {
      const q = pose(g, s.offset, i);
      const e = clamp(s.lift[i] ?? 0, 0, 1.2);
      const grow = (1 + LIFT_SCALE * e) * (i === L.active ? 1.1 : 1);
      const rx = (g.d * q.k * grow) / 2;
      const ry = (g.d * TILT * q.k * grow) / 2;
      const dx = (px - q.x) / rx;
      const dy = (py - (q.y + (LIFT_Y / 100) * g.d * TILT * q.k * e)) / ry;
      if (dx * dx + dy * dy > 1) continue;
      if (i === L.active) return i;
      if (q.y > bestY) { best = i; bestY = q.y; }
    }
    return best;
  }, []);

  const hoverRef = React.useRef((hit: number | null) => { void hit; });

  const tick = React.useCallback((now: number) => {
    const s = sim.current;
    const L = live.current;
    const g = L.geo;
    s.raf = 0;
    if (!g || !s.visible) { s.last = 0; return; }
    const dt = s.last ? clamp((now - s.last) / 1000, 0, 0.25) : 1 / 60;
    s.last = now;
    // Sub-steps keep the springs stable and the belt on real time when frames arrive late.
    const steps = Math.max(1, Math.ceil(dt / 0.017));
    const h = dt / steps;
    const stopped = L.paused || L.active !== null || L.open;
    const cruise = L.reduced ? 0 : L.speed;
    for (let step = 0; step < steps; step++) {
      if (s.mode === SEEK) {
        const w = 5.6;
        s.v += (w * w * (s.target - s.offset) - 2 * w * s.v) * h;
        s.offset += s.v * h;
        if (Math.abs(s.target - s.offset) < 0.3 && Math.abs(s.v) < 4) { s.offset = s.target; s.v = 0; s.mode = RUN; }
      } else if (s.mode === RUN) {
        if (stopped) {
          s.v *= Math.exp(-7.2 * h);
          if (Math.abs(s.v) < 0.02) s.v = 0;
        } else {
          let e = s.v - cruise;
          if (Math.abs(e) > Math.max(6, cruise * 0.5)) e = Math.sign(e) * Math.max(0, Math.abs(e) * Math.exp(-2.4 * h) - 90 * h);
          else e *= Math.exp(-3.4 * h);
          s.v = cruise + (Math.abs(e) < 0.01 ? 0 : e);
        }
        s.offset += s.v * h;
      }
      for (let i = 0; i < L.count; i++) {
        const goal = i === L.active ? 1 : 0;
        if (L.reduced) { s.lift[i] = goal; s.vlift[i] = 0; continue; }
        const x = s.lift[i] ?? 0;
        const v = (s.vlift[i] ?? 0) + (330 * (goal - x) - 23 * (s.vlift[i] ?? 0)) * h;
        s.lift[i] = x + v * h;
        s.vlift[i] = v;
      }
    }
    let busy = s.mode !== RUN || s.v !== 0 || (!stopped && cruise > 0);
    for (let i = 0; i < L.count; i++) {
      const goal = i === L.active ? 1 : 0;
      if (Math.abs(goal - (s.lift[i] ?? 0)) < 0.002 && Math.abs(s.vlift[i] ?? 0) < 0.02) { s.lift[i] = goal; s.vlift[i] = 0; }
      else busy = true;
    }
    if (s.inside && !s.lock && s.mode === RUN && !L.open && pointer.current.id < 0 && Math.abs(s.v) > 0.3) {
      const hit = hitTest(s.px, s.py);
      if (hit !== null && hit !== L.active) hoverRef.current(hit);
    }
    paintAll();
    if (busy) s.raf = requestAnimationFrame(tick);
    else s.last = 0;
  }, [hitTest, paintAll]);

  const kick = React.useCallback(() => {
    const s = sim.current;
    if (s.raf || !s.visible) return;
    s.last = 0;
    s.raf = requestAnimationFrame(tick);
  }, [tick]);

  const setActive = React.useCallback((next: number | null) => {
    const L = live.current;
    if (L.active === next) return;
    if (!L.activeControlled) { L.active = next; setInnerActive(next); }
    L.onActiveChange?.(next);
    kick();
  }, [kick]);

  const stop = React.useCallback(() => {
    setPlaying(false);
    const s = sim.current;
    s.touched = true;
    if (s.mode === SEEK) s.mode = RUN;
    const auto = autoActive.current;
    if (auto !== null) {
      autoActive.current = null;
      if (live.current.active === auto) setActive(null);
    }
  }, [setActive]);

  const seekTo = React.useCallback((index: number) => {
    const s = sim.current;
    const g = live.current.geo;
    if (!g) return;
    const base = g.s / 2 + index * g.pitch;
    s.target = base + Math.round((s.offset - base) / g.l) * g.l;
    if (live.current.reduced) { s.offset = s.target; s.v = 0; s.mode = RUN; paintAll(); return; }
    s.mode = SEEK;
    kick();
  }, [kick, paintAll]);

  const focusVisible = () => !!stageRef.current?.querySelector("[data-dish]:focus-visible");

  hoverRef.current = (hit: number | null) => {
    const current = live.current.active;
    if (hit === current) {
      // The visitor takes over the plate autoplay lifted: autoplay stops and the plate stays up.
      if (hit !== null && autoActive.current === hit) { autoActive.current = null; setPlaying(false); }
      return;
    }
    if (hit !== null) { stop(); setActive(hit); return; }
    if (current !== null && current !== autoActive.current && !focusVisible()) setActive(null);
  };

  const open = React.useCallback((index: number) => {
    stop();
    setActive(index);
    const s = sim.current;
    s.v = 0;
    s.mode = RUN;
    live.current.open = true;
    paintBelt();
    setOpenIndex(index);
    live.current.onOpenChange?.(index);
  }, [stop, setActive, paintBelt]);

  const close = React.useCallback(() => {
    live.current.open = false;
    setOpenIndex(null);
    live.current.onOpenChange?.(null);
    kick();
  }, [kick]);

  const go = (index: number, focus: boolean) => {
    if (count === 0) return;
    const next = ((index % count) + count) % count;
    stop();
    if (focus) plates.current[next]?.focus({ preventScroll: true });
    setActive(next);
    seekTo(next);
  };

  const togglePause = () => {
    stop();
    const L = live.current;
    const next = !L.paused;
    if (!L.pausedControlled) { L.paused = next; setInnerPaused(next); }
    L.onPausedChange?.(next);
    if (!next && L.active !== null && !focusVisible() && !sim.current.inside) setActive(null);
    kick();
  };

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  React.useEffect(() => { setPlaying(autoplay); }, [autoplay]);

  React.useLayoutEffect(() => {
    const section = sectionRef.current;
    const stage = stageRef.current;
    if (!section || !stage) return;
    const measure = () => {
      const next = { section: Math.round(section.clientWidth), stage: Math.round(stage.clientWidth) };
      setSize((old) => (old.section === next.section && old.stage === next.stage ? old : next));
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(section);
    observer.observe(stage);
    return () => observer.disconnect();
  }, [count > 0]);

  React.useLayoutEffect(() => {
    const s = sim.current;
    if (!geo) return;
    if (!s.init) {
      s.init = true;
      s.offset = geo.s / 2 - Math.min(live.current.speed * 1.62, geo.pitch * 0.45);
      s.v = live.current.reduced || live.current.paused ? 0 : live.current.speed;
    } else if (s.l > 0 && s.l !== geo.l) {
      const f = geo.l / s.l;
      s.offset *= f;
      s.target *= f;
    }
    if (live.current.reduced) {
      s.v = 0;
      if (s.mode !== DRAG) s.mode = RUN;
      if (!s.touched) s.offset = geo.s / 2;
    }
    s.l = geo.l;
    s.z = [];
    s.lane = [];
    paintAll();
    kick();
  }, [geo, items, reduced, paintAll, kick]);

  React.useEffect(() => { kick(); }, [active, paused, openIndex, reduced, speed, kick]);

  React.useEffect(() => {
    const node = sectionRef.current;
    const s = sim.current;
    let inView = true;
    const update = () => {
      const visible = inView && !document.hidden;
      if (visible === s.visible) return;
      s.visible = visible;
      if (visible) kick();
      else if (s.raf) { cancelAnimationFrame(s.raf); s.raf = 0; s.last = 0; }
    };
    const observer = node && typeof IntersectionObserver === "function" ? new IntersectionObserver((entries) => { inView = entries.some((entry) => entry.isIntersecting); update(); }) : null;
    if (node && observer) observer.observe(node);
    document.addEventListener("visibilitychange", update);
    update();
    return () => { observer?.disconnect(); document.removeEventListener("visibilitychange", update); };
  }, [kick]);

  React.useEffect(() => () => { const s = sim.current; if (s.raf) cancelAnimationFrame(s.raf); s.raf = 0; s.last = 0; }, []);

  const geoReady = geo !== null;
  React.useEffect(() => {
    if (!playing || reduced || paused || openIndex !== null || count === 0 || !geoReady) return;
    let timer = 0;
    const show = () => {
      const g = live.current.geo;
      if (!g) return;
      const last = autoLast.current;
      const index = last === null ? centerOf(g, sim.current.offset + live.current.speed * 0.25) : (last + 1) % count;
      autoLast.current = index;
      autoActive.current = index;
      setActive(index);
      seekTo(index);
      timer = window.setTimeout(() => {
        if (autoActive.current === index) {
          autoActive.current = null;
          if (live.current.active === index) setActive(null);
        }
        timer = window.setTimeout(show, Math.max(300, interval - HOLD));
      }, HOLD);
    };
    timer = window.setTimeout(show, autoLast.current === null ? 1600 : Math.max(300, interval - HOLD));
    return () => window.clearTimeout(timer);
  }, [playing, reduced, paused, openIndex, count, interval, geoReady, setActive, seekTo]);

  React.useLayoutEffect(() => {
    if (openIndex !== null || lifted !== null || returnFocus.current === null) return;
    const index = returnFocus.current;
    returnFocus.current = null;
    plates.current[index]?.focus({ preventScroll: true });
  }, [openIndex, lifted]);

  const local = (event: React.PointerEvent) => {
    const box = stageRef.current?.getBoundingClientRect();
    return { x: event.clientX - (box?.left ?? 0), y: event.clientY - (box?.top ?? 0) };
  };

  const onPointerDown = (event: React.PointerEvent) => {
    const g = live.current.geo;
    if (event.button !== 0 || !g) return;
    const at = local(event);
    const hit = hitTest(at.x, at.y);
    pendingOpen.current = -1;
    pointer.current = { id: event.pointerId, index: hit ?? -1, x: event.clientX, y: event.clientY, moved: false, start: sim.current.offset, lane: at.y >= g.ym ? 1 : -1, lastX: event.clientX, lastT: event.timeStamp, v: 0 };
  };

  const onPointerMove = (event: React.PointerEvent) => {
    const s = sim.current;
    const p = pointer.current;
    const stage = stageRef.current;
    const g = live.current.geo;
    if (!stage || !g) return;
    const at = local(event);
    if (event.pointerType === "mouse") { s.px = at.x; s.py = at.y; s.inside = true; }
    if (p.id === event.pointerId) {
      const dx = event.clientX - p.x;
      const now = event.timeStamp;
      if (!p.moved && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(event.clientY - p.y)) {
        p.moved = true;
        stop();
        setActive(null);
        s.mode = DRAG;
        if (stage.isConnected) stage.setPointerCapture(event.pointerId);
      }
      if (p.moved) {
        const v = (event.clientX - p.lastX) / Math.max(1, now - p.lastT);
        p.v = p.v * 0.6 + v * 0.4;
        p.lastX = event.clientX;
        p.lastT = now;
        const scale = p.lane > 0 ? 1 : 1 / g.kb;
        s.offset = p.start - p.lane * dx * scale;
        s.v = live.current.reduced ? 0 : -p.lane * p.v * 1000 * scale;
        kick();
      }
      return;
    }
    if (event.pointerType !== "mouse" || live.current.open) return;
    if (s.lock) {
      if (Math.hypot(at.x - s.lockX, at.y - s.lockY) < 4) return;
      s.lock = false;
    }
    hoverRef.current(hitTest(at.x, at.y));
  };

  const finishPointer = (event: React.PointerEvent, cancelled: boolean) => {
    const p = pointer.current;
    if (p.id !== event.pointerId) return;
    const s = sim.current;
    const stage = stageRef.current;
    if (stage?.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    pointer.current = { ...p, id: -1 };
    if (s.mode === DRAG) {
      s.mode = RUN;
      // Holding still before letting go bleeds the flick away (about 70 ms time constant).
      const carry = Math.exp(-Math.max(0, event.timeStamp - p.lastT) / 70);
      s.v = live.current.reduced ? 0 : clamp(s.v * carry, -1400, 1400);
      if (event.pointerType === "mouse") {
        const at = local(event);
        s.lock = true;
        s.lockX = at.x;
        s.lockY = at.y;
      }
      kick();
      return;
    }
    if (cancelled || p.moved) return;
    const touch = event.pointerType !== "mouse";
    if (p.index < 0) {
      if (touch && live.current.active !== null) { stop(); setActive(null); }
      return;
    }
    stop();
    if (touch && live.current.active !== p.index) setActive(p.index);
    else pendingOpen.current = p.index;
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (!["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key) || count === 0) return;
    event.preventDefault();
    const own = (event.target as HTMLElement).closest("[data-dish]")?.getAttribute("data-dish");
    const from = own != null ? Number(own) : (active ?? center);
    go(event.key === "Home" ? 0 : event.key === "End" ? count - 1 : from + (event.key === "ArrowRight" ? 1 : -1), true);
  };

  const openSource = React.useCallback(() => (openIndex === null ? null : lifts.current[openIndex]?.getBoundingClientRect() ?? null), [openIndex]);
  const onLift = React.useCallback((on: boolean) => setLifted(on ? openIndex : null), [openIndex]);
  const onDialogClose = React.useCallback(() => { returnFocus.current = openIndex; close(); }, [openIndex, close]);
  const onDialogAdd = React.useCallback(() => {
    const item = openIndex === null ? undefined : items[openIndex];
    if (item) live.current.onAdd?.(item);
  }, [openIndex, items]);

  const paths = React.useMemo(() => (geo ? { outer: edgePath(geo, geo.band / 2), inner: edgePath(geo, -geo.band / 2), island: edgePath(geo, -geo.band / 2 - geo.d * 0.035) } : null), [geo]);
  const current = active === null ? null : items[active] ?? null;
  const roving = active ?? center;
  const tiers = legendEntries(items, legend);
  const g = geo;
  const control = "inline-flex size-8 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none";

  const header = (eyebrow || heading || tiers.length > 0) && (
    <div className={wide ? "flex flex-col items-start gap-4 text-left" : "flex flex-col items-center gap-2 px-2 text-center"}>
      {eyebrow && <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">{eyebrow}</p>}
      {heading && <h2 className={`text-balance font-medium tracking-tight ${wide ? "text-4xl leading-[1.1] xl:text-[2.75rem]" : "text-2xl md:text-3xl"}`}>{heading}</h2>}
      {tiers.length > 0 && (
        <ul aria-hidden="true" data-legend className={`mt-1 flex flex-wrap items-center gap-x-3.5 gap-y-1.5 text-[11px] tabular-nums text-muted-foreground ${wide ? "justify-start" : "justify-center"} ${narrow ? "max-w-[15rem]" : ""}`}>
          {tiers.map((entry) => (
            <li key={entry.tier} className="inline-flex items-center gap-1.5">
              <span className={`size-2.5 rounded-full border-2 bg-transparent ${tierStyle(entry.tier).ring}`} />
              {entry.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const captionNode = (
    <div id={`${uid}-caption`} aria-live="polite" data-caption className={wide ? "min-h-[3.25rem]" : `mx-auto mt-2 max-w-md px-2 text-center ${narrow ? "min-h-[3.75rem]" : "min-h-[2.75rem]"}`}>
      <p className={`text-sm ${current ? "font-medium text-foreground" : "text-muted-foreground"}`}>
        {current ? <>{current.name} <span className="font-normal tabular-nums text-muted-foreground">· {current.price}</span></> : caption}
      </p>
      {current?.description && <p className="mt-0.5 text-[13px] leading-snug text-muted-foreground">{current.description}</p>}
    </div>
  );

  const midIndex = active ?? center;
  const midNode = renderCenter && items[midIndex] ? (
    <div data-mid className={wide ? "min-h-[14rem] w-full" : "mx-auto mt-3 min-h-[12rem] w-full max-w-md px-2 text-center"}>
      {renderCenter(items[midIndex], midIndex)}
    </div>
  ) : null;

  const controls = count > 1 && (
    <div className="relative z-10 mt-1 flex items-center justify-center gap-1.5">
      <button type="button" data-control="previous" aria-label={labels.previous} onClick={() => go((live.current.active ?? sim.current.center) - 1, false)} className={control}>
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M10 3.5 5.5 8l4.5 4.5" /></svg>
      </button>
      <button type="button" data-control="pause" aria-label={labels.pause ?? DEFAULT_LABELS.pause} aria-pressed={paused} onClick={togglePause} className={control}>
        {paused
          ? <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5" fill="currentColor"><path d="M5 3.4v9.2a.6.6 0 0 0 .9.5l7.4-4.6a.6.6 0 0 0 0-1L5.9 2.9a.6.6 0 0 0-.9.5Z" /></svg>
          : <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5" fill="currentColor"><rect x="4" y="3" width="2.6" height="10" rx="0.8" /><rect x="9.4" y="3" width="2.6" height="10" rx="0.8" /></svg>}
      </button>
      <button type="button" data-control="next" aria-label={labels.next} onClick={() => go((live.current.active ?? sim.current.center) + 1, false)} className={control}>
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M6 3.5 10.5 8 6 12.5" /></svg>
      </button>
    </div>
  );

  const stage = count > 0 && (
    <div
      ref={stageRef}
      data-stage
      role="group"
      aria-label={heading ?? "Sushi conveyor belt"}
      aria-roledescription="conveyor belt"
      className="relative w-full touch-pan-y select-none"
      style={{ height: g ? g.height : 260, overflowX: "clip" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={(event) => finishPointer(event, false)}
      onPointerCancel={(event) => finishPointer(event, true)}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse") return;
        const s = sim.current;
        s.inside = false;
        s.lock = false;
        const current = live.current.active;
        if (pointer.current.id < 0 && !live.current.open && current !== null && current !== autoActive.current && !focusVisible()) setActive(null);
      }}
      onBlur={(event) => {
        const next = event.relatedTarget as Node | null;
        if ((next && stageRef.current?.contains(next)) || live.current.open || sim.current.inside) return;
        const current = live.current.active;
        if (current !== null && current !== autoActive.current) setActive(null);
      }}
      onKeyDown={onKeyDown}
    >
      {g && renderCenter && (
        <div aria-hidden="true" data-midpoint className="pointer-events-none absolute z-[1] flex -translate-x-1/2 flex-col items-center" style={{ left: g.cx, top: project(g, 0, g.r + g.band / 2).y + g.side + 4 }}>
          <span className="size-0 border-x-[6px] border-b-[8px] border-x-transparent border-b-foreground/60" />
        </div>
      )}
      <div ref={beltRef} data-belt aria-hidden="true" className="pointer-events-none absolute inset-0">
        {g && paths && (
          <svg className="absolute left-0 top-0 overflow-visible" width={g.width} height={g.height} viewBox={`0 0 ${g.width} ${g.height}`} focusable="false">
            <defs>
              <filter id={`${uid}-soft`} x="-10%" y="-30%" width="120%" height="160%">
                <feGaussianBlur stdDeviation={(g.d * 0.06).toFixed(1)} />
              </filter>
              <linearGradient id={`${uid}-island`} x1="0" x2="0" y1="0" y2="1">
                <stop offset="0" style={{ stopColor: "var(--island)" }} />
                <stop offset="1" style={{ stopColor: "var(--island-low)" }} />
              </linearGradient>
            </defs>
            <path d={paths.outer} transform={`translate(0 ${(g.side + g.d * 0.07).toFixed(1)})`} fill="black" className="opacity-[0.18] dark:opacity-60" filter={`url(#${uid}-soft)`} />
            <path d={`${paths.outer}${paths.inner}`} fillRule="evenodd" transform={`translate(0 ${g.side.toFixed(1)})`} style={{ fill: "var(--belt-side)" }} />
            <path d={`${paths.outer}${paths.inner}`} fillRule="evenodd" style={{ fill: "var(--belt)" }} />
            <path ref={seamRef} fill="none" stroke="black" strokeOpacity={0.42} strokeWidth={Math.max(1, g.d * 0.013)} strokeLinecap="round" />
            <path ref={glintRef} fill="none" stroke="white" strokeOpacity={0.14} strokeWidth={Math.max(0.8, g.d * 0.009)} strokeLinecap="round" />
            <path d={paths.outer} fill="none" style={{ stroke: "var(--rail)" }} strokeWidth={Math.max(2, g.d * 0.026)} />
            <path d={paths.outer} fill="none" stroke="white" strokeOpacity={0.55} strokeWidth={Math.max(0.8, g.d * 0.008)} transform="translate(0 -0.8)" />
            <path d={paths.inner} fill="none" style={{ stroke: "var(--rail)" }} strokeWidth={Math.max(1.6, g.d * 0.02)} />
            <path d={paths.inner} fill="none" stroke="white" strokeOpacity={0.4} strokeWidth={Math.max(0.8, g.d * 0.008)} transform="translate(0 -0.7)" />
            <path d={paths.island} style={{ fill: "var(--island-wall)" }} />
            <path d={paths.island} transform={`translate(0 ${(-g.side * 0.6).toFixed(1)})`} style={{ fill: `url(#${uid}-island)` }} />
            <path d={paths.island} transform={`translate(0 ${(-g.side * 0.6 - 0.6).toFixed(1)})`} fill="none" stroke="white" strokeOpacity={0.55} strokeWidth={Math.max(0.8, g.d * 0.008)} className="dark:opacity-40" />
          </svg>
        )}
      </div>
      {g && items.map((item, i) => {
        const tier = tierStyle(item.tier);
        const isActive = active === i;
        const broken = !!failed[item.id];
        const mask = `url("${item.image}") 0 0 / 100% 100% no-repeat`;
        return (
          <button
            key={item.id}
            ref={(node) => { plates.current[i] = node; }}
            type="button"
            data-dish={i}
            data-active={isActive || undefined}
            tabIndex={i === roving ? 0 : -1}
            aria-label={`${item.name}, ${item.price}`}
            aria-describedby={`${uid}-caption`}
            aria-haspopup="dialog"
            aria-current={isActive || undefined}
            className="absolute left-0 top-0 cursor-pointer rounded-[50%] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
            style={{ width: g.d, height: g.d * TILT, visibility: lifted === i ? "hidden" : undefined }}
            onFocus={() => { if (pointer.current.id < 0) { stop(); setActive(i); } }}
            onClick={(event) => { const pending = pendingOpen.current; pendingOpen.current = -1; if (event.detail === 0 || pending === i) open(i); }}
          >
            <span aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-50 dark:opacity-90">
              <span ref={(node) => { shadows.current[i] = node; }} className="absolute inset-x-[5%] bottom-[-9%] top-[16%] rounded-[50%] bg-black" style={{ filter: `blur(${Math.max(2, g.d * 0.045).toFixed(1)}px)` }} />
            </span>
            <span ref={(node) => { lifts.current[i] = node; }} data-lift className="absolute inset-0">
              <span aria-hidden="true" data-placeholder className={`absolute rounded-[50%] border border-border bg-card ${broken ? "inset-[3%] shadow-sm" : "inset-[6%]"}`}>
                <span className="absolute inset-[30%] rounded-[50%] bg-muted-foreground/20" />
              </span>
              {!broken && (
                <img
                  src={item.image}
                  alt=""
                  draggable={false}
                  onError={() => setFailed((old) => (old[item.id] ? old : { ...old, [item.id]: true }))}
                  className="pointer-events-none absolute inset-0 size-full select-none object-fill"
                />
              )}
              {!broken && <span ref={(node) => { shades.current[i] = node; }} aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: 0, WebkitMask: mask, mask }} />}
              <span aria-hidden="true" data-ring className={`pointer-events-none absolute -inset-[2%] rounded-[50%] border-2 ${tier.ring}`} />
              <span ref={(node) => { anchors.current[i] = node; }} aria-hidden="true" className="pointer-events-none absolute left-1/2 top-0 size-0">
                <span data-chip className={`absolute bottom-[7px] left-0 flex -translate-x-1/2 items-center gap-1.5 whitespace-nowrap rounded-full border border-border bg-card py-1 pl-2 pr-2.5 text-[11px] font-medium leading-none text-card-foreground shadow-[0_6px_16px_-6px_color-mix(in_oklab,var(--color-foreground)_40%,transparent)] transition-[opacity,translate] duration-300 motion-reduce:transition-none ${isActive && lifted !== i ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}>
                  <span className={`size-1.5 rounded-full ${tier.dot}`} />
                  {item.name}
                  <span className="tabular-nums text-muted-foreground">{item.price}</span>
                </span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );

  return (
    <section
      {...rest}
      ref={setSectionRef}
      data-slot="sushi-conveyor-menu"
      data-layout={wide ? "wide" : "stack"}
      data-active={active ?? ""}
      data-open={openIndex ?? ""}
      data-paused={paused || undefined}
      data-center={center}
      className={`relative isolate w-full overflow-hidden bg-background text-foreground ${THEME} ${className ?? ""}`}
    >
      {wide ? (
        <div className="mx-auto grid w-full max-w-[88rem] grid-cols-[minmax(0,26rem)_minmax(0,1fr)] items-center gap-12 px-10 py-14">
          <div className="flex flex-col items-start gap-6">
            {header}
            {midNode ?? captionNode}
            {action}
          </div>
          <div className="min-w-0">
            {stage}
            {controls}
          </div>
        </div>
      ) : (
        <div className="flex w-full flex-col items-center px-4 pb-6 pt-6">
          {header}
          <div className="mt-2 w-full min-w-0">{stage}</div>
          {controls}
          {midNode ?? captionNode}
          {action && <div className="mt-3 flex justify-center">{action}</div>}
        </div>
      )}
      {openIndex !== null && items[openIndex] && (
        <DishDialog
          uid={uid}
          item={items[openIndex]}
          index={openIndex}
          total={count}
          labels={labels}
          reduced={reduced}
          broken={!!failed[items[openIndex].id]}
          source={openSource}
          onLift={onLift}
          onAdd={onDialogAdd}
          onClose={onDialogClose}
        />
      )}
    </section>
  );
}

/**
 * Detail view, using the skate-deck-rail reveal: the plate lifts off the belt
 * in an arc into a full-screen blurred view, details fade in beside it, and
 * the plate turns over by itself to show its underside (Front / Back toggle).
 */
function DishDialog({ uid, item, index, total, labels, reduced, broken, source, onLift, onAdd, onClose }: {
  uid: string;
  item: ConveyorDish;
  index: number;
  total: number;
  labels: SushiConveyorMenuLabels;
  reduced: boolean;
  broken: boolean;
  source: () => DOMRect | null;
  onLift: (lifted: boolean) => void;
  onAdd: () => void;
  onClose: () => void;
}) {
  const dialogRef = React.useRef(null as HTMLDivElement | null);
  const figureRef = React.useRef(null as HTMLDivElement | null);
  const spinRef = React.useRef(null as HTMLDivElement | null);
  const closeRef = React.useRef(null as HTMLButtonElement | null);
  const timer = React.useRef(0);
  const closing = React.useRef(false);
  const angle = React.useRef({ value: 0, target: 0, velocity: 0, raf: 0, last: 0, dragging: false, startX: 0, startAngle: 0, auto: 0 });
  const [shown, setShown] = React.useState(false);
  const [added, setAdded] = React.useState(false);
  const [side, setSide] = React.useState("front" as "front" | "back");
  const titleId = `${uid}-dish-title`;
  const tier = tierStyle(item.tier);
  const frontLabel = labels.front ?? "Front";
  const backLabel = labels.back ?? "Back";

  const spin = React.useCallback(() => {
    const a = angle.current;
    const node = spinRef.current;
    const loop = (now: number) => {
      const dt = a.last ? Math.min(0.1, (now - a.last) / 1000) : 1 / 60;
      a.last = now;
      const steps = Math.max(1, Math.ceil(dt / 0.017));
      for (let k = 0; k < steps; k++) {
        const accel = -90 * (a.value - a.target) - 2 * Math.sqrt(90) * 0.8 * a.velocity;
        a.velocity += accel * (dt / steps);
        a.value += a.velocity * (dt / steps);
      }
      if (node) node.style.transform = `rotateY(${a.value.toFixed(2)}deg)`;
      if (Math.abs(a.value - a.target) < 0.05 && Math.abs(a.velocity) < 0.05) { a.value = a.target; if (node) node.style.transform = `rotateY(${a.value}deg)`; a.raf = 0; a.last = 0; return; }
      a.raf = requestAnimationFrame(loop);
    };
    if (reduced) { a.value = a.target; a.velocity = 0; if (node) node.style.transform = `rotateY(${a.value}deg)`; return; }
    if (!a.raf) a.raf = requestAnimationFrame(loop);
  }, [reduced]);

  const turnTo = React.useCallback((next: "front" | "back") => {
    const a = angle.current;
    window.clearTimeout(a.auto);
    a.auto = 0;
    const base = Math.round(a.value / 360) * 360;
    a.target = base + (next === "back" ? 180 : 0);
    if (Math.abs(a.target - a.value) > 180) a.target -= 360 * Math.sign(a.target - a.value);
    setSide(next);
    spin();
  }, [spin]);

  React.useLayoutEffect(() => {
    const figure = figureRef.current;
    const from = source();
    const a = angle.current;
    closeRef.current?.focus({ preventScroll: true });
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    onLift(true);
    let animation = null as Animation | null;
    if (figure && from && !reduced && from.width > 0) {
      const to = figure.getBoundingClientRect();
      const sx = from.width / to.width;
      const sy = from.height / to.height;
      const dx = from.left + from.width / 2 - (to.left + to.width / 2);
      const dy = from.top + from.height / 2 - (to.top + to.height / 2);
      const lift = Math.min(90, Math.abs(dy) * 0.25 + 30);
      animation = figure.animate([
        { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
        { transform: `translate(${dx * 0.4}px, ${dy * 0.4 - lift}px) scale(${((sx + 1) / 2) * 1.03}, ${((sy + 1) / 2) * 1.03}) rotate(${dx > 0 ? -3 : 3}deg)`, offset: 0.5 },
        { transform: "none" },
      ], { duration: 680, easing: "cubic-bezier(.22,.85,.3,1)" });
    }
    const raf = requestAnimationFrame(() => setShown(true));
    if (reduced) {
      a.target = 180; a.value = 180; a.velocity = 0;
      if (spinRef.current) spinRef.current.style.transform = "rotateY(180deg)";
      setSide("back");
    } else {
      a.auto = window.setTimeout(() => {
        a.auto = 0;
        a.target = 180;
        setSide("back");
        spin();
      }, 860);
    }
    return () => {
      cancelAnimationFrame(raf);
      animation?.cancel();
      window.clearTimeout(timer.current);
      window.clearTimeout(a.auto);
      cancelAnimationFrame(a.raf);
      a.raf = 0;
      document.body.style.overflow = overflow;
      onLift(false);
    };
  }, [source, reduced, onLift, spin]);

  const dismiss = React.useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setShown(false);
    turnTo("front");
    const figure = figureRef.current;
    const to = source();
    if (!figure || !to || reduced || to.width === 0) { onClose(); return; }
    const from = figure.getBoundingClientRect();
    const sx = to.width / from.width;
    const sy = to.height / from.height;
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top + to.height / 2 - (from.top + from.height / 2);
    const animation = figure.animate([
      { transform: "none" },
      { transform: `translate(${dx * 0.6}px, ${dy * 0.6 - 30}px) scale(${(sx + 1) / 2}, ${(sy + 1) / 2})`, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})` },
    ], { duration: 560, easing: "cubic-bezier(.45,0,.55,1)", fill: "forwards" });
    animation.onfinish = () => onClose();
  }, [source, reduced, onClose, turnTo]);

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const dialog = dialogRef.current;
      if (!dialog || dialog.contains(event.target as Node)) return;
      if (event.key === "Escape") { event.preventDefault(); dismiss(); }
      else if (event.key === "ArrowLeft" || event.key === "ArrowRight") turnTo(side === "front" ? "back" : "front");
      else if (event.key === "Tab") {
        const first = dialog.querySelector("button");
        if (first) { event.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [dismiss, turnTo, side]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") { event.preventDefault(); dismiss(); return; }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); turnTo(side === "front" ? "back" : "front"); return; }
    if (event.key !== "Tab") return;
    const controls = [...(dialogRef.current?.querySelectorAll("button") ?? [])].filter((node) => !node.disabled);
    const first = controls[0];
    const last = controls.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  const add = () => {
    if (added || closing.current) return;
    onAdd();
    setAdded(true);
    timer.current = window.setTimeout(dismiss, reduced ? 0 : 450);
  };

  const faces = (["front", "back"] as const);

  return createPortal(
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} data-dish-dialog className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto p-5 text-foreground sm:p-8" onKeyDown={onKeyDown}>
      <div aria-hidden="true" className={`absolute inset-0 bg-background/90 backdrop-blur-xl transition-opacity duration-300 motion-reduce:transition-none ${shown ? "opacity-100" : "opacity-0"}`} onClick={dismiss} />
      <button ref={closeRef} type="button" onClick={dismiss} className={`absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium tracking-wide text-muted-foreground outline-none transition-[opacity,color] duration-300 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none ${shown ? "opacity-100" : "opacity-0"}`}>
        {labels.close}
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13" /></svg>
      </button>
      <div className="relative grid w-full max-w-4xl items-center gap-6 sm:grid-cols-[auto_minmax(0,1fr)] sm:gap-12">
        <div ref={figureRef} data-dish-figure className="relative mx-auto aspect-square w-[min(70vw,42svh,22rem)] sm:w-[min(38vw,60svh,24rem)]">
          <span aria-hidden="true" className="absolute inset-x-[8%] bottom-[-4%] top-[14%] rounded-full bg-black opacity-25 blur-2xl dark:opacity-70" />
          <div
            className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
            style={{ perspective: "1200px" }}
            onPointerDown={(event) => { const a = angle.current; window.clearTimeout(a.auto); a.auto = 0; a.dragging = true; a.startX = event.clientX; a.startAngle = a.value; cancelAnimationFrame(a.raf); a.raf = 0; a.last = 0; event.currentTarget.setPointerCapture(event.pointerId); }}
            onPointerMove={(event) => { const a = angle.current; if (!a.dragging) return; a.value = clamp(a.startAngle + (event.clientX - a.startX) * 0.6, a.startAngle - 220, a.startAngle + 220); if (spinRef.current) spinRef.current.style.transform = `rotateY(${a.value.toFixed(2)}deg)`; }}
            onPointerUp={() => { const a = angle.current; if (!a.dragging) return; a.dragging = false; const facing = ((a.value % 360) + 360) % 360; turnTo(facing > 90 && facing < 270 ? "back" : "front"); }}
            onPointerCancel={() => { angle.current.dragging = false; turnTo(side); }}
          >
            <div ref={spinRef} data-dish-spin className="absolute inset-0 [transform-style:preserve-3d]">
              <div data-face="front" className="absolute inset-0 [backface-visibility:hidden]">
                {broken ? (
                  <span aria-hidden="true" className="absolute inset-[3%] rounded-full border border-border bg-muted">
                    <span className="absolute inset-[30%] rounded-full bg-muted-foreground/25" />
                  </span>
                ) : (
                  <img src={item.image} alt={item.name} draggable={false} className="pointer-events-none absolute inset-0 size-full select-none object-contain" />
                )}
                <span aria-hidden="true" className={`absolute -inset-[1.5%] rounded-full border-[3px] ${tier.ring}`} />
              </div>
              <div data-face="back" className="absolute inset-0 [backface-visibility:hidden]" style={{ transform: "rotateY(180deg)" }}>
                <span aria-hidden="true" className="absolute inset-[3%] rounded-full bg-[radial-gradient(circle_at_42%_38%,#2c2c33,#0f0f13)] shadow-[inset_0_0_0_2px_color-mix(in_oklab,white_10%,transparent)]" />
                <span aria-hidden="true" className="absolute inset-[24%] rounded-full shadow-[inset_0_2px_6px_color-mix(in_oklab,black_80%,transparent),0_0_0_3px_color-mix(in_oklab,white_8%,transparent)]" />
                <span className="absolute inset-[24%] flex flex-col items-center justify-center gap-1 px-[4%] text-center">
                  <span aria-hidden="true" className={`size-2 rounded-full ${tier.dot}`} />
                  {item.subtitle && <span className="text-[clamp(0.7rem,2.4vw,0.95rem)] font-semibold uppercase tracking-[0.18em] text-foreground">{item.subtitle}</span>}
                  <span className="font-mono text-[clamp(0.6rem,2vw,0.75rem)] tracking-[0.12em] text-muted-foreground">{item.price}</span>
                </span>
                <span aria-hidden="true" className={`absolute -inset-[1.5%] rounded-full border-[3px] ${tier.ring}`} />
              </div>
            </div>
          </div>
        </div>
        <div className={`flex min-w-0 flex-col gap-3 text-center transition-[opacity,transform] delay-150 duration-500 motion-reduce:transition-none sm:text-left ${shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
          <p className="flex items-center justify-center gap-2 font-mono text-[11px] tracking-[0.2em] text-muted-foreground sm:justify-start">
            <span aria-hidden="true" className={`size-2 rounded-full ${tier.dot}`} />
            {pad(index + 1)} / {pad(total)}{item.subtitle ? ` · ${item.subtitle}` : ""}
          </p>
          <h3 id={titleId} className="text-balance text-xl font-medium tracking-tight sm:text-3xl">{item.name}</h3>
          <p className="text-lg font-semibold tabular-nums">{item.price}</p>
          {item.description && <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>}
          {item.details && item.details.length > 0 && (
            <ul className="flex flex-wrap justify-center gap-1.5 sm:justify-start">
              {item.details.map((detail) => <li key={detail} className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">{detail}</li>)}
            </ul>
          )}
          <div role="group" aria-label={`${frontLabel} / ${backLabel}`} className="mt-1 inline-flex self-center rounded-full border border-border p-1 sm:self-start">
            {faces.map((face) => (
              <button key={face} type="button" data-side={face} aria-pressed={side === face} onClick={() => turnTo(face)} className={`rounded-full px-3.5 py-1.5 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none ${side === face ? "bg-chart-1 text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {face === "front" ? frontLabel : backLabel}
              </button>
            ))}
          </div>
          {labels.add && (
            <div className="mt-1">
              <button type="button" data-add onClick={add} className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-sm outline-none transition-[translate,box-shadow] hover:-translate-y-px hover:shadow-md focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background motion-reduce:transition-none">
                {added
                  ? <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M3.5 8.5l3 3 6-7" /></svg>
                  : <svg aria-hidden="true" viewBox="0 0 16 16" className="size-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M8 3.5v9M3.5 8h9" /></svg>}
                {labels.add}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default SushiConveyorMenu;
