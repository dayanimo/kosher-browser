// ---------- i18n ----------

const STRINGS = {
  he: {
    page_title: "דפדפן כשר — הגדרות",
    brand_name: "דפדפן כשר",
    settings_subtitle: "הגדרות",
    sidebar_nav_aria: "ניווט בהגדרות",
    sidebar_sections_aria: "חלקי ההגדרות",
    protection_active: "הגנה פעילה",

    tab_blocklist: "רשימת חסימה",
    tab_categories: "קטגוריות",
    tab_schedule: "לוח זמנים",
    tab_whitelist: "רשימת היתר",
    tab_security: "אבטחה",
    tab_general: "כללי",

    blocklist_eyebrow: "כללים מותאמים",
    blocklist_title: "רשימת חסימה",
    blocklist_lede: "חסום דומיינים ספציפיים. הזינו את הדומיין הבסיסי, כמו <code>youtube.com</code>. תת־דומיינים נתפסים אוטומטית.",
    blocklist_card_title: "הוספת דומיין",
    blocklist_hint: "אחד בכל פעם. לחצו Enter להוספה.",
    blocklist_input_placeholder: "לדוגמה: youtube.com",
    blocklist_add_btn: "הוסף",
    blocklist_aria: "דומיינים חסומים",

    categories_eyebrow: "ערכות מוכנות",
    categories_title: "קטגוריות",
    categories_lede: "הפעילו או כבו קטגוריות שלמות. הרשימות הן נקודות פתיחה; ניתן להוסיף עוד דומיינים ברשימת החסימה.",

    schedule_eyebrow: "חסימה מבוססת זמן",
    schedule_title: "לוח זמנים",
    schedule_lede: "במהלך חלונות הזמן המתוזמנים, כל הקטגוריות ורשימת החסימה נאכפות, גם אם הקטגוריות כבויות.",
    schedule_toggle_title: "הפעל לוח זמנים",
    schedule_toggle_hint: "החל את חלונות הזמן. כשמושבת, לוחות הזמנים מתעלמים.",
    schedule_add_block_btn: "הוסף חלון זמן",
    schedule_from: "מ",
    schedule_to: "עד",
    schedule_remove: "הסר",

    day_sun: "א",
    day_mon: "ב",
    day_tue: "ג",
    day_wed: "ד",
    day_thu: "ה",
    day_fri: "ו",
    day_sat: "ש",

    cat_social: "רשתות חברתיות",
    cat_video: "סטרימינג וידאו",
    cat_news: "חדשות",
    cat_shopping: "קניות",
    cat_adult: "תוכן למבוגרים",
    cat_gambling: "הימורים",
    cat_block_label: "חסום",

    whitelist_eyebrow: "אפשרו רק את מה שתבחרו",
    whitelist_title: "רשימת היתר",
    whitelist_lede: "במצב רשימת היתר, כל הרשת חסומה מלבד דומיינים שתוסיפו כאן. השתמשו בזהירות.",
    whitelist_mode_label: "מצב רשימת היתר",
    whitelist_mode_hint: "אפשר רק אתרים ברשימת היתר (חסום את כל השאר).",
    whitelist_card_title: "דומיינים מותרים",
    whitelist_card_hint: "הוסיפו את הדומיין הבסיסי. תת־דומיינים מותרים אוטומטית.",
    whitelist_input_placeholder: "לדוגמה: wikipedia.org",
    whitelist_add_btn: "אפשר",
    whitelist_aria: "דומיינים מותרים",
    whitelist_confirm: "מצב רשימת היתר חוסם את כל הרשת מלבד אתרים שברשימה. להמשיך?",

    security_eyebrow: "הגנה",
    security_title: "אבטחה",
    security_lede: "נעלו את ההגדרות בסיסמה ומנעו השבתה של התוסף באמצע פוקוס.",
    security_card_title: "הגנה בסיסמה",
    security_card_hint: "קבע סיסמה כדי לדרוש אותה לשינוי הגדרות, סיום פוקוס מוקדם, או השבתת התוסף.",
    security_old_pwd_placeholder: "סיסמה נוכחית (אם קיימת)",
    security_new_pwd_placeholder: "סיסמה חדשה (השאר ריק להסרה)",
    security_save_btn: "שמור סיסמה",
    security_pwd_set: "סיסמה הוגדרה.",
    security_no_pwd: "לא הוגדרה סיסמה.",
    security_strict_label: "מצב מחמיר",
    security_strict_lede: "מצב מחמיר (לא ניתן להשבית את התוסף או לסיים פוקוס מוקדם). עדיין ניתן להסיר את התוסף מ־<code>chrome://extensions</code>.",
    security_strict_confirm: "מצב מחמיר מונע השבתה של התוסף או סיום פוקוס מוקדם. להמשיך?",
    security_strict_warning: "מצב מחמיר פעיל — לא ניתן להשבית.",

    general_eyebrow: "העדפות",
    general_title: "כללי",
    general_lede: "מתגים ראשיים, ההודעה המוצגת בעמודים חסומים, וסטטיסטיקת ההגנה שלכם.",
    general_blocking_label: "חסימה מופעלת",
    general_blocking_hint: "מתג ראשי לכל פעולות החסימה.",
    general_safesearch_label: "אכיפת חיפוש בטוח",
    general_safesearch_hint: "אכוף חיפוש בטוח ב־Google, Bing, DuckDuckGo.",
    general_message_title: "הודעה בעמוד החסימה",
    general_message_hint: "תוצג למי שיגיע לעמוד חסום.",
    general_message_placeholder: "הערה קצרה לעצמכם בעתיד...",
    general_save_btn: "שמור הודעה",
    general_stats_title: "סטטיסטיקה",
    general_stats_hint: "אתרים שנחסמו במכשיר זה.",
    general_stats_today: "חסימות היום",
    general_stats_total: "סך החסימות",
    general_language_title: "שפה",
    general_language_lede: "בחרו את שפת הממשק. ההגדרה משותפת לכל חלקי התוסף.",

    lock_title: "ההגדרות נעולות",
    lock_lede: "הזינו סיסמה לביצוע שינויים.",
    lock_password_placeholder: "סיסמה",
    lock_unlock_btn: "פתח",
    lock_wrong: "סיסמה שגויה. נסו שוב.",
    lock_empty: "אנא הזינו סיסמה.",

    remove: "הסר",
    block: "חסום",
    from: "מ",
    to: "עד",

    alert_remove: "הסר",
    alert_wrong_password: "סיסמה שגויה.",
    alert_save_failed: "לא ניתן לשמור את השינויים.",
    alert_save_pwd_failed: "לא ניתן לשמור את הסיסמה.",
    alert_pwd_saved: "הסיסמה נשמרה.",
    alert_old_pwd_wrong: "הסיסמה הנוכחית שגויה.",
    alert_message_saved: "נשמר."
  },

  en: {
    page_title: "Kosher Browser — Settings",
    brand_name: "Kosher Browser",
    settings_subtitle: "Settings",
    sidebar_nav_aria: "Settings navigation",
    sidebar_sections_aria: "Settings sections",
    protection_active: "Protection active",

    tab_blocklist: "Blocklist",
    tab_categories: "Categories",
    tab_schedule: "Schedule",
    tab_whitelist: "Whitelist",
    tab_security: "Security",
    tab_general: "General",

    blocklist_eyebrow: "Custom rules",
    blocklist_title: "Blocklist",
    blocklist_lede: "Block specific domains. Enter the base domain, like <code>youtube.com</code>. Subdomains are matched automatically.",
    blocklist_card_title: "Add a domain",
    blocklist_hint: "One at a time. Press Enter to add.",
    blocklist_input_placeholder: "e.g. youtube.com",
    blocklist_add_btn: "Add",
    blocklist_aria: "Blocked domains",

    categories_eyebrow: "Ready-made packs",
    categories_title: "Categories",
    categories_lede: "Toggle whole categories on or off. The lists are starting points; you can add more domains to the blocklist.",

    schedule_eyebrow: "Time-based blocking",
    schedule_title: "Schedule",
    schedule_lede: "During scheduled time windows, all categories and the blocklist are enforced — even if categories are off.",
    schedule_toggle_title: "Enable schedule",
    schedule_toggle_hint: "Apply your time windows. When disabled, schedules are ignored.",
    schedule_add_block_btn: "Add time block",
    schedule_from: "From",
    schedule_to: "To",
    schedule_remove: "Remove",

    day_sun: "Sun",
    day_mon: "Mon",
    day_tue: "Tue",
    day_wed: "Wed",
    day_thu: "Thu",
    day_fri: "Fri",
    day_sat: "Sat",

    cat_social: "Social networks",
    cat_video: "Video streaming",
    cat_news: "News",
    cat_shopping: "Shopping",
    cat_adult: "Adult content",
    cat_gambling: "Gambling",
    cat_block_label: "Block",

    whitelist_eyebrow: "Allow only what you choose",
    whitelist_title: "Whitelist",
    whitelist_lede: "In whitelist mode, the entire web is blocked except domains you add here. Use with care.",
    whitelist_mode_label: "Whitelist mode",
    whitelist_mode_hint: "Allow only sites on the whitelist (block everything else).",
    whitelist_card_title: "Allowed domains",
    whitelist_card_hint: "Add the base domain. Subdomains are allowed automatically.",
    whitelist_input_placeholder: "e.g. wikipedia.org",
    whitelist_add_btn: "Allow",
    whitelist_aria: "Allowed domains",
    whitelist_confirm: "Whitelist mode blocks the entire web except sites on the list. Continue?",

    security_eyebrow: "Protection",
    security_title: "Security",
    security_lede: "Lock settings with a password and prevent the extension from being disabled mid-focus.",
    security_card_title: "Password protection",
    security_card_hint: "Set a password to require it for changing settings, ending focus early, or disabling the extension.",
    security_old_pwd_placeholder: "Current password (if set)",
    security_new_pwd_placeholder: "New password (leave blank to remove)",
    security_save_btn: "Save password",
    security_pwd_set: "Password is set.",
    security_no_pwd: "No password set.",
    security_strict_label: "Strict mode",
    security_strict_lede: "Strict mode (the extension can't be disabled and focus can't be ended early). It can still be removed from <code>chrome://extensions</code>.",
    security_strict_confirm: "Strict mode prevents disabling the extension or ending focus early. Continue?",
    security_strict_warning: "Strict mode is on — can't be disabled.",

    general_eyebrow: "Preferences",
    general_title: "General",
    general_lede: "Master switches, the message shown on blocked pages, and your protection stats.",
    general_blocking_label: "Blocking enabled",
    general_blocking_hint: "Master switch for all blocking actions.",
    general_safesearch_label: "Enforce SafeSearch",
    general_safesearch_hint: "Enforce SafeSearch on Google, Bing, and DuckDuckGo.",
    general_message_title: "Blocked-page message",
    general_message_hint: "Shown to anyone who lands on a blocked page.",
    general_message_placeholder: "A short note to your future self...",
    general_save_btn: "Save message",
    general_stats_title: "Statistics",
    general_stats_hint: "Sites blocked on this device.",
    general_stats_today: "Blocks today",
    general_stats_total: "Total blocks",
    general_language_title: "Language",
    general_language_lede: "Choose the interface language. The setting is shared across the extension.",

    lock_title: "Settings are locked",
    lock_lede: "Enter your password to make changes.",
    lock_password_placeholder: "Password",
    lock_unlock_btn: "Unlock",
    lock_wrong: "Wrong password. Try again.",
    lock_empty: "Please enter a password.",

    remove: "Remove",
    block: "Block",
    from: "From",
    to: "To",

    alert_remove: "Remove",
    alert_wrong_password: "Wrong password.",
    alert_save_failed: "Couldn't save changes.",
    alert_save_pwd_failed: "Couldn't save the password.",
    alert_pwd_saved: "Password saved.",
    alert_old_pwd_wrong: "Current password is wrong.",
    alert_message_saved: "Saved."
  }
};

