#!/usr/bin/env node
/* Static page generator: reads assets/js/config.js and writes every page,
   sitemap.xml, robots.txt and site.webmanifest. No dependencies.
   Usage:  node tools/generate.mjs                                    */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";
import crypto from "node:crypto";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "assets/js/config.js"), "utf8"), sandbox);
const C = sandbox.window.SITE_CONFIG;
const B = C.business;
const SITE = C.siteUrl.replace(/\/$/, "");
const FLEET = C.fleet.filter((v) => v.enabled !== false);
const DESTS = C.destinations;
const TODAY = new Date().toISOString().slice(0, 10);
const warnings = [];
// Cache-busting version for CSS/JS (changes whenever the file changes)
const ver = (f) => crypto.createHash("md5").update(fs.readFileSync(path.join(ROOT, f))).digest("hex").slice(0, 8);
const V = { css: ver("assets/css/site.css"), cfg: ver("assets/js/config.js"), js: ver("assets/js/main.js") };
const sitemap = [];
const ogJobs = [];

const e = (s = "") => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const inr = (n) => "₹" + Math.round(n).toLocaleString("en-IN");
const ld = (o) => `<script type="application/ld+json">${JSON.stringify(o).replace(/</g, "\\u003c")}</script>`;
const vehBySeats = (v) => v.seats.join(", ").replace(/, (\d+)$/, " and $1");

/* ------------------------------------------------------------------ icons */
const I = {
  wa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4.5 19.5l1.1-3.6A8 8 0 1 1 8.4 18.6z"/><path d="M9.2 8.6c.2-.5.5-.5.8-.5h.5c.2 0 .4.1.5.4l.6 1.5c.1.3 0 .5-.1.7l-.5.6c.6 1.1 1.5 2 2.6 2.6l.6-.5c.2-.2.5-.2.7-.1l1.5.6c.3.1.4.3.4.5v.5c0 .3 0 .6-.5.8-.6.3-1.6.5-3-.2a8.6 8.6 0 0 1-3.8-3.8c-.7-1.4-.5-2.4-.3-3.1z"/></svg>',
  phone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 4h3.2l1.6 4-2 1.3a10 10 0 0 0 6.9 6.9l1.3-2 4 1.6V19a1.6 1.6 0 0 1-1.7 1.6A15.6 15.6 0 0 1 3.4 5.7 1.6 1.6 0 0 1 5 4z"/></svg>',
  mail: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="5.5" width="18" height="13" rx="1.5"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5"/></svg>',
  pin: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21s-6.5-6.2-6.5-11.2a6.5 6.5 0 0 1 13 0C18.5 14.8 12 21 12 21z"/><circle cx="12" cy="9.8" r="2.3"/></svg>',
  clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
  sun: '<svg class="i-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/></svg>',
  moon: '<svg class="i-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z"/></svg>',
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h10"/></svg>',
  seat: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 4h6a2 2 0 0 1 2 2.2L16.8 17H9.6L8 6.3A2 2 0 0 1 10 4z"/><path d="M7 17h14a2 2 0 0 1 2 2v2H9.5L7 17z"/><path d="M11 21v6M20 21v6M9 27h13"/></svg>',
  route: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="7" cy="25" r="3"/><circle cx="25" cy="7" r="3"/><path d="M10 25h9a4.5 4.5 0 0 0 0-9h-6a4.5 4.5 0 0 1 0-9h9" stroke-dasharray="3 3"/></svg>',
  door: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 14L16 5l11 9"/><path d="M8 12v15h16V12"/><path d="M13 27v-8h6v8"/></svg>',
  rupee: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 7h14M9 12h14M13 7c5 0 7 2 7 5s-3 5-7 5h-3l10 9"/></svg>',
  wheel: '<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="16" cy="16" r="11"/><circle cx="16" cy="16" r="3"/><path d="M5.5 14l7.7 1M26.5 14l-7.7 1M16 19v8"/></svg>',
  insta: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>',
  fb: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M14.5 21v-7.5h2.6l.4-3h-3V8.7c0-.9.3-1.5 1.5-1.5h1.6V4.5a20 20 0 0 0-2.4-.1c-2.4 0-4 1.4-4 4v2.1H8.6v3h2.6V21"/></svg>',
  yt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" aria-hidden="true"><rect x="2.5" y="5.5" width="19" height="13" rx="3.5"/><path d="M10 9.2v5.6l4.8-2.8z" fill="currentColor"/></svg>',
  x: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M4 4l16 16M20 4L4 20"/></svg>',
  in: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="2"/><path d="M8 10.5V16M8 7.8v.1M11.5 16v-5.5M11.5 13c0-1.6 1-2.5 2.3-2.5S16 11.3 16 13v3"/></svg>',
  share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="18" cy="18" r="2.5"/><path d="M8.2 10.8l7.6-3.6M8.2 13.2l7.6 3.6"/></svg>',
  link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/></svg>',
  mark: '<svg viewBox="0 0 40 40" fill="none" aria-hidden="true"><circle cx="20" cy="20" r="18.5" stroke="currentColor" stroke-width="3"/><path d="M9 29c6 0 14-1 14-5s-10-3-10-8 9-6 15-6" stroke="currentColor" stroke-width="3.2" stroke-linecap="round"/></svg>',
};
const contour = '<svg class="contour" viewBox="0 0 1200 28" preserveAspectRatio="none" aria-hidden="true"><path d="M0 18 C150 4 260 26 420 14 S700 2 860 16 S1080 26 1200 10" fill="none" stroke="currentColor" stroke-width="1.2"/><path d="M0 24 C170 12 280 30 440 20 S720 8 880 22 S1090 30 1200 18" fill="none" stroke="currentColor" stroke-width="1" opacity=".6"/></svg>';

/* --------------------------------------------------------------- hero art */
const heroArt = `<svg viewBox="0 0 1440 480" preserveAspectRatio="xMidYMax slice" role="img" aria-labelledby="hero-art-t">
<title id="hero-art-t">Illustration: a tempo traveller driving down a winding Western Ghats road through misty hills</title>
<!-- TODO (optional): swap this illustration for your own photo of your vehicle on a ghat road -->
<path fill="var(--ridge-1)" d="M0 210C120 150 220 120 340 150S560 90 700 130 940 70 1080 120 1320 100 1440 140V480H0Z"/>
<ellipse class="mist" cx="720" cy="215" rx="980" ry="38" fill="#fff" opacity=".35"/>
<path fill="var(--ridge-2)" d="M0 270C160 220 300 200 440 235S700 190 860 230 1120 180 1280 220 1400 230 1440 225V480H0Z"/>
<g fill="var(--ridge-3)" opacity=".9"><path d="M210 236l10-30 10 30z"/><path d="M228 238l8-24 8 24z"/><path d="M1010 214l9-28 9 28z"/><path d="M1026 216l7-22 7 22z"/><path d="M640 222l8-24 8 24z"/></g>
<ellipse class="mist" cx="500" cy="282" rx="700" ry="22" fill="#fff" opacity=".28"/>
<path fill="var(--ridge-3)" d="M0 340C200 290 380 280 560 310S900 270 1100 300 1360 300 1440 290V480H0Z"/>
<g fill="none" stroke-linecap="round" stroke-linejoin="round">
<path stroke="var(--road-edge)" stroke-width="30" opacity=".9" d="M1240 296C1120 310 990 318 900 322 856 324 852 348 900 350 1010 354 1120 358 1162 372 1196 384 1172 402 1120 404 960 410 700 412 520 422 380 430 300 452 236 492"/>
<path stroke="var(--road)" stroke-width="22" d="M1240 296C1120 310 990 318 900 322 856 324 852 348 900 350 1010 354 1120 358 1162 372 1196 384 1172 402 1120 404 960 410 700 412 520 422 380 430 300 452 236 492"/>
<path stroke="#eae3c9" stroke-width="1.6" stroke-dasharray="10 12" opacity=".8" d="M1240 296C1120 310 990 318 900 322 856 324 852 348 900 350 1010 354 1120 358 1162 372 1196 384 1172 402 1120 404 960 410 700 412 520 422 380 430 300 452 236 492"/>
</g>
<g transform="translate(640 366) rotate(-1.5) scale(1.55)"><g class="van">
<ellipse cx="50" cy="43" rx="48" ry="3.5" fill="#000" opacity=".25"/>
<path fill="var(--van)" stroke="var(--van-trim)" stroke-width="1.4" d="M11 8Q13 2 21 2H90Q96 2 96 8V36H4V22Q4 14 11 8Z"/>
<path fill="var(--glass)" d="M8 21L14.5 8H24V21Z"/>
<g fill="var(--glass)"><rect x="28" y="8" width="13" height="12" rx="1.5"/><rect x="44" y="8" width="13" height="12" rx="1.5"/><rect x="60" y="8" width="13" height="12" rx="1.5"/><rect x="76" y="8" width="14" height="12" rx="1.5"/></g>
<rect x="4" y="25" width="92" height="3" fill="var(--road-edge)"/>
<rect x="2" y="30" width="5" height="3" rx="1" fill="#f3c969"/>
<g><circle cx="21" cy="37" r="7" fill="#1b1d1a"/><circle cx="21" cy="37" r="2.8" fill="#9aa59c"/><circle cx="78" cy="37" r="7" fill="#1b1d1a"/><circle cx="78" cy="37" r="2.8" fill="#9aa59c"/></g>
</g></g>
<path fill="var(--ridge-4)" d="M860 480C980 440 1180 420 1440 404V480Z"/>
<path fill="var(--ridge-4)" d="M0 430C90 420 150 446 196 480H0Z"/>
<g fill="var(--ridge-4)"><path d="M1240 420l14-46 14 46z"/><path d="M1268 416l11-36 11 36z"/><path d="M1330 412l16-52 16 52z"/><path d="M1362 410l12-40 12 40z"/><path d="M40 440l12-40 12 40z"/><path d="M70 444l9-30 9 30z"/></g>
</svg>`;

