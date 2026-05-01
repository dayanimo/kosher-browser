---
name: kosher-browser
description: Complete reference for the Kosher Browser Chrome extension — a bilingual (Hebrew/English) MV3 site blocker with focus timer, schedules, password lock, strict mode, and SafeSearch enforcement. Use this skill whenever working on the kosher-browser project — adding features, fixing bugs, deploying updates, modifying popup/options/blocked surfaces, updating blocking rules, or publishing to the Chrome Web Store. Trigger on, kosher browser, kosher-browser, דפדפן כשר, update extension, deploy extension, publish to webstore, Chrome Web Store kosher, declarativeNetRequest issue, or any URL containing kosher-browser.
---

# Kosher Browser

A bilingual Chrome MV3 extension that blocks distracting or inappropriate sites with schedules, a focus timer, password lock, strict mode, and SafeSearch enforcement. Inspired by services like Rimon. Hebrew is the default language; English is a runtime toggle.

## Repository

- **GitHub**: https://github.com/dayanimo/kosher-browser (public)
- **Default branch**: `main`
- **Privacy policy**: https://dayanimo.github.io/kosher-browser/ (served via GitHub Pages from `/docs`)

## File map

```
kosher-browser/
├── manifest.json          # MV3 manifest — version, perms, action, options page
├── background.js          # Service worker — DNR rules, schedule, focus, stats, password gate
├── popup/                 # Toolbar popup UI (340×~720)
│   ├── popup.html         # Topbar, metrics, focus session, filter pills, footer button
│   ├── popup.css          # OKLCH palette, RTL via [dir="rtl"], lang overrides via [lang="en"]
│   └── popup.js           # STRINGS{he,en}, applyI18n(), inline password modal, patchSettings
├── options/               # Full settings page (1280-wide)
│   ├── options.html       # Sidebar tabs (Blocklist, Categories, Schedule, Whitelist, Security, General)
│   ├── options.css        # Sidebar layout, panel transitions, lock overlay, toggle switches
│   └── options.js         # STRINGS{he,en}, lock-on-entry overlay, language picker, dynamic DOM
├── blocked/               # Full-screen "site blocked" page
│   ├── blocked.html       # Auroras, breathing orb, headline, focus countdown, action buttons
│   ├── blocked.css        # Ambient drifting auroras, orb breathe animation, prefers-reduced-motion
│   └── blocked.js         # STRINGS{he,en}, computeReasonText(), countdown, BLOCK_OCCURRED report
├── icons/                 # 16, 32, 48, 128 PNGs + icon.svg source
├── docs/                  # GitHub Pages content — privacy policy
├── screenshots/           # Web Store assets (5 screenshots, promo, marquee tile)
├── scripts/
│   └── screenshots.mjs    # Playwright generator for store assets
├── PRIVACY.md             # Source for the privacy policy page
├── STORE_LISTING.md       # Copy/paste content for Web Store dashboard
└── README.md
```

## Tech Stack