let currentLang = "he";

function t(key) {
  return (
    (STRINGS[currentLang] && STRINGS[currentLang][key]) ??
    STRINGS.en[key] ??
    key
  );
}

function getDayLabels() {
  return currentLang === "he"
    ? [t("day_sun"), t("day_mon"), t("day_tue"), t("day_wed"), t("day_thu"), t("day_fri"), t("day_sat")]
    : [t("day_sun"), t("day_mon"), t("day_tue"), t("day_wed"), t("day_thu"), t("day_fri"), t("day_sat")];
}

function applyI18n() {
  document.documentElement.lang = currentLang;
  document.documentElement.dir = currentLang === "he" ? "rtl" : "ltr";

  // Title element (data-i18n on <title>)
  const titleEl = document.querySelector("title[data-i18n]");
  if (titleEl) titleEl.textContent = t(titleEl.getAttribute("data-i18n"));

  // Body text — translation strings may contain a <code> sample (e.g. "youtube.com").
  // We parse and rebuild via the DOM API to avoid innerHTML.
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    if (node.tagName === "TITLE") return;
    const key = node.getAttribute("data-i18n");
    const val = t(key);
    while (node.firstChild) node.removeChild(node.firstChild);
    if (val.includes("<code>")) {
      const parts = val.split(/(<code>.*?<\/code>)/);
      for (const p of parts) {
        if (!p) continue;
        if (p.startsWith("<code>")) {
          const c = document.createElement("code");
          c.textContent = p.replace(/^<code>/, "").replace(/<\/code>$/, "");
          node.appendChild(c);
        } else {
          node.appendChild(document.createTextNode(p));
        }
      }
    } else {
      node.textContent = val;
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
  });

  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    el.setAttribute("title", t(el.getAttribute("data-i18n-title")));
  });

  document.querySelectorAll("[data-i18n-aria]").forEach((el) => {
    el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
  });

  // Re-render dynamic content if state is loaded
  if (state) render();

  // Update lock overlay if it exists
  const lockTitle = document.querySelector("#lockOverlay h2");
  if (lockTitle) lockTitle.textContent = t("lock_title");
  const lockLede = document.querySelector("#lockOverlay .lock-lede");
  if (lockLede) lockLede.textContent = t("lock_lede");
  const lockInput = document.getElementById("lockPassword");
  if (lockInput) lockInput.setAttribute("placeholder", t("lock_password_placeholder"));
  const lockSubmit = document.getElementById("lockSubmit");
  if (lockSubmit) lockSubmit.textContent = t("lock_unlock_btn");

  // Update language picker selection state
  document.querySelectorAll(".lang-option").forEach((btn) => {
    const isActive = btn.dataset.lang === currentLang;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-checked", isActive ? "true" : "false");
  });
}

