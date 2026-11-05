"use client"

import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { gsap } from "gsap"

/*
 * Dish Orbit Carousel: the featured item sits on the left; changing item swings
 * it out over the top on a wide orbit while the next one swings in from the
 * other side. The two-weight title wipes out and back in (thin line from the
 * right, heavy line from the left), the detail card and its coloured badge
 * cross-fade, and a band behind the scene turns and takes the item's colour.
 * It advances on its own on a timer, pausing while hovered, keyboard-focused or
 * off-screen. Arrows, thumbnails, the side pager, arrow keys and swipes jump too.
 *
 * Adapted for this site: inherits the site font, sits on a plain dark
 * background, and drops the restaurant-only controls (search, menu, play, order,
 * star rating, likes).
 */

export type Dish = {
  /** The thin first title line, e.g. "Full Stack". */
  title: string
  /** The heavy second title line, e.g. "Developer". */
  subtitle: string
  /** Square cut-out (transparent background). */
  image: string
  alt?: string
  /** Small line above the title. */
  eyebrow?: string
  /** Label under the thumbnail. Defaults to title + subtitle. */
  label?: string
  /** Short text in the coloured badge on the card, e.g. "01". */
  badge?: string
  /** Name on the card, e.g. the company. */
  heading: string
  /** Small line under the card's name. */
  subheading?: string
  description: string
  /** Bullet points shown on the card's second tab. */
  details?: string[]
  /** Badge and band colour: hex or rgb(), so the band can morph between items. */
  accent: string
}

export type DishOrbitCarouselLabels = {
  /** Accessible name of the whole carousel. */
  region: string
  /** Accessible name of the side pager. */
  pager: string
  previous: string
  next: string
  /** Card tabs. */
  overview: string
  details: string
  /** Screen-reader announcement, e.g. "Role" gives "Role 1 of 6: ...". */
  item: string
}

export type DishOrbitCarouselProps = {
  dishes: Dish[]
  /** Root height. A definite length: percentages collapse on a host page. */
  height?: string
  /** Optional photo behind the display. Washed by the theme background. */
  backdrop?: string
  /** Milliseconds each item stays up before the next. 0 turns auto-advance off. */
  interval?: number
  labels?: Partial<DishOrbitCarouselLabels>
  onChange?: (index: number) => void
  className?: string
}

const DEFAULT_LABELS: DishOrbitCarouselLabels = {
  region: "Items",
  pager: "Choose an item",
  previous: "Previous item",
  next: "Next item",
  overview: "Overview",
  details: "Details",
  item: "Item",
}

// #region carousel
export function wrapIndex(i: number, n: number): number {
  if (n <= 0) return 0
  return ((Math.round(i) % n) + n) % n
}

/** Which way to swing when jumping from one item to another: the shorter way round. */
export function stepDirection(from: number, to: number, n: number): 1 | -1 {
  if (n <= 0) return 1
  const fwd = (((to - from) % n) + n) % n
  return fwd <= n - fwd ? 1 : -1
}

/** First thumbnail shown in the strip window, keeping the current one in view. */
export function stripStart(index: number, n: number, visible: number): number {
  if (n <= visible) return 0
  return Math.max(0, Math.min(index - 1, n - visible))
}

/** Title font size so a line of `chars` characters fits `width` px at `em` average glyph width. */
export function fitSize(chars: number, max: number, width: number, em: number): number {
  return Math.min(max, width / (Math.max(1, chars) * em))
}
/**
 * The band: a thick stroke along the orbit circle, tapering at both ends.
 * Angles in degrees, screen space (0 = right, 90 = straight down).
 */
export function arcPath(a0: number, a1: number, cx: number, cy: number, r: number, w: number, steps = 48): string {
  const outer: string[] = []
  const inner: string[] = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    const a = ((a0 + (a1 - a0) * t) * Math.PI) / 180
    const h = (w / 2) * Math.pow(Math.sin(Math.PI * t), 0.45)
    const c = Math.cos(a)
    const s = Math.sin(a)
    outer.push((cx + c * (r + h)).toFixed(1) + " " + (cy + s * (r + h)).toFixed(1))
    inner.push((cx + c * (r - h)).toFixed(1) + " " + (cy + s * (r - h)).toFixed(1))
  }
  return "M" + outer.join("L") + "L" + inner.reverse().join("L") + "Z"
}

