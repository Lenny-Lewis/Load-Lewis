import React, { useEffect, useState } from "react";
import {
  AbsoluteFill, Audio, Img, Sequence, continueRender, delayRender,
  interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing,
} from "remotion";

// 128 BPM → one beat = 14.0625 frames at 30fps. Every cut lands on a beat.
const FPS = 30;
const BEAT = (60 / 128) * FPS;
const at = (beats) => Math.round(beats * BEAT);
const SCENES = {
  intro: [0, at(4)],          // 0.00 – 1.88s
  hero: [at(4), at(10)],      // 1.88 – 4.69s
  work: [at(10), at(16)],     // 4.69 – 7.50s
  career: [at(16), at(20)],   // 7.50 – 9.38s
  thoughts: [at(20), at(24)], // 9.38 – 11.25s
  end: [at(24), 450],         // 11.25 – 15.00s
};

const INK = "#f5f2ec";
const GOLD = "#cda144";
const SANS = '"Mona Sans", "Archivo", Helvetica, Arial, sans-serif';
const ART = '"Archivo", Helvetica, Arial, sans-serif';

const useFonts = () => {
  const [handle] = useState(() => delayRender("fonts"));
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Archivo:wght@400;600;800&family=Mona+Sans:wght@500;800;900&display=block";
    document.head.appendChild(link);
    link.onload = () => document.fonts.ready.then(() => continueRender(handle));
    link.onerror = () => continueRender(handle);
  }, [handle]);
};

/** Small beat pulse used on captions and cards. */
const useBeatPulse = (strength = 0.02) => {
  const frame = useCurrentFrame();
  const phase = (frame % BEAT) / BEAT;
  return 1 + strength * Math.exp(-phase * 6);
};

/** Fast whip-in from the right with a slight overshoot. */
const WhipIn = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame, fps, config: { damping: 16, stiffness: 180, mass: 0.6 } });
  const x = interpolate(p, [0, 1], [1100, 0]);
  const blur = interpolate(frame, [0, 5], [18, 0], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ transform: `translateX(${x}px)`, filter: `blur(${blur}px)` }}>{children}</AbsoluteFill>;
};

/** White flash on a cut. */
const Flash = () => {
  const frame = useCurrentFrame();
  const o = interpolate(frame, [0, 4], [0.35, 0], { extrapolateRight: "clamp" });
  return <AbsoluteFill style={{ background: "#fff", opacity: o, pointerEvents: "none" }} />;
};

/** Caption: words pop up one by one. */
const Caption = ({ text, top = 180, size = 92, delay = 2, accent }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = useBeatPulse(0.015);
  return (
    <div style={{ position: "absolute", top, left: 70, right: 70, fontFamily: SANS, fontWeight: 900, fontSize: size, lineHeight: 0.98, letterSpacing: "-0.035em", color: INK, transform: `scale(${pulse})`, transformOrigin: "left center", textShadow: "0 8px 40px rgba(0,0,0,.6)" }}>
      {text.split(" ").map((w, i) => {
        const p = spring({ frame: frame - delay - i * 2, fps, config: { damping: 14, stiffness: 220 } });
        return (
          <span key={i} style={{ display: "inline-block", marginRight: "0.22em", opacity: p, transform: `translateY(${(1 - p) * 40}px)`, color: accent && w === accent ? GOLD : INK }}>
            {w}
          </span>
        );
      })}
    </div>
  );
};

/** A site capture shown as a floating rounded "screen". */
const Screen = ({ src, top = 520, width = 960, zoomFrom = 1, zoomTo = 1.06, origin = "50% 30%" }) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const z = interpolate(frame, [0, durationInFrames], [zoomFrom, zoomTo], { easing: Easing.out(Easing.quad) });
  const pulse = useBeatPulse(0.008);
  return (
    <div style={{ position: "absolute", top, left: (1080 - width) / 2, width, height: width * 1.25, borderRadius: 34, overflow: "hidden", border: "2px solid rgba(255,255,255,.12)", boxShadow: "0 40px 120px rgba(0,0,0,.8), 0 0 0 1px rgba(205,161,68,.15)", transform: `scale(${pulse})` }}>
      <Img src={src} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transform: `scale(${z})`, transformOrigin: origin }} />
    </div>
  );
};

const Grain = () => (
  <AbsoluteFill style={{ opacity: 0.07, mixBlendMode: "overlay", backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }} />
);

const Backdrop = () => (
  <AbsoluteFill style={{ background: "radial-gradient(120% 70% at 50% 35%, #1a1a1f 0%, #050505 60%, #000 100%)" }} />
);

// ---------------------------------------------------------------- scenes --
const GLYPHS = "!@#$%&+=qertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM/{}[]-_()<>?";
const rand = (n) => { const x = Math.sin(n * 12.9898) * 43758.5453; return x - Math.floor(x); };

const Intro = () => {
  const frame = useCurrentFrame();
  const lines = ["Digital", "Digital Craft", "Digital Craft & Code"];
  const lineIdx = Math.min(2, Math.floor(frame / 15));
  const text = lines[lineIdx];
  const local = frame - lineIdx * 15;
  const shown = Array.from(text).map((ch, i) => {
    if (ch === " ") return " ";
    const settle = i * 0.6 + 4;
    return local < settle ? GLYPHS[Math.floor(rand(frame * 31 + i) * GLYPHS.length)] : ch;
  }).join("");
  const nameO = interpolate(frame, [20, 34], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <AbsoluteFill style={{ background: "#000", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontFamily: ART, fontWeight: 600, fontSize: 78, color: INK, letterSpacing: "-0.03em", whiteSpace: "pre" }}>{shown}</div>
      <div style={{ position: "absolute", bottom: 300, fontFamily: ART, fontSize: 34, letterSpacing: "0.3em", textTransform: "uppercase", color: GOLD, opacity: nameO }}>Lennox Lewis</div>
    </AbsoluteFill>
  );
};