// ---------- Helpers ----------

const $ = (id) => document.getElementById(id);

function send(msg) {
  return new Promise((resolve) => chrome.runtime.sendMessage(msg, resolve));
}

function el(tag, props = {}, ...children) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") node.className = v;
    else if (k === "dataset") Object.assign(node.dataset, v);
    else if (k.startsWith("on") && typeof v === "function") {
      node.addEventListener(k.slice(2).toLowerCase(), v);
    } else if (k === "checked" || k === "disabled" || k === "hidden") {
      if (v) node[k] = true;
    } else if (k === "text") {
      node.textContent = v;
    } else {
      node.setAttribute(k, v);
    }
  }
  for (const c of children) {
    if (c == null) continue;
    node.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
  }
  return node;
}

function clear(node) {
  while (node.firstChild) node.removeChild(node.firstChild);
}

let state = null;
let categoryLists = {};

async function load() {
  const [s, c] = await Promise.all([
    send({ type: "GET_SETTINGS" }),
    send({ type: "GET_CATEGORY_LISTS" })
  ]);
  state = s.settings;
  categoryLists = c.lists;
  render();
}

function render() {
  renderBlocklist();
  renderCategories();
  renderSchedule();
  renderWhitelist();
  renderSecurity();
  renderGeneral();
  renderLanguagePicker();
}