- **Manifest**: V3, `minimum_chrome_version: "111"` (for OKLCH and `color-mix`)
- **Frontend**: vanilla JS, inline SVG, no framework, no build step
- **Blocking**: `chrome.declarativeNetRequest` dynamic rules (redirect actions to extension's blocked page)
- **Storage**: `chrome.storage.local` for settings, `chrome.storage.session` for the unlock window
- **Bilingual**: Hebrew (default) + English. Per-surface `STRINGS = { he: {...}, en: {...} }` table, `t(key)` lookup, `data-i18n` attributes for static text, `applyI18n()` for re-rendering on language change.
- **CSP**: strict MV3 default — no inline scripts, no inline `on*` handlers, no `eval`, no `innerHTML` on user-controlled data
- **Crypto**: SHA-256 via `crypto.subtle.digest` for password hashing (no salt — local-only threat model)

## Permissions (minimal set)

```json
"permissions": ["storage", "alarms", "declarativeNetRequest", "declarativeNetRequestWithHostAccess"],
"host_permissions": ["<all_urls>"]
```

Do NOT add `tabs`, `webNavigation`, or `content_scripts` unless absolutely required — they were intentionally removed during cleanup. Block events are reported by the blocked page via a `BLOCK_OCCURRED` runtime message rather than via `webNavigation`.

## Security model

The extension's threat model is **the user themselves trying to bypass their own controls**, not an external attacker. Storage is local-only.

### Password lock
- `passwordHash` in `chrome.storage.local` is `SHA-256(password)`.
- Set/changed only via `SET_PASSWORD` message, which always re-verifies the old password.
- `UPDATE_SETTINGS` REJECTS any patch that touches `passwordHash` — force the caller through `SET_PASSWORD`. **This is a critical invariant; never relax it.**

### Unlock session
- Stored in `chrome.storage.session` as `unlockedUntil` timestamp (5-minute sliding window).
- Set by `UNLOCK` message after the user enters their password on the options-page lock overlay.
- `UPDATE_SETTINGS` (without `forcePassword`) accepts an unlock session as authentication.
- **Cleared every time the options page opens** (init() calls LOCK first), so settings always demand fresh password entry.
- Popup actions ALWAYS use `forcePassword: true` — they ignore the unlock session and demand the password every time.

### Strict mode
- `s.strictMode === true` makes `UPDATE_SETTINGS` reject patches with `enabled: false` or `strictMode: false`. The only way out is to uninstall and reinstall.
- Other settings (categories, schedule, whitelist, etc.) remain editable while authenticated — strict mode locks the kill switches, not all configuration.

### Things that go through the patch path safely
- `customBlocklist` (array of domains)
- `whitelist`, `whitelistMode`
- `categories.{social|video|news|shopping|adult|gambling}`
- `schedule.{enabled,blocks}`
- `focus` (set only via `START_FOCUS`/`END_FOCUS`, not directly)
- `safeSearch`
- `language` (`"he"` or `"en"`)
- `customMessage`

## DNR rule architecture

```
RULE_IDS = {
  CUSTOM_START: 1,        CUSTOM_END: 1000,
  CATEGORY_START: 1001,   CATEGORY_END: 2000,
  SCHEDULE_START: 2001,   SCHEDULE_END: 3000,
  FOCUS_START: 3001,      FOCUS_END: 3500,
  WHITELIST_START: 5001,  WHITELIST_END: 6000,
  SAFESEARCH_START: 9001, SAFESEARCH_END: 9100
}
```

`rebuildAllRules()` is **serialized through a Promise queue** to prevent the rule-id race that caused production crashes when `onInstalled` fired both an explicit rebuild and an indirect one via `storage.onChanged`. `replaceAllRules()` defensively includes the new rule IDs in `removeRuleIds` so the operation is idempotent.

**Priority semantics:** allow rules use priority 100, blocks use priority 1, SafeSearch redirects use priority 2. Allow always wins, so whitelisted Google bypasses SafeSearch — that's a known trade-off, not a bug.

**SafeSearch is independent of `enabled`** — keeps applying even when the rest of blocking is paused. Don't accidentally wipe SafeSearch in the early-return path of `rebuildAllRules`.

## i18n architecture

Each surface has its own `STRINGS = { he: {...}, en: {...} }` table at the top of its JS file.

```js
let currentLang = "he";

function t(key) {
  return (STRINGS[currentLang] && STRINGS[currentLang][key]) ?? STRINGS.en[key] ?? key;
}

function applyI18n() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "he" ? "rtl" : "ltr";
  document.querySelectorAll("[data-i18n]").forEach(n => n.textContent = t(n.dataset.i18n));
  // ... data-i18n-placeholder, data-i18n-title, data-i18n-aria
  // Re-run any dynamic renderers so dynamic strings re-translate.
}
```

Rules:
- HTML uses `data-i18n="key"`, `data-i18n-placeholder="key"`, `data-i18n-title="key"`, `data-i18n-aria="key"`.
- Keep the Hebrew text as the default in HTML so first paint before JS runs is sensible.
- Dynamic strings (alerts, prompts, status labels, dynamic DOM) call `t("key")` directly.
- Subscribe to `chrome.storage.onChanged` for the `language` key and re-apply on change.
- Domain inputs and chip text use `dir="ltr"` so URLs don't get bidi-mirrored inside RTL flow.
- English only: re-apply `text-transform: uppercase` and wider letter-spacing on eyebrows/labels via `[lang="en"]` selectors. Hebrew has no uppercase, so the Hebrew default has no `text-transform`.

## RTL CSS pitfalls

When adding new CSS:
- Use logical properties: `margin-inline-start`, `padding-inline-end`, `inset-inline-start`, `border-inline-start`, `text-align: start`.
- Avoid hardcoded `left`/`right`/`text-align: left`/etc.
- Toggle thumbs and any directional `transform: translateX()` need `[dir="rtl"]` overrides with negated values.
- Directional SVGs (arrows, play icons) need `transform: scaleX(-1)` mirroring under `[dir="rtl"]` OR redraw the path so it works in both directions.
- Numeric/time displays (`MM:SS`) should be wrapped with `direction: ltr; unicode-bidi: isolate` so they don't get reordered in RTL flow.

## Web Store dashboard

- **Console**: https://chrome.google.com/webstore/devconsole/
- **Version bumps**: edit `manifest.json` `"version"` field. The store rejects re-uploads of the same version.

### Build the upload zip
From the repo root:
```
rm -f ../kosher-browser-<VERSION>.zip
zip -r ../kosher-browser-<VERSION>.zip . \
  -x "*.DS_Store" "*.git*" ".git/*" \
  "README.md" "STORE_LISTING.md" "PRIVACY.md" \
  "icons/icon.svg" \
  "screenshots/*" "scripts/*" "docs/*"
```

The result lives one directory above the repo. Drop it into the **חבילה (Package)** tab in the dashboard.

### Privacy policy URL field
```
https://dayanimo.github.io/kosher-browser/
```

### Permission justifications
Already written in `STORE_LISTING.md` — copy/paste from there.

## Screenshot generator

```
node scripts/screenshots.mjs
```

Generates the full asset set in `screenshots/`:
- `promo-440x280.png` (small promo tile)
- `marquee-1400x560.png` (large marquee tile)
- `screenshot-1-popup-he-1280x800.png` through `screenshot-5-blocked-focus-he-1280x800.png`

The script mocks `chrome.storage`, `chrome.runtime.sendMessage`, etc. so the surfaces render with realistic data outside the extension context. **Important**: it uses Playwright with `deviceScaleFactor: 1` so screenshots come out at exactly 1280×800 (the store rejects 2× Retina captures).

If a surface renders empty during screenshot generation, almost always one of:
1. `passwordHash` set in mock → triggers lock overlay → blocks rendering. Use `passwordHash: ""` in `sampleSettings()`.
2. Mock chrome API doesn't return a Promise when called Promise-style. The mock supports both forms — verify if you change it.
3. Wait time too short. Async loads need ~800ms, dynamic clicks (tab switch) need additional ~400ms.

## Local install / testing

1. Open `chrome://extensions`.
2. Toggle **Developer mode** on.
3. Click **Load unpacked** → select the cloned repo's root folder.
4. After every code change: click the reload button on the Kosher Browser card in `chrome://extensions`.

## Common pitfalls

- **DNR rule-ID conflicts.** If you add a new rule range, make sure its IDs don't overlap any existing range and bump `RULE_IDS`. The full rebuild is serialized and idempotent, but per-rule additions outside `replaceAllRules` will fight with each other.
- **`chrome.storage.session` requires Chrome 102+.** The manifest pins to 111 for OKLCH; don't lower it without retesting.
- **`chrome.storage.local.get` is async.** Use the Promise form (`await chrome.storage.local.get(key)`) — that's what most of the code does. Don't use the callback form mixed with `await`.
- **`<title>` cannot be set via the generic data-i18n loop in some agents** because Playwright/headless DOM treats it specially. options.js and blocked.js handle it explicitly via `document.title = t("page_title")`.
- **HTML must keep Hebrew default text.** First paint before JS loads is what users see during the brief language hydration; if HTML has English placeholders, Hebrew users see a flash.
- **Don't add `webNavigation` or `tabs` permissions back.** They were removed for a reason — block-event counting goes through `BLOCK_OCCURRED` message instead.

## When deploying changes

1. Run any local tests by reloading the unpacked extension.
2. Bump `manifest.json` version.
3. Commit + push to `main`.
4. Build a new zip with the matching version number.
5. Open the Web Store dashboard, drop the zip into the Package tab.
6. If a previous version is in review, you may need to cancel that submission first.
7. Click שמירת טיוטה (Save draft) → שליחה לבדיקה (Submit for review).
