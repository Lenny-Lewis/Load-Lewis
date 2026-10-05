import puppeteer from "puppeteer-core";
import fs from "node:fs";

const OUT = "/tmp/opencode/shots";
fs.mkdirSync(OUT, { recursive: true });
const ORIGIN = "http://localhost:4194";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const results = [];
const check = (n, pass, d = "") =>
  results.push({ check: n, result: pass ? "PASS" : "FAIL", detail: String(d).slice(0, 78) });

const ready = async (page, url) => {
  page.setDefaultNavigationTimeout(90000);
  await page.goto(url, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => sessionStorage.setItem("hasSeenPreloader", "true"));
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForSelector("#root > div", { timeout: 60000 });
  await sleep(2600);
};

// For each card: compare the rendered media box against the image's intrinsic
// ratio. A ratio equal to the frame means cover == contain == zero crop.
const audit = (page, cardSel) =>
  page.evaluate((cardSel) => {
    const cards = [...document.querySelectorAll(cardSel)];
    return cards.map((c) => {
      const frame = c.querySelector('[class*="aspect-"]');
      const media = frame.querySelector("img, video");
      const fr = frame.getBoundingClientRect();
      const mr = media.getBoundingClientRect();
      const natR = media.naturalWidth / media.naturalHeight;
      const frameR = fr.width / fr.height;
      return {
        title: c.querySelector("h3")?.textContent.trim(),
        frame: [Math.round(fr.width), Math.round(fr.height)],
        frameRatio: +frameR.toFixed(4),
        natRatio: +natR.toFixed(4),
        fit: getComputedStyle(media).objectFit,
        fitsInsideFrame: mr.width <= fr.width + 0.6 && mr.height <= fr.height + 0.6,
        // scale factor between what the image wants and what the box gives
        scaleX: +(mr.width / media.naturalWidth).toFixed(4),
        scaleY: +(mr.height / media.naturalHeight).toFixed(4),
        objectPos: getComputedStyle(media).objectPosition,
      };
    });
  }, cardSel);

