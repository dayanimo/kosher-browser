const STRINGS = {
  he: {
    page_title: "רגע של הפסקה",
    brand_name: "דפדפן כשר",
    eyebrow: "גבול שהצבת",
    headline: "קח נשימה.",
    focus_label: "מפגש פוקוס בעיצומו",
    focus_foot: "תחזור לכאן כשהוא יסתיים. אין מה לעשות.",
    time_remaining_aria: "זמן שנותר",
    btn_return: "חזרה למקום שממנו הגעתי",
    btn_settings: "התאם הגדרות",
    legend_text: "מגן על הזמן שהקדשת לעצמך",
    reason_focus: "אתה באמצע מפגש פוקוס שהתחלת קודם.",
    reason_schedule: "האתר הזה מורחק בשעות שבחרת לשמור.",
    reason_whitelist: "מצב היתר־בלבד פעיל. רק האתרים שאישרת פתוחים כעת.",
    reason_category: "תוכן {cat} מושהה לפי ההגדרות שלך.",
    reason_default: "האתר הזה הוא אחד שבחרת להחזיק במרחק זרוע.",
    cat_social: "רשתות חברתיות",
    cat_video: "וידאו",
    cat_news: "חדשות",
    cat_shopping: "קניות",
    cat_adult: "תוכן למבוגרים",
    cat_gambling: "הימורים",
  },
  en: {
    page_title: "A moment to pause",
    brand_name: "Kosher Browser",
    eyebrow: "A boundary you set",
    headline: "Take a breath.",
    focus_label: "Focus session in progress",
    focus_foot: "Come back when it ends. Nothing to do here.",
    time_remaining_aria: "Time remaining",
    btn_return: "Back to where I came from",
    btn_settings: "Adjust settings",
    legend_text: "Protecting the time you set aside for yourself",
    reason_focus: "You are in the middle of a focus session you started earlier.",
    reason_schedule: "This site is set aside during the hours you chose to protect.",
    reason_whitelist: "Allow-list mode is active. Only sites you approved are open right now.",
    reason_category: "{cat} content is paused by your settings.",
    reason_default: "This is one of the sites you chose to keep at arm's length.",
    cat_social: "Social media",
    cat_video: "Video",
    cat_news: "News",
    cat_shopping: "Shopping",
    cat_adult: "Adult",
    cat_gambling: "Gambling",
  },
};

let currentLang = "he";
let lastCustomMessage = "";

function t(key) {
  const fromCurrent = STRINGS[currentLang] && STRINGS[currentLang][key];
  if (fromCurrent !== undefined && fromCurrent !== null) return fromCurrent;
  const fromEn = STRINGS.en && STRINGS.en[key];
  if (fromEn !== undefined && fromEn !== null) return fromEn;
  return key;
}

function send(msg) {
  return new Promise((resolve) => chrome.runtime.sendMessage(msg, resolve));
}

const params = new URLSearchParams(location.search);
const reason = params.get("reason") || "";

function computeReasonText(r) {
  if (r === "focus") return t("reason_focus");
  if (r === "schedule") return t("reason_schedule");
  if (r === "whitelist") return t("reason_whitelist");
  if (r.startsWith("category:")) {
    const c = r.slice(9).trim().toLowerCase();
    const catKey = "cat_" + c;
    const catLabel = (STRINGS[currentLang] && STRINGS[currentLang][catKey]) || c;
    return t("reason_category").replace("{cat}", catLabel);
  }
  return t("reason_default");
}

function applyI18n() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "he" ? "rtl" : "ltr";
  document.title = t("page_title");

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key) el.textContent = t(key);
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    const key = el.getAttribute("data-i18n-aria");
    if (key) el.setAttribute("aria-label", t(key));
  });

  const reasonEl = document.getElementById("reason");
  if (reasonEl) reasonEl.textContent = computeReasonText(reason);

  const messageEl = document.getElementById("message");
  if (messageEl) messageEl.textContent = lastCustomMessage || "";
}

// Read language preference synchronously-ish before settings load.
// We still call applyI18n() after to ensure consistent state.
chrome.storage.local.get("language", (result) => {
  if (result && (result.language === "en" || result.language === "he")) {
    currentLang = result.language;
  }
  applyI18n();
});

// Initial paint with current default while storage loads.
applyI18n();

// Report this navigation as a block event for stats. Fire-and-forget.
send({ type: "BLOCK_OCCURRED" });

(async () => {
  const res = await send({ type: "GET_SETTINGS" });
  if (!res || !res.ok) return;
  const s = res.settings;
  lastCustomMessage = s.customMessage || "";

  // Re-apply translations now that we have the custom message.
  applyI18n();

  if (s.focus.active && s.focus.endsAt > Date.now()) {
    document.getElementById("focusInfo").hidden = false;
    startCountdown(s.focus.endsAt);
  }
})();

// React to language changes in real time.
chrome.storage.onChanged.addListener((changes, area) => {
  if (area !== "local") return;
  if (changes.language) {
    const next = changes.language.newValue;
    if (next === "en" || next === "he") {
      currentLang = next;
      applyI18n();
    }
  }
});

function startCountdown(endsAt) {
  const tick = () => {
    const ms = endsAt - Date.now();
    if (ms <= 0) {
      document.getElementById("countdown").textContent = "00:00";
      return;
    }
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const display = m >= 60
      ? `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      : `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
    document.getElementById("countdown").textContent = display;
  };
  tick();
  setInterval(tick, 1000);
}

document.getElementById("goBack").addEventListener("click", () => {
  if (history.length > 1) history.back();
  else location.href = "https://www.google.com";
});

document.getElementById("openOptions").addEventListener("click", () => {
  chrome.runtime.openOptionsPage();
});
