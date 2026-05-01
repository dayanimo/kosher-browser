// Renders Web Store assets — promo tile + screenshots for each extension surface.
// Run: node scripts/screenshots.mjs

import { chromium } from "/opt/homebrew/lib/node_modules/@playwright/test/node_modules/playwright/index.mjs";
import path from "node:path";
import fs from "node:fs";
import url from "node:url";

const ROOT = path.resolve(path.dirname(url.fileURLToPath(import.meta.url)), "..");
const OUT = path.join(ROOT, "screenshots");
fs.mkdirSync(OUT, { recursive: true });

const mockChrome = (settings, lang = "he") => `
window.chrome = (() => {
  const settings = ${JSON.stringify(settings)};
  const categoryLists = {
    social: ["facebook.com","instagram.com","twitter.com","x.com","tiktok.com","reddit.com","linkedin.com","threads.net"],
    video: ["youtube.com","youtu.be","twitch.tv","netflix.com","hulu.com","vimeo.com","dailymotion.com"],
    news: ["cnn.com","foxnews.com","nytimes.com","bbc.com","ynet.co.il","walla.co.il","haaretz.co.il"],
    shopping: ["amazon.com","ebay.com","aliexpress.com","etsy.com","wish.com"],
    gambling: ["bet365.com","pokerstars.com","draftkings.com","fanduel.com"],
    adult: ["pornhub.com","xvideos.com","xnxx.com","redtube.com","onlyfans.com"]
  };
  const language = ${JSON.stringify(lang)};
  return {
    runtime: {
      getURL: (p) => "/" + p,
      openOptionsPage: () => {},
      sendMessage: (msg, cb) => {
        const reply = (() => {
          switch (msg.type) {
            case "GET_SETTINGS": return { ok: true, settings };
            case "GET_LOCK_STATE": return { ok: true, hasPassword: !!settings.passwordHash, unlocked: true };
            case "GET_CATEGORY_LISTS": return { ok: true, lists: categoryLists };
            case "UPDATE_SETTINGS": Object.assign(settings, msg.patch); return { ok: true };
            default: return { ok: true };
          }
        })();
        Promise.resolve().then(() => cb && cb(reply));
        return Promise.resolve(reply);
      },
      onMessage: { addListener: () => {} }
    },
    storage: {
      local: {
        get: (keys, cb) => {
          const obj = { language };
          let result;
          if (typeof keys === "string") result = { [keys]: obj[keys] };
          else if (Array.isArray(keys)) { result = {}; for (const k of keys) result[k] = obj[k]; }
          else if (keys === null || keys === undefined) result = obj;
          else result = obj;
          if (typeof cb === "function") cb(result);
          return Promise.resolve(result);
        },
        set: (data, cb) => {
          if (typeof cb === "function") cb();
          return Promise.resolve();
        }
      },
      session: {
        get: (k, cb) => {
          if (typeof cb === "function") cb({});
          return Promise.resolve({});
        },
        set: (d, cb) => {
          if (typeof cb === "function") cb();
          return Promise.resolve();
        }
      },
      onChanged: { addListener: () => {} }
    },
    alarms: { create: () => {}, clear: () => {}, onAlarm: { addListener: () => {} } },
    declarativeNetRequest: { getDynamicRules: async () => [], updateDynamicRules: async () => {} }
  };
})();
`;

const sampleSettings = (overrides = {}) => ({
  enabled: true,
  language: "he",
  customBlocklist: ["youtube.com", "twitter.com", "reddit.com", "tiktok.com", "facebook.com"],
  whitelistMode: false,
  whitelist: [],
  categories: { adult: true, social: true, video: true, news: false, shopping: false, gambling: true },
  schedule: {
    enabled: true,
    blocks: [
      { days: [1, 2, 3, 4, 5], start: "09:00", end: "18:00" },
      { days: [0, 6], start: "22:00", end: "06:00" }
    ]
  },
  focus: { active: false, endsAt: 0, label: "" },
  safeSearch: true,
  passwordHash: "",
  strictMode: false,
  stats: { blocksToday: 47, blocksTotal: 1284, lastDay: "2026-5-1" },
  customMessage: "",
  ...overrides
});

