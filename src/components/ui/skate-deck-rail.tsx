"use client";

import * as React from "react";
import { createPortal } from "react-dom";

export interface SkateDeck {
  id: string;
  /** Accessible name, caption and detail title, e.g. `Sunset Bands 8.25"`. */
  name: string;
  /** Collection line shown with the price under the rail and above the name in the detail view. */
  series?: string;
  /** Deck width such as `8.25"`. */
  width?: string;
  description?: string;
  /** Graphic-side photo: a transparent cut-out of one deck, nose up, filling a tall canvas (0.238 wide per 1 high, e.g. 238 x 1000). */
  image: string;
  /** Grip-side photo on the same canvas. Optional: without it the component draws grip tape over the deck outline. */
  gripImage?: string;
  /** Short tag such as a price, hung from the hook. */
  tag?: string;
  /** Short facts shown as chips in the detail view (wheelbase, plies, concave …). */
  details?: string[];
}

export interface SkateDeckRailLabels {
  graphic: string;
  grip: string;
  close: string;
  open: string;
}

export interface SkateDeckRailProps extends React.ComponentProps<"section"> {
  items: SkateDeck[];
  eyebrow?: string;
  heading?: string;
  /** Shown under the rail while no deck faces the front. */
  caption?: string;
  /** Call to action under the caption. */
  action?: React.ReactNode;
  /** Rendered under the specs in the detail view, e.g. an "Add to cart" button. */
  detailAction?: (deck: SkateDeck, index: number) => React.ReactNode;
  /** Turns the decks to the front one by one until the visitor interacts. */
  autoplay?: boolean;
  /** Milliseconds each deck faces the front during autoplay. */
  interval?: number;
  /** Controlled index of the deck facing the front; `null` for none. Leave undefined to let the rail manage it. */
  active?: number | null;
  onActiveChange?: (index: number | null) => void;
  onOpenChange?: (index: number | null) => void;
  labels?: SkateDeckRailLabels;
}

const DECK_ASPECT = 0.238;
const PERSPECTIVE = 900;
const LIFT_Z = 40;
const LIFT_SCALE = 0.05;
const GAP = 0.06;
const FRONT_EXTRA = 0.36;
const MAX_H = 380;
const MIN_RAIL_H = 180;
const CAROUSEL_MAX_H = 430;
const EDGE = 24;
const RAIL_TOP = 14;
const RAIL_Y = 0.022;
const HOOK_LEN = 0.085;
const HOLE_Y = 0.034;
const FOOT_PX = 36;
const FOOT = 0.11;
const STAGE_K = 1 + RAIL_Y + HOOK_LEN - HOLE_Y + FOOT;
const SWING_K = 26;
const SWING_DAMP = 2.3;
const SWING_LIMIT = 12;
const COUPLE = 0.035;
const HANG_SHARE = 0.3;
const RAD = Math.PI / 180;
const DEFAULT_LABELS: SkateDeckRailLabels = { graphic: "Graphic", grip: "Grip", close: "Close", open: "Open" };

const DECK_PATH = "M3,150 C3,46 53,4 119,4 C185,4 235,46 235,150 L235,850 C235,954 185,996 119,996 C53,996 3,954 3,850 Z";
const FALLBACK_MASK = `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 238 1000' preserveAspectRatio='none'><path d='${DECK_PATH}'/></svg>`)}")`;
const CONCAVE = "linear-gradient(90deg, color-mix(in oklab, black 46%, transparent) 0%, transparent 15%, color-mix(in oklab, white 13%, transparent) 50%, transparent 85%, color-mix(in oklab, black 46%, transparent) 100%), linear-gradient(to bottom, color-mix(in oklab, white 14%, transparent) 0%, transparent 9%, transparent 91%, color-mix(in oklab, white 10%, transparent) 100%)";
const RAIL_GRADIENT = "linear-gradient(to bottom, color-mix(in oklab, var(--rail-ink) 56%, white) 0%, color-mix(in oklab, var(--rail-ink) 84%, white) 17%, var(--rail-ink) 46%, color-mix(in oklab, var(--rail-ink) 72%, black) 80%, color-mix(in oklab, var(--rail-ink) 50%, black) 100%)";
const REST_SHADE = "linear-gradient(90deg, color-mix(in oklab, black 34%, transparent), color-mix(in oklab, black 12%, transparent) 45%, color-mix(in oklab, black 4%, transparent))";
const BRACKET_GRADIENT = "linear-gradient(to right, color-mix(in oklab, var(--rail-ink) 70%, white), var(--rail-ink) 55%, color-mix(in oklab, var(--rail-ink) 60%, black))";
const PLY = "linear-gradient(to right, color-mix(in oklab, white 52%, var(--color-muted-foreground)), color-mix(in oklab, white 82%, var(--color-muted-foreground)) 50%, color-mix(in oklab, white 48%, var(--color-muted-foreground)))";
const BOLTS = [0.174, 0.229, 0.748, 0.804].flatMap((y) => [0.402, 0.598].map((x) => [x, y]));
const GRIP_WINDOW = { top: 84.5, side: 33, bottom: 7.5 };

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function restAngle(i: number) {
  return -8 - ((i * 5 + 3) % 7);
}

function maskStyle(mask: string, fallback: boolean): React.CSSProperties {
  const value = `${mask} center / ${fallback ? "100% 100%" : "contain"} no-repeat`;
  return { WebkitMask: value, mask: value };
}

function tagScale(h: number) {
  return clamp(h / 300, 0.8, 1);
}

function railThickness(h: number) {
  return Math.max(8, Math.round(h * 0.032));
}

function stageGeometry(h: number) {
  const railY = Math.round(RAIL_TOP + RAIL_Y * h);
  const top = railY + (HOOK_LEN - HOLE_Y) * h;
  return { railY, railT: railThickness(h), top, height: Math.round(top + h + FOOT_PX + FOOT * h) };
}

function hookGeometry(h: number) {
  const r = railThickness(h) / 2;
  const t = Math.max(1.7, h * 0.0078);
  const rc = r * 0.95 + t * 0.6;
  const lift = r * 0.25;
  const length = HOOK_LEN * h;
  const pad = t + 3;
  const cx = pad + t / 2;
  const cy = r + rc + pad;
  const width = cx + 2 * rc + pad + t;
  const height = cy + length + pad;
  const f = (n: number) => n.toFixed(2);
  return {
    t, rc, cx, cy, width, height,
    left: -cx,
    top: HOLE_Y * h - (cy + length),
    pivotX: rc,
    pivotY: -(HOOK_LEN - HOLE_Y) * h - lift,
    shank: `M${f(cx)},${f(cy + length)} L${f(cx)},${f(cy - lift)}`,
    curl: `M${f(cx)},${f(cy - lift)} A${f(rc)},${f(rc)} 0 0 1 ${f(cx + 2 * rc)},${f(cy - lift)} L${f(cx + 2 * rc)},${f(cy + r * 0.3)}`,
    curlX: cx + rc,
    curlY: cy - lift,
  };
}

