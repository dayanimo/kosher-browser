# Kosher Browser — Chrome extension

A Chrome extension that blocks distracting and inappropriate sites with schedules, a focus timer, password protection, and SafeSearch enforcement. Inspired by services like Rimon.

## Features

- **Custom blocklist** — add any domain to block.
- **Category presets** — toggle Social media, Video, News, Shopping, Adult content, and Gambling lists with one click.
- **Schedule** — block during specific days and time windows (e.g., work hours, late evenings).
- **Focus timer** — block all distracting categories for 15m / 25m / 45m / 1h / 2h or any custom duration.
- **Whitelist mode** — block the entire web except sites you explicitly allow.
- **Password lock** — require a password to change settings, end focus early, or disable the extension.
- **Strict mode** — prevent disabling the extension or ending focus before the timer ends.
- **SafeSearch enforcement** — auto-applies SafeSearch on Google, Bing, and DuckDuckGo.
- **Custom block page** with a configurable message.
- **Stats** — count blocks today and total.

## Install (developer mode)

1. Open `chrome://extensions` in Chrome (or any Chromium browser: Edge, Brave, Arc).
2. Toggle **Developer mode** on (top right).
3. Click **Load unpacked**.
4. Select this folder: `kosher-browser`.
5. Pin the extension from the puzzle-piece icon for quick access.

## Use

- Click the extension icon to open the **popup**: master toggle, focus timer, quick category toggles, and stats.
- Click **Settings & blocklist** to open the full **options** page.

### Recommended setup

1. Open Settings → **Categories** and enable the categories you want blocked (e.g., Adult content, Social media).
2. Open **Blocklist** and add any extra sites unique to you.
3. Open **Schedule** and add a window like `Mon–Fri, 09:00–18:00` to enforce focus during work hours.
4. Open **Security**, set a password, and turn on **Strict mode** if you want it to be hard to bypass.

## Notes & limitations

- Blocking is implemented via Chrome's `declarativeNetRequest` API. It blocks page (main_frame) navigations — not embedded resources. This is the standard approach for site blockers in Manifest V3.
- The adult-content list shipped is a small starter list. Real-world content filtering needs a continually-updated list; consider supplementing with DNS-level filtering (e.g., your router's DNS, NextDNS, CleanBrowsing) or a service like Rimon for stronger enforcement.
- Strict mode does **not** prevent removal from `chrome://extensions` — Chrome itself owns that page. For absolute enforcement use a managed Chrome policy or an OS-level tool.

## File map

```
kosher-browser/
├── manifest.json          # MV3 manifest
├── background.js          # Service worker — rules, schedule, focus, stats
├── popup/                 # Toolbar popup UI
├── options/               # Full settings page
├── blocked/               # Block page shown when a site is blocked
├── icons/                 # Toolbar/store icons (16/32/48/128)
└── docs/                  # Privacy policy hosted via GitHub Pages
```

## Publishing

See [`STORE_LISTING.md`](STORE_LISTING.md) for the copy/paste-ready Chrome Web Store listing text, permission justifications, and packaging command.