async function withPage(browser, { viewport, locale }, fn) {
  const ctx = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    locale: locale || "he-IL"
  });
  const page = await ctx.newPage();
  await fn(page);
  await ctx.close();
}

const fileURL = (p) => "file://" + path.resolve(ROOT, p);

async function shoot(browser, { surface, viewport, settings, lang, out, locale, click, query, waitFor }) {
  await withPage(browser, { viewport, locale }, async (page) => {
    page.on("pageerror", (e) => console.error("[pageerror]", out, e.message));
    page.on("console", (m) => { if (m.type() === "error") console.error("[console.error]", out, m.text()); });
    await page.addInitScript({ content: mockChrome(settings, lang) });
    const u = fileURL(surface) + (query ? "?" + query : "");
    await page.goto(u);
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(800);
    if (waitFor) await page.waitForSelector(waitFor, { timeout: 5000, state: "attached" });
    if (click) { await page.click(click); await page.waitForTimeout(500); }
    await page.screenshot({ path: path.join(OUT, out), fullPage: false });
  });
}

(async () => {
  const browser = await chromium.launch();

  // ---- Promo tile (440×280) ----
  await withPage(browser, { viewport: { width: 440, height: 280 }, locale: "en-US" }, async (page) => {
    await page.goto("file:///tmp/promo-tile.html");
    await page.waitForLoadState("networkidle");
    await page.screenshot({ path: path.join(OUT, "promo-440x280.png") });
  });
  console.log("✓ promo-440x280.png");

  // ---- Native popup screenshots (used in composite) ----
  // Tall viewport so the full popup paints; the composite clips height.
  await shoot(browser, {
    surface: "popup/popup.html",
    viewport: { width: 360, height: 1200 },
    settings: sampleSettings(),
    lang: "he",
    out: "_popup-native-he.png"
  });
  await shoot(browser, {
    surface: "popup/popup.html",
    viewport: { width: 360, height: 1200 },
    settings: sampleSettings({ language: "en" }),
    lang: "en",
    locale: "en-US",
    out: "_popup-native-en.png"
  });

  // ---- Composite popup screenshots into 1280×800 marketing canvases ----
  const popupComposite = (popupPng, headline, sub, lang) => `
<!doctype html>
<html lang="${lang}" dir="${lang === "he" ? "rtl" : "ltr"}">
<head><style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { width: 100%; height: 100%; }
body {
  width: 1280px; height: 800px;
  background:
    radial-gradient(140% 100% at ${lang === "he" ? "100% 0%" : "0% 0%"}, oklch(50% 0.13 200 / 0.45), transparent 55%),
    linear-gradient(135deg, oklch(28% 0.13 264) 0%, oklch(34% 0.10 220) 50%, oklch(40% 0.09 200) 100%);
  color: white;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Display", "Heebo", "Assistant", system-ui, sans-serif;
  display: flex;
  align-items: center;
  gap: 64px;
  padding: 0 80px;
  overflow: hidden;
  position: relative;
}
.glow {
  position: absolute;
  width: 600px; height: 600px;
  ${lang === "he" ? "left" : "right"}: -150px; top: -150px;
  background: radial-gradient(circle, oklch(70% 0.13 195 / 0.30) 0%, transparent 60%);
  filter: blur(40px);
  pointer-events: none;
}
.text { flex: 1; min-width: 0; position: relative; z-index: 1; overflow: hidden; }
.eyebrow {
  font-size: 13px;
  font-weight: 600;
  color: oklch(85% 0.10 195);
  letter-spacing: 0.18em;
  text-transform: ${lang === "en" ? "uppercase" : "none"};
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  gap: 10px;
}
.eyebrow .pip { width: 6px; height: 6px; border-radius: 50%; background: oklch(78% 0.14 75); }
.headline {
  font-size: 50px;
  font-weight: 700;
  line-height: 1.06;
  letter-spacing: -0.025em;
  margin: 0 0 18px;
  max-width: 11ch;
}
.sub {
  font-size: 18px;
  line-height: 1.55;
  color: oklch(82% 0.03 220);
  max-width: 32ch;
}
.popup-frame {
  flex-shrink: 0;
  width: 340px;
  height: 620px;
  border-radius: 18px;
  overflow: hidden;
  position: relative;
  box-shadow:
    0 1px 0 rgba(255,255,255,0.10) inset,
    0 24px 60px rgba(8, 14, 26, 0.55),
    0 8px 18px rgba(8, 14, 26, 0.30);
}
.popup-frame img {
  display: block;
  width: 340px;
  height: auto;
}
.popup-frame::after {
  content: "";
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(180deg, transparent 0%, transparent 88%, rgba(8, 14, 26, 0.35) 100%);
}
</style></head>
<body>
  <div class="glow"></div>
  <div class="text">
    <div class="eyebrow"><span class="pip"></span><span>Kosher Browser</span></div>
    <h1 class="headline">${headline}</h1>
    <p class="sub">${sub}</p>
  </div>
  <div class="popup-frame">
    <img src="file://${path.join(OUT, popupPng)}" alt="">
  </div>
</body></html>`;

  fs.writeFileSync("/tmp/popup-mockup-he.html", popupComposite(
    "_popup-native-he.png",
    "חסום. התרכז.<br>נשום.",
    "תוסף לדפדפן שעוזר לך לחסום אתרים מסיחים או לא מתאימים, עם לוח זמנים, טיימר פוקוס ונעילה בסיסמה.",
    "he"
  ));
  fs.writeFileSync("/tmp/popup-mockup-en.html", popupComposite(
    "_popup-native-en.png",
    "Block. Focus.<br>Breathe.",
    "A browser extension that helps you block distracting or inappropriate sites, with schedules, a focus timer, and password protection.",
    "en"
  ));

  await withPage(browser, { viewport: { width: 1280, height: 800 }, locale: "he-IL" }, async (page) => {
    await page.goto("file:///tmp/popup-mockup-he.html");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(OUT, "screenshot-1-popup-he-1280x800.png") });
  });
  console.log("✓ screenshot-1-popup-he-1280x800.png");

  await withPage(browser, { viewport: { width: 1280, height: 800 }, locale: "en-US" }, async (page) => {
    await page.goto("file:///tmp/popup-mockup-en.html");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(200);
    await page.screenshot({ path: path.join(OUT, "screenshot-2-popup-en-1280x800.png") });
  });
  console.log("✓ screenshot-2-popup-en-1280x800.png");

  // ---- Options screenshots at native 1280×800 ----
  await shoot(browser, {
    surface: "options/options.html",
    viewport: { width: 1280, height: 800 },
    settings: sampleSettings(),
    lang: "he",
    out: "screenshot-3-options-categories-he-1280x800.png",
    waitFor: "#categoriesList .cat-card",
    click: '[data-tab="categories"]'
  });
  console.log("✓ screenshot-3-options-categories-he-1280x800.png");

  await shoot(browser, {
    surface: "options/options.html",
    viewport: { width: 1280, height: 800 },
    settings: sampleSettings(),
    lang: "he",
    out: "screenshot-4-options-schedule-he-1280x800.png",
    waitFor: "#scheduleBlocks .schedule-block",
    click: '[data-tab="schedule"]'
  });
  console.log("✓ screenshot-4-options-schedule-he-1280x800.png");

  // ---- Blocked page in focus mode (Hebrew) ----
  const focusEnd = Date.now() + 22 * 60 * 1000;
  await shoot(browser, {
    surface: "blocked/blocked.html",
    query: "reason=focus",
    viewport: { width: 1280, height: 800 },
    settings: sampleSettings({ focus: { active: true, endsAt: focusEnd, label: "פוקוס" } }),
    lang: "he",
    out: "screenshot-5-blocked-focus-he-1280x800.png"
  });
  console.log("✓ screenshot-5-blocked-focus-he-1280x800.png");

  // Clean up native popup intermediates.
  for (const f of ["_popup-native-he.png", "_popup-native-en.png"]) {
    try { fs.unlinkSync(path.join(OUT, f)); } catch {}
  }

  await browser.close();
  console.log("\nAll assets in", OUT);
})();