function Defs({ uid, h }: { uid: string; h: number }) {
  const g = hookGeometry(h);
  const inner = Math.max(0, (g.rc - g.t / 2) / (g.rc + g.t / 2));
  const span = 1 - inner;
  const metal = (amount: number, toward: "white" | "black") => `color-mix(in oklab, var(--color-muted-foreground) ${amount}%, ${toward})`;
  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute" focusable="false">
      <defs>
        <linearGradient id={`${uid}-shank`} gradientUnits="userSpaceOnUse" x1={g.cx - g.t / 2} x2={g.cx + g.t / 2} y1="0" y2="0">
          <stop offset="0" stopColor={metal(72, "black")} />
          <stop offset="0.3" stopColor={metal(30, "white")} />
          <stop offset="0.45" stopColor="white" />
          <stop offset="0.74" stopColor={metal(88, "black")} />
          <stop offset="1" stopColor={metal(50, "white")} />
        </linearGradient>
        <radialGradient id={`${uid}-curl`} gradientUnits="userSpaceOnUse" cx={g.curlX} cy={g.curlY} r={g.rc + g.t / 2}>
          <stop offset={inner} stopColor={metal(70, "black")} />
          <stop offset={inner + span * 0.4} stopColor="white" />
          <stop offset={inner + span * 0.72} stopColor={metal(85, "black")} />
          <stop offset="1" stopColor={metal(55, "white")} />
        </radialGradient>
        <filter id={`${uid}-grit`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.92" numOctaves="2" seed="11" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
          <feComponentTransfer>
            <feFuncA type="discrete" tableValues="0 0 0 0.3 0.65 1" />
          </feComponentTransfer>
        </filter>
        <filter id={`${uid}-powder`} x="0" y="0" width="100%" height="100%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="1" seed="4" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>
    </svg>
  );
}

function Hook({ uid, h }: { uid: string; h: number }) {
  const g = hookGeometry(h);
  return (
    <svg aria-hidden="true" data-hook width={g.width} height={g.height} viewBox={`0 0 ${g.width.toFixed(2)} ${g.height.toFixed(2)}`} className="pointer-events-none absolute overflow-visible" style={{ left: `calc(50% + ${g.left.toFixed(2)}px)`, top: g.top }}>
      <g fill="none" strokeLinecap="round" stroke="black" strokeOpacity="0.3" strokeWidth={g.t + 0.6} transform="translate(0.9 1.3)">
        <path d={g.shank} />
        <path d={g.curl} />
      </g>
      <path d={g.shank} fill="none" stroke={`url(#${uid}-shank)`} strokeWidth={g.t} strokeLinecap="round" />
      <path d={g.curl} fill="none" stroke={`url(#${uid}-curl)`} strokeWidth={g.t} strokeLinecap="round" />
      <path d={g.shank} fill="none" stroke="white" strokeOpacity="0.6" strokeWidth={g.t * 0.26} strokeLinecap="round" transform={`translate(${(-g.t * 0.16).toFixed(2)} 0)`} />
    </svg>
  );
}

function FallbackArt({ tone }: { tone: number }) {
  const ink = `var(--color-chart-${(tone % 5) + 1})`;
  return (
    <span
      aria-hidden="true"
      data-fallback
      className="absolute inset-0"
      style={{
        ...maskStyle(FALLBACK_MASK, true),
        background: `radial-gradient(circle at 50% 22%, color-mix(in oklab, white 85%, ${ink}) 0 7%, transparent 7.4%), repeating-linear-gradient(to bottom, color-mix(in oklab, ${ink} 82%, var(--color-card)) 0 9%, color-mix(in oklab, ${ink} 62%, black) 9% 10.5%), ${CONCAVE}`,
      }}
    />
  );
}

function Hole({ h }: { h: number }) {
  const size = Math.max(4, h * 0.022);
  return (
    <span
      aria-hidden="true"
      className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/80"
      style={{ top: `${HOLE_Y * 100}%`, width: size, height: size, boxShadow: "0 1px 0 color-mix(in oklab, white 35%, transparent), inset 0 1px 1px color-mix(in oklab, black 70%, transparent)" }}
    />
  );
}

type Sim = {
  x: number[]; vx: number[]; tx: number[];
  turn: number[]; vturn: number[]; tturn: number[];
  swing: number[]; vswing: number[];
  tag: number[]; vtag: number[];
  frameX: number[]; frameV: number[]; acc: number[];
  drag: number; grab: number; free: number; last: number; raf: number;
};

function emptySim(): Sim {
  return { x: [], vx: [], tx: [], turn: [], vturn: [], tturn: [], swing: [], vswing: [], tag: [], vtag: [], frameX: [], frameV: [], acc: [], drag: -1, grab: 0, free: 0, last: 0, raf: 0 };
}

function footprint(h: number, e: number) {
  return h * DECK_ASPECT * (1 + FRONT_EXTRA * clamp(e, 0, 1));
}

function progress(turn: number, i: number) {
  return clamp(1 - turn / restAngle(i), 0, 1.12);
}