/* --------------------------------------------------------------- route map */
const GEO = { bangalore: [12.97, 77.59], goa: [15.49, 73.83], hampi: [15.335, 76.46], "north-karnataka": [15.92, 75.68], udupi: [13.34, 74.75], mangalore: [12.91, 74.86], "south-canara": [12.95, 75.38], kerala: [10.09, 77.06], coorg: [12.42, 75.74], chikmagalur: [13.32, 75.77], mysore: [12.3, 76.64], ooty: [11.41, 76.7], kodaikanal: [10.24, 77.49], sakleshpur: [12.94, 75.79], dandeli: [15.25, 74.62], "jog-falls": [14.23, 74.81], pondicherry: [11.94, 79.83], tirupati: [13.63, 79.42] };
const LABEL = { goa: ["Goa", "s"], hampi: ["Hampi", "s"], "north-karnataka": ["Badami", "s"], udupi: ["Udupi", "e"], mangalore: ["Mangalore", "e"], "south-canara": ["Dharmasthala", "n"], kerala: ["Munnar", "e"], coorg: ["Coorg", "e"], chikmagalur: ["Chikmagalur", "s"], mysore: ["Mysore", "s"], ooty: ["Ooty", "s"], kodaikanal: ["Kodaikanal", "s"], sakleshpur: ["Sakleshpur", "s"], dandeli: ["Dandeli", "s"], "jog-falls": ["Jog Falls", "s"], pondicherry: ["Pondicherry", "e"], tirupati: ["Tirupati", "s"] };
const P = ([lat, lng]) => [+((lng - 73.4) * 88 + 4).toFixed(1), +((16.2 - lat) * 88 + 10).toFixed(1)];
const poly = (pts) => pts.map(([lng, lat], i) => (i ? "L" : "M") + P([lat, lng]).join(" ")).join("");
const westCoast = [[73.45, 16.2], [73.7, 15.7], [73.85, 15.3], [74.1, 14.85], [74.4, 14.3], [74.5, 13.9], [74.7, 13.35], [74.85, 12.85], [75.0, 12.5], [75.4, 11.85], [75.75, 11.25], [76.0, 10.7], [76.25, 10.0], [76.35, 9.6]];
const eastCoast = [[80.6, 15.9], [80.15, 15.3], [80.05, 14.6], [80.25, 13.6], [80.3, 13.0], [80.2, 12.5], [79.95, 12.1], [79.85, 11.6], [79.85, 10.9], [79.85, 10.3], [79.3, 10.0], [79.0, 9.6]];
function routeMap(rel, highlight) {
  const hub = P(GEO.bangalore);
  const legs = DESTS.filter((d) => GEO[d.id]).map((d) => {
    const [x, y] = P(GEO[d.id]);
    const mx = (hub[0] + x) / 2, my = (hub[1] + y) / 2, dx = x - hub[0], dy = y - hub[1];
    const cx = (mx - dy * 0.15).toFixed(1), cy = (my + dx * 0.15).toFixed(1);
    const [txt, side] = LABEL[d.id] || [d.name, "s"];
    const t = side === "e" ? `x="${x - 9}" y="${y + 4}" text-anchor="end"` : side === "n" ? `x="${x}" y="${y - 10}" text-anchor="middle"` : `x="${x + 9}" y="${y + 4}"`;
    const dim = highlight && highlight !== d.id ? ' opacity=".35"' : "";
    return { leg: `<path class="leg" d="M${hub.join(" ")}Q${cx} ${cy} ${x} ${y}"${dim}/>`, node: `<a href="${rel}${d.slug}/"${dim}><circle class="dot" cx="${x}" cy="${y}" r="${highlight === d.id ? 7 : 5}"/><text ${t}>${e(txt)}</text></a>` };
  });
  const westSea = poly([[73.3, 16.3], ...westCoast, [73.3, 9.5]]) + "Z";
  const eastSea = poly([[80.7, 16.3], ...eastCoast, [80.7, 9.5]]) + "Z";
  return `<svg viewBox="0 0 640 600" role="img" aria-labelledby="map-t map-d"><title id="map-t">Route map: Bangalore to popular destinations</title><desc id="map-d">Illustrative map of South India showing road trips from Bengaluru to ${DESTS.map((d) => d.name).join(", ")}. Not to scale.</desc>
<rect class="land" width="640" height="600"/><path class="sea" d="${westSea}"/><path class="sea" d="${eastSea}"/>
<path class="coast" d="${poly(westCoast)}"/><path class="coast" d="${poly(eastCoast)}"/>
<text class="sea-label" x="18" y="470">ARABIAN SEA</text><text class="sea-label" x="520" y="560" text-anchor="middle">BAY OF BENGAL</text>
${legs.map((l) => l.leg).join("")}${legs.map((l) => l.node).join("")}
<circle class="hub" cx="${hub[0]}" cy="${hub[1]}" r="9"/><text class="hub-label" x="${hub[0] + 13}" y="${hub[1] - 10}">Bengaluru</text></svg>`;
}

/* ------------------------------------------------------------ head / chrome */
function head({ title, desc, url, rel, og, jsonld = [], type = "website", noindex = false, abs = false }) {
  const full = title.length + B.name.length + 3 <= 60 ? `${title} | ${B.name}` : title;
  if (full.length > 60) warnings.push(`title > 60: ${full}`);
  if (desc.length > 155) warnings.push(`description > 155 (${desc.length}): ${url}`);
  const a = abs ? SITE + "/" : rel;
  const ogImg = `${SITE}/assets/img/og/${og}.jpg`;
  ogJobs.push({ key: og, title, desc });
  return `<!doctype html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${e(full)}</title>
<meta name="description" content="${e(desc)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${SITE}/${url}">\n<meta name="robots" content="index, follow, max-image-preview:large">`}
<meta name="geo.region" content="IN-KA">
<meta name="geo.placename" content="Bengaluru">
<meta name="geo.position" content="${B.geo.lat};${B.geo.lng}">
<meta name="ICBM" content="${B.geo.lat}, ${B.geo.lng}">
<meta name="theme-color" content="#f4f1ea" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#0f1a14" media="(prefers-color-scheme: dark)">
<meta property="og:type" content="${type}">
<meta property="og:site_name" content="${e(B.name)}">
<meta property="og:title" content="${e(title)}">
<meta property="og:description" content="${e(desc)}">
<meta property="og:url" content="${SITE}/${url}">
<meta property="og:image" content="${ogImg}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${e(title)}">
<meta property="og:locale" content="en_IN">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${e(title)}">
<meta name="twitter:description" content="${e(desc)}">
<meta name="twitter:image" content="${ogImg}">
<link rel="icon" href="${a}favicon.svg" type="image/svg+xml">
<link rel="icon" href="${a}favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="${a}apple-touch-icon.png">
<link rel="manifest" href="${a}site.webmanifest">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Source+Sans+3:wght@400;600;700&display=swap">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600;9..144,700&family=Source+Sans+3:wght@400;600;700&display=swap" media="print" onload="this.media='all'">
<link rel="stylesheet" href="${a}assets/css/site.css?v=${V.css}">
<script>document.documentElement.classList.add("js");try{var t=localStorage.getItem("theme");if(t)document.documentElement.setAttribute("data-theme",t)}catch(e){}</script>
${jsonld.map(ld).join("\n")}
</head>`;
}

const NAV = [["Fleet", "fleet/"], ["Destinations", "#routes"], ["Packages", "packages/"], ["Fare estimate", "#estimate"], ["About", "about/"], ["Contact", "contact/"]];
function header(rel, current) {
  return `<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
<div class="wrap header-in">
<a class="brand" href="${rel}">${I.mark}<span><span data-cfg="business.name">${e(B.name)}</span><small>Tempo traveller rentals · Bengaluru</small></span></a>
<nav class="nav" id="site-nav" aria-label="Main">
<ul>${NAV.map(([t, h]) => `<li><a href="${h.startsWith("#") ? (rel === "./" ? "" : rel) + h : rel + h}"${current === h ? ' aria-current="page"' : ""}>${t}</a></li>`).join("")}</ul>
</nav>
<div class="header-actions">
<button class="icon-btn theme-toggle" type="button" aria-label="Dark mode" aria-pressed="false">${I.moon}${I.sun}</button>
<a class="btn btn--wa header-cta" data-wa href="https://wa.me/${B.whatsapp}">${I.wa}WhatsApp</a>
<button class="icon-btn nav-toggle" type="button" aria-label="Menu" aria-expanded="false" aria-controls="site-nav">${I.menu}</button>
</div>
</div>
</header>
<main id="main">`;
}

function socials() {
  const s = C.social;
  const items = [[s.instagram, "Instagram", I.insta], [s.facebook, "Facebook", I.fb], [s.youtube, "YouTube", I.yt]].filter(([u]) => u);
  return items.length ? `<div class="socials">${items.map(([u, n, ic]) => `<a href="${e(u)}" rel="noopener" target="_blank" aria-label="${n}">${ic}</a>`).join("")}</div>` : "<!-- TODO: add social URLs in config.js to show icons here -->";
}

function footer(rel) {
  return `</main>