/** Where the band rests for each item, as [start, end] angles along the orbit. */
export const ARC_REST = [[50, 98], [46, 124], [60, 126], [40, 100]]
export function arcRest(index: number): number[] {
  return ARC_REST[((index % ARC_REST.length) + ARC_REST.length) % ARC_REST.length]
}

/** The band mid-swap: it stretches to trail between the outgoing and incoming item. */
export const ARC_SWEEP = [38, 146]
// #endregion

// The orbit: its pivot sits above the canvas (the .dsh-orbit transform-origin).
const ORBIT_X = 299
const ORBIT_Y = -450
const ORBIT_R = 650
const SWING = 50 // degrees the item travels round the orbit's pivot
const ITEM = 118 // thumbnail pitch in canvas px
const VISIBLE = 4
const TITLE_WIDTH = 305 // canvas px available to the title

const CSS =
  ".dsh-root{position:relative;overflow:hidden;width:100%;background:var(--color-background);color:var(--color-foreground);" +
  "container-type:inline-size;-webkit-tap-highlight-color:transparent}" +
  ".dsh-root *{box-sizing:border-box}" +
  ".dsh-bd{position:absolute;inset:0;width:100%;height:100%;max-width:none;object-fit:cover;pointer-events:none}" +
  ".dsh-wash{position:absolute;inset:0;background:color-mix(in oklab,var(--color-background) 38%,transparent);pointer-events:none}" +
  // multiply by the background: a no-op on a light theme, lights-off on a dark one
  ".dsh-dim{position:absolute;inset:0;background:var(--color-background);mix-blend-mode:multiply;opacity:.72;pointer-events:none}" +
  ".dsh-root:focus-visible{outline:2px solid var(--color-primary);outline-offset:-4px}" +
  ".dsh-canvas{position:absolute;left:50%;top:50%;width:960px;height:520px;transform:translate(-50%,-50%) scale(var(--dsh-s,1));transform-origin:50% 50%}" +
  ".dsh-arc{position:absolute;left:0;top:0;width:960px;height:520px;overflow:visible;pointer-events:none}" +
  ".dsh-btn{appearance:none;border:0;background:none;color:inherit;font:inherit;padding:0;margin:0;cursor:pointer}" +
  ".dsh-btn:focus-visible{outline:2px solid var(--color-primary);outline-offset:3px;border-radius:10px}" +
  ".dsh-pager{position:absolute;left:76px;top:172px;display:flex;flex-direction:column;align-items:center;gap:7px}" +
  ".dsh-dot{width:14px;height:10px;display:grid;place-items:center}" +
  ".dsh-dot i{display:block;width:3px;height:3px;border-radius:3px;background:var(--color-foreground);opacity:.45;transition:height .45s cubic-bezier(.3,.7,.2,1),opacity .3s}" +
  ".dsh-dot[aria-current] i{height:22px;opacity:.9}" +
  ".dsh-dot[aria-current]{height:26px}" +
  ".dsh-dot{transition:height .45s cubic-bezier(.3,.7,.2,1)}" +
  ".dsh-plates{position:absolute;left:130px;top:82px;width:245px;height:245px;touch-action:pan-y}" +
  ".dsh-orbit{position:absolute;inset:0;transform-origin:69% -217%;visibility:hidden;will-change:transform}" +
  ".dsh-orbit>img{display:block;width:245px;height:245px;max-width:none;object-fit:contain;user-select:none;-webkit-user-drag:none;" +
  "filter:drop-shadow(0 16px 22px rgba(0,0,0,.2)) drop-shadow(0 3px 5px rgba(0,0,0,.12))}" +
  ".dsh-head{position:absolute;left:388px;top:122px;width:" + TITLE_WIDTH + "px;height:150px}" +
  ".dsh-hd{position:absolute;inset:0;visibility:hidden}" +
  ".dsh-eye{font-size:12.5px;font-weight:600;letter-spacing:.01em;margin:0 0 4px 2px}" +
  ".dsh-t1,.dsh-t2{display:block;white-space:nowrap;line-height:1;text-transform:uppercase;margin:0}" +
  ".dsh-t1{font-weight:200;letter-spacing:-.015em;margin-top:6px}" +
  ".dsh-t2{font-weight:800;letter-spacing:-.025em;margin-top:6px;color:color-mix(in oklab,var(--color-foreground) 86%,transparent)}" +
  ".dsh-card{position:absolute;left:705px;top:80px;width:240px;padding:18px 20px 20px;border-radius:20px;" +
  "background:color-mix(in oklab,var(--color-foreground) 6%,transparent);-webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);" +
  "box-shadow:0 1px 0 color-mix(in oklab,var(--color-foreground) 6%,transparent) inset,0 18px 40px -24px rgba(0,0,0,.25)}" +
  ".dsh-tabs{display:flex;gap:16px;font-size:12px;margin-bottom:14px}" +
  ".dsh-tab{color:var(--color-muted-foreground);font-weight:500;padding:3px 0}" +
  ".dsh-tab[aria-selected=true]{color:var(--color-foreground);font-weight:600}" +
  ".dsh-bodies{display:grid}" +
  ".dsh-body{grid-area:1/1;visibility:hidden}" +
  ".dsh-rate{width:46px;height:46px;border-radius:10px;display:grid;place-items:center;margin:0 0 12px;font-size:22px;font-weight:700;letter-spacing:-.03em;line-height:1}" +
  ".dsh-chef{font-size:19px;font-weight:600;letter-spacing:-.01em;margin:0 0 10px}" +
  ".dsh-kit{font-size:10.5px;color:var(--color-muted-foreground);margin:-7px 0 10px}" +
  ".dsh-desc{font-size:12.5px;line-height:1.38;margin:0}" +
  ".dsh-ing{display:flex;flex-direction:column;gap:6px;margin:0;padding:0 0 0 14px;list-style:disc;font-size:11.5px;line-height:1.3}" +
  ".dsh-strip{position:absolute;left:130px;top:362px;width:550px;height:122px;display:flex;align-items:center}" +
  ".dsh-arrow{width:36px;height:36px;display:grid;place-items:center;flex:none}" +
  ".dsh-arrow svg{width:12px;height:16px;fill:currentColor}" +
  ".dsh-win{position:relative;width:" + ITEM * VISIBLE + "px;height:122px;overflow:hidden;flex:none;margin:0 2px;" +
  "-webkit-mask-image:linear-gradient(90deg,#000 88%,transparent);mask-image:linear-gradient(90deg,#000 88%,transparent)}" +
  ".dsh-track{position:absolute;left:0;top:0;display:flex;transition:transform .6s cubic-bezier(.65,0,.35,1)}" +
  ".dsh-th{width:" + ITEM + "px;height:122px;display:flex;justify-content:center;padding-top:3px}" +
  ".dsh-th .dsh-btn{width:80px;height:116px;border-radius:14px;display:flex;flex-direction:column;align-items:center;gap:7px;padding-top:9px;transition:background .45s}" +
  ".dsh-th .dsh-btn[aria-current]{background:color-mix(in oklab,var(--color-foreground) 9%,transparent);box-shadow:0 10px 24px -16px rgba(0,0,0,.3)}" +
  ".dsh-th img{width:56px;height:56px;max-width:none;object-fit:contain;filter:drop-shadow(0 4px 6px rgba(0,0,0,.18));transition:transform .45s}" +
  ".dsh-th .dsh-btn[aria-current] img{transform:scale(1.06)}" +
  ".dsh-th span{font-size:10px;line-height:1.25;text-align:center;font-weight:500;color:color-mix(in oklab,var(--color-foreground) 78%,transparent);max-width:78px}" +
  ".dsh-sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap}" +
  "@container (max-width:639px){" +
  ".dsh-canvas{position:relative;left:auto;top:auto;width:100%;height:auto;transform:none;display:flex;flex-direction:column;align-items:center;padding:14px 16px 18px}" +
  ".dsh-arc{width:200%;height:auto;left:-60%;top:-30px}" +
  ".dsh-pager{left:14px;top:150px}" +
  ".dsh-plates{position:relative;left:auto;top:auto;width:min(52vw,32svh);height:min(52vw,32svh);margin-top:0}" +
  ".dsh-orbit>img{width:100%;height:100%}" +
  ".dsh-head{position:relative;left:auto;top:auto;width:100%;height:120px;margin-top:10px}" +
  ".dsh-hd{text-align:center;transform:scale(.78);transform-origin:50% 0}" +
  ".dsh-card{position:relative;left:auto;top:auto;width:100%;max-width:420px;margin-top:10px}" +
  // phone: the pager and swipes cover the strip
  ".dsh-strip{display:none}" +
  "}" +
  // phone: the stacked layout sets its own height, so long text is never clipped
  "@media (max-width:639px){.dsh-root{height:auto!important}}" +
  "@media (prefers-reduced-motion:reduce){.dsh-track,.dsh-dot,.dsh-dot i,.dsh-th .dsh-btn,.dsh-th img{transition:none}}"