// ---------- Tabs ----------

document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    document.querySelectorAll(".tab").forEach((t) => t.classList.remove("active"));
    document.querySelectorAll(".panel").forEach((p) => p.hidden = true);
    tab.classList.add("active");
    document.querySelector(`.panel[data-panel="${tab.dataset.tab}"]`).hidden = false;
  });
});

// ---------- Patch helper ----------

async function patchSettings(patch) {
  let res = await send({ type: "UPDATE_SETTINGS", patch });
  if (!res.ok && res.error === "locked") {
    const unlocked = await promptUnlock();
    if (!unlocked) {
      await load();
      return false;
    }
    res = await send({ type: "UPDATE_SETTINGS", patch });
  }
  if (!res.ok) {
    if (res.error === "wrong_password") alert(t("alert_wrong_password"));
    else if (res.error !== "locked") alert(t("alert_save_failed"));
  }
  await load();
  return res.ok;
}

// ---------- Lock overlay ----------

function buildLockOverlay() {
  if (document.getElementById("lockOverlay")) return;
  const input = el("input", {
    type: "password",
    id: "lockPassword",
    placeholder: t("lock_password_placeholder"),
    autocomplete: "current-password"
  });
  const status = el("p", { id: "lockStatus", class: "lock-status" });
  const submit = el("button", {
    type: "button",
    id: "lockSubmit",
    class: "primary",
    text: t("lock_unlock_btn")
  });
  const form = el("div", { class: "lock-form" }, input, submit);

  const card = el("div", { class: "lock-card" },
    el("div", { class: "lock-mark", "aria-hidden": "true" }),
    el("h2", { text: t("lock_title") }),
    el("p", { class: "lock-lede", text: t("lock_lede") }),
    form,
    status
  );

  const overlay = el("div", { id: "lockOverlay", class: "lock-overlay" }, card);
  document.body.appendChild(overlay);

  const tryUnlock = async () => {
    const password = input.value;
    if (!password) {
      status.textContent = t("lock_empty");
      return;
    }
    submit.disabled = true;
    status.textContent = "";
    const res = await send({ type: "UNLOCK", password });
    submit.disabled = false;
    if (res.ok) {
      input.value = "";
      hideLockOverlay();
      lockResolve && lockResolve(true);
      lockResolve = null;
    } else {
      status.textContent = t("lock_wrong");
      input.select();
    }
  };

  submit.addEventListener("click", tryUnlock);
  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter") tryUnlock();
  });
}