<footer class="site-footer">
<div class="wrap">
<div class="foot-grid">
<div>
<a class="brand" href="${rel}">${I.mark}<span><span data-cfg="business.name">${e(B.name)}</span><small>Tempo traveller rentals · Bengaluru</small></span></a>
<p style="margin-top:1rem">Tempo traveller, Force Urbania and luxury 1x1 vans on rent in Bangalore, for weekend getaways, pilgrimages, weddings and corporate trips across South India.</p>
${socials()}
</div>
<div><h2>Fleet</h2><ul>${FLEET.map((v) => `<li><a href="${rel}${v.slug}/">${e(v.short)} on rent</a></li>`).join("")}<li><a href="${rel}fleet/">All vehicles</a></li></ul></div>
<div><h2>Top routes</h2><ul>${DESTS.slice(0, 8).map((d) => `<li><a href="${rel}${d.slug}/">Bangalore to ${e(d.name)}</a></li>`).join("")}</ul></div>
<div><h2>Contact</h2><ul>
<li><a data-tel href="tel:${B.phone}"><span data-cfg="business.phoneDisplay">${e(B.phoneDisplay)}</span></a></li>
<li><a data-wa href="https://wa.me/${B.whatsapp}">WhatsApp us</a></li>
<li><a data-mail href="mailto:${B.email}"><span data-cfg="business.email">${e(B.email)}</span></a></li>
<li>${e(B.area)}, ${e(B.city)}</li>
<li><a href="${rel}packages/">Tour packages</a></li>
<li><a href="${rel}about/">About us</a></li>
</ul></div>
</div>
<div class="foot-base"><span>© <span class="js-year">${new Date().getFullYear()}</span> ${e(B.name)}. All rates indicative.</span><span><a href="${rel}privacy-policy/">Privacy</a> · <a href="${rel}terms/">Terms</a> · <a href="${rel}links/">Links</a></span></div>
</div>
</footer>
<div class="mobile-bar">
<a class="btn btn--wa" data-wa href="https://wa.me/${B.whatsapp}">${I.wa}WhatsApp us</a>
<a class="btn btn--primary" data-tel href="tel:${B.phone}">${I.phone}Call now</a>
</div>
<script src="${rel}assets/js/config.js?v=${V.cfg}" defer></script>
<script src="${rel}assets/js/main.js?v=${V.js}" defer></script>
</body>
</html>
`;
}

function crumbs(rel, trail) {
  const items = [["Home", ""], ...trail];
  return {
    html: `<nav class="crumbs" aria-label="Breadcrumb"><ol>${items.map(([n, u], i) => i === items.length - 1 ? `<li aria-current="page">${e(n)}</li>` : `<li><a href="${rel}${u}">${e(n)}</a></li>`).join("")}</ol></nav>`,
    ld: { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items.map(([n, u], i) => ({ "@type": "ListItem", position: i + 1, name: n, item: `${SITE}/${u}` })) },
  };
}

/* ---------------------------------------------------------------- schema */
const bizLd = () => {
  const sameAs = Object.entries(C.social).filter(([k, v]) => v && k !== "instagramHandle").map(([, v]) => v);
  const o = {
    "@context": "https://schema.org", "@type": "TravelAgency", "@id": `${SITE}/#business`, name: B.name, url: `${SITE}/`,
    description: "Tempo traveller, Force Urbania and luxury 1x1 tempo traveller rental in Bangalore for outstation trips across South India.",
    telephone: B.phone, email: B.email, image: `${SITE}/assets/img/og/home.jpg`, logo: `${SITE}/android-chrome-512.png`, priceRange: "₹₹",
    address: { "@type": "PostalAddress", ...(B.street ? { streetAddress: B.street } : {}), addressLocality: `${B.area}, ${B.city}`, addressRegion: B.region, postalCode: B.postalCode, addressCountry: B.country },
    geo: { "@type": "GeoCoordinates", latitude: B.geo.lat, longitude: B.geo.lng },
    openingHours: B.openingHours,
    areaServed: [{ "@type": "City", name: "Bengaluru" }, ...DESTS.map((d) => ({ "@type": "Place", name: d.name }))],
  };
  if (sameAs.length) o.sameAs = sameAs;
  if (C.social.googleBusiness) o.hasMap = C.social.googleBusiness;
  return o;
};
const faqLd = (faqs) => ({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a.replace(/<[^>]+>/g, "") } })) });
const productLd = (v) => {
  const rates = v.seats.map((s) => v.ratePerKm[s]).filter(Boolean);
  const o = {
    "@context": "https://schema.org", "@type": "Product", name: `${v.name} on rent in Bangalore`,
    description: `${v.name} available in ${vehBySeats(v)} seater options for outstation and local trips from Bangalore. ${v.idealFor}`,
    image: `${SITE}/assets/img/fleet/${v.image}-960.webp`, brand: { "@type": "Brand", name: "Force Motors" }, category: "Vehicle rental",
  };
  // Offers are only published once real rates are set (ratesAreSample: false)
  if (!C.ratesAreSample && rates.length) o.offers = { "@type": "AggregateOffer", priceCurrency: "INR", lowPrice: Math.min(...rates), highPrice: Math.max(...rates), offerCount: rates.length, availability: "https://schema.org/InStock", seller: { "@id": `${SITE}/#business` }, description: "Price per km, minimum " + C.pricing.minKmPerDay + " km per day plus driver bata" };
  return o;
};

/* -------------------------------------------------------------- partials */
function faqHtml(faqs) {
  return `<div class="faq">${faqs.map(([q, a]) => `<details><summary>${e(q)}</summary><div class="answer"><p>${a}</p></div></details>`).join("")}</div>`;
}

function enquiryForm(id, preset = {}) {
  return `<form class="js-enquiry form-grid" id="${id}" novalidate>
<div class="field"><label for="${id}-name">Your name</label><input id="${id}-name" name="name" type="text" autocomplete="name" required></div>
<div class="field"><label for="${id}-date">Travel date</label><input id="${id}-date" name="date" type="date"></div>
<div class="field"><label for="${id}-pickup">Pickup point</label><input id="${id}-pickup" name="pickup" type="text" placeholder="e.g. Whitefield, Bengaluru"></div>
<div class="field"><label for="${id}-dest">Destination</label><select id="${id}-dest" name="destination" data-fill="dests"${preset.dest ? ` data-preset="${e(preset.dest)}"` : ""}><option value="">Choose a destination</option></select></div>
<div class="field"><label for="${id}-group">Group size</label><input id="${id}-group" name="group" type="number" min="1" max="60" inputmode="numeric" placeholder="e.g. 12"></div>
<div class="field"><label for="${id}-days">Number of days</label><input id="${id}-days" name="days" type="number" min="1" max="30" inputmode="numeric" placeholder="e.g. 3"></div>
<div class="field full"><label for="${id}-vehicle">Vehicle</label><select id="${id}-vehicle" name="vehicle" data-fill="vehicles"${preset.vehicle ? ` data-preset="${e(preset.vehicle)}"` : ""}></select></div>
<div class="field full"><label for="${id}-notes">Anything else? (optional)</label><textarea id="${id}-notes" name="notes" placeholder="Return date, stops, luggage, senior citizens, kids…"></textarea></div>
<div class="field full"><button class="btn btn--wa" type="submit">${I.wa}Send enquiry on WhatsApp</button></div>
<p class="form-note full">This opens WhatsApp with your details filled in. Nothing is stored on this website.</p>
</form>`;
}

function estimator(preset = {}) {
  return `<div class="estimator">
<div>
<p class="eyebrow">Fare estimator</p>
<h2>What will the trip cost?</h2>
<p class="lede">Pick a vehicle, a destination and the number of days. You get an indicative fare from our per-km rates in seconds.</p>
<p class="muted small">Calculation: the higher of the round-trip distance or <span class="js-min-km">${C.pricing.minKmPerDay}</span> km per day, times the per-km rate, plus driver bata of <span class="js-bata">${inr(C.pricing.driverBata)}</span> per day. Tolls, parking, inter-state permits and night charges are extra.</p>
</div>
<div class="js-estimator">
<p class="sample-note js-sample-note" hidden>Sample rates for preview. Final rates coming soon.</p>
<div class="est-form">
<div class="field"><label for="est-vehicle${preset.k || ""}">Vehicle</label><select id="est-vehicle${preset.k || ""}" name="vehicle"${preset.vehicle ? ` data-preset="${preset.vehicle}"` : ""}></select></div>
<div class="form-grid">
<div class="field"><label for="est-dest${preset.k || ""}">Destination</label><select id="est-dest${preset.k || ""}" name="dest"${preset.dest ? ` data-preset="${preset.dest}"` : ""}></select></div>
<div class="field"><label for="est-days${preset.k || ""}">Days</label><input id="est-days${preset.k || ""}" name="days" type="number" min="1" max="30" inputmode="numeric"></div>
<div class="field full js-km-row" hidden><label for="est-km${preset.k || ""}">One-way distance (km)</label><input id="est-km${preset.k || ""}" name="km" type="number" min="1" inputmode="numeric" value="200"></div>
</div>
</div>
<div class="est-result" aria-live="polite" style="margin-top:1.25rem">
<p class="est-label">Indicative fare</p>
<p class="est-total js-total">₹0</p>
<table class="est-breakdown"><tbody>
<tr><td>Billable distance</td><td class="js-bill-km">0 km</td></tr>
<tr><td>Rate</td><td class="js-rate">₹0/km</td></tr>
<tr><td>Vehicle charge</td><td class="js-base">₹0</td></tr>
<tr><td>Driver bata</td><td class="js-bata-total">₹0</td></tr>
</tbody></table>
<p class="small muted">Indicative only. Excludes tolls, parking, state permits and GST if applicable. Your final quote is confirmed on WhatsApp.</p>
<a class="btn btn--primary js-est-wa" href="https://wa.me/${B.whatsapp}">${I.wa}Confirm this quote on WhatsApp</a>
</div>
</div>
</div>`;
}

