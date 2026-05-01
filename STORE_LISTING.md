# Chrome Web Store listing — copy/paste

## Item name
Kosher Browser

## Summary (132 chars max)
Block distracting or inappropriate sites with schedules, a focus timer, password lock, and SafeSearch enforcement.

## Detailed description
Kosher Browser turns your browser into a focused, intentional space. Decide what you don't want to see — then it stays out of the way.

Features
• Custom blocklist — block any domain you choose.
• Category presets — Social media, Video, News, Shopping, Adult content, Gambling. One toggle each.
• Focus timer — block all distracting categories for 15 / 25 / 45 / 60 / 120 minutes or any custom duration.
• Schedule — block during specific days and time windows (work hours, evenings, etc.).
• Whitelist mode — block the entire web except sites you explicitly allow.
• Password lock — require a password to change settings, end focus early, or remove the protection.
• Strict mode — prevent disabling the extension or ending focus before the timer ends.
• SafeSearch enforced on Google, Bing, and DuckDuckGo.
• Custom block page with your own message.
• Hebrew and English interface (RTL/LTR), switchable in Settings.
• Privacy: nothing leaves your computer. No accounts, no analytics, no servers.

Inspired by the spirit of services like Rimon — a calmer, cleaner browser, built around your own boundaries.

## Category
Productivity

## Language(s)
English, Hebrew

---

## Single Purpose Description
Kosher Browser has a single purpose: helping the user block specific websites and categories of websites that they don't want to visit, with schedules, a focus timer, and password protection to make those rules harder to bypass.

## Permissions justifications

**`<all_urls>` (host_permissions)** — required to redirect blocked sites on any domain to the extension's internal block page. The extension does not read page contents, modify pages, or inject scripts into web pages. It only redirects top-level navigations to specific domains in the user's blocklist.

**`storage`** — to persist the user's blocklist, settings, and password hash on their own device. Nothing is transmitted.

**`alarms`** — to evaluate schedule windows once a minute and to end focus timers exactly when they expire. Without this, schedules and timers would not trigger reliably.

**`declarativeNetRequest`** — required to declare blocking rules that Chrome enforces in the network layer.

**`declarativeNetRequestWithHostAccess`** — required because the rules use the `redirect` action (sending the user to the in-extension block page) and the `addOrReplaceParams` query transform (for SafeSearch enforcement). Both action types require host access.

## Remote code use
This extension does NOT execute remote code. All scripts are bundled in the package.

## Privacy policy URL
You need to publish PRIVACY.md publicly and paste its URL here. Easiest option: create a GitHub repo, enable GitHub Pages, and use the resulting URL. The file is included in this folder.

## Account / data handling disclosure
- Personally identifiable information: NO
- Health information: NO
- Financial information: NO
- Authentication information: NO (the password is hashed locally and never transmitted)
- Personal communications: NO
- Location: NO
- Web history: NO (block events are counted, but URLs are never stored)
- User activity: NO
- Website content: NO

I certify that:
- I do not sell or transfer user data to third parties.
- I do not use or transfer user data for purposes unrelated to my item's single purpose.
- I do not use or transfer user data to determine creditworthiness or for lending purposes.

---

## Recommended screenshots (1280×800 PNG)

Take these inside Chrome with the extension installed:

1. **Popup** — open the toolbar popup with a focus session active or with several category filters toggled on. Show off the bilingual UI by capturing both Hebrew and English versions.
2. **Options — Categories tab** — show the category cards.
3. **Options — Schedule tab** — show one or two configured schedule windows.
4. **Blocked page** — visit a blocked site so the calming "take a breath" page appears.
5. **Options — Security tab** — show password protection set and strict mode on.

5 screenshots is the typical max worth uploading; minimum is 1.

## Promo tile (optional but recommended) — 440×280 PNG
Use the icon at large size on a dark indigo→teal gradient with the brand name "Kosher Browser" / "דפדפן כשר".

---

## Build the upload ZIP

From this folder:

```
cd <repo root>
zip -r ../kosher-browser-1.0.0.zip . -x "*.DS_Store" "*.git*" "README.md" "STORE_LISTING.md" "PRIVACY.md" "icons/icon.svg"
```

The result is `kosher-browser-1.0.0.zip` next to the project folder. Upload that file in the Web Store dashboard ("New item" → drop the ZIP).

## After approval

Updates: bump `version` in `manifest.json`, rebuild the ZIP with the same command, upload as a new package.