let lockResolve = null;

function showLockOverlay() {
  buildLockOverlay();
  document.getElementById("lockOverlay").classList.add("visible");
  setTimeout(() => {
    const i = document.getElementById("lockPassword");
    if (i) i.focus();
  }, 50);
}

function hideLockOverlay() {
  const o = document.getElementById("lockOverlay");
  if (o) o.classList.remove("visible");
}

function promptUnlock() {
  return new Promise((resolve) => {
    if (lockResolve) {
      const prev = lockResolve;
      lockResolve = (v) => { prev(v); resolve(v); };
    } else {
      lockResolve = resolve;
    }
    showLockOverlay();
  });
}

// ---------- Blocklist ----------

function renderBlocklist() {
  const ul = $("blocklist");
  clear(ul);
  for (const d of state.customBlocklist) {
    const removeBtn = el("button", {
      title: t("remove"),
      "aria-label": t("remove"),
      text: "×",
      onclick: async () => {
        await patchSettings({
          customBlocklist: state.customBlocklist.filter((x) => x !== d)
        });
      }
    });
    const li = el("li", { class: "chip" }, el("span", { text: d, dir: "ltr" }), removeBtn);
    ul.appendChild(li);
  }
}

$("addDomain").addEventListener("click", addDomainHandler);
$("newDomain").addEventListener("keydown", (e) => {
  if (e.key === "Enter") addDomainHandler();
});

async function addDomainHandler() {
  const v = $("newDomain").value.trim().toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
  if (!v) return;
  if (state.customBlocklist.includes(v)) {
    $("newDomain").value = "";
    return;
  }
  await patchSettings({ customBlocklist: [...state.customBlocklist, v] });
  $("newDomain").value = "";
}

// ---------- Categories ----------