function vehicleBlock(rel, v, level = "h3") {
  return `<article class="vehicle reveal">
<div class="vehicle-media">
<!-- TODO: replace with your own photo of your ${e(v.name)} (keep the same filenames, 960x640 and 480x320 WebP) -->
<img src="${rel}assets/img/fleet/${v.image}-960.webp" srcset="${rel}assets/img/fleet/${v.image}-480.webp 480w, ${rel}assets/img/fleet/${v.image}-960.webp 960w" sizes="(min-width: 900px) 50vw, 100vw" width="960" height="640" loading="lazy" decoding="async" alt="${e(v.name)} available on rent in Bangalore (photo placeholder)">
<span class="tier">${e(v.tier)}</span>
</div>
<div>
<${level}>${e(v.name)}</${level}>
<ul class="seat-chips" aria-label="Seat options">${v.seats.map((s) => `<li>${s} seater</li>`).join("")}</ul>
<dl class="spec">
<div><dt>Ideal for</dt><dd>${e(v.idealFor)}</dd></div>
<div><dt>Features</dt><dd><ul class="feature-list">${v.features.slice(0, 4).map((f) => `<li>${e(f)}</li>`).join("")}</ul></dd></div>
</dl>
<a class="link-arrow" href="${rel}${v.slug}/">${e(v.short)} rates and details</a>
</div>
</article>`;
}

function routeDetails(rel, d) {
  return `<details>
<summary><h3 class="dest">${e(d.name)}${d.sub ? `<small>${e(d.sub)}</small>` : `<small>${e(d.region)}</small>`}</h3><span class="meta"><b>~${d.km} km</b>${e(d.time)}</span></summary>
<div class="route-body">
<div><h4>Top places</h4><ul>${d.places.slice(0, 5).map((p) => `<li>${e(p)}</li>`).join("")}</ul></div>
<dl><div><dt>Suggested trip</dt><dd>${e(d.trip)}</dd></div><div><dt>Best season</dt><dd>${e(d.season)}</dd></div><div><dt>Recommended vehicle</dt><dd>${e(d.vehicle)}</dd></div></dl>
<a class="link-arrow" href="${rel}${d.slug}/">Bangalore to ${e(d.name)} tempo traveller</a>
</div>
</details>`;
}

function shareBar(url, title) {
  const u = encodeURIComponent(`${SITE}/${url}`), t = encodeURIComponent(title);
  return `<div class="share" role="group" aria-label="Share this page">
<span class="small muted">Share:</span>
<a href="https://wa.me/?text=${t}%20${u}" target="_blank" rel="noopener">${I.wa}WhatsApp</a>
<a href="https://www.facebook.com/sharer/sharer.php?u=${u}" target="_blank" rel="noopener">${I.fb}Facebook</a>
<a href="https://twitter.com/intent/tweet?url=${u}&amp;text=${t}" target="_blank" rel="noopener">${I.x}X</a>
<a href="https://www.linkedin.com/sharing/share-offsite/?url=${u}" target="_blank" rel="noopener">${I.in}LinkedIn</a>
<button type="button" class="js-share-native" hidden>${I.share}More</button>
<button type="button" class="js-copy">${I.link}Copy link</button>
</div>`;
}

function instaSection() {
  const h = C.social.instagramHandle;
  return `<section class="section" aria-labelledby="insta-h">
<div class="wrap insta">
<div class="reveal">
<p class="eyebrow">On the road</p>
<h2 id="insta-h">Follow our trips on Instagram</h2>
<p class="lede">Ghat roads at sunrise, temple-town mornings and the occasional monsoon detour. See where our vans went this week.</p>
${C.social.instagram ? `<a class="btn btn--ghost" href="${e(C.social.instagram)}" target="_blank" rel="noopener">${I.insta}Follow @${e(h)}</a>` : `<!-- TODO: set social.instagram and instagramHandle in config.js, then re-run the generator --><a class="btn btn--ghost" href="#" aria-disabled="true">${I.insta}Instagram coming soon</a>`}
</div>
<!-- TODO: replace these tiles with 6 of your own trip photos (WebP, square, lazy-loaded) -->
<div class="insta-grid reveal" aria-hidden="true">${Array.from({ length: 6 }, (_, i) => `<div>Your trip photo ${i + 1}</div>`).join("")}</div>
</div>
</section>`;
}

function reviewsSection(rel) {
  return `<section class="section" aria-labelledby="reviews-h">
<div class="wrap">
<div class="section-head"><div><p class="eyebrow">Reviews</p><h2 id="reviews-h">What our travellers say</h2></div></div>
<!-- TODO: paste real Google reviews here (or a lightweight Google reviews embed). Do not add made-up reviews. -->
<div class="reviews-empty">
<p><strong>Real Google reviews will appear here.</strong> We only publish genuine reviews from customers who travelled with us.</p>
${C.social.googleBusiness ? `<a class="btn btn--ghost" href="${e(C.social.googleBusiness)}" target="_blank" rel="noopener">Read our Google reviews</a>` : `<a class="btn btn--ghost" href="${rel}contact/">Travelled with us? Tell us</a>`}
</div>
</div>
</section>`;
}

/* ------------------------------------------------------------- FAQs */
const homeFaqs = [
  ["What is the rent for a tempo traveller in Bangalore?", `Outstation trips are charged per kilometre, with a minimum of ${C.pricing.minKmPerDay} km per day, plus driver bata per day. Rates depend on the vehicle and seat count. Use the fare estimator on this page for an indicative fare, then confirm the final quote on WhatsApp.`],
  ["Which is better: Force Urbania or Force Traveller?", "The Force Urbania is the newer, more premium van, with a smoother ride, better seats and a quieter cabin, so it suits families and corporate groups on long highway runs. The Force Traveller (tempo traveller) offers more seat options, from 12 up to 26, and is the best value per seat for larger groups and pilgrimages."],
  ["What is not included in the fare?", "Tolls, parking, inter-state permit charges and night charges (if the driver drives late at night) are usually extra. GST is added if applicable. Everything is listed clearly in your quote before you book."],
  ["Do you provide a driver?", "Yes. Every vehicle comes with an experienced driver who knows the ghat roads and highways of South India. We do not offer self-drive."],
  ["Can you pick us up from home?", "Yes, we pick up from your home, office, hotel or the airport anywhere in Bengaluru, and drop you back at the end of the trip."],
  ["How do I book?", "Send us your travel date, pickup point, destination and group size on WhatsApp, or use the enquiry form on this page. We reply with vehicle options and a quote."],
];
const destFaqs = (d) => [
  [`How far is ${d.name} from Bangalore by road?`, `${d.name} is roughly ${d.km} km from Bangalore, about ${d.time} by road one way. Actual distance and time depend on your pickup point, route and traffic.`],
  [`Which tempo traveller size is best for a Bangalore to ${d.name} trip?`, `For ${d.name}, groups usually book a ${d.vehicle}. Small families often choose a 10 or 13 seater Force Urbania for comfort, while larger groups pick a 17, 20 or 26 seater Force Traveller.`],
  [`What is the best time to visit ${d.name}?`, `The best season is ${d.season}. ${d.note}`],
  [`How is the tempo traveller fare from Bangalore to ${d.name} calculated?`, `The fare is the higher of the round-trip distance or the minimum km per day, times the per-km rate, plus driver bata per day. Tolls, parking and permits are extra. Use the fare estimator on this page for an indicative figure.`],
];

/* --------------------------------------------------------------- pages */
function write(rel, html) {
  const out = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
}
function addSitemap(url, priority, freq = "monthly") { sitemap.push({ url, priority, freq }); }