const Hero = () => {
  const frame = useCurrentFrame();
  const stills = ["hero/5.jpg", "hero/6.jpg", "hero/4.jpg", "hero/7.jpg"]; // Design, Code, Views, Ideas
  const idx = Math.min(stills.length - 1, Math.floor(frame / (BEAT * 1.5)));
  return (
    <AbsoluteFill>
      <Backdrop />
      <WhipIn>
        <Caption text="3D websites that move with you." accent="3D" />
        <Screen src={staticFile(stills[idx])} zoomFrom={1.02} zoomTo={1.16} origin="15% 25%" />
      </WhipIn>
      <Flash />
    </AbsoluteFill>
  );
};

const Sequenced = ({ folder, count, caption, accent, speed = 1 }) => {
  const frame = useCurrentFrame();
  const i = Math.min(count - 1, Math.floor(frame * speed));
  return (
    <AbsoluteFill>
      <Backdrop />
      <WhipIn>
        <Caption text={caption} accent={accent} />
        <Screen src={staticFile(`${folder}/${String(i).padStart(4, "0")}.jpg`)} zoomFrom={1} zoomTo={1.04} />
      </WhipIn>
      <Flash />
    </AbsoluteFill>
  );
};

const Career = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const z = interpolate(frame, [0, durationInFrames], [1.05, 1.28]);
  const r = interpolate(frame, [0, durationInFrames], [-3, 2]);
  const pulse = useBeatPulse(0.02);
  return (
    <AbsoluteFill>
      <Backdrop />
      <WhipIn>
        <Caption text="A career built on shipping." accent="shipping." />
        <div style={{ position: "absolute", top: 640, left: 30, width: 1020, height: 700, overflow: "hidden", borderRadius: 34, transform: `scale(${pulse})` }}>
          <Img src={staticFile("belt.jpg")} style={{ width: "100%", height: "100%", objectFit: "contain", transform: `scale(${z}) rotate(${r}deg)` }} />
        </div>
      </WhipIn>
      <Flash />
    </AbsoluteFill>
  );
};

const EndCard = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const big = spring({ frame, fps, config: { damping: 12, stiffness: 120 } });
  const cta = spring({ frame: frame - 14, fps, config: { damping: 14, stiffness: 160 } });
  const url = spring({ frame: frame - 26, fps, config: { damping: 14, stiffness: 160 } });
  const pulse = useBeatPulse(0.03);
  // halftone-style dots behind the wordmark
  const dots = [];
  for (let y = 0; y < 22; y++) for (let x = 0; x < 30; x++) {
    const d = Math.hypot(x - 15, y - 11) / 15;
    const s = Math.max(0, 1 - d) * 7 * big;
    dots.push(<circle key={`${x}-${y}`} cx={x * 36 + 18} cy={y * 36 + 18} r={s} fill={GOLD} opacity={0.18} />);
  }
  return (
    <AbsoluteFill style={{ background: "#000", alignItems: "center", justifyContent: "center" }}>
      <svg width="1080" height="792" style={{ position: "absolute", top: 420 }}>{dots}</svg>
      <div style={{ fontFamily: SANS, fontWeight: 900, fontSize: 250, letterSpacing: "-0.06em", color: INK, transform: `scale(${(0.6 + 0.4 * big) * pulse})`, opacity: big, marginTop: -260 }}>lennox</div>
      <div style={{ position: "absolute", top: 1180, opacity: cta, transform: `translateY(${(1 - cta) * 50}px)` }}>
        <div style={{ fontFamily: ART, fontWeight: 800, fontSize: 64, color: "#111", background: GOLD, padding: "26px 54px", borderRadius: 999, letterSpacing: "-0.02em" }}>Start your project →</div>
      </div>
      <div style={{ position: "absolute", top: 1360, opacity: url, transform: `translateY(${(1 - url) * 30}px)`, fontFamily: ART, fontSize: 52, fontWeight: 600, color: INK, letterSpacing: "-0.01em" }}>lennoxlewis.co.ke</div>
      <div style={{ position: "absolute", top: 1450, opacity: url * 0.6, fontFamily: ART, fontSize: 30, letterSpacing: "0.3em", textTransform: "uppercase", color: INK }}>Link in bio</div>
      <Flash />
    </AbsoluteFill>
  );
};

export const Ad = () => {
  useFonts();
  const seq = (k, el) => <Sequence from={SCENES[k][0]} durationInFrames={SCENES[k][1] - SCENES[k][0]}>{el}</Sequence>;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      {seq("intro", <Intro />)}
      {seq("hero", <Hero />)}
      {seq("work", <Sequenced folder="work" count={84} caption="Projects built to stand out." accent="stand" speed={1} />)}
      {seq("career", <Career />)}
      {seq("thoughts", <Sequenced folder="thoughts" count={66} caption="And ideas worth reading." accent="ideas" speed={1.15} />)}
      {seq("end", <EndCard />)}
      <Grain />
      <Audio src={staticFile("mix.wav")} />
    </AbsoluteFill>
  );
};