function renderCategories() {
  const wrap = $("categoriesList");
  clear(wrap);
  const labels = {
    social: t("cat_social"),
    video: t("cat_video"),
    news: t("cat_news"),
    shopping: t("cat_shopping"),
    adult: t("cat_adult"),
    gambling: t("cat_gambling")
  };
  for (const [key, list] of Object.entries(categoryLists)) {
    const cb = el("input", {
      type: "checkbox",
      checked: !!state.categories[key],
      onchange: async (e) => {
        const cats = { ...state.categories, [key]: e.target.checked };
        await patchSettings({ categories: cats });
      }
    });
    const card = el("div", { class: "cat-card" },
      el("div", { class: "cat-card-header" },
        el("strong", { text: labels[key] || key }),
        el("label", { class: "check" }, cb, el("span", { text: t("block") }))
      ),
      el("div", { class: "cat-card-domains", text: list.join(", ") })
    );
    wrap.appendChild(card);
  }
}

// ---------- Schedule ----------

function renderSchedule() {
  $("scheduleEnabled").checked = !!state.schedule.enabled;
  const wrap = $("scheduleBlocks");
  clear(wrap);
  const dayLabels = getDayLabels();
  state.schedule.blocks.forEach((block, idx) => {
    const startInput = el("input", {
      type: "time",
      onchange: async (e) => {
        const blocks = [...state.schedule.blocks];
        blocks[idx] = { ...block, start: e.target.value };
        await patchSettings({ schedule: { ...state.schedule, blocks } });
      }
    });
    startInput.value = block.start || "09:00";

    const endInput = el("input", {
      type: "time",
      onchange: async (e) => {
        const blocks = [...state.schedule.blocks];
        blocks[idx] = { ...block, end: e.target.value };
        await patchSettings({ schedule: { ...state.schedule, blocks } });
      }
    });
    endInput.value = block.end || "17:00";

    const removeBtn = el("button", {
      class: "danger",
      text: t("schedule_remove"),
      onclick: async () => {
        const blocks = state.schedule.blocks.filter((_, i) => i !== idx);
        await patchSettings({ schedule: { ...state.schedule, blocks } });
      }
    });

    const dayGrid = el("div", { class: "day-grid" });
    dayLabels.forEach((label, day) => {
      const on = (block.days || []).includes(day);
      const dayBtn = el("div", {
        class: "day" + (on ? " on" : ""),
        text: label,
        onclick: async () => {
          const days = new Set(block.days || []);
          if (days.has(day)) days.delete(day); else days.add(day);
          const blocks = [...state.schedule.blocks];
          blocks[idx] = { ...block, days: [...days].sort() };
          await patchSettings({ schedule: { ...state.schedule, blocks } });
        }
      });
      dayGrid.appendChild(dayBtn);
    });

    const div = el("div", { class: "schedule-block" },
      el("div", { class: "row" },
        el("label", { text: t("from") }), startInput,
        el("label", { text: t("to") }), endInput,
        removeBtn
      ),
      dayGrid
    );
    wrap.appendChild(div);
  });
}

$("scheduleEnabled").addEventListener("change", async (e) => {
  await patchSettings({ schedule: { ...state.schedule, enabled: e.target.checked } });
});

$("addBlock").addEventListener("click", async () => {
  const blocks = [...state.schedule.blocks, { days: [1, 2, 3, 4, 5], start: "09:00", end: "17:00" }];
  await patchSettings({ schedule: { ...state.schedule, blocks } });
});

// ---------- Whitelist ----------

function renderWhitelist() {
  $("whitelistMode").checked = !!state.whitelistMode;
  const ul = $("whitelist");
  clear(ul);
  for (const d of state.whitelist) {
    const removeBtn = el("button", {
      title: t("remove"),
      "aria-label": t("remove"),
      text: "×",
      onclick: async () => {
        await patchSettings({ whitelist: state.whitelist.filter((x) => x !== d) });
      }
    });
    ul.appendChild(el("li", { class: "chip" }, el("span", { text: d, dir: "ltr" }), removeBtn));
  }
}