/* ---------- HOME ---------- */
{
  const rel = "./";
  const faqs = homeFaqs;
  const html = head({ title: "Tempo Traveller on Rent in Bangalore", desc: "Tempo traveller and Force Urbania on rent in Bangalore. 10 to 26 seaters for Goa, Coorg, Ooty, Kerala and more. Instant fare estimate, quote on WhatsApp.", url: "", rel, og: "home", jsonld: [bizLd(), faqLd(faqs), { "@context": "https://schema.org", "@type": "WebSite", name: B.name, url: `${SITE}/` }] }) + header(rel, "") + `
<section class="hero">
<div class="hero-art">${heroArt}</div>
<div class="wrap hero-in">
<div>
<h1><span class="kicker">Tempo traveller &amp; Force Urbania on rent in Bangalore</span>Take the ghat road. We'll take the wheel.</h1>
<p class="lede">AC tempo travellers from 10 to 26 seats, with drivers who know every hairpin from Shiradi to Kalhatti. Weekend getaways, pilgrimages, weddings and office offsites, quoted in minutes.</p>
<div class="hero-ctas">
<a class="btn btn--wa" data-wa href="https://wa.me/${B.whatsapp}">${I.wa}Get a quote on WhatsApp</a>
<a class="btn btn--ghost" href="#estimate">Estimate your fare</a>
</div>
</div>
<form class="picker js-picker" aria-labelledby="picker-h">
<h2 id="picker-h">Where are you headed?</h2>
<div class="field"><label for="pk-dest">From Bangalore to</label><select id="pk-dest" name="dest"><option value="">Choose a destination</option>${DESTS.map((d) => `<option>${e(d.name)}</option>`).join("")}<option>Somewhere else</option></select></div>
<div class="picker-row">
<div class="field"><label for="pk-group">Group size</label><select id="pk-group" name="group"><option value="">People</option><option>Up to 9</option><option>10 to 13</option><option>14 to 17</option><option>18 to 20</option><option>21 to 26</option><option>More than 26</option></select></div>
<div class="field" style="align-self:end"><button class="btn btn--primary" type="submit" style="width:100%">Get quote</button></div>
</div>
<p class="form-note">Opens WhatsApp with your trip details filled in.</p>
</form>
</div>
</section>

<section class="facts" aria-label="At a glance">
<div class="wrap"><ul>
<li>${I.seat}<span><strong>10 to 26 seats</strong>Urbania, Traveller and 1x1 luxury</span></li>
<li>${I.route}<span><strong>${DESTS.length} routes</strong>Planned from Bengaluru</span></li>
<li>${I.door}<span><strong>Doorstep pickup</strong>Anywhere in Bengaluru</span></li>
<li>${I.rupee}<span><strong>Clear pricing</strong>Per-km rate, bata and extras listed upfront</span></li>
</ul></div>
</section>

<section class="section" id="fleet" aria-labelledby="fleet-h">
<div class="wrap">
<div class="section-head reveal"><div><p class="eyebrow">Our fleet</p><h2 id="fleet-h">Pick the van that fits your group</h2></div><p class="lede">Every vehicle is air-conditioned, cleaned before every trip and driven by a professional who knows South Indian highways.</p></div>
<div class="fleet-list">${FLEET.map((v) => vehicleBlock(rel, v)).join("")}</div>
</div>
</section>

<section class="section section--tint" id="routes" aria-labelledby="routes-h">
<div class="wrap">
<div class="section-head reveal"><div><p class="eyebrow">Popular routes</p><h2 id="routes-h">Every road out of Bangalore</h2></div><p class="lede">From a Mysore day trip to a week down the Kerala coast. Tap a route for top places, the best season and the right vehicle size.</p></div>
<div class="routes">
<div class="route-map-wrap reveal"><div class="route-map">${routeMap(rel)}</div><p class="map-caption">Illustrative map, not to scale. Distances are approximate one-way road distances from central Bengaluru.</p></div>
<div class="timetable">${DESTS.map((d) => routeDetails(rel, d)).join("")}</div>
</div>
</div>
</section>

<section class="section section--forest" id="estimate" aria-label="Fare estimator">
<div class="wrap">${estimator()}</div>
</section>

<section class="section" aria-labelledby="why-h">
<div class="wrap">
<div class="section-head reveal"><div><p class="eyebrow">Why travel with us</p><h2 id="why-h">Less planning, more road trip</h2></div></div>
<ol class="why reveal">
<li><div><h3>Drivers who know the ghats</h3><p>Shiradi, Charmadi, Kalhatti, the Kodai ghat road. Our drivers drive these routes all the time and plan around night bans and monsoon closures.</p></div></li>
<li><div><h3>Clear, written quotes</h3><p>You get the per-km rate, minimum km, driver bata and what's extra before you confirm. No surprise "adjustments" at the end of the trip.</p></div></li>
<li><div><h3>Clean, checked vehicles</h3><p>Every van is cleaned and checked before each trip: AC, tyres, brakes, first-aid kit.</p></div></li>
<li><div><h3>Help with the paperwork</h3><p>Inter-state permits, Nilgiris and Kodaikanal e-passes and darshan timings. We tell you what's needed before you leave.</p></div></li>
<li><div><h3>Flexible itineraries</h3><p>Want to add Belur on the way to Chikmagalur or a sunset at Murudeshwar? Plan stops your way and we'll quote it.</p></div></li>
<li><div><h3>One WhatsApp away</h3><p>Quotes, changes and live location sharing during the trip, all on WhatsApp.</p></div></li>
</ol>
</div>
</section>

${reviewsSection(rel)}

<section class="section section--tint" id="faq" aria-labelledby="faq-h">
<div class="wrap faq-layout">
<div class="reveal"><p class="eyebrow">FAQ</p><h2 id="faq-h">Questions people ask before booking</h2><p class="lede">Not answered here? Message us. We usually reply within minutes during working hours.</p></div>
${faqHtml(faqs)}
</div>
</section>

<section class="section" id="enquire" aria-labelledby="enq-h">
<div class="wrap enquiry">
<div class="reveal">
<p class="eyebrow">Enquire</p>
<h2 id="enq-h">Tell us about your trip</h2>
<p class="lede">Fill this in and WhatsApp opens with everything ready to send. We reply with vehicle options and a quote.</p>
<ul class="contact-lines">
<li>${I.phone}<a data-tel href="tel:${B.phone}"><span data-cfg="business.phoneDisplay">${e(B.phoneDisplay)}</span></a></li>
<li>${I.mail}<a data-mail href="mailto:${B.email}"><span data-cfg="business.email">${e(B.email)}</span></a></li>
<li>${I.pin}<span>${e(B.area)}, ${e(B.city)}, ${e(B.region)}</span></li>
<li>${I.clock}<span data-cfg="business.openingHoursText">${e(B.openingHoursText)}</span></li>
</ul>
</div>
${enquiryForm("home-enq")}
</div>
</section>
${instaSection()}
` + footer(rel);
  write("index.html", html);
  addSitemap("", "1.0", "weekly");
}

/* ---------- FLEET ---------- */
{
  const rel = "../";
  const c = crumbs(rel, [["Fleet", "fleet/"]]);
  const html = head({ title: "Tempo Traveller & Urbania Fleet in Bangalore", desc: `Our fleet: Force Urbania (${vehBySeats(FLEET[0])} seater), Force Traveller (${vehBySeats(FLEET[1])} seater) and luxury 1x1 tempo travellers on rent in Bangalore.`, url: "fleet/", rel, og: "fleet", jsonld: [c.ld, { "@context": "https://schema.org", "@type": "ItemList", itemListElement: FLEET.map((v, i) => ({ "@type": "ListItem", position: i + 1, url: `${SITE}/${v.slug}/`, name: v.name })) }] }) + header(rel, "fleet/") + `
<section class="page-hero"><div class="wrap">${c.html}
<p class="eyebrow">Fleet</p>
<h1>Tempo travellers &amp; vans on rent in Bangalore</h1>
<p class="lede">Three kinds of vehicle, ${FLEET.reduce((n, v) => n + v.seats.length, 0)} seat options, all with AC and a professional driver. Not sure which one? Tell us your group size on WhatsApp and we'll suggest one.</p>
</div></section>
<section class="section"><div class="wrap"><div class="fleet-list">${FLEET.map((v) => vehicleBlock(rel, v, "h2")).join("")}</div></div></section>
<section class="section section--forest" id="estimate" aria-label="Fare estimator"><div class="wrap">${estimator()}</div></section>
<section class="section"><div class="wrap enquiry"><div><p class="eyebrow">Enquire</p><h2>Check availability</h2><p class="lede">Weekends and long weekends book out early. Send your dates and we'll confirm what's free.</p></div>${enquiryForm("fleet-enq")}</div></section>
` + footer(rel);
  write("fleet/index.html", html);
  addSitemap("fleet/", "0.9");
}

