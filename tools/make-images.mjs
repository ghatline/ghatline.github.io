#!/usr/bin/env node
/* Generates favicons, WebP photo placeholders and 1200x630 OG share cards.
   Optional: only needed when you change the business name or add pages.
   Needs:  npm i playwright sharp && npx playwright install chromium
   Run from the folder where those are installed:
     node /path/to/site/tools/make-images.mjs /path/to/site            */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { createRequire } from "node:module";

const require = createRequire(path.join(process.cwd(), "noop.js"));
const sharp = require("sharp");
const { chromium } = require("playwright");
const ROOT = path.resolve(process.argv[2] || ".");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "assets/js/config.js"), "utf8"), sandbox);
const C = sandbox.window.SITE_CONFIG;
const out = (p) => { const f = path.join(ROOT, p); fs.mkdirSync(path.dirname(f), { recursive: true }); return f; };

/* ---- favicons ---- */
const mark = (bg, fg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="${bg}"/><path d="M14 46c10 0 22-1.5 22-8s-16-5-16-13 14-9 24-9" fill="none" stroke="${fg}" stroke-width="6" stroke-linecap="round"/></svg>`;
fs.writeFileSync(out("favicon.svg"), mark("#1e3a2b", "#e07a55"));
for (const [name, size] of [["favicon-32.png", 32], ["apple-touch-icon.png", 180], ["android-chrome-192.png", 192], ["android-chrome-512.png", 512]]) {
  await sharp(Buffer.from(mark("#1e3a2b", "#e07a55"))).resize(size, size).png().toFile(out(name));
}

/* ---- vehicle photo placeholders (TODO: replace with your own photos) ---- */
const van = (len, lux) => {
  const w = 96 + len;
  const wins = Array.from({ length: Math.floor((w - 34) / 16) }, (_, i) => `<rect x="${28 + i * 16}" y="8" width="13" height="12" rx="1.5" fill="#38505c"/>`).join("");
  return `<g><ellipse cx="${w / 2}" cy="43" rx="${w / 2}" ry="3.5" fill="#000" opacity=".18"/><path fill="#f7f5ef" stroke="#1e3a2b" stroke-width="1.4" d="M11 8Q13 2 21 2H${w - 6}Q${w} 2 ${w} 8V36H4V22Q4 14 11 8Z"/><path fill="#38505c" d="M8 21L14.5 8H24V21Z"/>${wins}<rect x="4" y="25" width="${w - 4}" height="3" fill="${lux ? "#c9a24a" : "#b4472b"}"/><circle cx="21" cy="37" r="7" fill="#1b1d1a"/><circle cx="21" cy="37" r="2.8" fill="#9aa59c"/><circle cx="${w - 18}" cy="37" r="7" fill="#1b1d1a"/><circle cx="${w - 18}" cy="37" r="2.8" fill="#9aa59c"/></g>`;
};
for (const v of C.fleet) {
  if (v.photo || v.illustration) continue; // real photo or illustration in place: never overwrite it
  const len = v.id === "force-urbania" ? 10 : v.id === "maharaja" ? 18 : 22;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 960 640" width="960" height="640">
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d8dfdc"/><stop offset="1" stop-color="#eef0ea"/></linearGradient></defs>
<rect width="960" height="640" fill="url(#g)"/>
<path fill="#9fb39a" d="M0 330C120 280 240 260 360 290S600 230 740 270 900 250 960 260V640H0Z"/>
<path fill="#6f8f6a" d="M0 400C180 360 340 350 500 380S800 340 960 360V640H0Z"/>
<path fill="#2d302c" d="M0 520H960V600H0Z"/><path d="M0 560H960" stroke="#eae3c9" stroke-width="3" stroke-dasharray="26 22"/>
<g transform="translate(${480 - (96 + len) * 2.6} 330) scale(5.2)">${van(len, v.id === "maharaja")}</g>
<rect x="24" y="24" width="912" height="592" fill="none" stroke="#1e3a2b" stroke-width="3" stroke-dasharray="14 10" opacity=".5"/>
<text x="480" y="120" text-anchor="middle" font-family="Arial, sans-serif" font-size="34" font-weight="700" fill="#9c3a20" letter-spacing="4">YOUR VEHICLE PHOTO HERE</text>
<text x="480" y="168" text-anchor="middle" font-family="Georgia, serif" font-size="26" fill="#1e3a2b">Placeholder: replace with a real photo</text>
</svg>`;
  const buf = Buffer.from(svg);
  await sharp(buf).resize(960, 640).webp({ quality: 72 }).toFile(out(`assets/img/fleet/${v.image}-960.webp`));
  await sharp(buf).resize(480, 320).webp({ quality: 70 }).toFile(out(`assets/img/fleet/${v.image}-480.webp`));
}

/* ---- OG share cards ---- */
const jobs = JSON.parse(fs.readFileSync(path.join(ROOT, "tools/og-pages.json"), "utf8"));
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
for (const j of jobs) {
  await page.setContent(`<!doctype html><html><head><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700&family=Source+Sans+3:wght@600;700&display=block" rel="stylesheet">
<style>body{margin:0;width:1200px;height:630px;overflow:hidden;background:linear-gradient(180deg,#d8dfdc,#eef0ea);font-family:"Source Sans 3",sans-serif;position:relative}
.t{position:absolute;left:72px;top:64px;right:72px}
.k{font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#9c3a20;font-size:24px;display:flex;gap:14px;align-items:center}.k:before{content:"";width:44px;height:3px;background:#9c3a20}
h1{font-family:Fraunces,serif;font-weight:700;font-size:${j.title.length > 40 ? 64 : 76}px;line-height:1.04;color:#16221b;margin:22px 0 0;max-width:900px;letter-spacing:-.02em}
.b{position:absolute;left:72px;bottom:44px;color:#fff;font-weight:700;font-size:28px;display:flex;align-items:center;gap:14px;z-index:2}
.b span{font-weight:600;font-size:22px;opacity:.85}
.cta{position:absolute;right:72px;bottom:40px;background:#b4472b;color:#fff;font-weight:700;font-size:24px;padding:14px 24px;border-radius:6px;z-index:2}
svg.art{position:absolute;left:0;bottom:0;width:1200px;height:300px}</style></head><body>
<div class="t"><div class="k">Tempo traveller on rent · Bengaluru</div><h1>${esc(j.title)}</h1></div>
<svg class="art" viewBox="0 0 1200 300" preserveAspectRatio="none"><path fill="#9fb39a" d="M0 80C120 30 240 20 360 50S600 0 740 40 1000 10 1200 40V300H0Z"/><path fill="#6f8f6a" d="M0 140C180 100 340 90 500 120S800 80 1200 110V300H0Z"/><path fill="#1e3a2b" d="M0 200C200 170 400 165 600 185S1000 160 1200 175V300H0Z"/></svg>
<div class="b">${esc(C.business.name)} <span>· ${esc(C.business.phoneDisplay)}</span></div><div class="cta">Get a quote on WhatsApp</div>
</body></html>`, { waitUntil: "networkidle" });
  const png = await page.screenshot({ type: "png" });
  await sharp(png).jpeg({ quality: 82, mozjpeg: true }).toFile(out(`assets/img/og/${j.key}.jpg`));
}
await browser.close();
console.log(`Images done: ${jobs.length} OG cards, ${C.fleet.length * 2} placeholders, favicons.`);
