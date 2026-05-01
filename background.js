// Kosher Browser — background service worker
// Manages blocking rules, schedules, focus timer, stats, and password lock.

const DEFAULTS = {
  enabled: true,
  language: "he",
  customBlocklist: [],
  whitelistMode: false,
  whitelist: [],
  categories: {
    adult: false,
    social: false,
    video: false,
    news: false,
    shopping: false,
    gambling: false
  },
  schedule: {
    enabled: false,
    // Each entry: { days: [0..6], start: "HH:MM", end: "HH:MM" }
    blocks: []
  },
  focus: {
    active: false,
    endsAt: 0,
    label: ""
  },
  safeSearch: true,
  passwordHash: "",
  strictMode: false,
  stats: { blocksToday: 0, blocksTotal: 0, lastDay: "" },
  customMessage: ""
};

// Preset category lists. These are starting points; users can add more in Options.
const CATEGORY_LISTS = {
  social: [
    "facebook.com", "instagram.com", "twitter.com", "x.com", "tiktok.com",
    "snapchat.com", "reddit.com", "pinterest.com", "linkedin.com", "threads.net"
  ],
  video: [
    "youtube.com", "youtu.be", "twitch.tv", "netflix.com", "hulu.com",
    "vimeo.com", "dailymotion.com", "tiktok.com"
  ],
  news: [
    "cnn.com", "foxnews.com", "nytimes.com", "bbc.com", "bbc.co.uk",
    "ynet.co.il", "walla.co.il", "haaretz.co.il"
  ],
  shopping: [
    "amazon.com", "ebay.com", "aliexpress.com", "etsy.com", "wish.com"
  ],
  gambling: [
    "bet365.com", "pokerstars.com", "draftkings.com", "fanduel.com"
  ],
  // A small starter adult list. Real-world filtering needs continually-updated lists.
  adult: [
    "pornhub.com", "xvideos.com", "xnxx.com", "redtube.com", "youporn.com",
    "xhamster.com", "onlyfans.com"
  ]
};

// Rule ID ranges (declarativeNetRequest dynamic rules)
const RULE_IDS = {
  CUSTOM_START: 1,
  CUSTOM_END: 1000,
  CATEGORY_START: 1001,
  CATEGORY_END: 2000,
  SCHEDULE_START: 2001,
  SCHEDULE_END: 3000,
  FOCUS_START: 3001,
  FOCUS_END: 3500,
  WHITELIST_START: 5001,
  WHITELIST_END: 6000,
  SAFESEARCH_START: 9001,
  SAFESEARCH_END: 9100
};

// ---------- Lifecycle ----------

chrome.runtime.onInstalled.addListener(async () => {
  const data = await chrome.storage.local.get(null);
  const merged = { ...DEFAULTS, ...data };
  await chrome.storage.local.set(merged);
  await rebuildAllRules();
  setupAlarms();
});

chrome.runtime.onStartup.addListener(async () => {
  await rebuildAllRules();
  setupAlarms();
});

// ---------- Alarms ----------

function setupAlarms() {
  chrome.alarms.create("scheduleTick", { periodInMinutes: 1 });
  chrome.alarms.create("dailyReset", { periodInMinutes: 30 });
}

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === "scheduleTick") {
    await applyScheduleAndFocus();
  } else if (alarm.name === "dailyReset") {
    await maybeResetDailyStats();
  } else if (alarm.name === "focusEnd") {
    await endFocus();
  }
});

// ---------- Storage helpers ----------

async function getSettings() {
  const data = await chrome.storage.local.get(null);
  return { ...DEFAULTS, ...data };
}

async function setSettings(patch) {
  await chrome.storage.local.set(patch);
}

// ---------- Rule building ----------

function domainToUrlFilter(domain) {
  // Strip protocol + path
  const clean = domain.trim().toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
  if (!clean) return null;
  return `||${clean}^`;
}

function buildBlockRule(id, domain, redirectUrl) {
  const filter = domainToUrlFilter(domain);
  if (!filter) return null;
  return {
    id,
    priority: 1,
    action: {
      type: "redirect",
      redirect: { url: redirectUrl }
    },
    condition: {
      urlFilter: filter,
      resourceTypes: ["main_frame"]
    }
  };
}

function buildAllowRule(id, domain) {
  const filter = domainToUrlFilter(domain);
  if (!filter) return null;
  return {
    id,
    priority: 100,
    action: { type: "allow" },
    condition: {
      urlFilter: filter,
      resourceTypes: ["main_frame"]
    }
  };
}

function blockedPageUrl(reason) {
  const url = chrome.runtime.getURL("blocked/blocked.html");
  return `${url}?reason=${encodeURIComponent(reason)}`;
}

