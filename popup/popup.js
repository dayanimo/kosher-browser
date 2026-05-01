const $ = (id) => document.getElementById(id);

const STRINGS = {
  he: {
    brand_name: "דפדפן כשר",
    status_active: "פעיל",
    status_disabled: "מושבת",
    status_focus: "מצב פוקוס",
    status_whitelist_suffix: " · רשימת היתר",
    focus_default_label: "פוקוס",
    blocked_today: "נחסמו היום",
    all_time: "סך הכל",
    focus_session: "מפגש פוקוס",
    no_distractions: "ללא הסחות",
    min_unit: "דק׳",
    hr_unit: "שע׳",
    custom_placeholder: "מותאם",
    start: "התחל",
    password_if_set_placeholder: "סיסמה (אם הוגדרה)",
    end_early: "סיים מוקדם",
    filters: "סינון",
    tap_to_toggle: "הקש להחלפה",
    cat_social: "רשתות חברתיות",
    cat_social_meta: "פיד וציר זמן",
    cat_video: "וידאו",
    cat_video_meta: "יוטיוב וסטרימינג",
    cat_news: "חדשות",
    cat_news_meta: "כותרות ופרשנות",
    cat_shopping: "קניות",
    cat_shopping_meta: "חנויות ומבצעים",
    cat_adult: "תוכן למבוגרים",
    cat_adult_meta: "תכנים מפורשים",
    cat_gambling: "הימורים",
    cat_gambling_meta: "הימורים וקזינו",
    safesearch_enforced: "חיפוש בטוח מאולץ",
    safesearch_engines: "גוגל, בינג, דאקדאקגו",
    open_options_label: "הגדרות ורשימת חסימה",
    metrics_aria: "סטטיסטיקת חסימה",
    presets_aria: "משכים מוגדרים מראש",
    paused_suffix: " · מושהה",
    alert_wrong_password: "סיסמה שגויה.",
    alert_save_failed: "לא ניתן לשמור את השינויים.",
    prompt_password_for_settings: "הזן סיסמה לשינוי ההגדרות:",
    alert_strict_focus_end: "מצב מחמיר פעיל — לא ניתן לסיים את הפוקוס מוקדם.",
    alert_end_focus_failed: "לא ניתן לסיים את הפוקוס.",
    pw_modal_title: "סיסמה נדרשת",
    pw_modal_lede: "הזן סיסמה כדי לשנות הגדרה זו.",
    pw_modal_cancel: "ביטול",
    pw_modal_submit: "אישור",
    pw_modal_wrong: "סיסמה שגויה. נסה שוב.",
    pw_modal_empty: "אנא הזן סיסמה."
  },
  en: {
    brand_name: "Kosher Browser",
    status_active: "Active",
    status_disabled: "Disabled",
    status_focus: "Focus mode",
    status_whitelist_suffix: " · Whitelist",
    focus_default_label: "Focus",
    blocked_today: "Blocked today",
    all_time: "All time",
    focus_session: "Focus session",
    no_distractions: "No distractions",
    min_unit: "min",
    hr_unit: "hr",
    custom_placeholder: "Custom",
    start: "Start",
    password_if_set_placeholder: "Password (if set)",
    end_early: "End early",
    filters: "Filters",
    tap_to_toggle: "Tap to toggle",
    cat_social: "Social networks",
    cat_social_meta: "Feeds and timelines",
    cat_video: "Video",
    cat_video_meta: "YouTube and streaming",
    cat_news: "News",
    cat_news_meta: "Headlines and commentary",
    cat_shopping: "Shopping",
    cat_shopping_meta: "Stores and deals",
    cat_adult: "Adult content",
    cat_adult_meta: "Explicit material",
    cat_gambling: "Gambling",
    cat_gambling_meta: "Betting and casinos",
    safesearch_enforced: "SafeSearch enforced",
    safesearch_engines: "Google, Bing, DuckDuckGo",
    open_options_label: "Settings and block list",
    metrics_aria: "Blocking statistics",
    presets_aria: "Preset durations",
    paused_suffix: " · Paused",
    alert_wrong_password: "Wrong password.",
    alert_save_failed: "Could not save changes.",
    prompt_password_for_settings: "Enter password to change settings:",
    alert_strict_focus_end: "Strict mode is active — cannot end focus early.",
    alert_end_focus_failed: "Could not end focus.",
    pw_modal_title: "Password required",
    pw_modal_lede: "Enter your password to change this setting.",
    pw_modal_cancel: "Cancel",
    pw_modal_submit: "Confirm",
    pw_modal_wrong: "Wrong password. Try again.",
    pw_modal_empty: "Please enter your password."
  }
};