/* ---------- VEHICLE PAGES ---------- */
const seatGuide = (s) => s <= 10 ? "A family of 6 to 9 with full luggage, or a small group who want extra room." : s <= 12 ? "A family or friends' group of 8 to 11 with luggage, with room to stretch out." : s <= 13 ? "A joint family or friends' group of 9 to 12 with luggage. A popular size for weekend trips." : s <= 17 ? "Two families or an office team of 13 to 16." : s <= 20 ? "Larger groups, pilgrim parties and sports teams of 16 to 19." : "Big groups of 20 to 25. The lowest cost per head for long trips.";
FLEET.forEach((v, idx) => {
  const rel = "../";
  const c = crumbs(rel, [["Fleet", "fleet/"], [v.short + " on rent", v.slug + "/"]]);
  const title = idx === 1 ? "Tempo Traveller on Rent in Bangalore: 12 to 26 Seater" : idx === 0 ? "Force Urbania on Rent in Bangalore" : "Luxury Maharaja Tempo Traveller in Bangalore";
  const h1 = idx === 1 ? "Tempo traveller on rent in Bangalore" : idx === 0 ? "Force Urbania on rent in Bangalore" : "Luxury Maharaja tempo traveller on rent in Bangalore";
  const desc = idx === 1 ? "Hire a 12, 13, 17, 20 or 26 seater Force Traveller tempo traveller in Bangalore with driver. Per-km rates, features and instant fare estimate." : idx === 0 ? "Hire a 10, 13 or 17 seater Force Urbania in Bangalore with driver. Premium pushback seats and AC. See per-km rates and get a quote on WhatsApp." : "Hire a luxury 1x1 Maharaja tempo traveller in Bangalore with captain seats, extra legroom and LED lighting. See rates and book on WhatsApp.";
  const faqs = [
    [`How many seats does the ${v.short} have?`, `We offer the ${v.name} in ${vehBySeats(v)} seater options.`],
    [`What is the ${v.short} rent per km in Bangalore?`, `Rates depend on the seat option and are listed on this page. A minimum of ${C.pricing.minKmPerDay} km per day applies on outstation trips, plus driver bata. Tolls, parking and permits are extra.`],
    [`Is the ${v.short} good for long trips?`, v.idealFor],
  ];
  const html = head({ title, desc, url: v.slug + "/", rel, og: v.id, type: "product", jsonld: [c.ld, productLd(v), faqLd(faqs)] }) + header(rel, "fleet/") + `
<section class="page-hero"><div class="wrap">${c.html}
<div class="dest-hero">
<div><p class="eyebrow">${e(v.tier)} · ${vehBySeats(v)} seater</p><h1>${e(h1)}</h1><p class="lede">${e(v.idealFor)}</p>
<div class="hero-ctas"><a class="btn btn--wa" data-wa="Hi ${e(B.name)}, I'd like a quote for the ${e(v.name)}." href="https://wa.me/${B.whatsapp}">${I.wa}Get a quote on WhatsApp</a><a class="btn btn--ghost" data-tel href="tel:${B.phone}">${I.phone}Call now</a></div></div>
<div class="vehicle-media">
<!-- TODO: replace with your own photo of your ${e(v.name)} -->
<img src="${rel}assets/img/fleet/${v.image}-960.webp" srcset="${rel}assets/img/fleet/${v.image}-480.webp 480w, ${rel}assets/img/fleet/${v.image}-960.webp 960w" sizes="(min-width: 1000px) 40vw, 100vw" width="960" height="640" fetchpriority="high" alt="${e(v.name)} on rent in Bangalore (photo placeholder)">
</div>
</div>
</div></section>
<section class="section"><div class="wrap content-grid">
<div class="prose">
<h2>Rates</h2>
<p class="sample-note js-sample-note" hidden>Sample rates for preview. Final rates coming soon.</p>
<table class="rate-table"><thead><tr><th scope="col">Seats</th><th scope="col">Per km</th><th scope="col">Min. per day*</th></tr></thead><tbody data-rates="${v.id}">${v.seats.map((s) => `<tr><td>${s} seater</td><td>${inr(v.ratePerKm[s] || 0)}/km</td><td>${inr((v.ratePerKm[s] || 0) * C.pricing.minKmPerDay)}</td></tr>`).join("")}</tbody></table>
<p class="small muted">*Minimum <span class="js-min-km">${C.pricing.minKmPerDay}</span> km per day on outstation trips, plus driver bata of <span class="js-bata">${inr(C.pricing.driverBata)}</span> per day. Tolls, parking, permits and night charges extra. All rates indicative.</p>
<h2>Features</h2>
<ul class="feature-list two">${v.features.map((f) => `<li>${e(f)}</li>`).join("")}</ul>
<h2>${vehBySeats(v)} seater ${idx === 1 ? "tempo traveller" : e(v.short)} options</h2>
${v.seats.map((s) => `<h3>${s} seater ${idx === 1 ? "tempo traveller" : e(v.short)} in Bangalore</h3><p>${seatGuide(s)}</p>`).join("")}
<h2>Popular trips in the ${e(v.short)}</h2>
<ul class="chip-links">${DESTS.map((d) => `<li><a href="${rel}${d.slug}/">Bangalore to ${e(d.name)}</a></li>`).join("")}</ul>
<h2>FAQ</h2>
${faqHtml(faqs)}
</div>
<aside class="side-card">
<h2>Book this vehicle</h2>
<p class="muted">Send your dates, pickup point and destination. We'll confirm availability and the final fare.</p>
${enquiryForm("veh-enq", { vehicle: v.short })}
</aside>
</div></section>
<section class="section section--forest" id="estimate" aria-label="Fare estimator"><div class="wrap">${estimator({ vehicle: v.id })}</div></section>
<section class="section"><div class="wrap"><h2>Other vehicles</h2><ul class="chip-links">${FLEET.filter((o) => o !== v).map((o) => `<li><a href="${rel}${o.slug}/">${e(o.name)}</a></li>`).join("")}</ul><div style="margin-top:2rem">${shareBar(v.slug + "/", title)}</div></div></section>
` + footer(rel);
  write(`${v.slug}/index.html`, html);
  addSitemap(v.slug + "/", "0.9");
});

/* ---------- DESTINATION PAGES ---------- */
DESTS.forEach((d) => {
  const rel = "../";
  const c = crumbs(rel, [["Destinations", "#routes"], [`Bangalore to ${d.name}`, d.slug + "/"]]);
  c.ld.itemListElement[1].item = `${SITE}/#routes`;
  const faqs = destFaqs(d);
  const title = `Bangalore to ${d.name} Tempo Traveller`;
  let desc = `Bangalore to ${d.name}${d.sub ? ` (${d.sub})` : ""} by tempo traveller or Force Urbania: ~${d.km} km, ${d.trip} plans, top places and an instant fare estimate.`;
  if (desc.length > 155) desc = `Bangalore to ${d.name} by tempo traveller or Force Urbania: ~${d.km} km, ${d.trip} plans, top places and an instant fare estimate.`;
  const html = head({ title, desc, url: d.slug + "/", rel, og: d.id, jsonld: [c.ld, faqLd(faqs), { "@context": "https://schema.org", "@type": "TouristTrip", name: `Bangalore to ${d.name} by tempo traveller`, description: desc, touristType: ["Families", "Friends", "Corporate groups", "Pilgrims"], itinerary: { "@type": "ItemList", itemListElement: d.places.map((p, i) => ({ "@type": "ListItem", position: i + 1, item: { "@type": "TouristAttraction", name: p } })) }, provider: { "@id": `${SITE}/#business` } }] }) + header(rel, "#routes") + `
<section class="page-hero"><div class="wrap">${c.html}
<div class="dest-hero">
<div><p class="eyebrow">${e(d.region)}${d.sub ? " · " + e(d.sub) : ""}</p><h1>Bangalore to ${e(d.name)} tempo traveller</h1>
<p class="lede">Book a tempo traveller or Force Urbania from Bangalore to ${e(d.name)}${d.sub ? ` (${e(d.sub)})` : ""}, with a driver who knows the route. Doorstep pickup anywhere in Bengaluru.</p>
<div class="hero-ctas"><a class="btn btn--wa" data-wa="Hi ${e(B.name)}, I'd like a quote for a Bangalore to ${e(d.name)} trip." href="https://wa.me/${B.whatsapp}">${I.wa}Get a ${e(d.name)} quote</a><a class="btn btn--ghost" href="#estimate">Estimate fare</a></div></div>
<dl class="trip-facts">
<div><dt>Distance (approx.)</dt><dd>~${d.km} km one way</dd></div>
<div><dt>Drive time</dt><dd>${e(d.time)}</dd></div>
<div><dt>Suggested trip</dt><dd>${e(d.trip)}</dd></div>
<div><dt>Best season</dt><dd>${e(d.season)}</dd></div>
<div><dt>Recommended vehicle</dt><dd>${e(d.vehicle)}</dd></div>
<div><dt>Pickup</dt><dd>Anywhere in Bengaluru</dd></div>
</dl>
</div>
</div></section>
<section class="section"><div class="wrap content-grid">
<div class="prose">
<h2>Top places to visit in ${e(d.name)}</h2>
<ol class="places">${d.places.map((p) => `<li>${e(p)}</li>`).join("")}</ol>
<h2>The route from Bangalore</h2>
<p>${e(d.route)}</p>
<div class="callout"><p><strong>Good to know:</strong> ${e(d.note)}</p></div>
<h2>Which vehicle should you book?</h2>
<p>Most groups heading to ${e(d.name)} book a <strong>${e(d.vehicle)}</strong>. For more comfort on the long stretches, the <a href="${rel}${FLEET[0].slug}/">Force Urbania</a> is quieter and smoother. For bigger groups and the best value per seat, choose the <a href="${rel}${FLEET[1].slug}/">Force Traveller tempo traveller</a>${FLEET[2] ? `, or travel in style in a <a href="${rel}${FLEET[2].slug}/">luxury 1x1 Maharaja</a>` : ""}.</p>
<h2>Frequently asked questions</h2>
${faqHtml(faqs)}
</div>
<aside>
<div class="route-map" style="margin-bottom:1rem">${routeMap(rel, d.id)}</div>
<p class="map-caption" style="margin-bottom:1.5rem">Illustrative map, not to scale. Distances approximate.</p>
<div class="side-card"><h2>Plan your ${e(d.name)} trip</h2>${enquiryForm("dest-enq", { dest: d.name })}</div>
</aside>
</div></section>
<section class="section section--forest" id="estimate" aria-label="Fare estimator"><div class="wrap">${estimator({ dest: d.id })}</div></section>
<section class="section"><div class="wrap">
<h2>More trips from Bangalore</h2>
<ul class="chip-links">${DESTS.filter((o) => o !== d).map((o) => `<li><a href="${rel}${o.slug}/">Bangalore to ${e(o.name)}</a></li>`).join("")}</ul>
<div style="margin-top:2rem">${shareBar(d.slug + "/", title)}</div>
</div></section>
` + footer(rel);
  write(`${d.slug}/index.html`, html);
  addSitemap(d.slug + "/", "0.8");
});