// Serialize rebuilds so concurrent triggers (onInstalled + storage.onChanged,
// alarm tick + UPDATE_SETTINGS, etc.) cannot race and try to add the same
// rule IDs twice.
let rebuildQueue = Promise.resolve();
function rebuildAllRules() {
  rebuildQueue = rebuildQueue.then(doRebuildAllRules).catch((e) => {
    console.error("rebuildAllRules failed:", e);
  });
  return rebuildQueue;
}

async function doRebuildAllRules() {
  const s = await getSettings();
  const newRules = [];
  let id;

  // SafeSearch is independent of the enabled flag — keep enforcing even when
  // the rest of blocking is paused.
  const safeSearchRules = s.safeSearch ? buildSafeSearchRules() : [];

  if (!s.enabled && !s.focus.active) {
    await replaceAllRules(safeSearchRules);
    return;
  }

  // Whitelist mode: block everything except whitelisted domains.
  if (s.whitelistMode && s.enabled) {
    // Allow rules for whitelisted domains
    id = RULE_IDS.WHITELIST_START;
    for (const d of s.whitelist) {
      const r = buildAllowRule(id++, d);
      if (r) newRules.push(r);
      if (id > RULE_IDS.WHITELIST_END) break;
    }
    // Allow rule for the extension's own pages
    newRules.push({
      id: RULE_IDS.WHITELIST_END,
      priority: 100,
      action: { type: "allow" },
      condition: {
        urlFilter: "|chrome-extension://",
        resourceTypes: ["main_frame"]
      }
    });
    // Catch-all block rule
    newRules.push({
      id: RULE_IDS.CUSTOM_START,
      priority: 1,
      action: {
        type: "redirect",
        redirect: { url: blockedPageUrl("whitelist") }
      },
      condition: {
        urlFilter: "*",
        resourceTypes: ["main_frame"]
      }
    });
  } else {
    // Custom blocklist
    if (s.enabled) {
      id = RULE_IDS.CUSTOM_START;
      for (const d of s.customBlocklist) {
        const r = buildBlockRule(id++, d, blockedPageUrl("custom"));
        if (r) newRules.push(r);
        if (id > RULE_IDS.CUSTOM_END) break;
      }

      // Categories
      id = RULE_IDS.CATEGORY_START;
      for (const [cat, on] of Object.entries(s.categories)) {
        if (!on) continue;
        const list = CATEGORY_LISTS[cat] || [];
        for (const d of list) {
          const r = buildBlockRule(id++, d, blockedPageUrl(`category:${cat}`));
          if (r) newRules.push(r);
          if (id > RULE_IDS.CATEGORY_END) break;
        }
      }
    }

    // Schedule (only the currently-active block window adds rules)
    if (s.enabled && s.schedule.enabled && isScheduleActive(s.schedule)) {
      id = RULE_IDS.SCHEDULE_START;
      // Schedule blocks the same domains as categories+custom by enforcing them;
      // for simplicity, schedule activates ALL category lists during its window.
      const all = new Set([
        ...s.customBlocklist,
        ...Object.values(CATEGORY_LISTS).flat()
      ]);
      for (const d of all) {
        const r = buildBlockRule(id++, d, blockedPageUrl("schedule"));
        if (r) newRules.push(r);
        if (id > RULE_IDS.SCHEDULE_END) break;
      }
    }

    // Focus timer (active = block everything that's distracting + custom + categories)
    if (s.focus.active && s.focus.endsAt > Date.now()) {
      id = RULE_IDS.FOCUS_START;
      const all = new Set([
        ...s.customBlocklist,
        ...CATEGORY_LISTS.social,
        ...CATEGORY_LISTS.video,
        ...CATEGORY_LISTS.news,
        ...CATEGORY_LISTS.shopping,
        ...CATEGORY_LISTS.adult,
        ...CATEGORY_LISTS.gambling
      ]);
      for (const d of all) {
        const r = buildBlockRule(id++, d, blockedPageUrl("focus"));
        if (r) newRules.push(r);
        if (id > RULE_IDS.FOCUS_END) break;
      }
    }
  }

  newRules.push(...safeSearchRules);

  await replaceAllRules(newRules);
}