let currentLang = "he";

function t(key) {
  return (STRINGS[currentLang] && STRINGS[currentLang][key]) ?? STRINGS.en[key] ?? key;
}

function applyI18n() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "he" ? "rtl" : "ltr";

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    node.setAttribute("placeholder", t(node.dataset.i18nPlaceholder));
  });
  document.querySelectorAll("[data-i18n-title]").forEach((node) => {
    node.setAttribute("title", t(node.dataset.i18nTitle));
  });
  document.querySelectorAll("[data-i18n-aria]").forEach((node) => {
    node.setAttribute("aria-label", t(node.dataset.i18nAria));
  });

  // Re-render dynamic strings (status text, focus label, etc.) in the new language.
  load();
}

function send(msg) {
  return new Promise((resolve) => chrome.runtime.sendMessage(msg, resolve));
}

let countdownTimer = null;

async function load() {
  const res = await send({ type: "GET_SETTINGS" });
  if (!res || !res.ok) return;
  const s = res.settings;

  document.body.classList.toggle("is-paused", !s.enabled);
  $("blocksToday").textContent = s.stats.blocksToday;
  $("blocksTotal").textContent = s.stats.blocksTotal;

  $("catSocial").checked = !!s.categories.social;
  $("catVideo").checked = !!s.categories.video;
  $("catNews").checked = !!s.categories.news;
  $("catShopping").checked = !!s.categories.shopping;
  $("catAdult").checked = !!s.categories.adult;
  $("catGambling").checked = !!s.categories.gambling;
  $("safeSearchToggle").checked = !!s.safeSearch;

  // Status text
  let status = s.enabled ? t("status_active") : t("status_disabled");
  if (s.focus.active && s.focus.endsAt > Date.now()) status = t("status_focus");
  if (s.whitelistMode) status += t("status_whitelist_suffix");
  $("statusText").textContent = status;

  // Focus UI
  if (s.focus.active && s.focus.endsAt > Date.now()) {
    $("focusInactive").hidden = true;
    $("focusActive").hidden = false;
    $("focusLabel").textContent = s.focus.label || t("focus_default_label");
    startCountdown(s.focus.endsAt);
  } else {
    $("focusInactive").hidden = false;
    $("focusActive").hidden = true;
    stopCountdown();
  }
}