/* ---------- PACKAGES ---------- */
{
  const rel = "../";
  const c = crumbs(rel, [["Packages", "packages/"]]);
  const D = Object.fromEntries(DESTS.map((d) => [d.id, d]));
  // TODO: adjust these sample tour plans to match how you actually run trips
  const pkgs = [
    { name: "Coorg weekend", dest: "coorg", len: "2N/3D", km: "~550 km round trip", days: [["Day 1", "Early pickup, breakfast on the expressway, Namdroling Golden Temple at Bylakuppe, Dubare Elephant Camp, check in at Madikeri."], ["Day 2", "Abbey Falls, Raja's Seat sunset, coffee estate walk. Optional jeep to Mandalpatti."], ["Day 3", "Talacauvery and Bhagamandala in the morning, drive back to Bengaluru."]] },
    { name: "Chikmagalur and Belur–Halebidu", dest: "chikmagalur", len: "2N/3D", km: "~520 km round trip", days: [["Day 1", "Drive via Hassan, stop at Belur and Halebidu temples, check in at Chikmagalur."], ["Day 2", "Mullayanagiri sunrise, Baba Budangiri, Jhari or Hebbe falls by jeep."], ["Day 3", "Coffee museum or estate visit, return to Bengaluru by evening."]] },
    { name: "Hampi and Badami heritage circuit", dest: "hampi", len: "4N/5D", km: "~1,100 km round trip", days: [["Day 1", "Drive to Hampi via Chitradurga Fort."], ["Day 2", "Virupaksha, Vittala Temple, Lotus Mahal, Hemakuta sunset."], ["Day 3", "Anegundi and coracle ride, drive to Badami."], ["Day 4", "Badami caves, Aihole and Pattadakal."], ["Day 5", "Return to Bengaluru."]] },
    { name: "Coastal temple trail", dest: "south-canara", len: "3N/4D", km: "~1,000 km round trip", days: [["Day 1", "Drive to Dharmasthala via the Shiradi ghat; evening darshan."], ["Day 2", "Kukke Subramanya, then Udupi Sri Krishna Matha and Malpe beach."], ["Day 3", "Kollur Mookambika, Murudeshwar and Gokarna."], ["Day 4", "Morning at Om Beach, return via Jog Falls (seasonal) or Shivamogga."]] },
    { name: "Mysore and Ooty", dest: "ooty", len: "3N/4D", km: "~650 km round trip", days: [["Day 1", "Srirangapatna, Mysore Palace, Brindavan Gardens in the evening."], ["Day 2", "Chamundi Hills, drive through Bandipur–Mudumalai to Ooty (before the night closure)."], ["Day 3", "Botanical Garden, Ooty Lake, Doddabetta, toy train to Coonoor."], ["Day 4", "Pykara on the way down, return to Bengaluru."]] },
    { name: "Kerala hills and backwaters", dest: "kerala", len: "5N/6D", km: "~1,400 km round trip", days: [["Day 1", "Long drive to Munnar via Salem and Coimbatore."], ["Day 2", "Tea gardens, Eravikulam National Park, Mattupetty."], ["Day 3", "Drive to Alleppey; overnight houseboat."], ["Day 4", "Fort Kochi, Chinese fishing nets, Mattancherry."], ["Day 5", "Athirappilly Falls, drive towards the border."], ["Day 6", "Return to Bengaluru."]] },
    { name: "Goa getaway", dest: "goa", len: "3N/4D", km: "~1,200 km round trip", days: [["Day 1", "Early start via NH48; lunch at Hubballi, reach Goa by evening."], ["Day 2", "North Goa: Fort Aguada, Calangute, Baga, Anjuna."], ["Day 3", "Old Goa churches, Panaji's Fontainhas, South Goa beaches."], ["Day 4", "Return to Bengaluru."]] },
    { name: "Tirupati darshan", dest: "tirupati", len: "1N/2D", km: "~520 km round trip", days: [["Day 1", "Pickup at night or early morning, reach Tirupati, Padmavathi Temple, Srikalahasti."], ["Day 2", "Tirumala darshan (as per your TTD slot), return to Bengaluru."]] },
  ].filter((p) => D[p.dest]);
  const html = head({ title: "Tempo Traveller Tour Packages from Bangalore", desc: "Sample tempo traveller tour plans from Bangalore: Coorg, Chikmagalur, Hampi, coastal temples, Ooty, Kerala, Goa and Tirupati. Customise on WhatsApp.", url: "packages/", rel, og: "packages", jsonld: [c.ld] }) + header(rel, "packages/") + `
<section class="page-hero"><div class="wrap">${c.html}<p class="eyebrow">Tour plans</p><h1>Road trip plans from Bangalore</h1><p class="lede">Sample day-by-day plans our groups like. Change any day, add stops or stretch the trip, and we'll quote it on WhatsApp.</p></div></section>
<section class="section"><div class="wrap"><div class="pkg-list">
${pkgs.map((p) => `<article class="pkg reveal"><div><h2>${e(p.name)}</h2><p class="meta"><span>${p.len}</span><span>${p.km} (approx.)</span><span>${e(D[p.dest].vehicle)}</span></p><p class="muted">${e(D[p.dest].season)} is the best time to go.</p><div class="hero-ctas"><a class="btn btn--wa" data-wa="Hi ${e(B.name)}, I'm interested in the ${e(p.name)} (${p.len}) plan." href="https://wa.me/${B.whatsapp}">${I.wa}Get this plan quoted</a></div><p style="margin-top:1rem"><a class="link-arrow" href="${rel}${D[p.dest].slug}/">About the ${e(D[p.dest].name)} route</a></p></div><ol class="days">${p.days.map(([k, t]) => `<li><b>${k}</b><span>${e(t)}</span></li>`).join("")}</ol></article>`).join("")}
</div></div></section>
<section class="section section--forest" id="estimate" aria-label="Fare estimator"><div class="wrap">${estimator()}</div></section>
` + footer(rel);
  write("packages/index.html", html);
  addSitemap("packages/", "0.8");
}

/* ---------- ABOUT ---------- */
{
  const rel = "../";
  const c = crumbs(rel, [["About", "about/"]]);
  const html = head({ title: "About Us: Tempo Traveller Rentals in Bangalore", desc: `About ${B.name}: tempo traveller, Force Urbania and luxury van rentals in Bangalore with experienced drivers for trips across South India.`, url: "about/", rel, og: "about", jsonld: [c.ld] }) + header(rel, "about/") + `
<section class="page-hero"><div class="wrap">${c.html}<p class="eyebrow">About us</p><h1>Road trips, run properly</h1><p class="lede">We're a Bengaluru-based tempo traveller rental business. Our job is simple: get your group there and back comfortably, safely and on time.</p></div></section>
<section class="section"><div class="wrap content-grid"><div class="prose">
<!-- TODO: replace this section with your real story: when you started, how many vehicles you run, who you are. Only include facts you can stand behind. -->
<div class="todo-box"><p><strong>Your story goes here.</strong> Add when you started, how many vehicles you own, who drives them and what you're proud of. Keep it factual: real numbers only.</p></div>
<h2>How we work</h2>
<ul>
<li><strong>Written quotes.</strong> Rate per km, minimum km, driver bata and extras, sent on WhatsApp before you confirm.</li>
<li><strong>Experienced drivers.</strong> Our drivers know the ghat roads, night bans and permit checkposts on the routes we run.</li>
<li><strong>Clean, checked vehicles.</strong> Cleaned and checked before every trip.</li>
<li><strong>Door-to-door.</strong> Pickup and drop anywhere in Bengaluru.</li>
</ul>
<h2>Where we go</h2>
<ul class="chip-links">${DESTS.map((d) => `<li><a href="${rel}${d.slug}/">${e(d.name)}</a></li>`).join("")}</ul>
</div>
<aside class="side-card"><h2>Talk to us</h2><p class="muted">Questions about a trip? We're happy to help you plan.</p><a class="btn btn--wa" data-wa href="https://wa.me/${B.whatsapp}">${I.wa}WhatsApp us</a><a class="btn btn--ghost" data-tel href="tel:${B.phone}">${I.phone}Call now</a></aside>
</div></section>
${reviewsSection(rel)}
` + footer(rel);
  write("about/index.html", html);
  addSitemap("about/", "0.5");
}