function buildSafeSearchRules() {
  return [
    {
      id: RULE_IDS.SAFESEARCH_START,
      priority: 2,
      action: {
        type: "redirect",
        redirect: {
          transform: {
            queryTransform: {
              addOrReplaceParams: [{ key: "safe", value: "active" }]
            }
          }
        }
      },
      condition: {
        urlFilter: "||google.com/search",
        resourceTypes: ["main_frame"]
      }
    },
    {
      id: RULE_IDS.SAFESEARCH_START + 1,
      priority: 2,
      action: {
        type: "redirect",
        redirect: {
          transform: {
            queryTransform: {
              addOrReplaceParams: [{ key: "adlt", value: "strict" }]
            }
          }
        }
      },
      condition: {
        urlFilter: "||bing.com/search",
        resourceTypes: ["main_frame"]
      }
    },
    {
      id: RULE_IDS.SAFESEARCH_START + 2,
      priority: 2,
      action: {
        type: "redirect",
        redirect: {
          transform: {
            queryTransform: {
              addOrReplaceParams: [{ key: "kp", value: "-2" }]
            }
          }
        }
      },
      condition: {
        urlFilter: "||duckduckgo.com/",
        resourceTypes: ["main_frame"]
      }
    }
  ];
}

async function replaceAllRules(newRules) {
  const existing = await chrome.declarativeNetRequest.getDynamicRules();
  // Remove every existing rule plus every id we're about to add — the latter
  // makes the operation idempotent if a previous batch partially applied.
  const removeRuleIds = [...new Set([
    ...existing.map((r) => r.id),
    ...newRules.map((r) => r.id)
  ])];
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds,
    addRules: newRules
  });
}

// ---------- Schedule logic ----------

function isScheduleActive(schedule) {
  if (!schedule || !schedule.blocks || !schedule.blocks.length) return false;
  const now = new Date();
  const day = now.getDay(); // 0=Sun..6=Sat
  const minutes = now.getHours() * 60 + now.getMinutes();
  for (const block of schedule.blocks) {
    if (!block.days || !block.days.includes(day)) continue;
    const start = parseTime(block.start);
    const end = parseTime(block.end);
    if (start === null || end === null) continue;
    if (start <= end) {
      if (minutes >= start && minutes < end) return true;
    } else {
      // Wraps past midnight
      if (minutes >= start || minutes < end) return true;
    }
  }
  return false;
}

function parseTime(hhmm) {
  if (!hhmm || typeof hhmm !== "string") return null;
  const [h, m] = hhmm.split(":").map(Number);
  if (isNaN(h) || isNaN(m)) return null;
  return h * 60 + m;
}

async function applyScheduleAndFocus() {
  const s = await getSettings();
  // End focus if expired
  if (s.focus.active && s.focus.endsAt <= Date.now()) {
    await endFocus();
    return;
  }
  await rebuildAllRules();
}

// ---------- Focus timer ----------

async function startFocus(minutes, label) {
  const endsAt = Date.now() + minutes * 60 * 1000;
  await setSettings({ focus: { active: true, endsAt, label: label || "Focus" } });
  chrome.alarms.create("focusEnd", { when: endsAt });
  await rebuildAllRules();
}

async function endFocus() {
  await setSettings({ focus: { active: false, endsAt: 0, label: "" } });
  chrome.alarms.clear("focusEnd");
  await rebuildAllRules();
}

// ---------- Stats ----------

function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

async function maybeResetDailyStats() {
  const s = await getSettings();
  const today = todayKey();
  if (s.stats.lastDay !== today) {
    await setSettings({
      stats: { blocksToday: 0, blocksTotal: s.stats.blocksTotal, lastDay: today }
    });
  }
}

async function incrementBlock() {
  await maybeResetDailyStats();
  const s = await getSettings();
  await setSettings({
    stats: {
      blocksToday: s.stats.blocksToday + 1,
      blocksTotal: s.stats.blocksTotal + 1,
      lastDay: todayKey()
    }
  });
}

// Block events are reported by the blocked page itself via a runtime message.

// ---------- Password ----------

async function sha256(text) {
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyPassword(plain) {
  const s = await getSettings();
  if (!s.passwordHash) return true; // no password set
  const hash = await sha256(plain);
  return hash === s.passwordHash;
}

// ---------- Unlock session ----------
// When a password is set, settings changes require either an active unlock
// session (started by the options page) OR the password supplied with the
// request (used by popup quick toggles).

const UNLOCK_DURATION_MS = 5 * 60 * 1000;

async function getUnlockedUntil() {
  const r = await chrome.storage.session.get("unlockedUntil");
  return r.unlockedUntil || 0;
}

async function setUnlockedUntil(ms) {
  await chrome.storage.session.set({ unlockedUntil: ms });
}

async function isUnlocked() {
  const s = await getSettings();
  if (!s.passwordHash) return true;
  return (await getUnlockedUntil()) > Date.now();
}

async function refreshUnlock() {
  await setUnlockedUntil(Date.now() + UNLOCK_DURATION_MS);
}

// ---------- Storage change → rebuild rules ----------

chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area !== "local") return;
  const triggers = ["enabled", "customBlocklist", "categories", "whitelist",
    "whitelistMode", "schedule", "safeSearch", "focus"];
  if (Object.keys(changes).some((k) => triggers.includes(k))) {
    await rebuildAllRules();
  }
});