function startCountdown(endsAt) {
  stopCountdown();
  const tick = () => {
    const ms = endsAt - Date.now();
    if (ms <= 0) {
      $("focusCountdown").textContent = "00:00";
      stopCountdown();
      load();
      return;
    }
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const display = m >= 60
      ? `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    $("focusCountdown").textContent = display;
  };
  tick();
  countdownTimer = setInterval(tick, 1000);
}

function stopCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer);
    countdownTimer = null;
  }
}

function requestPassword(initialError) {
  return new Promise((resolve) => {
    const modal = $("pwModal");
    const input = $("pwModalInput");
    const status = $("pwModalStatus");
    const submit = $("pwModalSubmit");
    const cancel = $("pwModalCancel");

    input.value = "";
    status.textContent = initialError || "";
    modal.hidden = false;
    setTimeout(() => input.focus(), 30);

    let settled = false;
    const cleanup = () => {
      submit.removeEventListener("click", onSubmit);
      cancel.removeEventListener("click", onCancel);
      input.removeEventListener("keydown", onKeydown);
      modal.hidden = true;
    };
    const onSubmit = () => {
      if (settled) return;
      const pw = input.value;
      if (!pw) {
        status.textContent = t("pw_modal_empty");
        return;
      }
      settled = true;
      cleanup();
      resolve(pw);
    };
    const onCancel = () => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(null);
    };
    const onKeydown = (e) => {
      if (e.key === "Enter") { e.preventDefault(); onSubmit(); }
      else if (e.key === "Escape") { e.preventDefault(); onCancel(); }
    };
    submit.addEventListener("click", onSubmit);
    cancel.addEventListener("click", onCancel);
    input.addEventListener("keydown", onKeydown);
  });
}

async function patchSettings(patch) {
  const lockState = await send({ type: "GET_LOCK_STATE" });

  // No password set — apply directly.
  if (!lockState || !lockState.hasPassword) {
    const res = await send({ type: "UPDATE_SETTINGS", patch });
    if (!res.ok && res.error !== "locked") alert(t("alert_save_failed"));
    await load();
    return res.ok;
  }

  // Password is set — ALWAYS demand fresh per-action authentication for
  // popup-originated changes. The unlock session is intentionally bypassed.
  let errorMsg = "";
  while (true) {
    const password = await requestPassword(errorMsg);
    if (password === null) {
      await load();
      return false;
    }
    const res = await send({
      type: "UPDATE_SETTINGS",
      patch,
      password,
      forcePassword: true
    });
    if (res.ok) {
      await load();
      return true;
    }
    if (res.error === "wrong_password" || res.error === "no_password") {
      errorMsg = t("pw_modal_wrong");
      continue;
    }
    alert(t("alert_save_failed"));
    await load();
    return false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("language", (data) => {
    if (data && (data.language === "he" || data.language === "en")) {
      currentLang = data.language;
    }
    applyI18n();
  });

  $("safeSearchToggle").addEventListener("change", async (e) => {
    await patchSettings({ safeSearch: e.target.checked });
  });

  const catMap = {
    catSocial: "social",
    catVideo: "video",
    catNews: "news",
    catShopping: "shopping",
    catAdult: "adult",
    catGambling: "gambling"
  };

  for (const [id, key] of Object.entries(catMap)) {
    $(id).addEventListener("change", async (e) => {
      const res = await send({ type: "GET_SETTINGS" });
      const cats = { ...res.settings.categories, [key]: e.target.checked };
      await patchSettings({ categories: cats });
    });
  }

  document.querySelectorAll(".preset").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const min = parseInt(btn.dataset.min, 10);
      await send({ type: "START_FOCUS", minutes: min });
      load();
    });
  });

  $("startFocus").addEventListener("click", async () => {
    const min = parseInt($("customMin").value, 10);
    if (!min || min < 1) return;
    await send({ type: "START_FOCUS", minutes: min });
    load();
  });

  $("endFocus").addEventListener("click", async () => {
    const password = $("endPassword").value;
    const res = await send({ type: "END_FOCUS", password });
    if (!res.ok) {
      if (res.error === "wrong_password") alert(t("alert_wrong_password"));
      else if (res.error === "strict_mode") alert(t("alert_strict_focus_end"));
      else alert(t("alert_end_focus_failed"));
      return;
    }
    load();
  });

  $("openOptions").addEventListener("click", () => {
    chrome.runtime.openOptionsPage();
  });
});

if (chrome.storage && chrome.storage.onChanged) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (changes.language) {
      const next = changes.language.newValue;
      if (next === "he" || next === "en") {
        currentLang = next;
        applyI18n();
      }
    }
  });
}

window.addEventListener("unload", stopCountdown);