/* ---------- CONTACT ---------- */
{
  const rel = "../";
  const c = crumbs(rel, [["Contact", "contact/"]]);
  const html = head({ title: "Contact Us: Book a Tempo Traveller in Bangalore", desc: `Contact ${B.name} to book a tempo traveller or Force Urbania in Bangalore. WhatsApp, call or send an enquiry. Doorstep pickup across Bengaluru.`, url: "contact/", rel, og: "contact", jsonld: [c.ld, bizLd()] }) + header(rel, "contact/") + `
<section class="page-hero"><div class="wrap">${c.html}<p class="eyebrow">Contact</p><h1>Book your tempo traveller</h1><p class="lede">WhatsApp is the fastest way to reach us. Send your date, pickup point, destination and group size.</p></div></section>
<section class="section"><div class="wrap enquiry">
<div>
<h2>Reach us</h2>
<ul class="contact-lines">
<li>${I.wa}<a data-wa href="https://wa.me/${B.whatsapp}">WhatsApp <span data-cfg="business.phoneDisplay">${e(B.phoneDisplay)}</span></a></li>
<li>${I.phone}<a data-tel href="tel:${B.phone}">Call <span data-cfg="business.phoneDisplay">${e(B.phoneDisplay)}</span></a></li>
<li>${I.mail}<a data-mail href="mailto:${B.email}"><span data-cfg="business.email">${e(B.email)}</span></a></li>
<li>${I.pin}<span>${B.street ? e(B.street) + ", " : ""}${e(B.area)}, ${e(B.city)}, ${e(B.region)} ${e(B.postalCode)}</span></li>
<li>${I.clock}<span data-cfg="business.openingHoursText">${e(B.openingHoursText)}</span></li>
</ul>
${C.social.googleBusiness ? `<p style="margin-top:1.5rem"><a class="link-arrow" href="${e(C.social.googleBusiness)}" target="_blank" rel="noopener">Find us on Google Maps</a></p>` : "<!-- TODO: add your Google Business Profile URL in config.js to show a Maps link here -->"}
${socials()}
</div>
${enquiryForm("contact-enq")}
</div></section>
` + footer(rel);
  write("contact/index.html", html);
  addSitemap("contact/", "0.7");
}

/* ---------- LEGAL ---------- */
function legal(slug, title, desc, h1, body) {
  const rel = "../";
  const c = crumbs(rel, [[h1, slug + "/"]]);
  const html = head({ title, desc, url: slug + "/", rel, og: "home", jsonld: [c.ld] }) + header(rel, "") + `
<section class="page-hero"><div class="wrap">${c.html}<h1>${e(h1)}</h1><p class="muted">Last updated: ${TODAY}</p></div></section>
<section class="section"><div class="wrap prose">
<!-- TODO: have this reviewed for your business before relying on it -->
${body}
</div></section>
` + footer(rel);
  write(`${slug}/index.html`, html);
  addSitemap(slug + "/", "0.3", "yearly");
}
legal("privacy-policy", "Privacy Policy", `Privacy policy for ${B.name}: what information we collect when you enquire about a tempo traveller and how we use it.`, "Privacy policy", `
<p>This website is run by ${e(B.legalName)} ("we", "us"). This policy explains what happens to your information when you use the site.</p>
<h2>What we collect</h2>
<p>The site has no login, no cookies and no analytics. The enquiry forms do not send data to our servers. They open WhatsApp on your device with a pre-filled message, and you choose whether to send it.</p>
<p>When you contact us on WhatsApp, by phone or email, we receive what you share: usually your name, phone number, travel dates, pickup point and group size.</p>
<h2>How we use it</h2>
<p>Only to reply to your enquiry, quote and run your trip, and for records required by law (for example, trip sheets and invoices). We do not sell or share your details for marketing.</p>
<h2>Third-party services</h2>
<p>The site loads fonts from Google Fonts and is hosted on GitHub Pages; both may log your IP address as part of normal web traffic. WhatsApp is operated by Meta and has its own privacy policy.</p>
<h2>Your choices</h2>
<p>You can ask us to delete your enquiry details at any time by writing to <a data-mail href="mailto:${B.email}">${e(B.email)}</a>.</p>
<h2>Contact</h2>
<p>${e(B.legalName)}, ${e(B.area)}, ${e(B.city)}, ${e(B.region)}. Phone: <a data-tel href="tel:${B.phone}">${e(B.phoneDisplay)}</a>.</p>`);
legal("terms", "Terms and Conditions", `Booking terms for ${B.name} tempo traveller rentals: fares, extras, cancellations and travel conditions.`, "Terms and conditions", `
<!-- TODO: confirm each point matches how you actually operate (especially cancellation and km counting) -->
<h2>Fares</h2>
<ul>
<li>Fares on this website, including the fare estimator, are indicative. The final fare is the one confirmed in writing (WhatsApp or email) at booking.</li>
<li>Outstation trips are charged per km with a minimum of ${C.pricing.minKmPerDay} km per day, plus driver bata per day.</li>
<li>Kilometres and time are counted from our garage and back to our garage.</li>
<li>Tolls, parking, inter-state permits, entry fees and GST (if applicable) are extra unless the quote says otherwise.</li>
<li>Night driving between 10 pm and 6 am may attract a night charge.</li>
</ul>
<h2>Booking and payment</h2>
<ul><li>A booking is confirmed once an advance is received. The balance is payable as agreed in your quote.</li></ul>
<h2>Cancellation</h2>
<ul><li>Cancellation charges depend on how close to the trip you cancel. They are stated in your booking confirmation.</li></ul>
<h2>On the trip</h2>
<ul>
<li>The driver may refuse to drive in unsafe conditions or beyond legal driving hours, and needs proper rest between days.</li>
<li>Smoking, alcohol and illegal substances are not allowed in the vehicle.</li>
<li>Passengers are responsible for their luggage and belongings, and for any damage they cause to the vehicle.</li>
<li>Delays caused by traffic, weather, road closures, permit checks or breakdowns are not grounds for a refund, but we will always try to arrange a replacement vehicle.</li>
</ul>
<h2>Contact</h2>
<p>${e(B.legalName)}, ${e(B.area)}, ${e(B.city)}. Phone: <a data-tel href="tel:${B.phone}">${e(B.phoneDisplay)}</a>.</p>`);

/* ---------- LINKS (Instagram link in bio) ---------- */
{
  const rel = "../";
  const links = [
    ["Get a quote on WhatsApp", `https://wa.me/${B.whatsapp}`, "data-wa"],
    ["Call us", `tel:${B.phone}`, "data-tel"],
    ["Estimate your fare", `${rel}#estimate`],
    ["Our fleet", `${rel}fleet/`],
    ["Tour packages", `${rel}packages/`],
    ["Bangalore to Coorg", `${rel}${DESTS.find((d) => d.id === "coorg")?.slug}/`],
    ["Bangalore to Goa", `${rel}${DESTS.find((d) => d.id === "goa")?.slug}/`],
    ["Bangalore to Ooty", `${rel}${DESTS.find((d) => d.id === "ooty")?.slug}/`],
    ...(C.social.googleBusiness ? [["Google reviews", C.social.googleBusiness]] : []),
  ];
  const html = head({ title: "Links", desc: `Quick links for ${B.name}: WhatsApp quote, call, fare estimator, fleet, tour packages and popular routes from Bangalore.`, url: "links/", rel, og: "home" }).replace("<body>", "") + `
<body>
<main id="main" class="linkpage">
<a class="brand" href="${rel}">${I.mark}<span><span data-cfg="business.name">${e(B.name)}</span><small>Tempo traveller rentals · Bengaluru</small></span></a>
<h1 style="font-size:var(--step-3)">Tempo traveller on rent in Bangalore</h1>
<p class="muted">Urbania, Traveller and 1x1 luxury vans, 10 to 26 seats, with driver.</p>
<ul>${links.map(([t, h, attr]) => `<li><a href="${h}"${attr ? " " + attr : ""}>${e(t)}</a></li>`).join("")}</ul>
${socials()}
</main>
<script src="${rel}assets/js/config.js?v=${V.cfg}" defer></script>
<script src="${rel}assets/js/main.js?v=${V.js}" defer></script>
</body>
</html>
`;
  write("links/index.html", html);
  addSitemap("links/", "0.4");
}

/* ---------- 404 (absolute paths: GitHub Pages serves it at any URL) ---------- */
{
  const rel = SITE + "/";
  const html = head({ title: "Page not found", desc: "This page took a wrong turn. Head back to tempo traveller rentals in Bangalore.", url: "404.html", rel, og: "home", noindex: true, abs: true }) + header(rel, "") + `
<section class="section notfound"><div class="wrap">
<p class="code" aria-hidden="true">404</p>
<h1 style="font-size:var(--step-4)">Wrong turn at the hairpin</h1>
<p class="lede">The page you were looking for isn't here. It may have moved, or the link had a typo.</p>
<div class="hero-ctas"><a class="btn btn--primary" href="${rel}">Back to home</a><a class="btn btn--ghost" href="${rel}fleet/">See the fleet</a><a class="btn btn--wa" data-wa href="https://wa.me/${B.whatsapp}">${I.wa}WhatsApp us</a></div>
</div></section>
` + footer(rel);
  write("404.html", html);
}

/* ---------- sitemap / robots / manifest ---------- */
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map((s) => `  <url><loc>${SITE}/${s.url}</loc><lastmod>${TODAY}</lastmod><changefreq>${s.freq}</changefreq><priority>${s.priority}</priority></url>`).join("\n")}
</urlset>
`);
write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`);
write("site.webmanifest", JSON.stringify({ name: B.name, short_name: B.name.slice(0, 12), description: B.tagline, start_url: "./", scope: "./", display: "standalone", background_color: "#f4f1ea", theme_color: "#1e3a2b", icons: [{ src: "android-chrome-192.png", sizes: "192x192", type: "image/png" }, { src: "android-chrome-512.png", sizes: "512x512", type: "image/png" }, { src: "favicon.svg", sizes: "any", type: "image/svg+xml" }] }, null, 2));
const seen = new Set();
write("tools/og-pages.json", JSON.stringify(ogJobs.filter((j) => !seen.has(j.key) && seen.add(j.key)), null, 2));

console.log(`Generated ${sitemap.length + 1} pages.`);
warnings.forEach((w) => console.warn("WARN", w));
