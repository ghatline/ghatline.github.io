#!/usr/bin/env node
/* Tells Bing (and other IndexNow engines: Yandex, Seznam, Naver) that pages changed,
   so they re-crawl within hours instead of weeks. Free, no account needed.
   Run AFTER pushing, once the site is live:   node tools/indexnow.mjs
   Google does not use IndexNow; submit sitemap.xml in Google Search Console instead. */
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(ROOT, "assets/js/config.js"), "utf8"), sandbox);
const C = sandbox.window.SITE_CONFIG;
const key = C.seo && C.seo.indexNowKey;
if (!key) { console.error("Set seo.indexNowKey in config.js first."); process.exit(1); }
const site = C.siteUrl.replace(/\/$/, "");
const urls = [...fs.readFileSync(path.join(ROOT, "sitemap.xml"), "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: new URL(site).host, key, keyLocation: `${site}/${key}.txt`, urlList: urls }),
});
console.log(`IndexNow: HTTP ${res.status} for ${urls.length} URLs (200 or 202 = accepted)`);