const HIDE_1 = "inset(0% 0% 0% 100%)" // thin line: wipes in from the right
const HIDE_2 = "inset(0% 100% 0% 0%)" // heavy line: wipes in from the left
const SHOW = "inset(0% 0% 0% 0%)"

export function DishOrbitCarousel({
  dishes,
  height = "100svh",
  backdrop,
  interval = 6000,
  labels,
  onChange,
  className,
}: DishOrbitCarouselProps) {
  const n = dishes.length
  const text = { ...DEFAULT_LABELS, ...labels }
  const [index, setIndex] = useState(0)
  const [tab, setTab] = useState("overview")
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [onScreen, setOnScreen] = useState(false)
  const [reduced, setReduced] = useState(false)

  const rootRef = useRef(null as HTMLDivElement | null)
  const indexRef = useRef(0)
  const onChangeRef = useRef(onChange)
  onChangeRef.current = onChange
  const orbits = useRef([] as (HTMLDivElement | null)[])
  const heads = useRef([] as (HTMLDivElement | null)[])
  const bodies = useRef([] as (HTMLDivElement | null)[])
  const arcRef = useRef(null as SVGPathElement | null)
  const arc = useRef({ a0: 0, a1: 0 })
  const shown = useRef(-1)
  const dirRef = useRef(1 as 1 | -1)
  const tlRef = useRef(null as gsap.core.Timeline | null)
  const reducedRef = useRef(false)
  const swipe = useRef(null as { x: number; y: number } | null)

  // Fit the 960 x 520 design canvas to the root. Measured on resize only.
  useLayoutEffect(() => {
    const el = rootRef.current
    if (!el) return
    const fit = () => {
      const w = el.clientWidth
      const h = el.clientHeight
      el.style.setProperty("--dsh-s", String(Math.min(w / 960, h / 520, 1.6)))
    }
    fit()
    const ro = new ResizeObserver(fit)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    const on = () => {
      reducedRef.current = mq.matches
      setReduced(mq.matches)
    }
    on()
    mq.addEventListener("change", on)
    return () => mq.removeEventListener("change", on)
  }, [])

  // The swap. Every item is in the DOM; GSAP only moves the outgoing and incoming ones.
  useLayoutEffect(() => {
    const from = shown.current
    const to = index
    const parts = (i: number) => {
      const head = heads.current[i]
      return {
        orbit: orbits.current[i],
        head,
        eye: head && head.querySelector(".dsh-eye"),
        t1: head && head.querySelector(".dsh-t1"),
        t2: head && head.querySelector(".dsh-t2"),
        body: bodies.current[i],
      }
    }
    // Writes the band's path only; no layout is read.
    const drawArc = () => arcRef.current?.setAttribute("d", arcPath(arc.current.a0, arc.current.a1, ORBIT_X, ORBIT_Y, ORBIT_R, 118))
    const rest = arcRest(to)
    const tint = dishes[to] ? dishes[to].accent : "transparent"
    if (tlRef.current) tlRef.current.progress(1).kill()
    const b = parts(to)
    if (from === -1 || from === to || reducedRef.current) {
      for (let i = 0; i < n; i++) if (i !== to) {
        const p = parts(i)
        gsap.set([p.orbit, p.head, p.body], { autoAlpha: 0 })
      }
      gsap.set([b.orbit, b.head, b.body, b.eye], { autoAlpha: 1, rotation: 0, y: 0 })
      gsap.set(b.t1, { clipPath: SHOW })
      gsap.set(b.t2, { clipPath: SHOW })
      arc.current.a0 = rest[0]
      arc.current.a1 = rest[1]
      drawArc()
      if (arcRef.current) gsap.set(arcRef.current, { fill: tint })
      shown.current = to
      return
    }
    const a = parts(from)
    const d = dirRef.current
    const tl = gsap.timeline({ onComplete: () => { tlRef.current = null } })
    tlRef.current = tl
    // item: out over the top on the orbit, the next one swings in from the far side
    tl.to(a.orbit, { rotation: SWING * d, duration: 0.62, ease: "power2.in" }, 0)
      .set(a.orbit, { autoAlpha: 0, rotation: 0 }, 0.62)
      .fromTo(b.orbit, { autoAlpha: 1, rotation: -SWING * d }, { rotation: 0, duration: 0.95, ease: "power3.out" }, 0.3)
    // title: thin line clips away to the right, heavy line to the left, then the next wipes in
    tl.to(a.t1, { clipPath: HIDE_1, duration: 0.42, ease: "power2.in" }, 0)
      .to(a.t2, { clipPath: HIDE_2, duration: 0.42, ease: "power2.in" }, 0.06)
      .to(a.eye, { autoAlpha: 0, duration: 0.25 }, 0)
      .set(a.head, { autoAlpha: 0 }, 0.5)
      .set(b.head, { autoAlpha: 1 }, 0.5)
      .fromTo(b.eye, { autoAlpha: 0, y: 6 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power2.out" }, 0.55)
      .fromTo(b.t1, { clipPath: HIDE_1 }, { clipPath: SHOW, duration: 0.7, ease: "power3.out" }, 0.55)
      .fromTo(b.t2, { clipPath: HIDE_2 }, { clipPath: SHOW, duration: 0.7, ease: "power3.out" }, 0.62)
    // card: cross-fade, the incoming rows rise in turn
    tl.to(a.body, { autoAlpha: 0, y: -6, duration: 0.3, ease: "power1.in" }, 0.05)
      .set(b.body, { autoAlpha: 1, y: 0 }, 0.4)
    if (b.body) tl.fromTo(b.body.children, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.5, stagger: 0.06, ease: "power2.out" }, 0.4)
    // the band stretches along the orbit with the items, then settles into the next item's span, morphing colour
    tl.to(arc.current, { a0: ARC_SWEEP[0], a1: ARC_SWEEP[1], duration: 0.6, ease: "power2.inOut", onUpdate: drawArc }, 0)
      .to(arc.current, { a0: rest[0], a1: rest[1], duration: 0.85, ease: "power3.out", onUpdate: drawArc }, 0.6)
    if (arcRef.current) tl.to(arcRef.current, { fill: tint, duration: 1.1, ease: "power1.inOut" }, 0.1)
    shown.current = to
  }, [index, n, dishes])

  useEffect(() => () => { tlRef.current?.kill() }, [])

  const select = (next: number, dir: 1 | -1) => {
    if (next === indexRef.current) return
    dirRef.current = dir
    indexRef.current = next
    setIndex(next)
    onChangeRef.current?.(next)
  }

  // Only run while the section is on screen.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setOnScreen(entry.isIntersecting), { threshold: 0.25 })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Restarts whenever the item changes, so a manual jump gets the full time too.
  const playing = interval > 0 && n > 1 && onScreen && !hovered && !focused && !reduced
  useEffect(() => {
    if (!playing) return
    const timer = window.setInterval(() => {
      if (!document.hidden) select(wrapIndex(indexRef.current + 1, n), 1)
    }, interval)
    return () => window.clearInterval(timer)
  }, [playing, index, interval, n])

  // Buttons, keys and swipes jump to an item.
  const go = (to: number, dir?: 1 | -1) => {
    if (n < 2) return
    const next = wrapIndex(to, n)
    if (next === index) return
    select(next, dir ?? stepDirection(index, next, n))
  }
  const step = (d: 1 | -1) => go(index + d, d)

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") { e.preventDefault(); step(1) }
    else if (e.key === "ArrowLeft") { e.preventDefault(); step(-1) }
  }
  const onPointerDown = (e: React.PointerEvent) => { swipe.current = { x: e.clientX, y: e.clientY } }
  const onPointerUp = (e: React.PointerEvent) => {
    const s = swipe.current
    swipe.current = null
    if (!s) return
    const dx = e.clientX - s.x
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(e.clientY - s.y) * 1.4) step(dx < 0 ? 1 : -1)
  }

  const start = stripStart(index, n, VISIBLE)
  const dish = dishes[index]

  return (
    <div
      ref={rootRef}
      className={"dsh-root" + (className ? " " + className : "")}
      style={{ height }}
      role="region"
      aria-roledescription="carousel"
      aria-label={text.region}
      tabIndex={0}
      onKeyDown={onKeyDown}
      // Mouse only: a tap fires enter with no matching leave, which would pause it for good on touch.
      onPointerEnter={(e) => { if (e.pointerType === "mouse") setHovered(true) }}
      onPointerLeave={(e) => { if (e.pointerType === "mouse") setHovered(false) }}
      // Keyboard focus only: a clicked button keeps focus, which would leave it paused after the mouse moves away.
      onFocusCapture={(e) => { if (e.target.matches(":focus-visible")) setFocused(true) }}
      onBlurCapture={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setFocused(false) }}
    >
      <style>{CSS}</style>
      {backdrop ? <img className="dsh-bd" src={backdrop} alt="" width={1200} height={900} /> : null}
      {backdrop ? <div className="dsh-dim" /> : null}
      {backdrop ? <div className="dsh-wash" /> : null}

      <div className="dsh-canvas">
        <svg className="dsh-arc" viewBox="0 0 960 520" aria-hidden="true">
          <path ref={arcRef} style={{ opacity: 0.34 }} />
        </svg>

        <div className="dsh-pager" role="tablist" aria-label={text.pager}>
          {dishes.map((d, i) => (
            <button key={i} type="button" role="tab" className="dsh-btn dsh-dot" aria-selected={i === index}
              aria-current={i === index ? "true" : undefined} aria-label={d.title + " " + d.subtitle} onClick={() => go(i)}>
              <i />
            </button>
          ))}
        </div>

        <div className="dsh-plates" onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => (swipe.current = null)}>
          {dishes.map((d, i) => (
            <div key={i} ref={(el) => { orbits.current[i] = el }} className="dsh-orbit" aria-hidden={i !== index}>
              <img src={d.image} alt={d.alt ?? d.title + " " + d.subtitle} width={245} height={245} draggable={false} />
            </div>
          ))}
        </div>

        <div className="dsh-head" aria-live={playing ? "off" : "polite"}>
          {dishes.map((d, i) => (
            <div key={i} ref={(el) => { heads.current[i] = el }} className="dsh-hd" aria-hidden={i !== index}>
              {d.eyebrow ? <p className="dsh-eye">{d.eyebrow}</p> : null}
              <h3 style={{ margin: 0, font: "inherit" }}>
                <span className="dsh-t1" style={{ fontSize: fitSize(d.title.length, 56, TITLE_WIDTH, 0.62) + "px" }}>{d.title}</span>
                <span className="dsh-t2" style={{ fontSize: fitSize(d.subtitle.length, 62, TITLE_WIDTH, 0.72) + "px" }}>{d.subtitle}</span>
              </h3>
            </div>
          ))}
        </div>

        <div className="dsh-card">
          <div className="dsh-tabs" role="tablist" aria-label={text.details}>
            {["overview", "details"].map((t) => (
              <button key={t} type="button" role="tab" className="dsh-btn dsh-tab" aria-selected={tab === t} onClick={() => setTab(t)}>
                {t === "overview" ? text.overview : text.details}
              </button>
            ))}
          </div>
          <div className="dsh-bodies">
            {dishes.map((d, i) => (
              <div key={i} ref={(el) => { bodies.current[i] = el }} className="dsh-body" aria-hidden={i !== index}>
                {d.badge ? <div className="dsh-rate" style={{ background: d.accent }}>{d.badge}</div> : null}
                <p className="dsh-chef">{d.heading}</p>
                {d.subheading ? <p className="dsh-kit">{d.subheading}</p> : null}
                {tab === "overview" || !d.details?.length ? (
                  <p className="dsh-desc">{d.description}</p>
                ) : (
                  <ul className="dsh-ing">{d.details.map((x) => <li key={x}>{x}</li>)}</ul>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="dsh-strip">
          <button type="button" className="dsh-btn dsh-arrow" aria-label={text.previous} onClick={() => step(-1)}>
            <svg viewBox="0 0 12 16" aria-hidden="true"><path d="M11 0v16L0 8z" /></svg>
          </button>
          <div className="dsh-win">
            <div className="dsh-track" style={{ transform: "translateX(" + -start * ITEM + "px)" }}>
              {dishes.map((d, i) => (
                <div key={i} className="dsh-th">
                  <button type="button" className="dsh-btn" aria-current={i === index ? "true" : undefined} onClick={() => go(i)}>
                    <img src={d.image} alt="" width={56} height={56} draggable={false} />
                    <span>{d.label ?? d.title + " " + d.subtitle}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button type="button" className="dsh-btn dsh-arrow" aria-label={text.next} onClick={() => step(1)}>
            <svg viewBox="0 0 12 16" aria-hidden="true"><path d="M1 0v16l11-8z" /></svg>
          </button>
        </div>

      </div>
      <p className="dsh-sr" aria-live={playing ? "off" : "polite"}>{dish ? text.item + " " + (index + 1) + " of " + n + ": " + dish.title + " " + dish.subtitle : ""}</p>
    </div>
  )
}

export default DishOrbitCarousel
