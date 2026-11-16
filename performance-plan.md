# Performance Plan

Status: **on hold** (written 2026-11-14)

## Baseline (Microsoft Clarity, 2 pageviews, very early data)

| Metric | Value | Target | Verdict |
|---|---|---|---|
| Performance score | 50/100 | 90+ | 50% needs improvement, 50% poor |
| LCP (Largest Contentful Paint) | **63 s** | < 2.5 s | poor |
| INP (Interaction to Next Paint) | **520 ms** | < 200 ms | poor |
| CLS (Cumulative Layout Shift) | 0.005 | < 0.1 | good |

Re-check these in Clarity (Dashboard → Performance) before starting, since there will be more data by then.

## Likely causes (from the code)

1. **Heavy JavaScript up front.** Uncompressed production chunks (`npm run build` → `dist/assets/`):
   - `index-*.js`: ~1.85 MB (main bundle)
   - `react-spline-*.js`: ~2.0 MB (Spline runtime)
   - `physics-*.js`: ~1.9 MB (physics engine)
2. **~15 MB 3D model on mobile.** On phones, the hero swaps Spline for `ComputersCanvas` (`src/components/SplineRobotCard.jsx` → `src/components/Computers.jsx`), which loads `public/desktop_pc/`:
   - `scene.bin` 4.2 MB, `scene.gltf` 1.7 MB, `textures/` 9.4 MB
   - (`public/planet/`, the mobile contact Earth, is ~3 MB more)
3. **The preloader hides the LCP element.** `src/components/Preloader.jsx` keeps the overlay up until the hero 3D reports ready, capped by `MAX_WAIT_MS = 8000`. The hero text can't paint until then, which adds directly to LCP.
4. **INP.** Spline, three.js and physics keep the main thread busy, so taps queue behind rendering.

## Plan (highest impact first)

- [ ] **1. Compress the mobile 3D models.** Convert textures to WebP/KTX2 and compress meshes with Draco/Meshopt (e.g. `gltf-transform optimize`). Expect `desktop_pc` to drop from ~15 MB to ~1–2 MB with no visible change. Same for `planet`. *Lowest risk, start here.*
- [ ] **2. Load 3D after the content.** Paint the hero text plus a static poster image first, then load Spline/three.js when idle or visible. Make sure the physics chunk isn't loaded up front.
- [ ] **3. Shorten the preloader wait.** Lower `MAX_WAIT_MS` from 8 s to ~2–3 s, or stop waiting for 3D and fade the scene in when ready.
- [ ] **4. Split the main bundle.** Lazy-load routes (`React.lazy`) for Work, Case Study, Articles, Thoughts, Comments and Company Profile pages so the homepage ships less JS.

## Notes

- Steps 1–2 should give the biggest LCP gains.
- Visual check after each step is Lennox's job (3D may appear a moment after the text with step 2).
- Measure after each step: Clarity performance panel, plus `dist/assets` sizes from `npm run build`.