$("whitelistMode").addEventListener("change", async (e) => {
  if (e.target.checked) {
    if (!confirm(t("whitelist_confirm"))) {
      e.target.checked = false;
      return;
    }
  }
  await patchSettings({ whitelistMode: e.target.checked });
});

$("addWhitelist").addEventListener("click", addWhitelistHandler);
$("newWhitelist").addEventListener("keydown", (e) => {
  if (e.key === "Enter") addWhitelistHandler();
});

async function addWhitelistHandler() {
  const v = $("newWhitelist").value.trim().toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/.*$/, "");
  if (!v) return;
  if (state.whitelist.includes(v)) {
    $("newWhitelist").value = "";
    return;
  }
  await patchSettings({ whitelist: [...state.whitelist, v] });
  $("newWhitelist").value = "";
}

// ---------- Security ----------

function renderSecurity() {
  $("strictMode").checked = !!state.strictMode;
  $("pwStatus").textContent = state.passwordHash
    ? t("security_pwd_set")
    : t("security_no_pwd");
}

$("setPassword").addEventListener("click", async () => {
  const oldPassword = $("oldPassword").value;
  const newPassword = $("newPassword").value;
  const res = await send({ type: "SET_PASSWORD", oldPassword, newPassword });
  if (!res.ok) {
    alert(res.error === "wrong_password" ? t("alert_old_pwd_wrong") : t("alert_save_pwd_failed"));
    return;
  }
  $("oldPassword").value = "";
  $("newPassword").value = "";
  await load();
  alert(t("alert_pwd_saved"));
});

$("strictMode").addEventListener("change", async (e) => {
  if (e.target.checked) {
    if (!confirm(t("security_strict_confirm"))) {
      e.target.checked = false;
      return;
    }
  }
  await patchSettings({ strictMode: e.target.checked });
});

// ---------- General ----------

function renderGeneral() {
  $("enabledMain").checked = !!state.enabled;
  $("safeSearchMain").checked = !!state.safeSearch;
  $("customMessage").value = state.customMessage || "";
  $("statsToday").textContent = state.stats.blocksToday;
  $("statsTotal").textContent = state.stats.blocksTotal;
}

$("enabledMain").addEventListener("change", async (e) => {
  if (!e.target.checked && state.strictMode) {
    alert(t("security_strict_warning"));
    e.target.checked = true;
    return;
  }
  await patchSettings({ enabled: e.target.checked });
});

$("safeSearchMain").addEventListener("change", async (e) => {
  await patchSettings({ safeSearch: e.target.checked });
});

$("saveMessage").addEventListener("click", async () => {
  await patchSettings({ customMessage: $("customMessage").value });
  alert(t("alert_message_saved"));
});

// ---------- Language picker ----------

function renderLanguagePicker() {
  document.querySelectorAll(".lang-option").forEach((btn) => {
    const isActive = btn.dataset.lang === currentLang;
    btn.classList.toggle("active", isActive);
    btn.setAttribute("aria-checked", isActive ? "true" : "false");
  });
}

document.querySelectorAll(".lang-option").forEach((btn) => {
  btn.addEventListener("click", async () => {
    const newLang = btn.dataset.lang;
    if (!newLang || newLang === currentLang) return;
    await chrome.storage.local.set({ language: newLang });
    currentLang = newLang;
    applyI18n();
    await load();
  });
});

// ---------- Init ----------

async function init() {
  // Read language preference first
  const langData = await chrome.storage.local.get("language");
  if (langData && (langData.language === "he" || langData.language === "en")) {
    currentLang = langData.language;
  }
  applyI18n();

  const lock = await send({ type: "GET_LOCK_STATE" });
  if (lock && lock.hasPassword) {
    // Always require fresh authentication when entering settings.
    await send({ type: "LOCK" });
    await promptUnlock();
  }
  await load();
}

// React to language changes from elsewhere (popup, other tabs)
chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area !== "local" || !changes.language) return;
  const newLang = changes.language.newValue;
  if ((newLang === "he" || newLang === "en") && newLang !== currentLang) {
    currentLang = newLang;
    applyI18n();
    if (state) await load();
  }
});

document.addEventListener("DOMContentLoaded", init);