export function SkateDeckRail({
  items,
  eyebrow,
  heading,
  caption,
  action,
  detailAction,
  autoplay = false,
  interval = 2600,
  active: activeProp,
  onActiveChange,
  onOpenChange,
  labels = DEFAULT_LABELS,
  className,
  ...rest
}: SkateDeckRailProps) {
  const uid = React.useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const count = items.length;
  const stageRef = React.useRef(null as HTMLDivElement | null);
  const slots = React.useRef([] as (HTMLButtonElement | null)[]);
  const hangs = React.useRef([] as (HTMLSpanElement | null)[]);
  const swings = React.useRef([] as (HTMLSpanElement | null)[]);
  const turns = React.useRef([] as (HTMLSpanElement | null)[]);
  const shades = React.useRef([] as (HTMLSpanElement | null)[]);
  const glints = React.useRef([] as (HTMLSpanElement | null)[]);
  const nears = React.useRef([] as (HTMLSpanElement | null)[]);
  const fars = React.useRef([] as (HTMLSpanElement | null)[]);
  const tags = React.useRef([] as (HTMLSpanElement | null)[]);
  const sim = React.useRef(emptySim());
  const [size, setSize] = React.useState({ width: 0, h: 300, carousel: false });
  const [innerActive, setInnerActive] = React.useState(null as number | null);
  const controlled = activeProp !== undefined;
  const wanted = controlled ? activeProp : innerActive;
  const active = wanted !== null && wanted !== undefined && wanted >= 0 && wanted < count ? wanted : null;
  const [focusIndex, setFocusIndex] = React.useState(0);
  const [openIndex, setOpenIndex] = React.useState(null as number | null);
  const [reduced, setReduced] = React.useState(false);
  const [playing, setPlaying] = React.useState(autoplay);
  const [lifted, setLifted] = React.useState(null as number | null);
  const [failed, setFailed] = React.useState({} as { [id: string]: boolean });
  const returnFocus = React.useRef(null as number | null);
  const pendingOpen = React.useRef(-1);
  const pointer = React.useRef({ id: -1, index: -1, x: 0, y: 0, moved: false, kind: "", swipe: 0, lastX: 0, lastT: 0, v: 0 });
  const live = React.useRef({ active: null as number | null, requested: null as number | null | undefined, size, reduced, count, openIndex: null as number | null, carouselIndex: 0, controlled, onActiveChange, onOpenChange });
  live.current = { ...live.current, active, size, reduced, count, openIndex, controlled, onActiveChange, onOpenChange };

  const carouselIndex = size.carousel ? (active ?? live.current.carouselIndex) : null;
  const geo = stageGeometry(size.h);
  const w = size.h * DECK_ASPECT;

  React.useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  React.useEffect(() => { setPlaying(autoplay); }, [autoplay]);

  React.useLayoutEffect(() => {
    const stage = stageRef.current;
    const section = stage?.parentElement;
    if (!stage || !section) return;
    const measure = () => {
      const width = stage.clientWidth;
      if (!width) return;
      const chrome = section.getBoundingClientRect().height - stage.getBoundingClientRect().height;
      const byHeight = (window.innerHeight - chrome - 12 - RAIL_TOP - FOOT_PX) / STAGE_K;
      const fit = (width - 2 * EDGE) / (Math.max(1, count) * (DECK_ASPECT + GAP) + FRONT_EXTRA * DECK_ASPECT);
      const carousel = fit < MIN_RAIL_H;
      const raw = carousel ? Math.min(CAROUSEL_MAX_H, width * 0.92, byHeight) : Math.min(MAX_H, fit, byHeight);
      const h = Math.round(Math.max(150, raw));
      setSize((old) => (Math.abs(old.width - width) < 0.5 && old.carousel === carousel && Math.abs(old.h - h) < 1 ? old : { width, h, carousel }));
    };
    measure();
    const observer = new ResizeObserver(() => measure());
    observer.observe(stage);
    observer.observe(section);
    window.addEventListener("resize", measure);
    return () => { observer.disconnect(); window.removeEventListener("resize", measure); };
  }, [count]);

  const targets = React.useCallback((h: number, width: number, carousel: boolean, front: number | null, centre: number) => {
    const deckW = h * DECK_ASPECT;
    const feet = items.map((_, i) => footprint(h, i === front ? 1 : 0));
    if (carousel) {
      const gap = GAP * h * 1.5;
      const c = clamp(centre, 0, Math.max(0, feet.length - 1));
      const xs = feet.map(() => 0);
      xs[c] = width / 2;
      for (let i = c + 1; i < feet.length; i++) xs[i] = (xs[i - 1] ?? 0) + ((feet[i - 1] ?? 0) + (feet[i] ?? 0)) / 2 + gap;
      for (let i = c - 1; i >= 0; i--) xs[i] = (xs[i + 1] ?? 0) - ((feet[i + 1] ?? 0) + (feet[i] ?? 0)) / 2 - gap;
      // keep the wall full: the track never leaves an empty stretch at either end
      const left = (xs[0] ?? 0) - (feet[0] ?? 0) / 2;
      const right = (xs[feet.length - 1] ?? 0) + (feet[feet.length - 1] ?? 0) / 2;
      const shift = right - left <= width - 2 * EDGE ? (width - left - right) / 2 : left > EDGE ? EDGE - left : right < width - EDGE ? width - EDGE - right : 0;
      return xs.map((x) => x + shift);
    }
    const n = feet.length;
    const restGap = clamp((width - 2 * EDGE - n * deckW - FRONT_EXTRA * deckW) / Math.max(1, n - 1), GAP * h, deckW * 0.8);
    const total = feet.reduce((sum, f) => sum + f, 0) + restGap * Math.max(0, n - 1);
    let cursor = (width - total) / 2;
    return feet.map((f) => { const x = cursor + f / 2; cursor += f + restGap; return x; });
  }, [items]);

  const paint = React.useCallback((i: number) => {
    const s = sim.current;
    const { h } = live.current.size;
    const deckW = h * DECK_ASPECT;
    const slot = slots.current[i];
    if (!slot) return;
    const angle = s.turn[i] ?? restAngle(i);
    const e = progress(angle, i);
    const lift = Math.min(1, e);
    const theta = s.swing[i] ?? 0;
    slot.style.transform = `translate3d(${((s.x[i] ?? 0) - deckW / 2).toFixed(2)}px,0,0)`;
    const hang = hangs.current[i];
    if (hang) hang.style.transform = `rotate(${(theta * HANG_SHARE).toFixed(3)}deg)`;
    const sw = swings.current[i];
    if (sw) sw.style.transform = `rotate(${(theta * (1 - HANG_SHARE)).toFixed(3)}deg)`;
    const tu = turns.current[i];
    if (tu) tu.style.transform = `perspective(${PERSPECTIVE}px) rotateY(${angle.toFixed(2)}deg) translateZ(${(LIFT_Z * lift).toFixed(2)}px) scale(${(1 + LIFT_SCALE * e).toFixed(4)})`;
    const shade = shades.current[i];
    if (shade) shade.style.opacity = (1 - lift).toFixed(3);
    const glint = glints.current[i];
    if (glint) {
      glint.style.transform = `translate3d(${(-140 + 290 * lift).toFixed(1)}%,0,0) skewX(-14deg)`;
      glint.style.opacity = (Math.sin(Math.PI * clamp(lift, 0, 1)) * 0.95).toFixed(3);
    }
    const near = nears.current[i];
    if (near) {
      near.style.opacity = (1 - lift).toFixed(3);
      near.style.transform = `translate3d(${(deckW * 0.07).toFixed(1)}px, ${(h * 0.012).toFixed(1)}px, 0)`;
    }
    const far = fars.current[i];
    if (far) {
      far.style.opacity = lift.toFixed(3);
      far.style.transform = `translate3d(${(deckW * (0.07 + 0.2 * lift)).toFixed(1)}px, ${(h * (0.012 + 0.045 * lift)).toFixed(1)}px, 0) scale(${(1 + 0.05 * lift).toFixed(3)})`;
    }
    const tag = tags.current[i];
    if (tag) tag.style.transform = `rotate(${(-9 + (s.tag[i] ?? 0)).toFixed(2)}deg) scale(${tagScale(h).toFixed(3)})`;
  }, []);

  const step = React.useCallback((now: number) => {
    const s = sim.current;
    const n = live.current.count;
    // slow frames keep wall-clock time: up to 100 ms per frame, integrated in sub-steps of at most ~17 ms
    const dt = s.last ? Math.min(0.1, (now - s.last) / 1000) : 1 / 60;
    s.last = now;
    const { h, width, carousel } = live.current.size;
    const deckW = h * DECK_ASPECT;
    const tail = h * (1 - HOLE_Y) + HOOK_LEN * h * HANG_SHARE;
    const spacing = (i: number) => (footprint(h, progress(s.turn[i] ?? 0, i)) + footprint(h, progress(s.turn[i + 1] ?? 0, i + 1))) / 2 + h * 0.012;
    for (let i = 0; i < n; i++) s.frameX[i] = s.x[i] ?? 0;
    const sub = Math.max(2, Math.ceil(dt / 0.017));
    const sdt = dt / sub;
    for (let k = 0; k < sub; k++) {
      for (let i = 0; i < n; i++) {
        if (i === s.drag) continue;
        const restoring = now > s.free;
        const stiff = restoring ? 130 : 0;
        const damp = restoring ? 2 * Math.sqrt(130) * 0.86 : 3.2;
        const ax = -stiff * ((s.x[i] ?? 0) - (s.tx[i] ?? 0)) - damp * (s.vx[i] ?? 0);
        s.vx[i] = (s.vx[i] ?? 0) + ax * sdt;
        s.x[i] = (s.x[i] ?? 0) + (s.vx[i] ?? 0) * sdt;
      }
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < n - 1; i++) {
          const a = s.x[i] ?? 0;
          const b = s.x[i + 1] ?? 0;
          const overlap = spacing(i) - (b - a);
          if (overlap <= 0) continue;
          if (i === s.drag) s.x[i + 1] = b + overlap;
          else if (i + 1 === s.drag) s.x[i] = a - overlap;
          else { s.x[i] = a - overlap / 2; s.x[i + 1] = b + overlap / 2; }
          const va = s.vx[i] ?? 0;
          const vb = s.vx[i + 1] ?? 0;
          if (va > vb) {
            const shared = (va + vb) / 2;
            const kick = (va - vb) * 0.12;
            if (i !== s.drag) s.vx[i] = shared - kick;
            if (i + 1 !== s.drag) s.vx[i + 1] = shared + kick;
          }
        }
      }
      if (!carousel && n > 0) {
        const first = EDGE * 0.5 + footprint(h, progress(s.turn[0] ?? 0, 0)) / 2;
        const last = width - EDGE * 0.5 - footprint(h, progress(s.turn[n - 1] ?? 0, n - 1)) / 2;
        if ((s.x[0] ?? 0) < first) { s.x[0] = first; s.vx[0] = Math.abs(s.vx[0] ?? 0) * 0.3; }
        if ((s.x[n - 1] ?? 0) > last) { s.x[n - 1] = last; s.vx[n - 1] = -Math.abs(s.vx[n - 1] ?? 0) * 0.3; }
        for (let i = 0; i < n - 1; i++) {
          const min = (s.x[i] ?? 0) + spacing(i);
          if ((s.x[i + 1] ?? 0) >= min - 0.01) continue;
          s.x[i + 1] = min;
          if (i + 1 !== s.drag && (s.vx[i + 1] ?? 0) < (s.vx[i] ?? 0)) s.vx[i + 1] = s.vx[i] ?? 0;
        }
        if ((s.x[n - 1] ?? 0) > last) s.x[n - 1] = last;
        for (let i = n - 1; i > 0; i--) {
          const max = (s.x[i] ?? 0) - spacing(i - 1);
          if ((s.x[i - 1] ?? 0) <= max + 0.01) continue;
          s.x[i - 1] = max;
          if (i - 1 !== s.drag && (s.vx[i - 1] ?? 0) > (s.vx[i] ?? 0)) s.vx[i - 1] = s.vx[i] ?? 0;
        }
      }
      for (let i = 0; i < n; i++) {
        const ta = -150 * ((s.turn[i] ?? 0) - (s.tturn[i] ?? 0)) - 2 * Math.sqrt(150) * 0.78 * (s.vturn[i] ?? 0);
        s.vturn[i] = (s.vturn[i] ?? 0) + ta * sdt;
        s.turn[i] = (s.turn[i] ?? 0) + (s.vturn[i] ?? 0) * sdt;
        const sa = -SWING_K * (s.swing[i] ?? 0) - SWING_DAMP * (s.vswing[i] ?? 0) + (s.acc[i] ?? 0) * COUPLE;
        s.vswing[i] = (s.vswing[i] ?? 0) + sa * sdt;
        let swing = (s.swing[i] ?? 0) + (s.vswing[i] ?? 0) * sdt;
        if (Math.abs(swing) > SWING_LIMIT) {
          swing = Math.sign(swing) * SWING_LIMIT;
          if ((s.vswing[i] ?? 0) * swing > 0) s.vswing[i] = -(s.vswing[i] ?? 0) * 0.25;
        }
        s.swing[i] = swing;
        const tagA = -46 * ((s.tag[i] ?? 0) - swing * 0.6) - 3.4 * (s.vtag[i] ?? 0) - (s.vswing[i] ?? 0) * 0.9;
        s.vtag[i] = (s.vtag[i] ?? 0) + tagA * sdt;
        s.tag[i] = clamp((s.tag[i] ?? 0) + (s.vtag[i] ?? 0) * sdt, -30, 30);
      }
      for (let pass = 0; pass < 2; pass++) {
        for (let i = 0; i < n - 1; i++) {
          if (progress(s.turn[i] ?? 0, i) > 0.5 || progress(s.turn[i + 1] ?? 0, i + 1) > 0.5) continue;
          const ta = (s.x[i] ?? 0) - tail * Math.sin((s.swing[i] ?? 0) * RAD);
          const tb = (s.x[i + 1] ?? 0) - tail * Math.sin((s.swing[i + 1] ?? 0) * RAD);
          const overlap = deckW * 0.98 + 1 - (tb - ta);
          if (overlap <= 0) continue;
          const turn = overlap / 2 / tail / RAD;
          s.swing[i] = clamp((s.swing[i] ?? 0) + turn, -SWING_LIMIT, SWING_LIMIT);
          s.swing[i + 1] = clamp((s.swing[i + 1] ?? 0) - turn, -SWING_LIMIT, SWING_LIMIT);
          const wa = s.vswing[i] ?? 0;
          const wb = s.vswing[i + 1] ?? 0;
          if (wa < wb) {
            const mean = (wa + wb) / 2;
            s.vswing[i] = mean + (wb - wa) * 0.18;
            s.vswing[i + 1] = mean - (wb - wa) * 0.18;
          }
        }
      }
    }
    for (let i = 0; i < n; i++) {
      const v = ((s.x[i] ?? 0) - (s.frameX[i] ?? 0)) / dt;
      const a = (v - (s.frameV[i] ?? 0)) / dt;
      s.frameV[i] = v;
      s.acc[i] = (s.acc[i] ?? 0) * 0.5 + clamp(a, -30000, 30000) * 0.5;
    }
    let busy = s.drag >= 0 || now < s.free;
    for (let i = 0; i < n; i++) {
      paint(i);
      if (Math.abs(s.vx[i] ?? 0) > 0.4 || (now > s.free && Math.abs((s.x[i] ?? 0) - (s.tx[i] ?? 0)) > 0.25) || Math.abs((s.turn[i] ?? 0) - (s.tturn[i] ?? 0)) > 0.05 || Math.abs(s.vturn[i] ?? 0) > 0.05 || Math.abs(s.swing[i] ?? 0) > 0.02 || Math.abs(s.vswing[i] ?? 0) > 0.05 || Math.abs(s.tag[i] ?? 0) > 0.05 || Math.abs(s.vtag[i] ?? 0) > 0.08 || Math.abs(s.acc[i] ?? 0) > 1) busy = true;
    }
    if (busy) s.raf = requestAnimationFrame(step);
    else {
      s.raf = 0; s.last = 0;
      for (let i = 0; i < n; i++) {
        if (now > s.free) s.x[i] = s.tx[i] ?? 0;
        s.turn[i] = s.tturn[i] ?? restAngle(i); s.vturn[i] = 0;
        s.swing[i] = 0; s.vswing[i] = 0; s.tag[i] = 0; s.vtag[i] = 0; s.acc[i] = 0; s.frameV[i] = 0;
        paint(i);
      }
    }
  }, [paint]);

  const kick = React.useCallback(() => {
    const s = sim.current;
    if (live.current.reduced) {
      for (let i = 0; i < live.current.count; i++) {
        s.x[i] = s.tx[i] ?? 0; s.vx[i] = 0; s.turn[i] = s.tturn[i] ?? restAngle(i); s.vturn[i] = 0;
        s.swing[i] = 0; s.vswing[i] = 0; s.tag[i] = 0; s.vtag[i] = 0; s.acc[i] = 0; s.frameV[i] = 0;
        paint(i);
      }
      return;
    }
    if (!s.raf) { s.last = 0; s.raf = requestAnimationFrame(step); }
  }, [paint, step]);

  const impulse = React.useCallback((i: number, amount: number) => {
    const s = sim.current;
    if (live.current.reduced || i < 0 || i >= live.current.count) return;
    s.vswing[i] = (s.vswing[i] ?? 0) + amount;
    kick();
  }, [kick]);

  const choose = React.useCallback((index: number | null) => {
    const l = live.current;
    if (index === l.active || index === l.requested) return;
    l.requested = index;
    if (!l.controlled) { l.active = index; setInnerActive(index); }
    l.onActiveChange?.(index);
  }, []);

  const previous = React.useRef(null as number | null);
  React.useLayoutEffect(() => {
    const old = previous.current;
    live.current.requested = undefined;
    if (old === active) return;
    previous.current = active;
    if (active !== null) { impulse(active - 1, -26); impulse(active + 1, 26); live.current.carouselIndex = active; }
    if (old !== null) { impulse(old - 1, 12); impulse(old + 1, -12); }
  }, [active, impulse]);

  React.useLayoutEffect(() => {
    if (!size.width) return;
    const s = sim.current;
    const front = active;
    const xs = targets(size.h, size.width, size.carousel, front, active ?? live.current.carouselIndex);
    const fresh = s.x.length !== count;
    for (let i = 0; i < count; i++) {
      s.tx[i] = (xs[i] ?? 0) + (size.carousel ? pointer.current.swipe : 0);
      s.tturn[i] = i === front ? 0 : restAngle(i);
      if (fresh || reduced) {
        s.x[i] = s.tx[i] ?? 0; s.vx[i] = 0; s.frameX[i] = s.x[i] ?? 0; s.frameV[i] = 0; s.acc[i] = 0;
        s.turn[i] = s.tturn[i] ?? restAngle(i); s.vturn[i] = 0;
        s.swing[i] = s.swing[i] ?? 0; s.vswing[i] = s.vswing[i] ?? 0; s.tag[i] = 0; s.vtag[i] = 0;
      }
    }
    if (fresh) { s.x.length = count; for (let i = 0; i < count; i++) paint(i); }
    kick();
  }, [size, active, count, reduced, targets, paint, kick]);

  const brushed = React.useRef(false);
  React.useEffect(() => {
    if (!size.width || brushed.current || reduced) return;
    brushed.current = true;
    const timers = items.map((_, i) => window.setTimeout(() => impulse(i, 38 - i * 2), 90 + i * 60));
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [size.width, reduced, items, impulse]);

  React.useEffect(() => () => { cancelAnimationFrame(sim.current.raf); sim.current.raf = 0; }, []);

  React.useLayoutEffect(() => {
    if (openIndex !== null || lifted !== null || returnFocus.current === null) return;
    const index = returnFocus.current;
    returnFocus.current = null;
    slots.current[index]?.focus({ preventScroll: true });
  }, [openIndex, lifted]);

  const stop = React.useCallback(() => setPlaying(false), []);

  React.useEffect(() => {
    if (!playing || reduced || openIndex !== null || count === 0 || !size.width) return;
    let timer = window.setTimeout(function advance() {
      const current = live.current.active;
      choose(current === null ? 0 : (current + 1) % live.current.count);
      timer = window.setTimeout(advance, interval);
    }, active === null ? 1100 : interval);
    return () => window.clearTimeout(timer);
  }, [playing, reduced, openIndex, count, interval, size.width, choose, active]);

  const open = React.useCallback((index: number) => {
    stop();
    choose(index);
    setOpenIndex(index);
    live.current.onOpenChange?.(index);
  }, [choose, stop]);

  const source = React.useCallback(() => (openIndex === null ? null : turns.current[openIndex]?.getBoundingClientRect() ?? null), [openIndex]);
  const onLift = React.useCallback((lift: boolean) => setLifted(lift ? openIndex : null), [openIndex]);
  const onDetailClose = React.useCallback(() => {
    const index = openIndex;
    if (index === null) return;
    returnFocus.current = index;
    setOpenIndex(null);
    live.current.onOpenChange?.(null);
    impulse(index, (index % 2 ? 1 : -1) * 40);
  }, [openIndex, impulse]);

  function nearest(clientX: number, clientY: number) {
    const stage = stageRef.current;
    if (!stage) return null;
    const box = stage.getBoundingClientRect();
    const x = clientX - box.left;
    const y = clientY - box.top;
    const { h } = live.current.size;
    const g = stageGeometry(h);
    if (y < g.railY - 10 || y > g.height) return null;
    const s = sim.current;
    let best = null as number | null;
    let distance = Infinity;
    for (let i = 0; i < live.current.count; i++) {
      const half = footprint(h, progress(s.turn[i] ?? 0, i)) / 2 + 4;
      const d = Math.abs(x - (s.x[i] ?? 0));
      if (d < half && d < distance) { best = i; distance = d; }
    }
    return best;
  }

  const onPointerMove = (event: React.PointerEvent) => {
    const p = pointer.current;
    const s = sim.current;
    const stage = stageRef.current;
    if (p.id === event.pointerId && stage) {
      const dx = event.clientX - p.x;
      const now = performance.now();
      if (!p.moved && Math.abs(dx) > 6 && Math.abs(dx) > Math.abs(event.clientY - p.y)) {
        p.moved = true;
        stop();
        if (stage.isConnected) stage.setPointerCapture(event.pointerId);
        if (!live.current.size.carousel && p.index >= 0) {
          s.drag = p.index;
          s.grab = (event.clientX - stage.getBoundingClientRect().left) - (s.x[p.index] ?? 0);
        }
      }
      if (p.moved) {
        const v = (event.clientX - p.lastX) / Math.max(1, now - p.lastT);
        p.v = p.v * 0.6 + v * 0.4;
        p.lastX = event.clientX; p.lastT = now;
        if (s.drag >= 0) {
          s.vx[s.drag] = p.v * 1000;
          s.x[s.drag] = event.clientX - stage.getBoundingClientRect().left - s.grab;
          s.free = now + 900;
          kick();
        } else if (live.current.size.carousel) {
          p.swipe = dx;
          const xs = targets(live.current.size.h, live.current.size.width, true, live.current.active, live.current.active ?? live.current.carouselIndex);
          for (let i = 0; i < live.current.count; i++) s.tx[i] = (xs[i] ?? 0) + dx;
          kick();
        }
      }
      return;
    }
    if (event.pointerType !== "mouse" || live.current.size.carousel || live.current.openIndex !== null) return;
    const hit = nearest(event.clientX, event.clientY);
    const current = live.current.active;
    if (current !== null && hit !== current) {
      const box = stage?.getBoundingClientRect();
      const keep = box ? Math.abs(event.clientX - box.left - (s.x[current] ?? 0)) < footprint(live.current.size.h, 1) / 2 + 10 : false;
      if (keep && hit === null) return;
    }
    if (hit !== null) { stop(); choose(hit); }
  };

  const onPointerDown = (event: React.PointerEvent) => {
    if (event.button !== 0) return;
    const hit = nearest(event.clientX, event.clientY);
    const now = performance.now();
    pendingOpen.current = -1;
    pointer.current = { id: event.pointerId, index: hit ?? -1, x: event.clientX, y: event.clientY, moved: false, kind: event.pointerType, swipe: 0, lastX: event.clientX, lastT: now, v: 0 };
  };

  const finishPointer = (event: React.PointerEvent, cancelled: boolean) => {
    const p = pointer.current;
    if (p.id !== event.pointerId) return;
    const s = sim.current;
    const stage = stageRef.current;
    if (stage?.hasPointerCapture(event.pointerId)) stage.releasePointerCapture(event.pointerId);
    pointer.current = { ...p, id: -1 };
    if (s.drag >= 0) {
      // a fling only if the hand was still moving when it let go
      const idle = performance.now() - p.lastT;
      s.vx[s.drag] = (s.vx[s.drag] ?? 0) * clamp(1 - idle / 120, 0, 1);
      s.drag = -1;
      s.free = performance.now() + 700;
      kick();
      return;
    }
    if (p.moved && live.current.size.carousel) {
      const dx = event.clientX - p.x;
      const current = live.current.active ?? live.current.carouselIndex;
      const advance = Math.abs(dx) > 40 || Math.abs(p.v) > 0.45 ? (dx < 0 ? 1 : -1) : 0;
      pointer.current.swipe = 0;
      choose(clamp(current + advance, 0, live.current.count - 1));
      for (let i = 0; i < live.current.count; i++) impulse(i, clamp(-p.v * 22, -30, 30));
      return;
    }
    if (cancelled || p.moved || p.index < 0) return;
    stop();
    const touch = p.kind !== "mouse";
    if (touch && live.current.active !== p.index) choose(p.index);
    else pendingOpen.current = p.index;
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
    if (!keys.includes(event.key) || count === 0) return;
    event.preventDefault();
    stop();
    const from = active ?? focusIndex;
    const next = event.key === "Home" ? 0 : event.key === "End" ? count - 1 : clamp(from + (event.key === "ArrowRight" ? 1 : -1), 0, count - 1);
    setFocusIndex(next);
    choose(next);
    slots.current[next]?.focus({ preventScroll: true });
  };

  const current = active === null ? null : items[active];
  const hook = hookGeometry(size.h);

  return (
    <section
      {...rest}
      data-slot="skate-deck-rail"
      data-mode={size.carousel ? "carousel" : "rail"}
      data-active={active ?? ""}
      className={`relative isolate w-full overflow-hidden bg-background text-foreground [--rail-ink:var(--color-foreground)] dark:[--rail-ink:color-mix(in_oklab,var(--color-foreground)_17%,var(--color-background))] ${className ?? ""}`}
    >
      <Defs uid={uid} h={size.h} />
      {(eyebrow || heading) && (
        <header className="relative z-10 flex flex-col items-center gap-2 px-6 pt-7 text-center">
          {eyebrow && <p className="text-[11px] font-medium uppercase tracking-[0.28em] text-muted-foreground">{eyebrow}</p>}
          {heading && <h2 className="text-balance text-2xl font-medium tracking-tight md:text-3xl">{heading}</h2>}
        </header>
      )}

      <div
        ref={stageRef}
        data-stage
        role="group"
        aria-roledescription="deck rail"
        aria-label={heading ?? "Deck rail"}
        className="relative mt-4 w-full touch-pan-y select-none"
        style={{ height: geo.height, overflowX: "clip" }}
        onPointerMove={onPointerMove}
        onPointerDown={onPointerDown}
        onPointerUp={(event) => finishPointer(event, false)}
        onPointerCancel={(event) => finishPointer(event, true)}
        onPointerLeave={(event) => { if (event.pointerType === "mouse" && pointer.current.id < 0 && !live.current.size.carousel && !document.activeElement?.matches("[data-deck]:focus-visible")) choose(null); }}
        onKeyDown={onKeyDown}
      >
        <div aria-hidden="true" data-rail className="pointer-events-none absolute inset-x-0 z-[5]" style={{ top: geo.railY - geo.railT / 2, height: geo.railT }}>
          <div className="absolute inset-x-3 h-3 rounded-full bg-black/15 blur-[5px] dark:bg-black/60" style={{ top: geo.railT + 1 }} />
          <div className="absolute inset-0 rounded-full" style={{ background: RAIL_GRADIENT, boxShadow: "0 1px 0 color-mix(in oklab, var(--color-foreground) 14%, transparent)" }} />
          <svg aria-hidden="true" className="absolute inset-0 size-full rounded-full opacity-25 mix-blend-overlay" preserveAspectRatio="none">
            <rect width="100%" height="100%" filter={`url(#${uid}-powder)`} />
          </svg>
          <div className="absolute inset-x-2 top-[20%] h-px rounded-full bg-white/35 dark:bg-white/25" />
          {[0, 1].map((side) => (
            <div key={side} className="absolute top-1/2 w-3.5 -translate-y-1/2 rounded-[3px]" style={{ [side ? "right" : "left"]: 8, height: geo.railT * 2.8, background: BRACKET_GRADIENT, boxShadow: "0 3px 6px color-mix(in oklab, black 22%, transparent)" }}>
              <span className="absolute left-1/2 top-1 size-1 -translate-x-1/2 rounded-full bg-white/30" />
              <span className="absolute bottom-1 left-1/2 size-1 -translate-x-1/2 rounded-full bg-white/30" />
            </div>
          ))}
        </div>

        {items.map((item, i) => {
          const fallback = !!failed[item.id];
          const mask = fallback ? FALLBACK_MASK : `url("${item.image}")`;
          const facing = active === i;
          return (
            <button
              key={item.id}
              ref={(node) => { slots.current[i] = node; }}
              type="button"
              data-deck={i}
              data-front={facing || undefined}
              tabIndex={i === (active ?? focusIndex) ? 0 : -1}
              aria-label={item.name}
              aria-describedby={`${uid}-caption`}
              aria-pressed={facing}
              className="group absolute left-0 cursor-pointer rounded-lg outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
              style={{ top: geo.top, width: w, height: size.h, zIndex: facing ? 30 : 10 + i, transform: `translate3d(${((sim.current.x[i] ?? 0) - w / 2).toFixed(2)}px,0,0)` }}
              onFocus={() => { setFocusIndex(i); if (pointer.current.id < 0) { stop(); choose(i); } }}
              onClick={(event) => { const pending = pendingOpen.current; pendingOpen.current = -1; if (event.detail === 0 || pending === i) open(i); }}
            >
              <span ref={(node) => { hangs.current[i] = node; }} data-hang className="absolute inset-0" style={{ transformOrigin: `calc(50% + ${hook.pivotX.toFixed(2)}px) ${hook.pivotY.toFixed(2)}px` }}>
                <span ref={(node) => { swings.current[i] = node; }} data-swing className="absolute inset-0" style={{ transformOrigin: `50% ${HOLE_Y * 100}%`, visibility: lifted === i ? "hidden" : undefined }}>
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ filter: `blur(${Math.max(2, size.h * 0.008).toFixed(1)}px)` }}>
                    <span ref={(node) => { nears.current[i] = node; }} data-shadow="near" className="absolute inset-0 block bg-black/25 dark:bg-black/70" style={maskStyle(mask, fallback)} />
                  </span>
                  <span aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ filter: `blur(${Math.max(6, size.h * 0.03).toFixed(1)}px)` }}>
                    <span ref={(node) => { fars.current[i] = node; }} data-shadow="far" className="absolute inset-0 block bg-black/20 opacity-0 dark:bg-black/65" style={maskStyle(mask, fallback)} />
                  </span>
                  <span ref={(node) => { turns.current[i] = node; }} data-turn className="absolute inset-0" style={{ transformOrigin: `50% ${HOLE_Y * 100}%`, transform: `perspective(${PERSPECTIVE}px) rotateY(${restAngle(i)}deg)` }}>
                    {fallback
                      ? <FallbackArt tone={i} />
                      : <img src={item.image} alt="" draggable={false} decoding="async" onError={() => setFailed((old) => (old[item.id] ? old : { ...old, [item.id]: true }))} className="pointer-events-none absolute inset-0 size-full select-none object-contain" />}
                    <span ref={(node) => { shades.current[i] = node; }} aria-hidden="true" data-shade className="pointer-events-none absolute inset-0" style={{ ...maskStyle(mask, fallback), background: REST_SHADE }} />
                    <span aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden" style={maskStyle(mask, fallback)}>
                      <span ref={(node) => { glints.current[i] = node; }} className="absolute inset-y-0 left-0 w-[70%] opacity-0" style={{ background: "linear-gradient(90deg, transparent, color-mix(in oklab, white 55%, transparent) 50%, transparent)" }} />
                    </span>
                    <Hole h={size.h} />
                  </span>
                </span>
                <Hook uid={uid} h={size.h} />
                {item.tag && (
                  <span ref={(node) => { tags.current[i] = node; }} aria-hidden="true" className="pointer-events-none absolute origin-top" style={{ left: `calc(50% + ${(hook.t * 0.6).toFixed(1)}px)`, top: `${HOLE_Y * 100}%`, transform: `rotate(-9deg) scale(${tagScale(size.h).toFixed(3)})` }}>
                    <span className="block h-[12px] w-px bg-foreground/40" />
                    <span className="relative -ml-2 block whitespace-nowrap rounded-[3px] border border-foreground/10 bg-card px-1.5 pb-1 pt-2 text-[9px] font-semibold leading-none tracking-wide text-card-foreground shadow-[0_2px_6px_color-mix(in_oklab,black_22%,transparent)]">
                      <span className="absolute left-2 top-[3px] size-[3px] -translate-x-1/2 rounded-full bg-foreground/30" />
                      {item.tag}
                    </span>
                  </span>
                )}
              </span>
              <span aria-hidden="true" className="pointer-events-none absolute left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-chart-1 px-2.5 py-1 text-[10px] font-semibold uppercase leading-none tracking-[0.16em] text-foreground opacity-0 shadow-sm transition-opacity duration-200 group-data-[front]:opacity-100 motion-reduce:transition-none" style={{ top: size.h * 1.12 + 8 }}>
                {labels.open}
              </span>
            </button>
          );
        })}
      </div>

      {size.carousel && count > 1 && (
        <div className="relative z-10 flex justify-center gap-1.5" role="group" aria-label={heading ?? "Deck rail"}>
          {items.map((item, i) => (
            <button key={item.id} type="button" tabIndex={-1} aria-label={item.name} aria-current={carouselIndex === i} onClick={() => { stop(); choose(i); }} className={`h-1.5 rounded-full outline-none transition-[width,background-color] duration-300 focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none ${carouselIndex === i ? "w-6 bg-foreground" : "w-1.5 bg-foreground/25 hover:bg-foreground/45"}`} />
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center gap-3 px-6 pb-7 pt-3 text-center">
        <div id={`${uid}-caption`} aria-live="polite" className="min-h-[2.75rem]">
          <p className="text-sm font-medium">{current ? current.name : caption}</p>
          {current && (current.series || current.tag) && <p className="mt-1 text-[13px] text-muted-foreground">{[current.series, current.tag].filter(Boolean).join(" · ")}</p>}
        </div>
        {action}
      </div>

      {openIndex !== null && items[openIndex] && (
        <Detail
          uid={uid}
          item={items[openIndex]}
          index={openIndex}
          total={count}
          labels={labels}
          reduced={reduced}
          fallback={!!failed[items[openIndex].id]}
          extra={detailAction?.(items[openIndex], openIndex)}
          source={source}
          onLift={onLift}
          onClose={onDetailClose}
        />
      )}
    </section>
  );
}

function GripFace({ uid, item, mask, fallback, tone }: { uid: string; item: SkateDeck; mask: string; fallback: boolean; tone: number }) {
  if (item.gripImage) {
    return (
      <div data-grip className="absolute inset-0">
        <img src={item.gripImage} alt="" draggable={false} className="pointer-events-none absolute inset-0 size-full select-none object-contain" />
      </div>
    );
  }
  const cut = `inset(${GRIP_WINDOW.top}% ${GRIP_WINDOW.side}% ${GRIP_WINDOW.bottom}% ${GRIP_WINDOW.side}% round 4px)`;
  return (
    <div data-grip className="absolute inset-0 [--grip-ink:color-mix(in_oklab,var(--color-foreground)_90%,var(--color-background))] dark:[--grip-ink:color-mix(in_oklab,var(--color-background)_55%,black)]">
      {fallback
        ? <span aria-hidden="true" className="absolute inset-0" style={{ ...maskStyle(mask, fallback), background: PLY }} />
        : <img src={item.image} alt="" draggable={false} className="pointer-events-none absolute inset-0 size-full -scale-x-100 select-none object-contain" />}
      <span aria-hidden="true" className="absolute inset-0 overflow-hidden" style={{ ...maskStyle(mask, fallback), transform: "scale(0.974, 0.992)" }}>
        <span className="absolute inset-0 bg-[var(--grip-ink)]" />
        <svg aria-hidden="true" className="absolute inset-0 size-full opacity-50 mix-blend-screen dark:opacity-35" preserveAspectRatio="none">
          <rect width="100%" height="100%" filter={`url(#${uid}-grit)`} />
        </svg>
        <span className="absolute inset-0" style={{ background: CONCAVE }} />
      </span>
      {BOLTS.map(([x, y]) => (
        <span key={`${x}-${y}`} aria-hidden="true" data-bolt className="absolute h-auto min-w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/80" style={{ left: `${(x ?? 0) * 100}%`, top: `${(y ?? 0) * 100}%`, width: "3.6%", aspectRatio: "1", boxShadow: "inset 0 1px 1px color-mix(in oklab, black 80%, transparent), 0 0.5px 0 color-mix(in oklab, white 26%, transparent)" }} />
      ))}
      <span aria-hidden="true" data-window className="absolute inset-0" style={{ clipPath: cut, WebkitClipPath: cut }}>
        {fallback ? <FallbackArt tone={tone} /> : <img src={item.image} alt="" draggable={false} className="pointer-events-none absolute inset-0 size-full -scale-x-100 select-none object-contain" />}
      </span>
      <span aria-hidden="true" className="absolute rounded-[4px] shadow-[inset_0_1px_3px_color-mix(in_oklab,black_70%,transparent),0_0_0_1px_color-mix(in_oklab,white_14%,transparent)]" style={{ left: `${GRIP_WINDOW.side}%`, right: `${GRIP_WINDOW.side}%`, top: `${GRIP_WINDOW.top}%`, bottom: `${GRIP_WINDOW.bottom}%` }} />
    </div>
  );
}

function Detail({ uid, item, index, total, labels, reduced, fallback, extra, source, onLift, onClose }: {
  uid: string;
  item: SkateDeck;
  index: number;
  total: number;
  labels: SkateDeckRailLabels;
  reduced: boolean;
  fallback: boolean;
  extra: React.ReactNode;
  source: () => DOMRect | null;
  onLift: (lifted: boolean) => void;
  onClose: () => void;
}) {
  const dialogRef = React.useRef(null as HTMLDivElement | null);
  const figureRef = React.useRef(null as HTMLDivElement | null);
  const spinRef = React.useRef(null as HTMLDivElement | null);
  const closeRef = React.useRef(null as HTMLButtonElement | null);
  const [side, setSide] = React.useState("graphic" as "graphic" | "grip");
  const [shown, setShown] = React.useState(false);
  const angle = React.useRef({ value: 0, target: 0, velocity: 0, raf: 0, last: 0, dragging: false, startX: 0, startAngle: 0, auto: 0 });
  const closing = React.useRef(false);
  const titleId = `${uid}-deck-title`;
  const mask = fallback ? FALLBACK_MASK : `url("${item.image}")`;

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

  const turnTo = React.useCallback((next: "graphic" | "grip") => {
    const a = angle.current;
    window.clearTimeout(a.auto);
    a.auto = 0;
    const base = Math.round(a.value / 360) * 360;
    a.target = base + (next === "grip" ? 180 : 0);
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
    let animation = null as Animation | null;
    if (figure && from && !reduced && from.width > 0) {
      const to = figure.getBoundingClientRect();
      const scale = from.height / to.height;
      const dx = from.left + from.width / 2 - (to.left + to.width / 2);
      const dy = from.top - to.top;
      const lift = Math.min(90, Math.abs(dy) * 0.25 + 30);
      onLift(true);
      animation = figure.animate([
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
        { transform: `translate(${dx * 0.4}px, ${dy * 0.4 - lift}px) scale(${((scale + 1) / 2) * 1.03}) rotate(${dx > 0 ? -3 : 3}deg)`, offset: 0.5 },
        { transform: "none" },
      ], { duration: 680, easing: "cubic-bezier(.22,.85,.3,1)" });
    }
    const raf = requestAnimationFrame(() => setShown(true));
    if (reduced) {
      a.target = 180; a.value = 180; a.velocity = 0;
      if (spinRef.current) spinRef.current.style.transform = "rotateY(180deg)";
      setSide("grip");
    } else {
      a.auto = window.setTimeout(() => {
        a.auto = 0;
        a.target = 180;
        setSide("grip");
        spin();
      }, 860);
    }
    return () => {
      cancelAnimationFrame(raf);
      animation?.cancel();
      window.clearTimeout(a.auto);
      document.body.style.overflow = overflow;
      cancelAnimationFrame(a.raf);
      a.raf = 0;
      onLift(false);
    };
  }, [source, reduced, onLift, spin]);

  const dismiss = React.useCallback(() => {
    if (closing.current) return;
    closing.current = true;
    setShown(false);
    turnTo("graphic");
    const figure = figureRef.current;
    const to = source();
    if (!figure || !to || reduced || to.width === 0) { onClose(); return; }
    const from = figure.getBoundingClientRect();
    const scale = to.height / from.height;
    const dx = to.left + to.width / 2 - (from.left + from.width / 2);
    const dy = to.top - from.top;
    const animation = figure.animate([
      { transform: "none" },
      { transform: `translate(${dx * 0.6}px, ${dy * 0.6 - 30}px) scale(${(scale + 1) / 2})`, offset: 0.55 },
      { transform: `translate(${dx}px, ${dy}px) scale(${scale})` },
    ], { duration: 560, easing: "cubic-bezier(.45,0,.55,1)", fill: "forwards" });
    animation.onfinish = () => onClose();
  }, [source, reduced, onClose, turnTo]);

  React.useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const dialog = dialogRef.current;
      if (!dialog || dialog.contains(event.target as Node)) return;
      if (event.key === "Escape") { event.preventDefault(); dismiss(); }
      else if (event.key === "ArrowLeft" || event.key === "ArrowRight") turnTo(side === "graphic" ? "grip" : "graphic");
      else if (event.key === "Tab") { const first = dialog.querySelector("button"); if (first) { event.preventDefault(); first.focus(); } }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [dismiss, turnTo, side]);

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") { event.preventDefault(); dismiss(); return; }
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") { event.preventDefault(); turnTo(side === "graphic" ? "grip" : "graphic"); return; }
    if (event.key !== "Tab") return;
    const controls = [...(dialogRef.current?.querySelectorAll("button, a[href], input, select, textarea, [tabindex]:not([tabindex='-1'])") ?? [])].filter((node) => !(node as HTMLButtonElement).disabled) as HTMLElement[];
    const first = controls[0];
    const last = controls.at(-1);
    if (!first || !last) return;
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  const faces = (["graphic", "grip"] as const);

  return createPortal(
    <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} data-deck-detail className="fixed inset-0 z-[1000] flex items-center justify-center overflow-y-auto p-5 text-foreground sm:p-8" onKeyDown={onKeyDown}>
      <div aria-hidden="true" className={`absolute inset-0 bg-background/90 backdrop-blur-xl transition-opacity duration-300 motion-reduce:transition-none ${shown ? "opacity-100" : "opacity-0"}`} onClick={dismiss} />
      <button ref={closeRef} type="button" onClick={dismiss} className={`absolute right-4 top-4 z-10 inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium tracking-wide text-muted-foreground outline-none transition-[opacity,color] duration-300 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none ${shown ? "opacity-100" : "opacity-0"}`}>
        {labels.close}
        <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13" /></svg>
      </button>
      <div className="relative grid w-full max-w-3xl grid-cols-[auto_minmax(0,1fr)] items-center gap-5 sm:gap-12">
        <div ref={figureRef} data-figure className="relative h-[min(64svh,600px)] origin-top sm:h-[min(70svh,600px)]" style={{ aspectRatio: DECK_ASPECT }}>
          <span aria-hidden="true" className="absolute inset-0 translate-x-[8%] translate-y-[3%] bg-black/25 blur-xl dark:bg-black/70" style={maskStyle(mask, fallback)} />
          <div
            className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing"
            style={{ perspective: "1200px" }}
            onPointerDown={(event) => { const a = angle.current; window.clearTimeout(a.auto); a.auto = 0; a.dragging = true; a.startX = event.clientX; a.startAngle = a.value; cancelAnimationFrame(a.raf); a.raf = 0; a.last = 0; event.currentTarget.setPointerCapture(event.pointerId); }}
            onPointerMove={(event) => { const a = angle.current; if (!a.dragging) return; a.value = clamp(a.startAngle + (event.clientX - a.startX) * 0.6, a.startAngle - 220, a.startAngle + 220); if (spinRef.current) spinRef.current.style.transform = `rotateY(${a.value.toFixed(2)}deg)`; }}
            onPointerUp={() => { const a = angle.current; if (!a.dragging) return; a.dragging = false; const facing = ((a.value % 360) + 360) % 360; turnTo(facing > 90 && facing < 270 ? "grip" : "graphic"); }}
            onPointerCancel={() => { angle.current.dragging = false; turnTo(side); }}
          >
            <div ref={spinRef} data-detail-spin className="absolute inset-0 [transform-style:preserve-3d]">
              <div data-face="graphic" className="absolute inset-0 [backface-visibility:hidden]">
                {fallback ? <FallbackArt tone={index} /> : <img src={item.image} alt={item.name} draggable={false} className="pointer-events-none absolute inset-0 size-full select-none object-contain" />}
                <Hole h={600} />
              </div>
              <div data-face="grip" className="absolute inset-0 [backface-visibility:hidden]" style={{ transform: "rotateY(180deg)" }}>
                <GripFace uid={uid} item={item} mask={mask} fallback={fallback} tone={index} />
                <Hole h={600} />
              </div>
            </div>
          </div>
        </div>
        <div className={`flex min-w-0 flex-col gap-3 transition-[opacity,transform] delay-150 duration-500 motion-reduce:transition-none ${shown ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"}`}>
          <p className="font-mono text-[11px] tracking-[0.2em] text-muted-foreground">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}{item.series ? ` · ${item.series}` : ""}
          </p>
          <h3 id={titleId} className="text-balance text-xl font-medium tracking-tight sm:text-3xl">{item.name}</h3>
          {(item.tag || item.width) && (
            <div className="flex flex-wrap items-baseline gap-3">
              {item.tag && <span className="text-lg font-semibold tabular-nums">{item.tag}</span>}
              {item.width && <span className="rounded-md border border-border px-2 py-0.5 font-mono text-xs text-muted-foreground">{item.width}</span>}
            </div>
          )}
          {item.description && <p className="text-sm leading-relaxed text-muted-foreground">{item.description}</p>}
          {item.details && item.details.length > 0 && (
            <ul className="flex flex-wrap gap-1.5">
              {item.details.map((detail) => <li key={detail} className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground">{detail}</li>)}
            </ul>
          )}
          <div role="group" aria-label={`${labels.graphic} / ${labels.grip}`} className="mt-1 inline-flex self-start rounded-full border border-border p-1">
            {faces.map((face) => (
              <button key={face} type="button" data-side={face} aria-pressed={side === face} onClick={() => turnTo(face)} className={`rounded-full px-3.5 py-1.5 text-xs font-medium outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring motion-reduce:transition-none ${side === face ? "bg-chart-1 text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {face === "graphic" ? labels.graphic : labels.grip}
              </button>
            ))}
          </div>
          {extra && <div className="mt-1">{extra}</div>}
        </div>
      </div>
    </div>,
    document.body,
  );
}

export default SkateDeckRail;