// ---------- Message handler (popup / options / content / blocked page) ----------

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
  (async () => {
    try {
      switch (msg.type) {
        case "GET_SETTINGS": {
          sendResponse({ ok: true, settings: await getSettings() });
          break;
        }
        case "UPDATE_SETTINGS": {
          const s = await getSettings();
          const patch = msg.patch && typeof msg.patch === "object" ? msg.patch : {};

          // Reject patches that would weaken protection through the wrong door.
          // Password changes must go through SET_PASSWORD (which re-verifies the
          // old password). And while strict mode is on, blocking-related kill
          // switches and strict mode itself cannot be turned off.
          if ("passwordHash" in patch) {
            sendResponse({ ok: false, error: "use_set_password" });
            return;
          }
          if (s.strictMode && (patch.strictMode === false || patch.enabled === false)) {
            sendResponse({ ok: false, error: "strict_mode" });
            return;
          }

          if (s.passwordHash) {
            if (msg.forcePassword) {
              // Caller (popup) demands fresh per-action authentication.
              // The unlock session is ignored and NOT refreshed by this path.
              if (typeof msg.password !== "string" || !msg.password) {
                sendResponse({ ok: false, error: "no_password" });
                return;
              }
              const ok = await verifyPassword(msg.password);
              if (!ok) {
                sendResponse({ ok: false, error: "wrong_password" });
                return;
              }
            } else {
              // Standard flow: accept active unlock session or password in the request.
              const unlocked = (await getUnlockedUntil()) > Date.now();
              if (!unlocked) {
                if (typeof msg.password !== "string" || !msg.password) {
                  sendResponse({ ok: false, error: "locked" });
                  return;
                }
                const ok = await verifyPassword(msg.password);
                if (!ok) {
                  sendResponse({ ok: false, error: "wrong_password" });
                  return;
                }
                await refreshUnlock();
              } else {
                await refreshUnlock();
              }
            }
          }
          await setSettings(patch);
          sendResponse({ ok: true });
          break;
        }
        case "GET_LOCK_STATE": {
          const s = await getSettings();
          sendResponse({
            ok: true,
            hasPassword: !!s.passwordHash,
            unlocked: await isUnlocked()
          });
          break;
        }
        case "UNLOCK": {
          const ok = await verifyPassword(msg.password || "");
          if (!ok) { sendResponse({ ok: false, error: "wrong_password" }); return; }
          await refreshUnlock();
          sendResponse({ ok: true });
          break;
        }
        case "LOCK": {
          await setUnlockedUntil(0);
          sendResponse({ ok: true });
          break;
        }
        case "SET_PASSWORD": {
          // Require existing password (if any) to change.
          const s = await getSettings();
          if (s.passwordHash) {
            const ok = await verifyPassword(msg.oldPassword || "");
            if (!ok) { sendResponse({ ok: false, error: "wrong_password" }); return; }
          }
          const newHash = msg.newPassword ? await sha256(msg.newPassword) : "";
          await setSettings({ passwordHash: newHash });
          sendResponse({ ok: true });
          break;
        }
        case "VERIFY_PASSWORD": {
          const ok = await verifyPassword(msg.password || "");
          sendResponse({ ok });
          break;
        }
        case "START_FOCUS": {
          await startFocus(msg.minutes || 25, msg.label || "Focus");
          sendResponse({ ok: true });
          break;
        }
        case "END_FOCUS": {
          const s = await getSettings();
          if (s.passwordHash) {
            const ok = await verifyPassword(msg.password || "");
            if (!ok) { sendResponse({ ok: false, error: "wrong_password" }); return; }
          }
          if (s.strictMode) {
            sendResponse({ ok: false, error: "strict_mode" });
            return;
          }
          await endFocus();
          sendResponse({ ok: true });
          break;
        }
        case "GET_CATEGORY_LISTS": {
          sendResponse({ ok: true, lists: CATEGORY_LISTS });
          break;
        }
        case "REBUILD_RULES": {
          await rebuildAllRules();
          sendResponse({ ok: true });
          break;
        }
        case "BLOCK_OCCURRED": {
          await incrementBlock();
          sendResponse({ ok: true });
          break;
        }
        default:
          sendResponse({ ok: false, error: "unknown_message" });
      }
    } catch (err) {
      sendResponse({ ok: false, error: String(err && err.message || err) });
    }
  })();
  return true; // async
});