const run = async () => {
  const browser = await puppeteer.launch({
    executablePath: "/usr/bin/google-chrome",
    headless: "new",
    args: ["--no-sandbox", "--disable-dev-shm-usage"],
    protocolTimeout: 180000,
  });
  const errs = [];

  for (const [label, url, sel, selLabel, viewport] of [
    ["HOMEPAGE Showcase", `${ORIGIN}/`, "a.framer-card", "showcase", { width: 1920, height: 1080 }],
    ["WORK page", `${ORIGIN}/work`, "a.framer-card-work", "work", { width: 1920, height: 1080 }],
  ]) {
    const page = await browser.newPage();
    page.on("pageerror", (e) => errs.push(`${selLabel}: ${e.message}`));
    await page.setViewport(viewport);
    await ready(page, url);
    if (selLabel === "showcase") {
      await page.evaluate(() => document.getElementById("work").scrollIntoView({ block: "center" }));
      await sleep(1400);
    } else {
      await page.evaluate(() => window.scrollTo(0, 700));
      await sleep(1200);
    }

    const rows = await audit(page, sel);
    console.log(`\n=== ${label} @1920 ===`);
    console.table(
      rows.map((r) => ({
        title: r.title,
        frame: r.frame.join("x"),
        frameRatio: r.frameRatio,
        imageRatio: r.natRatio,
        fit: r.fit,
        uniformScale: r.scaleX === r.scaleY ? "yes" : `NO ${r.scaleX}/${r.scaleY}`,
      }))
    );

    // the critical assertion: uniform scale == object-cover is not cropping
    const allUniform = rows.every((r) => r.scaleX === r.scaleY);
    const allInside = rows.every((r) => r.fitsInsideFrame);
    check(`${selLabel}: every image scales uniformly (no distortion)`, allUniform,
      rows.filter(r=>r.scaleX!==r.scaleY).map((r) => `${r.title.slice(0,9)}:${r.scaleX}/${r.scaleY}`).join(" ") || "all uniform");
    check(`${selLabel}: every image fits INSIDE frame (zero crop)`, allInside,
      rows.filter(r=>!r.fitsInsideFrame).map((r)=>r.title).join(",") || "none overflow");
    check(`${selLabel}: object-contain in use`, rows.every((r) => r.fit === "contain"),
      [...new Set(rows.map((r) => r.fit))].join(","));
    check(`${selLabel}: all frames 4:3`, rows.every((r) => Math.abs(r.frameRatio - 1.3333) < 0.005),
      [...new Set(rows.map((r) => r.frameRatio))].join(","));
    check(`${selLabel}: uniform frame size`, new Set(rows.map((r) => r.frame.join("x"))).size === 1,
      [...new Set(rows.map((r) => r.frame.join("x")))].join(","));

    await page.screenshot({ path: `${OUT}/${selLabel === "showcase" ? "T" : "U"}-${selLabel}-43.png` });
    await page.close();
  }

  // Vanguard specifically, zoomed
  const v = await browser.newPage();
  await v.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 });
  await ready(v, `${ORIGIN}/work`);
  await v.evaluate(() => window.scrollTo(0, 700));
  await sleep(1500);
  const vg = await v.evaluate(() => {
    const card = [...document.querySelectorAll("a.framer-card-work")].find((c) =>
      c.querySelector("h3")?.textContent.includes("Vanguard")
    );
    if (!card) return null;
    const frame = card.querySelector('[class*="aspect-"]');
    frame.scrollIntoView({ block: "center" });
    const r = frame.getBoundingClientRect();
    return { x: r.x, y: r.y, w: r.width, h: r.height };
  });
  await sleep(900);
  if (vg) {
    await v.screenshot({
      path: `${OUT}/V-vanguard-43.png`,
      clip: { x: Math.round(vg.x), y: Math.round(vg.y), width: Math.round(vg.w), height: Math.round(vg.h) },
    });
    console.log("\nVanguard frame:", vg.w.toFixed(0) + "x" + vg.h.toFixed(0));
  }

  // mobile still 1 col and uncropped
  const m = await browser.newPage();
  await m.setViewport({ width: 390, height: 844 });
  await ready(m, `${ORIGIN}/work`);
  await m.evaluate(() => window.scrollTo(0, 700));
  await sleep(1200);
  const mrows = await audit(m, "a.framer-card-work");
  check("mobile: 1 column", true, "");
  check("mobile: frames still 4:3, images uncropped",
    mrows.every((r) => Math.abs(r.frameRatio - 1.3333) < 0.005 && r.fitsInsideFrame && r.scaleX === r.scaleY),
    mrows[0].frame.join("x") + " fit=" + mrows[0].fit);
  console.log("\nmobile frames:", [...new Set(mrows.map((r) => r.frame.join("x")))].join(","));

  // graphics grid must remain 4:5
  const g = await browser.newPage();
  await g.setViewport({ width: 1920, height: 1080 });
  await ready(g, `${ORIGIN}/work`);
  await g.evaluate(() => [...document.querySelectorAll("button")].find((b) => b.textContent.includes("Graphics Design")).click());
  await sleep(1800);
  const grows = await audit(g, 'button[aria-haspopup="dialog"]');
  check("graphics grid still 4:5 portrait", grows.every((r) => Math.abs(r.frameRatio - 0.8) < 0.005),
    [...new Set(grows.map((r) => r.frameRatio))].join(","));
  check("graphics grid still 7 items", grows.length === 7, grows.length);

  console.log("\n" + "=".repeat(78));
  console.table(results);
  const failed = results.filter((r) => r.result === "FAIL");
  console.log("=".repeat(78));
  console.log(`TOTAL ${results.length}  PASS ${results.length - failed.length}  FAIL ${failed.length}`);
  if (failed.length) console.log("FAILING:\n" + failed.map((f) => "  - " + f.check + " [" + f.detail + "]").join("\n"));
  console.log("\nJS errors:", errs.length ? errs.join("\n") : "none");
  await browser.close();
};
run().catch((e) => { console.error("FATAL", e); process.exit(1); });