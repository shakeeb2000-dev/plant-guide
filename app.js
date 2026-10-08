/* =============================================================
   Plant Guide — app logic
   Plain JavaScript, no internet needed, no build step.
   You should not need to edit this file to change content.
   Content lives in the files in data/.
   ============================================================= */

var Plant = (function () {
  "use strict";

  var STORE_PREFIX = "plantguide:v1:";
  var THEME_KEY    = STORE_PREFIX + "theme";
  var ANSWER_KEY   = STORE_PREFIX + "answers";

  var view = document.getElementById("view");

  var PROCS       = window.PLANT_PROCEDURES || [];
  var FAULTS      = window.PLANT_FAULTS || [];
  var INFO        = window.PLANT_INFO || { name: "Plant Guide", site: "", revision: "" };
  var MAP         = window.PLANT_MAP || null;
  var ICONS       = window.MACHINE_ICONS || {};
  var INTERVIEWS  = window.PLANT_INTERVIEWS || [];
  var STEP_FIELDS = window.PLANT_STEP_FIELDS || [];
  var AREAS       = (MAP && MAP.areas) || [];

  /* =============================================================
     THEMES
     Two complete looks. The CSS does the work; this just sets the
     data-theme attribute and remembers the choice.
     ============================================================= */

  var THEMES = {
    control: {
      id: "control",
      name: "Control Room",
      blurb: "Dark, glowing, like the screens in the control room.",
      swatch: ["#070b0a", "#122019", "#2ce08c", "#4fc3f7", "#ffb74d"],
      meta: "#0d1714"
    },
    industrial: {
      id: "industrial",
      name: "Bold Industrial",
      blurb: "High contrast, heavy type, built to read across a noisy room.",
      swatch: ["#e8e4da", "#ffffff", "#ffd400", "#15130f", "#0b7a3f"],
      meta: "#15130f"
    }
  };

  var theme = "control";

  function loadTheme() {
    try {
      var t = localStorage.getItem(THEME_KEY);
      if (t && THEMES[t]) theme = t;
    } catch (e) {}
    applyTheme();
  }

  function applyTheme() {
    document.documentElement.setAttribute("data-theme", theme);
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.setAttribute("content", THEMES[theme].meta);
    var btn = document.getElementById("themeBtn");
    if (btn) btn.querySelector(".lbl").textContent = THEMES[theme].name;
  }

  function setTheme(t) {
    if (!THEMES[t]) return;
    theme = t;
    try { localStorage.setItem(THEME_KEY, t); } catch (e) {}
    applyTheme();
    route();
  }

  function flipTheme() {
    setTheme(theme === "control" ? "industrial" : "control");
  }

  function dark() { return theme === "control"; }

  /* ---------- theme-aware map palettes ----------
     The data files hold light-paper colours. Each theme maps them
     to something that belongs on that canvas. */

  var SKINS = {
    control: {
      p1:       { plate: "#13261f", stroke: "#2ce08c", text: "#d4f3e4", accent: "#2ce08c" },
      p2:       { plate: "#0e2230", stroke: "#4fc3f7", text: "#d2ecfb", accent: "#4fc3f7" },
      shared:   { plate: "#2a2012", stroke: "#ffb74d", text: "#f8e4c4", accent: "#ffb74d" },
      services: { plate: "#201a30", stroke: "#b794f6", text: "#e3d7fb", accent: "#b794f6" }
    },
    industrial: {
      p1:       { plate: "#ffffff", stroke: "#15130f", text: "#15130f", accent: "#0b7a3f" },
      p2:       { plate: "#ffffff", stroke: "#15130f", text: "#15130f", accent: "#11399e" },
      shared:   { plate: "#ffffff", stroke: "#15130f", text: "#15130f", accent: "#a35a00" },
      services: { plate: "#ffffff", stroke: "#15130f", text: "#15130f", accent: "#5b2bb8" }
    }
  };

  var STREAM_COLORS = {
    control: {
      raw: "#2ce08c", meal: "#9bd84f", tallow: "#ffb74d", blood: "#ff7a95",
      water: "#4fc3f7", vapour: "#b794f6", steam: "#ff6b60"
    },
    industrial: {
      raw: "#0b7a3f", meal: "#3f6212", tallow: "#a35a00", blood: "#9f1239",
      water: "#11399e", vapour: "#5b2bb8", steam: "#b3160f"
    }
  };

  function skin(plantKey) {
    var s = SKINS[theme];
    return s[plantKey] || s.services;
  }

  function streamColor(key) {
    return STREAM_COLORS[theme][key] || ((MAP.streams[key] || {}).color) || "#888";
  }

  function canvasColor() { return dark() ? "#080e0c" : "#faf8f3"; }

  /* =============================================================
     ICONS  (interface icons, drawn the same way as machine icons)
     ============================================================= */

  var UI = {
    home:     '<path d="M3 10.5 12 3l9 7.5"/><path d="M5.5 9.5V20h13V9.5"/><path d="M9.5 20v-6h5v6"/>',
    grid:     '<rect x="3" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.6"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.6"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.6"/>',
    cog:      '<circle cx="12" cy="12" r="3.2"/><path d="M12 2.6v2.8M12 18.6v2.8M4.4 12H1.6M22.4 12h-2.8M6.6 6.6 4.6 4.6M19.4 19.4l-2-2M17.4 6.6l2-2M4.6 19.4l2-2"/>',
    search:   '<circle cx="10.6" cy="10.6" r="6.6"/><path d="M15.4 15.4 21 21"/>',
    back:     '<path d="M19 12H5"/><path d="M11 6 5 12l6 6"/>',
    next:     '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
    chevron:  '<path d="M9 5l7 7-7 7"/>',
    print:    '<path d="M7 9V3.5h10V9"/><rect x="3.5" y="9" width="17" height="8" rx="1.8"/><path d="M7 15h10v5.5H7z"/>',
    play:     '<path d="M8 4.8 19 12 8 19.2V4.8Z"/>',
    stop:     '<rect x="5.5" y="5.5" width="13" height="13" rx="1.8"/>',
    wrench:   '<path d="M14.7 6.3a4.6 4.6 0 0 0 6 6l-9.3 9.3a2.4 2.4 0 0 1-3.4 0l-2.6-2.6a2.4 2.4 0 0 1 0-3.4Z"/><path d="M14.7 6.3 18.1 2.9"/><path d="M17.5 9.1 21 5.7"/>',
    map:      '<path d="M9 3.5 3.5 6v14.5L9 18l6 2.5 5.5-2.5V3.5L15 6 9 3.5Z"/><path d="M9 3.5V18M15 6v14.5"/>',
    sheet:    '<path d="M6 2.8h8.5L19 7.3V21a.9.9 0 0 1-.9.9H6a.9.9 0 0 1-.9-.9V3.7A.9.9 0 0 1 6 2.8Z"/><path d="M14 2.8v5h5"/><path d="M8.2 12.5h7M8.2 16h5"/>',
    truck:    '<path d="M2.8 6.5h10v9.5H2.8z"/><path d="M12.8 9.5h4l3 3v3.5h-7z"/><circle cx="6.6" cy="18.4" r="1.9"/><circle cx="16.4" cy="18.4" r="1.9"/>',
    refresh:  '<path d="M20.4 11a8.4 8.4 0 0 0-14.6-4.3L3.2 9.3"/><path d="M3.2 4.4v4.9h4.9"/><path d="M3.6 13a8.4 8.4 0 0 0 14.6 4.3l2.6-2.6"/><path d="M20.8 19.6v-4.9h-4.9"/>',
    plus:     '<path d="M12 5.5v13M5.5 12h13"/>',
    minus:    '<path d="M5.5 12h13"/>',
    fit:      '<path d="M3.6 8.6V3.6h5M20.4 8.6V3.6h-5M3.6 15.4v5h5M20.4 15.4v5h-5"/>',
    expand:   '<path d="M3.6 9V3.6H9M21 9V3.6h-5.4M3.6 15v5.4H9M21 15v5.4h-5.4"/>',
    collapse: '<path d="M9 3.6V9H3.6M15 3.6V9h5.4M9 20.4V15H3.6M15 20.4V15h5.4"/>',
    check:    '<path d="M4.6 12.8 9.4 17.6 19.4 6.8"/>',
    alert:    '<path d="M12 3.4 21.4 20H2.6L12 3.4Z"/><path d="M12 9.4v4.6"/><circle cx="12" cy="16.8" r="1"/>',
    download: '<path d="M12 3.6v11"/><path d="M7.6 10.4 12 14.8l4.4-4.4"/><path d="M4.4 19.6h15.2"/>',
    upload:   '<path d="M12 15.4V4.4"/><path d="M7.6 8.8 12 4.4l4.4 4.4"/><path d="M4.4 19.6h15.2"/>',
    trash:    '<path d="M4.4 7h15.2"/><path d="M9.4 7V4.4h5.2V7"/><path d="M6.4 7l1 13.2h9.2L17.6 7"/>',
    copy:     '<rect x="8.4" y="8.4" width="11.2" height="11.2" rx="1.8"/><path d="M15.6 8.4V5.6a1.2 1.2 0 0 0-1.2-1.2H5.6a1.2 1.2 0 0 0-1.2 1.2v8.8a1.2 1.2 0 0 0 1.2 1.2h2.8"/>',
    share:    '<circle cx="18" cy="5.6" r="2.6"/><circle cx="6" cy="12" r="2.6"/><circle cx="18" cy="18.4" r="2.6"/><path d="M8.3 10.7 15.7 6.9M8.3 13.3l7.4 3.8"/>',
    contrast: '<circle cx="12" cy="12" r="8.6"/><path d="M12 3.4v17.2a8.6 8.6 0 0 0 0-17.2Z" fill="currentColor" stroke="none"/>',
    eye:      '<path d="M2.4 12s3.6-6.4 9.6-6.4S21.6 12 21.6 12s-3.6 6.4-9.6 6.4S2.4 12 2.4 12Z"/><circle cx="12" cy="12" r="2.8"/>',
    flag:     '<path d="M6 21V4.2"/><path d="M6 4.6h11.4l-2 4 2 4H6"/>',
    clock:    '<circle cx="12" cy="12" r="8.6"/><path d="M12 7.2V12l3.4 2.2"/>',
    user:     '<circle cx="12" cy="8.4" r="3.8"/><path d="M4.8 20.4a7.2 7.2 0 0 1 14.4 0"/>',
    bell:     '<path d="M6.6 10.4a5.4 5.4 0 0 1 10.8 0c0 4.4 2 5.8 2 5.8H4.6s2-1.4 2-5.8Z"/><path d="M10.2 19.4a2 2 0 0 0 3.6 0"/>',
    shield:   '<path d="M12 3 5.4 5.6v5.6c0 4.4 2.8 7.6 6.6 9.2 3.8-1.6 6.6-4.8 6.6-9.2V5.6L12 3Z"/><path d="M9.2 12.2l2 2 3.6-4"/>',
    camera:   '<path d="M3.4 8.6h3.2l1.6-2.4h7.6l1.6 2.4h3.2v10.2H3.4Z"/><circle cx="12" cy="13.4" r="3.4"/>',
    pencil:   '<path d="M4 20h4.2L20 8.2 15.8 4 4 15.8Z"/><path d="M14.4 5.4 18.6 9.6"/>'
  };

  /* tiles and rows get a real icon where there is a sensible one,
     and fall back to the little picture in the data file */
  var PROC_ART = {
    "startup-plant":      "play",
    "shutdown-plant":     "stop",
    "line-intake":        "truck",
    "line-ovine":         "cooker",
    "line-mbm":           "mill",
    "line-tallow":        "tank",
    "support-changeover": "refresh",
    "support-loadout":    "bagging",
    "support-odour":      "fan"
  };

  var FAULT_ART = {
    "cooker-temp":     "cooker",
    "meal-wet":        "press",
    "tallow-quality":  "tank",
    "mill-trip":       "mill",
    "odour-complaint": "fan",
    "steam-low":       "boiler",
    "foreign-body":    "metaldetector"
  };

  function art(name) {
    if (!name) return null;
    if (UI[name]) return UI[name];
    if (ICONS[name]) return ICONS[name];
    return null;
  }

  function svgIcon(name, size, width) {
    var a = art(name);
    if (!a) return "";
    var s = size || 24;
    return '<svg viewBox="0 0 24 24" width="' + s + '" height="' + s + '" fill="none" ' +
           'stroke="currentColor" stroke-width="' + (width || 1.8) + '" ' +
           'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + a + "</svg>";
  }

  /* an icon for a tile: proper svg if we have one, else the glyph */
  function tileArt(name, glyph) {
    var svg = svgIcon(name, 26, 1.7);
    return svg || '<span class="glyph">' + (glyph || "") + "</span>";
  }

  /* =============================================================
     SMALL HELPERS
     ============================================================= */

  function esc(s) {
    return String(s === undefined || s === null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  function byId(list, id) {
    for (var i = 0; i < list.length; i++) if (list[i].id === id) return list[i];
    return null;
  }

  function procsIn(category) {
    return PROCS.filter(function (p) { return p.category === category; });
  }

  function statusBadge(status) {
    return status === "approved"
      ? '<span class="badge ok dot">Signed off</span>'
      : '<span class="badge draft dot">Draft &mdash; needs sign-off</span>';
  }

  function go(hash) { location.hash = hash; }

  function btn(cls, icon, label, onclick) {
    return '<button class="btn ' + cls + '" onclick="' + onclick + '">' +
           svgIcon(icon, 17) + "<span>" + esc(label) + "</span></button>";
  }

  /* =============================================================
     SAVED CHECKLIST STATE
     ============================================================= */

  function loadState(id) {
    try {
      var raw = localStorage.getItem(STORE_PREFIX + id);
      return raw ? JSON.parse(raw) : { checked: {}, by: "", date: "" };
    } catch (e) {
      return { checked: {}, by: "", date: "" };
    }
  }

  function saveState(id, state) {
    try { localStorage.setItem(STORE_PREFIX + id, JSON.stringify(state)); } catch (e) {}
  }

  function loadAnswers() {
    try {
      var raw = localStorage.getItem(ANSWER_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (e) { return {}; }
  }

  function saveAnswers(obj) {
    try { localStorage.setItem(ANSWER_KEY, JSON.stringify(obj)); } catch (e) {
      alert("This device would not let me save. The storage may be full.");
    }
  }

  function countAnswered(iv) {
    var a = loadAnswers(), total = 0, done = 0;
    iv.sections.forEach(function (s) {
      s.questions.forEach(function (q) {
        total++;
        var v = a[iv.id + "." + q.id];
        if (q.type === "steps") {
          if (Array.isArray(v) && v.some(function (st) {
            return Object.keys(st).some(function (k) { return String(st[k] || "").trim(); });
          })) done++;
        } else if (String(v === undefined || v === null ? "" : v).trim()) done++;
      });
    });
    return { total: total, done: done };
  }

  /* =============================================================
     HOME
     ============================================================= */

  function tile(hash, artName, glyph, title, sub, opts) {
    opts = opts || {};
    var style = "";
    if (opts.accent) style += "--tile-accent:" + opts.accent + ";";
    if (opts.tint) style += "--tile-tint:" + opts.tint + ";";
    return '<button class="tile ' + (opts.cls || "") + '"' +
             (style ? ' style="' + style + '"' : "") +
             ' onclick="Plant.go(\'' + hash + '\')">' +
             '<span class="tile-icon">' + tileArt(artName, glyph) + "</span>" +
             '<span class="tile-title">' + esc(title) + "</span>" +
             '<span class="tile-sub">' + esc(sub) + "</span>" +
             (opts.meta
               ? '<span class="tile-meta">' + esc(opts.meta) + svgIcon("chevron", 13) + "</span>"
               : "") +
           "</button>";
  }

  function accentFor(key) {
    var map = {
      green:  dark() ? "#2ce08c" : "#0b7a3f",
      amber:  dark() ? "#ffb74d" : "#a35a00",
      blue:   dark() ? "#4fc3f7" : "#11399e",
      violet: dark() ? "#b794f6" : "#5b2bb8",
      red:    dark() ? "#ff6b60" : "#b3160f"
    };
    return map[key] || map.green;
  }

  function tintFor(key) {
    var map = {
      green:  dark() ? "rgba(44,224,140,.13)"  : "#d8f0e2",
      amber:  dark() ? "rgba(255,183,77,.13)"  : "#fff3cc",
      blue:   dark() ? "rgba(79,195,247,.13)"  : "#d9e2ff",
      violet: dark() ? "rgba(183,148,246,.13)" : "#e7dcff",
      red:    dark() ? "rgba(255,107,96,.13)"  : "#ffd9d6"
    };
    return map[key] || map.green;
  }

  function allMachinesCount() { return allMachines().length; }

  function renderHome() {
    var h = "";

    /* ---- hero ---- */
    h += '<section class="hero">';
    h += '<p class="hero-eyebrow"><span class="pulse"></span>' +
         esc(INFO.revision ? "Working draft" : "Plant manual") + "</p>";
    h += "<h1>" + esc(INFO.name) + "</h1>";
    h += '<p class="hero-sub">' + esc(INFO.site) + ". Every job is a step-by-step list you can " +
         "tick off as you walk the plant. Works with no internet.</p>";
    h += '<div class="hero-stats">';
    h += '<div class="stat"><b class="num">' + AREAS.length + "</b><span>Plant areas</span></div>";
    h += '<div class="stat"><b class="num">' + allMachinesCount() + "</b><span>Machines</span></div>";
    h += '<div class="stat"><b class="num">' + PROCS.length + "</b><span>Procedures</span></div>";
    h += '<div class="stat"><b class="num">' + FAULTS.length + "</b><span>Fault guides</span></div>";
    h += "</div></section>";

    /* ---- the two big jobs ---- */
    h += '<div class="tile-grid two">';
    procsIn("startup").forEach(function (p) {
      h += tile("#/p/" + p.id, PROC_ART[p.id], p.icon, p.title, p.subtitle || "",
                { cls: "hero-tile", accent: accentFor("green"), tint: tintFor("green"),
                  meta: p.steps.length + " steps \u00B7 " + (p.duration || "") });
    });
    procsIn("shutdown").forEach(function (p) {
      h += tile("#/p/" + p.id, PROC_ART[p.id], p.icon, p.title, p.subtitle || "",
                { cls: "hero-tile", accent: accentFor("blue"), tint: tintFor("blue"),
                  meta: p.steps.length + " steps \u00B7 " + (p.duration || "") });
    });
    h += "</div>";

    /* ---- trouble + map ---- */
    h += '<h2>When you need it fast</h2><div class="tile-grid two">';
    h += tile("#/trouble", "wrench", "\u{1F527}", "Something has gone wrong",
              "Answer a few yes/no questions and get the fix",
              { accent: accentFor("amber"), tint: tintFor("amber"),
                meta: FAULTS.length + " fault guides" });
    if (MAP) {
      h += tile("#/map", "map", "\u{1F5FA}", "Plant Map",
                "The whole plant, area by area. Tap any machine.",
                { accent: accentFor("violet"), tint: tintFor("violet"),
                  meta: AREAS.length + " areas \u00B7 " + allMachinesCount() + " machines" });
    }
    h += "</div>";

    /* ---- lines ---- */
    h += '<h2>The lines</h2><div class="tile-grid">';
    procsIn("line").forEach(function (p) {
      h += tile("#/p/" + p.id, PROC_ART[p.id], p.icon, p.title, p.subtitle || "",
                { accent: accentFor("green"), tint: tintFor("green"),
                  meta: p.steps.length + " steps" });
    });
    h += "</div>";

    /* ---- support ---- */
    h += '<h2>Support jobs</h2><div class="tile-grid">';
    procsIn("support").forEach(function (p) {
      h += tile("#/p/" + p.id, PROC_ART[p.id], p.icon, p.title, p.subtitle || "",
                { accent: accentFor("blue"), tint: tintFor("blue"),
                  meta: p.steps.length + " steps" });
    });
    h += "</div>";

    /* ---- the step builders ---- */
    h += '<h2>Write the real procedure</h2>';
    h += '<p class="lede">Walk the plant with your boss and add a step at a time. Each step ' +
         "takes your words and as many photos as you like, and you can slot a step in " +
         "between two you have already written.</p>";
    h += '<div class="tile-grid two">';
    Object.keys(BUILDERS).forEach(function (k) {
      var b = BUILDERS[k];
      h += tile("#/build/" + k, b.art, "", b.title, b.sub,
                { accent: accentFor(b.accent), tint: tintFor(b.accent),
                  meta: "Words and photos, step by step" });
    });
    h += "</div>";

    /* ---- interview sheets ---- */
    if (INTERVIEWS.length) {
      h += '<h2>Fill in your plant</h2>';
      h += '<p class="lede">The questions to ask your boss, with a box under each one to type the ' +
           "answer straight in. It saves as you go.</p>";
      h += '<div class="tile-grid">';
      INTERVIEWS.forEach(function (iv) {
        var p = countAnswered(iv);
        h += tile("#/interview/" + iv.id, "sheet", iv.icon, iv.title, iv.subtitle || "",
                  { accent: accentFor("amber"), tint: tintFor("amber"),
                    meta: p.done + " of " + p.total + " answered" });
      });
      h += "</div>";
    }

    /* ---- settings ---- */
    h += '<h2>Set up</h2><div class="tile-grid">';
    h += tile("#/settings", "cog", "\u2699", "Settings",
              "Look and feel, backup, restore and updates",
              { accent: accentFor("violet"), tint: tintFor("violet"),
                meta: THEMES[theme].name });
    h += "</div>";

    h += '<div class="callout info" style="margin-top:30px"><strong>This copy is not finished yet</strong>' +
         "The steps you can see are examples to show the shape of the book. Go through them with " +
         "your boss, correct them, and they become your real plant manual.</div>";

    view.className = "view";
    view.innerHTML = h;
    window.scrollTo(0, 0);
  }

  /* =============================================================
     PROCEDURE PAGE
     ============================================================= */

  function renderProcedure(id) {
    var p = byId(PROCS, id);
    if (!p) return renderNotFound();

    var state = loadState(id);
    var h = "";

    h += '<div class="machine-head" style="border-left-color:' + accentFor("green") + '">' +
           '<span class="machine-icon" style="color:' + accentFor("green") + '">' +
             svgIcon(PROC_ART[p.id] || "play", 38, 1.5) +
           "</span>" +
           '<div class="machine-headtext">' +
             statusBadge(p.status) +
             "<h1>" + esc(p.title) + "</h1>" +
             '<p class="lede" style="margin:5px 0 0">' + esc(p.subtitle || "") + "</p>" +
           "</div></div>";

    if (p.summary) {
      h += '<div class="card"><h3>What this job is</h3><div>' + esc(p.summary) + "</div>";
      h += '<div class="step-meta" style="margin-top:14px">';
      if (p.duration) h += "<span>" + svgIcon("clock", 14) + "How long: <b>" + esc(p.duration) + "</b></span>";
      if (p.who) h += "<span>" + svgIcon("user", 14) + "Who: <b>" + esc(p.who) + "</b></span>";
      h += "<span>" + svgIcon("check", 14) + "Steps: <b>" + p.steps.length + "</b></span>";
      h += "</div></div>";
    }

    if (p.ppe && p.ppe.length) {
      h += '<div class="card"><h3>' + svgIcon("shield", 14) + " Wear this before you start</h3>" +
           '<ul class="chips">';
      p.ppe.forEach(function (x) { h += "<li>" + esc(x) + "</li>"; });
      h += "</ul></div>";
    }

    (p.warnings || []).forEach(function (w) {
      h += '<div class="callout ' + (w.type === "danger" ? "danger" : "warn") + '">' +
             "<strong>" + esc(w.title) + "</strong>" + esc(w.text) + "</div>";
    });

    /* who is doing it */
    h += '<div class="card"><h3>Who is doing this job</h3><div class="signoff">' +
           '<label class="field"><span>Name</span>' +
             '<input id="sign-by" type="text" value="' + esc(state.by) + '" placeholder="Your name">' +
           "</label>" +
           '<label class="field"><span>Date and shift</span>' +
             '<input id="sign-date" type="text" value="' + esc(state.date) + '" placeholder="e.g. 3 Oct, day shift">' +
           "</label>" +
         "</div></div>";

    /* progress */
    h += '<div class="progress-wrap"><div class="progress-card">' +
           '<span class="count" id="progCount">0 of ' + p.steps.length + " done</span>" +
           '<span class="bar"><span id="progBar"></span></span>' +
           '<button class="btn ghost small" onclick="Plant.resetChecks(\'' + p.id + '\')">Clear ticks</button>' +
         "</div></div>";

    /* steps */
    h += '<ol class="steps">';
    p.steps.forEach(function (s, i) {
      var done = !!state.checked[i];
      h += '<li class="step' + (done ? " done" : "") + '" id="step-' + i + '">' +
             '<input class="step-check" type="checkbox" ' + (done ? "checked" : "") +
               ' onchange="Plant.toggleStep(\'' + p.id + "'," + i + ',this.checked)"' +
               ' aria-label="Step ' + (i + 1) + ' done">' +
             '<div class="step-body">' +
               '<div class="step-head"><span class="step-no num">' + (i + 1) + "</span>" +
               '<span class="step-title">' + esc(s.title) + "</span></div>";
      if (s.detail) h += '<p class="step-detail">' + esc(s.detail) + "</p>";
      if (s.warning) {
        h += '<div class="step-warn">' + svgIcon("alert", 14) +
             " <b>Careful:</b> " + esc(s.warning) + "</div>";
      }
      if (s.checks && s.checks.length) {
        h += '<ul class="step-checks">';
        s.checks.forEach(function (c) { h += "<li>" + esc(c) + "</li>"; });
        h += "</ul>";
      }
      if (s.who || s.time) {
        h += '<div class="step-meta">';
        if (s.who) h += "<span>" + svgIcon("user", 13) + "<b>" + esc(s.who) + "</b></span>";
        if (s.time) h += "<span>" + svgIcon("clock", 13) + "<b>" + esc(s.time) + "</b></span>";
        h += "</div>";
      }
      h += "</div></li>";
    });
    h += "</ol>";

    h += '<div class="btn-row">' +
           btn("primary", "home", "Back to the menu", "Plant.go('#/')") +
           btn("", "print", "Print / save as PDF", "window.print()") +
           btn("", "wrench", "Something has gone wrong", "Plant.go('#/trouble')") +
         "</div>";

    view.className = "view";
    view.innerHTML = h;
    window.scrollTo(0, 0);

    var by = document.getElementById("sign-by");
    var dt = document.getElementById("sign-date");
    function persistSign() {
      var st = loadState(p.id);
      st.by = by.value; st.date = dt.value;
      saveState(p.id, st);
    }
    by.addEventListener("input", persistSign);
    dt.addEventListener("input", persistSign);

    updateProgress(p);
  }

  function updateProgress(p) {
    if (!p) return;
    var state = loadState(p.id);
    var done = 0;
    for (var i = 0; i < p.steps.length; i++) if (state.checked[i]) done++;
    var pct = p.steps.length ? Math.round((done / p.steps.length) * 100) : 0;
    var c = document.getElementById("progCount");
    var b = document.getElementById("progBar");
    if (c) c.textContent = done + " of " + p.steps.length + " done";
    if (b) b.style.width = pct + "%";
  }

  function toggleStep(procId, index, checked) {
    var st = loadState(procId);
    if (checked) st.checked[index] = true; else delete st.checked[index];
    saveState(procId, st);
    var li = document.getElementById("step-" + index);
    if (li) li.className = "step" + (checked ? " done" : "");
    updateProgress(byId(PROCS, procId));
  }

  function resetChecks(procId) {
    var st = loadState(procId);
    st.checked = {};
    saveState(procId, st);
    renderProcedure(procId);
  }

  /* =============================================================
     TROUBLESHOOTING
     ============================================================= */

  function renderFaultList() {
    var h = "<h1>Something has gone wrong</h1>";
    h += '<p class="lede">Pick what you are seeing. The app asks a few simple questions and ' +
         "takes you to the fix.</p>";

    h += '<div class="callout danger"><strong>If anyone could get hurt, stop first</strong>' +
         "Press the emergency stop, isolate and lock out the machine, and get your supervisor. " +
         "Fault finding comes after people are safe.</div>";

    var areas = [];
    FAULTS.forEach(function (f) { if (areas.indexOf(f.area) === -1) areas.push(f.area); });

    areas.forEach(function (area) {
      h += "<h2>" + esc(area) + "</h2>";
      FAULTS.filter(function (f) { return f.area === area; }).forEach(function (f) {
        h += '<button class="result" onclick="Plant.go(\'#/t/' + f.id + '\')">' +
               '<span class="result-ico" style="color:' + accentFor("amber") + '">' +
                 (svgIcon(FAULT_ART[f.id], 22, 1.5) || esc(f.icon || "")) +
               "</span>" +
               '<span class="result-body">' +
                 '<span class="result-kind">Fault guide</span>' +
                 '<span class="result-title">' + esc(f.title) + "</span>" +
                 '<span class="result-snip">' + esc(f.symptom || "") + "</span>" +
               "</span>" +
               '<span class="result-go">' + svgIcon("chevron", 18) + "</span>" +
             "</button>";
      });
    });

    h += '<div class="btn-row">' + btn("primary", "home", "Back to the menu", "Plant.go('#/')") + "</div>";

    view.className = "view";
    view.innerHTML = h;
    window.scrollTo(0, 0);
  }

  var flow = null; /* { faultId, nodeId, trail: [{q, a, from}] } */

  function renderFault(id) {
    var f = byId(FAULTS, id);
    if (!f) return renderNotFound();
    if (!flow || flow.faultId !== id) flow = { faultId: id, nodeId: "start", trail: [] };
    renderFlow();
  }

  function renderFlow() {
    var f = byId(FAULTS, flow.faultId);
    var node = f.nodes[flow.nodeId];
    var h = "";

    h += '<div class="machine-head" style="border-left-color:' + accentFor("amber") + '">' +
           '<span class="machine-icon" style="color:' + accentFor("amber") + '">' +
             (svgIcon(FAULT_ART[f.id], 38, 1.5) || svgIcon("wrench", 38, 1.5)) +
           "</span>" +
           '<div class="machine-headtext">' +
             statusBadge(f.status) +
             "<h1>" + esc(f.title) + "</h1>" +
             '<p class="lede" style="margin:5px 0 0">' + esc(f.area) + "</p>" +
           "</div></div>";

    if (flow.trail.length) {
      h += '<ul class="trail">';
      flow.trail.forEach(function (t) {
        h += "<li><span>" + esc(t.q) + "</span> <b>" + esc(t.a) + "</b></li>";
      });
      h += "</ul>";
    }

    if (node && node.q) {
      h += '<div class="ask-card">';
      h += '<p class="ask-step">Question ' + (flow.trail.length + 1) + "</p>";
      h += '<p class="ask-q">' + esc(node.q) + "</p>";
      if (node.hint) h += '<p class="ask-hint">' + esc(node.hint) + "</p>";
      h += '<div class="ask-options">';
      node.options.forEach(function (o, i) {
        h += '<button class="ask-option" onclick="Plant.answer(' + i + ')">' +
               '<span class="key">' + (i + 1) + "</span>" +
               "<span>" + esc(o.label) + "</span>" +
             "</button>";
      });
      h += "</div></div>";
    } else if (node && node.fix) {
      h += '<div class="fix-head">' +
             '<span class="tick">' + svgIcon("check", 20, 2.4) + "</span>" +
             "<h2>" + esc(node.fix.title) + "</h2>" +
           "</div>";
      h += '<ol class="steps">';
      node.fix.steps.forEach(function (s, i) {
        h += '<li class="step"><div class="step-body"><div class="step-head">' +
               '<span class="step-no num">' + (i + 1) + "</span>" +
               '<span class="step-title">' + esc(s) + "</span>" +
             "</div></div></li>";
      });
      h += "</ol>";
      if (node.fix.escalate) {
        h += '<div class="callout danger"><strong>When to stop and call someone</strong>' +
             esc(node.fix.escalate) + "</div>";
      }
    } else {
      h += '<div class="callout danger"><strong>This path is not written yet</strong>' +
           "Ask your boss what happens here, and we will add it.</div>";
    }

    h += '<div class="btn-row">';
    if (flow.trail.length) h += btn("", "back", "Go back one question", "Plant.flowBack()");
    h += btn("", "refresh", "Start this fault again", "Plant.flowRestart()") +
         btn("", "grid", "Pick a different fault", "Plant.go('#/trouble')") +
         btn("primary", "home", "Back to the menu", "Plant.go('#/')") +
         "</div>";

    view.className = "view";
    view.innerHTML = h;
    window.scrollTo(0, 0);
  }

  function answer(optionIndex) {
    var f = byId(FAULTS, flow.faultId);
    var node = f.nodes[flow.nodeId];
    var opt = node.options[optionIndex];
    flow.trail.push({ q: node.q, a: opt.label, from: flow.nodeId });
    flow.nodeId = opt.next;
    renderFlow();
  }

  function flowBack() {
    var last = flow.trail.pop();
    if (last) flow.nodeId = last.from;
    renderFlow();
  }

  function flowRestart() {
    flow = { faultId: flow.faultId, nodeId: "start", trail: [] };
    renderFlow();
  }

  /* =============================================================
     PLANT MAP
     -------------------------------------------------------------
     The drawing is worked out from the arrows, not placed by hand.
     Long chains are folded into bands that snake left, right, left
     down the page, and the whole thing is then scaled to fill the
     screen — so you should never have to zoom to read it.
     ============================================================= */

  var AREA_W = 224, AREA_H = 122;
  var NODE_W = 140, NODE_H = 128;

  var mapZoom = null;       /* null means "work it out and fill the screen" */
  var mapFitScale = 1;
  var mapStreams = null;
  var remountMap = null;

  var DETAIL_KEY = STORE_PREFIX + "mapdetail";
  var mapDetail = "simple";   /* "simple" hides the conveyors, "full" shows everything */

  function loadDetail() {
    try {
      var d = localStorage.getItem(DETAIL_KEY);
      if (d === "simple" || d === "full") mapDetail = d;
    } catch (e) {}
  }

  function setDetail(d) {
    mapDetail = d;
    try { localStorage.setItem(DETAIL_KEY, d); } catch (e) {}
    mapZoom = null;
    route();
  }

  function initStreams() {
    if (mapStreams || !MAP) return;
    mapStreams = {};
    Object.keys(MAP.streams).forEach(function (k) { mapStreams[k] = true; });
  }

  function areaById(id) {
    for (var i = 0; i < AREAS.length; i++) if (AREAS[i].id === id) return AREAS[i];
    return null;
  }

  var machineCache = null;

  function allMachines() {
    if (machineCache) return machineCache;
    machineCache = [];
    AREAS.forEach(function (a) {
      (a.nodes || []).forEach(function (n) { machineCache.push({ node: n, area: a }); });
    });
    return machineCache;
  }

  function machineById(id) {
    var list = allMachines();
    for (var i = 0; i < list.length; i++) if (list[i].node.id === id) return list[i];
    return null;
  }

  /* which fault pages suit which kind of machine */
  var TYPE_FAULTS = {
    cooker: ["cooker-temp", "steam-low"],
    dryer: ["meal-wet", "cooker-temp"],
    press: ["meal-wet", "tallow-quality"],
    decanter: ["tallow-quality"],
    separator: ["tallow-quality"],
    tank: ["tallow-quality"],
    mill: ["mill-trip"],
    screw: ["mill-trip"],
    shaker: ["mill-trip"],
    binfeeder: ["mill-trip"],
    metaldetector: ["foreign-body"],
    bagging: ["foreign-body"],
    pit: ["foreign-body"],
    boiler: ["steam-low"],
    biofilter: ["odour-complaint"],
    fan: ["odour-complaint"],
    condenser: ["odour-complaint"],
    evaporator: ["odour-complaint"],
    daf: ["odour-complaint"],
    contrashear: ["odour-complaint"],
    saturator: ["odour-complaint"]
  };

  /* ---------- layout engine ---------- */

  function layoutGraph(nodes, edges, W, H, gapX, gapY, maxCols, maxRows) {
    var idMap = {}, depth = {}, row = {};
    nodes = nodes || [];
    nodes.forEach(function (n) { idMap[n.id] = n; depth[n.id] = 0; });

    var fwd = (edges || []).filter(function (e) {
      return !e.back && idMap[e.from] && idMap[e.to] && e.from !== e.to;
    });

    for (var pass = 0; pass <= nodes.length; pass++) {
      var changed = false;
      for (var i = 0; i < fwd.length; i++) {
        var e = fwd[i];
        if (depth[e.to] < depth[e.from] + 1) { depth[e.to] = depth[e.from] + 1; changed = true; }
      }
      if (!changed) break;
    }

    var cols = {};
    nodes.forEach(function (n) {
      var d = depth[n.id];
      (cols[d] = cols[d] || []).push(n);
    });
    var keys = Object.keys(cols).map(Number).sort(function (a, b) { return a - b; });

    function predRow(n) {
      var sum = 0, count = 0;
      fwd.forEach(function (e) {
        if (e.to === n.id && row[e.from] !== undefined) { sum += row[e.from]; count++; }
      });
      return count ? sum / count : 1e6;
    }

    keys.forEach(function (k) {
      var list = cols[k];
      if (k > 0) {
        var order = list.map(function (n, i) { return { n: n, r: predRow(n), i: i }; });
        order.sort(function (a, b) { return a.r - b.r || a.i - b.i; });
        list = order.map(function (o) { return o.n; });
        cols[k] = list;
      }
      list.forEach(function (n, i) { row[n.id] = i; });
    });

    /* A column with a lot of machines in it (think ten dosing pumps all
       feeding one DAF) would otherwise make one very tall thin strip.
       So a tall column gets broken into side-by-side sub-columns. The
       process order, left to right, is kept either way. */
    var tallest = 1;
    keys.forEach(function (k) { tallest = Math.max(tallest, cols[k].length); });

    var rowCap = Math.max(1, maxRows || tallest);
    var slots = [];
    keys.forEach(function (k) {
      var list = cols[k];
      for (var i = 0; i < list.length; i += rowCap) slots.push(list.slice(i, i + rowCap));
    });

    var totalCols = slots.length || 1;
    var mc = Math.max(1, Math.min(maxCols || totalCols, totalCols));

    var bands = [];
    for (var c = 0; c < totalCols; c += mc) bands.push(slots.slice(c, c + mc));

    var padX = 34, padY = 30;
    var bandGap = gapY + 34;
    var y = padY, bottom = padY;
    var pos = {}, bandOf = {};

    bands.forEach(function (bandSlots, bi) {
      var rows = 1;
      bandSlots.forEach(function (s) { rows = Math.max(rows, s.length); });
      var bandH = rows * H + (rows - 1) * gapY;
      var ltr = (bi % 2 === 0);

      bandSlots.forEach(function (list, j) {
        var slot = ltr ? j : (mc - 1 - j);
        var cx = padX + slot * (W + gapX) + W / 2;
        var colH = list.length * H + (list.length - 1) * gapY;
        var top = y + (bandH - colH) / 2;
        list.forEach(function (n, i2) {
          pos[n.id] = { x: cx, y: top + i2 * (H + gapY) + H / 2 };
          bandOf[n.id] = bi;
        });
      });

      bottom = y + bandH;
      y = bottom + bandGap;
    });

    var used = Math.min(mc, totalCols);
    return {
      pos: pos,
      bandOf: bandOf,
      width: padX * 2 + used * W + (used - 1) * gapX,
      height: bottom + padY,
      totalCols: totalCols,
      tallest: tallest,
      bands: bands.length
    };
  }

  /* Try every fold width and every column height, and keep whichever
     combination fills the stage biggest. This is what means you should
     never have to zoom. */
  function fitLayout(nodes, edges, W, H, gapX, gapY, stageW, stageH, maxScale) {
    var probe = layoutGraph(nodes, edges, W, H, gapX, gapY, 9999, 9999);
    var rowCap = Math.max(1, Math.min(probe.tallest, 9));
    var best = null;

    /* Work from least-split to most-split, and only accept more
       splitting if it buys a real improvement. Machines that run in
       parallel then stay stacked in one column, which is far easier
       to follow than having them broken up side by side. */
    for (var mr = rowCap; mr >= 1; mr--) {
      var wide = layoutGraph(nodes, edges, W, H, gapX, gapY, 9999, mr);
      var colCap = Math.max(1, Math.min(wide.totalCols, 30));
      for (var mc = colCap; mc >= 1; mc--) {
        var L = layoutGraph(nodes, edges, W, H, gapX, gapY, mc, mr);
        var s = Math.min(stageW / L.width, stageH / L.height);
        if (s > maxScale) s = maxScale;

        if (!best) { best = { L: L, scale: s, mc: mc, mr: mr }; continue; }

        /* same amount of splitting: take any gain.
           more splitting than the best so far: it has to earn it. */
        var sameSplit = (mr === best.mr);
        var needed = sameSplit ? best.scale + 0.004 : best.scale * 1.12;
        if (s > needed) best = { L: L, scale: s, mc: mc, mr: mr };
      }
    }
    return best;
  }

  /* ---------- svg plumbing ---------- */

  function iconMarkup(type, cx, cy, box, color, width) {
    var a = ICONS[type] || ICONS.generic;
    var s = box / 24;
    return '<g transform="translate(' + (cx - box / 2) + "," + (cy - box / 2) +
           ") scale(" + s + ')" fill="none" stroke="' + color + '" stroke-width="' +
           (width || 1.5) + '" stroke-linecap="round" stroke-linejoin="round">' + a + "</g>";
  }

  function wrapLabel(text, maxChars, maxLines) {
    var words = String(text).split(" ");
    var lines = [], cur = "";
    for (var i = 0; i < words.length; i++) {
      var test = cur ? cur + " " + words[i] : words[i];
      if (test.length > maxChars && cur) { lines.push(cur); cur = words[i]; }
      else cur = test;
    }
    if (cur) lines.push(cur);
    var max = maxLines || 2;
    if (lines.length > max) lines = lines.slice(0, max - 1).concat([lines.slice(max - 1).join(" ")]);
    return lines;
  }

  function svgDefs() {
    var s = "<defs>";
    Object.keys(MAP.streams).forEach(function (k) {
      var c = streamColor(k);
      s += '<marker id="arw-' + k + '" viewBox="0 0 10 10" refX="8.6" refY="5" ' +
           'markerWidth="5.4" markerHeight="5.4" orient="auto">' +
           '<path d="M0 1.2 L9 5 L0 8.8 z" fill="' + c + '"/></marker>';
    });
    if (dark()) {
      s += '<filter id="nodeGlow" x="-40%" y="-40%" width="180%" height="180%">' +
           '<feDropShadow dx="0" dy="3" stdDeviation="5" flood-color="#000" flood-opacity=".55"/>' +
           "</filter>";
    }
    return s + "</defs>";
  }

  function edgePath(a, b, sa, sb, back) {
    var dx = b.x - a.x, dy = b.y - a.y;

    if (back) {
      var low = Math.max(a.y + sa.hh, b.y + sb.hh) + 22;
      return "M" + a.x + " " + (a.y + sa.hh) + " V" + low + " H" + b.x + " V" + (b.y + sb.hh);
    }

    /* straight down or up — this is how the snake folds */
    if (Math.abs(dx) < 3) {
      return dy > 0
        ? "M" + a.x + " " + (a.y + sa.hh) + " V" + (b.y - sb.hh)
        : "M" + a.x + " " + (a.y - sa.hh) + " V" + (b.y + sb.hh);
    }

    /* same row — straight across, either direction */
    if (Math.abs(dy) < 3) {
      return dx > 0
        ? "M" + (a.x + sa.hw) + " " + a.y + " H" + (b.x - sb.hw)
        : "M" + (a.x - sa.hw) + " " + a.y + " H" + (b.x + sb.hw);
    }

    /* close across but different row — drop out of the bottom and over */
    if (Math.abs(dx) < (sa.hw + sb.hw) * 1.5) {
      var sy = dy > 0 ? a.y + sa.hh : a.y - sa.hh;
      var ey = dy > 0 ? b.y - sb.hh : b.y + sb.hh;
      var jog = dy > 0 ? ey - 16 : ey + 16;
      return "M" + a.x + " " + sy + " V" + jog + " H" + b.x + " V" + ey;
    }

    /* plenty of room — classic dogleg through the middle */
    var ax = dx > 0 ? a.x + sa.hw : a.x - sa.hw;
    var bx = dx > 0 ? b.x - sb.hw : b.x + sb.hw;
    var mx = (ax + bx) / 2;
    return "M" + ax + " " + a.y + " H" + mx + " V" + b.y + " H" + bx;
  }

  function drawEdges(edges, pos, sizes, showLabels, cellW, cellH) {
    var s = "", labels = "";
    var fallback = { hw: NODE_W / 2, hh: NODE_H / 2 };

    /* Writing that lands on top of a machine is worse than no
       writing at all, so a label is nudged up or down to find a
       clear spot and dropped if it cannot. */
    var cells = [];
    if (cellW) {
      Object.keys(pos).forEach(function (id) {
        cells.push({ x: pos[id].x, y: pos[id].y });
      });
    }
    function clear(lx, ly) {
      if (!cellW) return true;
      for (var i = 0; i < cells.length; i++) {
        if (Math.abs(lx - cells[i].x) < cellW * 0.46 &&
            Math.abs(ly - cells[i].y) < cellH * 0.42) return false;
      }
      return true;
    }
    function place(lx, ly) {
      if (clear(lx, ly)) return ly;
      var tries = [-18, 18, -32, 32, -46, 46];
      for (var i = 0; i < tries.length; i++) {
        if (clear(lx, ly + tries[i])) return ly + tries[i];
      }
      return null;
    }
    (edges || []).forEach(function (e) {
      if (mapStreams[e.stream] === false) return;
      var a = pos[e.from], b = pos[e.to];
      if (!a || !b) return;
      var sa = sizes[e.from] || fallback;
      var sb = sizes[e.to] || fallback;
      var col = streamColor(e.stream);
      var d = edgePath(a, b, sa, sb, e.back);

      if (e.dashed) {
        s += '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="2.2" ' +
             'stroke-dasharray="8 6" stroke-linejoin="round" opacity=".8" ' +
             'marker-end="url(#arw-' + e.stream + ')"/>';
      } else {
        s += '<path d="' + d + '" fill="none" stroke="' + col + '" stroke-width="2.6" ' +
             'stroke-linejoin="round" opacity="' + (dark() ? ".55" : ".95") + '" ' +
             'marker-end="url(#arw-' + e.stream + ')"/>';
        if (dark()) {
          s += '<path class="flow" d="' + d + '" fill="none" stroke="' + col + '" ' +
               'stroke-width="2.6" stroke-linejoin="round" opacity=".95"/>';
        }
      }

      if (showLabels && e.label) {
        /* put the writing in the GAP between the two machines, not
           halfway between their middles, or a wide machine sits on
           top of it */
        var lx = (a.x + b.x) / 2;
        if (Math.abs(b.y - a.y) < 3 && Math.abs(b.x - a.x) > 3) {
          lx = b.x > a.x
            ? ((a.x + sa.hw) + (b.x - sb.hw)) / 2
            : ((a.x - sa.hw) + (b.x + sb.hw)) / 2;
        }
        /* a return loop runs under the row, so its label goes down
           there with it rather than over the machines */
        var ly = e.back
          ? Math.max(a.y + sa.hh, b.y + sb.hh) + 18
          : ((a.y + b.y) / 2) - 7;

        var fy = e.back ? ly : place(lx, ly);
        if (fy !== null) {
          labels += '<text class="map-edgelabel" x="' + lx + '" y="' + fy + '" fill="' + col +
                    '" style="stroke:' + canvasColor() + '">' + esc(e.label) + "</text>";
        }
      }
    });
    return s + labels;
  }

  function guessBadge(x, y) {
    var bg = dark() ? "#2a2012" : "#ffd400";
    var fg = dark() ? "#ffb74d" : "#15130f";
    return '<circle cx="' + x + '" cy="' + y + '" r="9.5" fill="' + bg + '" stroke="' + fg +
           '" stroke-width="1.8"/>' +
           '<text class="map-guess" x="' + x + '" y="' + (y + 4.2) + '" fill="' + fg + '">?</text>';
  }

  function alarmBadge(x, y) {
    var c = dark() ? "#ff6b60" : "#b3160f";
    return '<circle cx="' + x + '" cy="' + y + '" r="5.2" fill="' + c + '" opacity=".9"/>';
  }

  /* ---------- node painters ---------- */

  function drawAreaPlate(n, p) {
    var sk = skin(n.plant);
    var x = p.x - AREA_W / 2, y = p.y - AREA_H / 2;
    var s = '<g class="mnode" onclick="Plant.go(\'#/map/' + n.id + '\')" role="button" ' +
            'tabindex="0" aria-label="' + esc(n.label) + '">';

    s += '<rect class="plate" x="' + x + '" y="' + y + '" width="' + AREA_W + '" height="' + AREA_H +
         '" rx="' + (dark() ? 15 : 4) + '" fill="' + sk.plate + '" stroke="' + sk.stroke +
         '" stroke-width="' + (dark() ? 1.8 : 3) + '"' +
         (dark() ? ' filter="url(#nodeGlow)"' : "") + "/>";

    if (dark()) {
      s += '<path d="M' + (x + 14) + " " + (y + 1) + " H" + (x + AREA_W - 14) +
           '" stroke="' + sk.stroke + '" stroke-width="1.6" opacity=".45"/>';
      s += '<rect x="' + x + '" y="' + (y + 16) + '" width="3.4" height="' + (AREA_H - 32) +
           '" rx="1.7" fill="' + sk.accent + '" opacity=".9"/>';
    } else {
      s += '<rect x="' + x + '" y="' + y + '" width="' + AREA_W + '" height="8" fill="' +
           sk.accent + '"/>';
    }

    s += iconMarkup(n.type, x + 40, p.y - 4, 34, sk.accent, 1.45);

    wrapLabel(n.label, 19, 3).forEach(function (line, i) {
      s += '<text class="area-label" x="' + (x + 68) + '" y="' + (y + 40 + i * 16) +
           '" fill="' + sk.text + '">' + esc(line) + "</text>";
    });

    s += '<text class="area-count" x="' + (x + 68) + '" y="' + (y + AREA_H - 16) +
         '" fill="' + (dark() ? "#7f968e" : "#6f6a60") + '">' +
         (n.pending ? "photos to come" : n.count + (n.count === 1 ? " machine" : " machines")) +
         "</text>";

    s += "</g>";
    return s;
  }

  /* =============================================================
     HOW A MACHINE IS DRAWN
     -------------------------------------------------------------
     On your control room screens a tank looks like a tank and a
     conveyor is just a bar. That is what makes them readable at a
     glance. So each type gets its own silhouette and its own size,
     rather than everything being the same rounded box.
     ============================================================= */

  var PLATE_H = 66;    /* reference height a shape is scaled against */
  var PLATE_BAND = 80; /* the room set aside for the body, so a tall
                          tank can never reach down into its own label */

  function plateShape(type) {
    switch (type) {
      case "tank":          return { kind: "cyl",    w: 0.50, h: 1.14 };
      case "silo":          return { kind: "silo",   w: 0.56, h: 1.16 };
      case "bin":
      case "binfeeder":     return { kind: "hopper", w: 0.70, h: 1.00 };
      case "pit":           return { kind: "pit",    w: 0.80, h: 0.84 };
      case "cooker":
      case "dryer":         return { kind: "drum",   w: 1.00, h: 0.70 };
      case "decanter":
      case "press":
      case "contrashear":   return { kind: "cone",   w: 0.96, h: 0.72 };
      case "separator":     return { kind: "bowl",   w: 0.62, h: 1.00 };
      case "evaporator":    return { kind: "column", w: 0.46, h: 1.14 };
      case "boiler":
      case "daf":
      case "bloodplant":
      case "biofilter":     return { kind: "box",    w: 0.92, h: 0.84 };
      case "saturator":     return { kind: "cyl",    w: 0.44, h: 1.04 };
      case "condenser":     return { kind: "box",    w: 0.92, h: 0.72 };
      case "pump":
      case "dosingpump":    return { kind: "circle", w: 0.40, h: 0.56 };
      case "fan":           return { kind: "circle", w: 0.44, h: 0.62 };
      case "mill":          return { kind: "circle", w: 0.52, h: 0.74 };
      case "valve":         return { kind: "valve",  w: 0.40, h: 0.52 };
      case "shaker":        return { kind: "deck",   w: 0.92, h: 0.56 };
      case "screw":         return { kind: "bar",    w: 1.04, h: 0.40 };
      case "metaldetector": return { kind: "arch",   w: 0.70, h: 0.80 };
      case "bagging":       return { kind: "sack",   w: 0.58, h: 0.92 };
      default:              return { kind: "box",    w: 0.88, h: 0.84 };
    }
  }

  /* how far out from the middle an arrow should stop */
  function plateSize(n, cellW) {
    var s = plateShape(n.type);
    var w = cellW * s.w, h = PLATE_H * s.h;
    return { hw: w / 2 + 7, hh: h / 2 + 7, w: w, h: h, kind: s.kind };
  }

  /* a level bar inside a vessel, the way your screens show them */
  function levelOf(n) {
    if (!n.values) return null;
    for (var i = 0; i < n.values.length; i++) {
      var v = n.values[i];
      if (!/level/i.test(String(v.k))) continue;
      var m = String(v.v).match(/([\d.]+)\s*%/);
      if (m) {
        var pct = parseFloat(m[1]);
        if (pct >= 0 && pct <= 100) return pct;
      }
    }
    return null;
  }

  function platePath(kind, cx, cy, w, h) {
    var x = cx - w / 2, y = cy - h / 2, r = w / 2;

    switch (kind) {
      case "cyl":
        return "M" + x + " " + (y + 7) + " A" + r + " 7 0 0 1 " + (x + w) + " " + (y + 7) +
               " V" + (y + h - 7) + " A" + r + " 7 0 0 1 " + x + " " + (y + h - 7) + " Z";
      case "silo":
        return "M" + x + " " + (y + 8) + " A" + r + " 8 0 0 1 " + (x + w) + " " + (y + 8) +
               " V" + (y + h - 16) + " L" + cx + " " + (y + h) +
               " L" + x + " " + (y + h - 16) + " Z";
      case "hopper":
        return "M" + x + " " + y + " H" + (x + w) + " L" + (cx + w * 0.17) + " " + (y + h) +
               " H" + (cx - w * 0.17) + " Z";
      case "pit":
        return "M" + x + " " + y + " H" + (x + w) + " L" + (x + w - 7) + " " + (y + h) +
               " H" + (x + 7) + " Z";
      case "drum":
        return "M" + (x + h / 2) + " " + y + " H" + (x + w - h / 2) +
               " A" + (h / 2) + " " + (h / 2) + " 0 0 1 " + (x + w - h / 2) + " " + (y + h) +
               " H" + (x + h / 2) +
               " A" + (h / 2) + " " + (h / 2) + " 0 0 1 " + (x + h / 2) + " " + y + " Z";
      case "cone":
        return "M" + x + " " + y + " H" + (x + w * 0.62) + " L" + (x + w) + " " + cy +
               " L" + (x + w * 0.62) + " " + (y + h) + " H" + x + " Z";
      case "bowl":
        return "M" + cx + " " + y + " L" + (x + w) + " " + (y + h * 0.42) +
               " L" + (cx + w * 0.22) + " " + (y + h) + " H" + (cx - w * 0.22) +
               " L" + x + " " + (y + h * 0.42) + " Z";
      case "column":
        return "M" + x + " " + (y + 9) + " A" + r + " 9 0 0 1 " + (x + w) + " " + (y + 9) +
               " V" + (y + h - 9) + " A" + r + " 9 0 0 1 " + x + " " + (y + h - 9) + " Z";
      case "circle":
        var rr = Math.min(w, h) / 2;
        return "M" + (cx - rr) + " " + cy + " a" + rr + " " + rr + " 0 1 0 " + (rr * 2) + " 0" +
               " a" + rr + " " + rr + " 0 1 0 " + (-rr * 2) + " 0 Z";
      case "valve":
        return "M" + x + " " + y + " L" + (x + w) + " " + (y + h) +
               " H" + x + " L" + (x + w) + " " + y + " Z";
      case "deck":
        return "M" + x + " " + (y + h * 0.3) + " L" + (x + w) + " " + y +
               " V" + (y + h * 0.7) + " L" + x + " " + (y + h) + " Z";
      case "bar":
        return "M" + (x + h / 2) + " " + y + " H" + (x + w - h / 2) +
               " a" + (h / 2) + " " + (h / 2) + " 0 0 1 0 " + h +
               " H" + (x + h / 2) + " a" + (h / 2) + " " + (h / 2) + " 0 0 1 0 " + (-h) + " Z";
      case "arch":
        return "M" + x + " " + (y + h) + " V" + (y + w / 2) +
               " A" + r + " " + (w / 2) + " 0 0 1 " + (x + w) + " " + (y + w / 2) +
               " V" + (y + h) + " Z";
      case "sack":
        return "M" + (x + w * 0.2) + " " + y + " H" + (x + w * 0.8) +
               " L" + (x + w) + " " + (y + h * 0.26) + " V" + (y + h) +
               " H" + x + " V" + (y + h * 0.26) + " Z";
      default:
        var rad = dark() ? 9 : 2;
        return "M" + (x + rad) + " " + y + " H" + (x + w - rad) +
               " a" + rad + " " + rad + " 0 0 1 " + rad + " " + rad +
               " V" + (y + h - rad) + " a" + rad + " " + rad + " 0 0 1 " + (-rad) + " " + rad +
               " H" + (x + rad) + " a" + rad + " " + rad + " 0 0 1 " + (-rad) + " " + (-rad) +
               " V" + (y + rad) + " a" + rad + " " + rad + " 0 0 1 " + rad + " " + (-rad) + " Z";
    }
  }

  /* the dashed block that says "this carries on into the next area" */
  function drawHandover(n, p, plantKey, cellW, hash) {
    var sk = skin(plantKey);
    var w = cellW * 0.80, h = PLATE_H * 0.64;
    var top = p.y - NODE_H / 2;
    var cy = top + PLATE_BAND / 2;
    var x = p.x - w / 2, y = cy - h / 2;

    var s = hash
      ? '<g class="mnode" onclick="Plant.go(\'' + hash + '\')" role="button" tabindex="0">'
      : "<g>";

    s += '<rect class="hit" x="' + (p.x - cellW / 2) + '" y="' + (p.y - NODE_H / 2) +
         '" width="' + cellW + '" height="' + NODE_H + '" rx="8"/>';
    s += '<rect class="plate" x="' + x + '" y="' + y + '" width="' + w + '" height="' + h +
         '" rx="' + (dark() ? 10 : 2) + '" fill="none" stroke="' + sk.stroke +
         '" stroke-width="1.8" stroke-dasharray="7 6" opacity=".75"/>';
    s += iconMarkup(hash ? "screw" : "generic", p.x, cy, 22, sk.accent, 1.4);

    wrapLabel(n.label, Math.round(cellW / 7), 3).forEach(function (line, i) {
      s += '<text class="map-nodelabel" x="' + p.x + '" y="' + (top + PLATE_BAND + 14 + i * 12.5) +
           '" fill="' + (dark() ? "#8ba9a1" : "#4e4a42") + '">' + esc(line) + "</text>";
    });

    return s + "</g>";
  }

  function drawMachinePlate(n, p, plantKey, cellW) {
    var sk = skin(plantKey);
    var size = plateSize(n, cellW);
    var sh = plateShape(n.type);
    var w = size.w, h = size.h;
    var top = p.y - NODE_H / 2;
    var cy = top + PLATE_BAND / 2;

    var s = '<g class="mnode" onclick="Plant.go(\'#/m/' + n.id + '\')" role="button" ' +
            'tabindex="0" aria-label="' + esc(n.label) + '">';

    /* a transparent pad so the whole cell is tappable, not just the shape */
    s += '<rect class="hit" x="' + (p.x - cellW / 2) + '" y="' + (p.y - NODE_H / 2) +
         '" width="' + cellW + '" height="' + NODE_H + '" rx="8"/>';

    var d = platePath(sh.kind, p.x, cy, w, h);
    s += '<path class="plate" d="' + d + '" fill="' + sk.plate + '" stroke="' + sk.stroke +
         '" stroke-width="' + (dark() ? 1.7 : 2.6) + '" stroke-linejoin="round"' +
         (dark() ? ' filter="url(#nodeGlow)"' : "") + "/>";

    /* level bar for vessels, like the bars on your screens */
    var pct = levelOf(n);
    if (pct !== null && /cyl|silo|hopper|column|box|pit/.test(sh.kind)) {
      var bw = Math.max(7, w * 0.17);
      var bx = p.x + w / 2 - bw - 4;
      var byTop = cy - h / 2 + 10;
      var bh = h - 20;
      if (bh > 10) {
        s += '<rect x="' + bx + '" y="' + byTop + '" width="' + bw + '" height="' + bh +
             '" rx="2" fill="' + (dark() ? "#000" : "#efeee8") + '" opacity=".55"/>';
        var fh = bh * (pct / 100);
        s += '<rect x="' + bx + '" y="' + (byTop + bh - fh) + '" width="' + bw +
             '" height="' + fh + '" rx="2" fill="' + sk.accent + '" opacity=".92"/>';
      }
    }

    /* the icon sits in the body, scaled to whatever room there is */
    var box = Math.max(16, Math.min(30, Math.min(w, h) * 0.72));
    s += iconMarkup(n.type, p.x, cy, box, sk.accent, 1.45);

    /* writing goes underneath the machine, not inside it */
    var ty = top + PLATE_BAND + 14;
    if (n.tag) {
      s += '<text class="map-tag" x="' + p.x + '" y="' + ty + '" fill="' + sk.accent + '">' +
           esc(n.tag) + "</text>";
      ty += 13;
    }
    wrapLabel(n.label, Math.round(cellW / 7.2), n.tag ? 2 : 3).forEach(function (line, i) {
      s += '<text class="map-nodelabel" x="' + p.x + '" y="' + (ty + i * 12.5) + '" fill="' +
           sk.text + '">' + esc(line) + "</text>";
    });

    /* badges sit on the corners of the cell, so they are always in
       the same place whatever shape the machine is */
    var cl = p.x - cellW / 2, ct = p.y - NODE_H / 2;
    if (n.guess) s += guessBadge(cl + cellW - 13, ct + 13);
    if (n.alarms && n.alarms.length) s += alarmBadge(cl + 13, ct + 13);

    s += "</g>";
    return s;
  }

  /* =============================================================
     SIMPLE VIEW
     -------------------------------------------------------------
     On your screens a run of conveyors is a line, not a row of
     boxes. Simple view does the same: it hides the conveyors and
     inline valves and names them on the arrow instead. Plant 1
     Receival drops from 17 boxes to 4.
     ============================================================= */

  var MINOR_TYPES = { screw: 1, valve: 1 };

  function isMinor(n) {
    return !!MINOR_TYPES[n.type] && !n.keepInSimple;
  }

  function viaLabel(list) {
    if (!list.length) return null;
    if (list.length === 1) return list[0];
    if (list.length === 2) return list.join(", ");
    return list[0] + " \u2026 " + list[list.length - 1] + " (" + list.length + ")";
  }

  function simplifyGraph(nodes, edges, inLabel, outLabel) {
    nodes = nodes || [];
    edges = edges || [];

    var major = nodes.filter(function (n) { return !isMinor(n); });
    if (!major.length || major.length === nodes.length) return null;

    var byId = {};
    nodes.forEach(function (n) { byId[n.id] = n; });

    var out = {}, hasIncoming = {};
    edges.forEach(function (e) {
      if (!byId[e.from] || !byId[e.to]) return;
      (out[e.from] = out[e.from] || []).push(e);
      hasIncoming[e.to] = true;
    });

    var newEdges = [];
    var seenPair = {};
    var needIn = false, needOut = false;

    /* Walk forward from a starting point, stepping over the minor
       machines and collecting their names. Where a run leaves the
       area entirely it lands on a hand-over block instead of just
       disappearing. */
    function walk(startId, startIsEntry) {
      var stack = [{ id: startId, through: [], stream: null, dashed: false,
                     label: null, back: false, depth: 0 }];
      var guard = 0;

      while (stack.length && guard++ < 6000) {
        var cur = stack.pop();
        var outs = out[cur.id] || [];

        /* a run that stops at a conveyor is heading out of the area */
        if (!outs.length && cur.through.length) {
          var ko = startId + ">__out__";
          if (!seenPair[ko]) {
            seenPair[ko] = 1;
            needOut = true;
            newEdges.push({
              from: startId, to: "__out__",
              stream: cur.stream || "meal", dashed: cur.dashed,
              label: cur.label || viaLabel(cur.through)
            });
          }
          continue;
        }

        outs.forEach(function (e) {
          var next = byId[e.to];
          if (!next) return;
          var stream = cur.stream || e.stream;
          var dashed = cur.dashed || !!e.dashed;
          var label = cur.label || e.label || null;

          if (isMinor(next)) {
            if (cur.depth > 26) return;
            stack.push({
              id: next.id,
              through: cur.through.concat([next.tag || next.label]),
              stream: stream, dashed: dashed, label: label,
              back: cur.back || !!e.back,
              depth: cur.depth + 1
            });
            return;
          }

          var from = startIsEntry ? "__in__" : startId;
          var key = from + ">" + next.id;
          if (seenPair[key]) return;
          seenPair[key] = 1;
          if (startIsEntry) needIn = true;

          newEdges.push({
            from: from, to: next.id, stream: stream,
            dashed: dashed, back: cur.back || !!e.back,
            label: label || viaLabel(cur.through)
          });
        });
      }
    }

    major.forEach(function (m) { walk(m.id, false); });

    /* conveyor runs that start the area, with nothing feeding them */
    nodes.forEach(function (n) {
      if (isMinor(n) && !hasIncoming[n.id]) walk(n.id, true);
    });

    var finalNodes = major.slice();

    if (needIn) {
      finalNodes.unshift({
        id: "__in__", label: inLabel || "Comes in from another area",
        type: "generic", keepInSimple: true, handover: true
      });
    }
    if (needOut) {
      finalNodes.push({
        id: "__out__", label: outLabel || "Goes on to another area",
        type: "generic", keepInSimple: true, handover: true
      });
    }

    return { nodes: finalNodes, edges: newEdges, hidden: nodes.length - major.length };
  }

  /* ---------- the stage ---------- */

  function sizeStage(stage) {
    if (document.body.classList.contains("map-full")) {
      stage.style.height = "";
      return;
    }
    var top = stage.getBoundingClientRect().top + window.pageYOffset;
    var h = Math.max(380, window.innerHeight - (top - window.pageYOffset) - 26);
    stage.style.height = h + "px";
  }

  function mapOverlayZoom() {
    return '<div class="map-overlay tr">' +
             '<button class="icon-btn" onclick="Plant.mapZoomBy(-0.12)" title="Zoom out" ' +
               'aria-label="Zoom out">' + svgIcon("minus", 18) + "</button>" +
             '<span class="zoom-val num" id="zoomVal">100%</span>' +
             '<button class="icon-btn" onclick="Plant.mapZoomBy(0.12)" title="Zoom in" ' +
               'aria-label="Zoom in">' + svgIcon("plus", 18) + "</button>" +
             '<button class="icon-btn wide" onclick="Plant.mapZoomFit()" title="Fit to screen">' +
               svgIcon("fit", 17) + "<span>Fit</span></button>" +
             '<button class="icon-btn" id="fullBtn" onclick="Plant.mapFull()" ' +
               'title="Full screen" aria-label="Full screen">' + svgIcon("expand", 18) + "</button>" +
           "</div>";
  }

  function detailToggle() {
    return '<div class="map-overlay bl">' +
             '<div class="seg">' +
               '<button class="seg-btn' + (mapDetail === "simple" ? " on" : "") + '" ' +
                 'onclick="Plant.setDetail(\'simple\')">Simple</button>' +
               '<button class="seg-btn' + (mapDetail === "full" ? " on" : "") + '" ' +
                 'onclick="Plant.setDetail(\'full\')">Every machine</button>' +
             "</div>" +
             '<span class="detail-hint" id="detailHint"></span>' +
           "</div>";
  }

  function streamChips() {
    var h = '<div class="map-overlay tl">';
    Object.keys(MAP.streams).forEach(function (k) {
      var c = streamColor(k);
      h += '<button class="map-chip' + (mapStreams[k] ? " on" : "") + '" ' +
             'style="--chip:' + c + '" onclick="Plant.mapToggle(\'' + k + '\')">' +
             '<span class="dot"></span>' + esc(MAP.streams[k].label) + "</button>";
    });
    return h + "</div>";
  }

  function setZoomLabel(s) {
    var el = document.getElementById("zoomVal");
    if (el) el.textContent = Math.round(s * 100) + "%";
  }

  function paintMap(spec) {
    var stage = document.getElementById("mapStage");
    var scroll = document.getElementById("mapScroll");
    if (!stage || !scroll) return;

    sizeStage(stage);

    /* the scroll box is padded so the floating controls never sit on
       top of a machine — take that padding off the space we can use */
    var cs = window.getComputedStyle(scroll);
    var padW = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    var padH = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);

    var sw = Math.max(240, scroll.clientWidth - padW - 4);
    var sh = Math.max(240, scroll.clientHeight - padH - 4);

    var best = fitLayout(spec.nodes, spec.edges, spec.W, spec.H,
                         spec.gapX, spec.gapY, sw, sh, spec.maxScale || 1.25);
    mapFitScale = best.scale;

    var scale = mapZoom || best.scale;
    var L = best.L;

    /* each machine knows its own size, so arrows stop at the shape
       rather than at an invisible box around it */
    var sizes = {};
    spec.nodes.forEach(function (n) {
      sizes[n.id] = spec.sizeOf ? spec.sizeOf(n) : { hw: spec.W / 2, hh: spec.H / 2 };
    });

    var svg = '<svg class="plantmap" viewBox="0 0 ' + L.width + " " + L.height + '" ' +
              'width="' + Math.round(L.width * scale) + '" height="' +
              Math.round(L.height * scale) + '" xmlns="http://www.w3.org/2000/svg">';
    svg += svgDefs();
    svg += drawEdges(spec.edges, L.pos, sizes, spec.labels && scale >= 0.5,
                     spec.W, spec.H);
    spec.nodes.forEach(function (n) {
      var p = L.pos[n.id];
      if (p) svg += spec.paint(n, p);
    });
    svg += "</svg>";

    scroll.innerHTML = svg;
    setZoomLabel(scale);
    enableDragScroll(scroll);
  }

  function enableDragScroll(el) {
    if (!el || el.dataset.drag === "1") return;
    el.dataset.drag = "1";
    var down = false, sx = 0, sy = 0, sl = 0, st = 0;
    el.addEventListener("mousedown", function (e) {
      if (e.target.closest && e.target.closest(".mnode")) return;
      down = true; sx = e.pageX; sy = e.pageY; sl = el.scrollLeft; st = el.scrollTop;
      el.classList.add("grabbing");
    });
    window.addEventListener("mouseup", function () {
      down = false; el.classList.remove("grabbing");
    });
    el.addEventListener("mousemove", function (e) {
      if (!down) return;
      e.preventDefault();
      el.scrollLeft = sl - (e.pageX - sx);
      el.scrollTop = st - (e.pageY - sy);
    });
  }

  function mapToggle(stream) {
    initStreams();
    mapStreams[stream] = !mapStreams[stream];
    var el = document.querySelector('.map-chip[onclick*="\'' + stream + '\'"]');
    if (el) el.classList.toggle("on", !!mapStreams[stream]);
    if (remountMap) remountMap();
  }

  function mapZoomBy(d) {
    var cur = mapZoom || mapFitScale;
    mapZoom = Math.max(0.25, Math.min(2.2, Math.round((cur + d) * 100) / 100));
    if (remountMap) remountMap();
  }

  function mapZoomFit() {
    mapZoom = null;
    if (remountMap) remountMap();
  }

  function mapFull() {
    document.body.classList.toggle("map-full");
    var b = document.getElementById("fullBtn");
    if (b) b.innerHTML = svgIcon(
      document.body.classList.contains("map-full") ? "collapse" : "expand", 18);
    mapZoom = null;
    if (remountMap) remountMap();
  }

  /* ---------- level 1: the whole plant ---------- */

  function renderMapOverview() {
    if (!MAP) return renderNotFound();
    initStreams();

    var nodes = AREAS.map(function (a) {
      return { id: a.id, label: a.title, type: a.icon, plant: a.plant,
               count: (a.nodes || []).length, pending: a.pending };
    });
    var edges = [];
    AREAS.forEach(function (a) {
      (a.to || []).forEach(function (t) {
        if (areaById(t)) edges.push({ from: a.id, to: t, stream: "raw" });
      });
    });

    var h = '<div class="map-page">';
    h += '<div class="map-head"><div class="map-headtext">' +
           "<h1>Plant Map</h1>" +
           '<p class="lede" style="margin:4px 0 0">The whole plant, in the same order as your ' +
           "control room screens. Tap an area to go inside it.</p>" +
         "</div>" +
         '<div class="legend-inline">' +
           Object.keys(MAP.plants).map(function (k) {
             var sk = skin(k);
             return '<span class="plant-chip" style="background:' + sk.plate + ";border-color:" +
                    sk.stroke + ";color:" + sk.text + '">' + esc(MAP.plants[k].label) + "</span>";
           }).join("") +
         "</div></div>";

    h += '<div class="map-stage" id="mapStage">' +
           mapOverlayZoom() +
           '<div class="map-overlay bl">Tap an area \u00B7 drag to move \u00B7 ' +
             AREAS.length + " areas</div>" +
           '<div class="map-scroll" id="mapScroll"></div>' +
         "</div>";

    h += '<div class="map-extra">';
    h += '<div class="callout warn" style="margin-top:16px">' +
         "<strong>Built from your control room screens</strong>" +
         "Areas and machine numbers come straight off your screens. Anything with an orange " +
         "<b>?</b> inside is still a guess. Silos, milling and bagging are waiting on photos.</div>";

    h += "<h2>Jump straight to an area</h2>";
    h += '<div class="tile-grid">';
    AREAS.forEach(function (a) {
      var sk = skin(a.plant);
      h += tile("#/map/" + a.id, a.icon, "", a.title,
                MAP.plants[a.plant].label,
                { accent: sk.accent, tint: dark() ? sk.plate : "#fff",
                  meta: ((a.nodes || []).length) + " machines" });
    });
    h += "</div>";
    h += '<div class="btn-row">' + btn("primary", "home", "Back to the menu", "Plant.go('#/')") + "</div>";
    h += "</div></div>";

    view.className = "view wide";
    view.innerHTML = h;
    window.scrollTo(0, 0);

    remountMap = function () {
      paintMap({
        nodes: nodes, edges: edges,
        W: AREA_W, H: AREA_H, gapX: 58, gapY: 26,
        labels: false, maxScale: 1.15,
        sizeOf: function () { return { hw: AREA_W / 2, hh: AREA_H / 2 }; },
        paint: function (n, p) { return drawAreaPlate(n, p); }
      });
    };
    remountMap();
  }

  /* ---------- level 2: inside one area ---------- */

  function renderArea(id) {
    var a = areaById(id);
    if (!a) return renderNotFound();
    initStreams();

    var sk = skin(a.plant);
    var i = AREAS.indexOf(a);

    var h = '<div class="map-page">';

    h += '<div class="machine-head" style="border-left-color:' + sk.accent + '">' +
           '<span class="machine-icon" style="color:' + sk.accent + '">' +
             '<svg viewBox="0 0 56 56" width="42" height="42">' +
               iconMarkup(a.icon, 28, 28, 42, sk.accent, 1.5) +
             "</svg></span>" +
           '<div class="machine-headtext">' +
             '<span class="machine-tag">' + esc(MAP.plants[a.plant].label) + "</span>" +
             "<h1>" + esc(a.title) + "</h1>" +
             '<p class="lede" style="margin:4px 0 0">' + ((a.nodes || []).length) +
               " machines \u00B7 area " + (i + 1) + " of " + AREAS.length + "</p>" +
           "</div></div>";

    h += '<div class="map-stage" id="mapStage">' +
           streamChips() +
           mapOverlayZoom() +
           detailToggle() +
           '<div class="map-scroll" id="mapScroll"></div>' +
         "</div>";

    h += '<div class="map-extra">';

    if (a.summary) {
      h += '<div class="card" style="margin-top:16px"><h3>What happens here</h3><div>' +
           esc(a.summary) + "</div></div>";
    }
    if (a.note) {
      h += '<div class="callout warn"><strong>Check this with me</strong>' + esc(a.note) + "</div>";
    }

    h += '<div class="btn-row">';
    if (i > 0) {
      h += btn("", "back", "Back: " + AREAS[i - 1].title, "Plant.go('#/map/" + AREAS[i - 1].id + "')");
    }
    if (i < AREAS.length - 1) {
      h += btn("", "next", "Next: " + AREAS[i + 1].title, "Plant.go('#/map/" + AREAS[i + 1].id + "')");
    }
    h += "</div>";

    if ((a.to || []).length) {
      h += '<div class="card"><h3>Feeds into</h3><div class="joined-list">';
      a.to.forEach(function (t) {
        var nx = areaById(t);
        if (nx) {
          h += '<button class="joined-btn" onclick="Plant.go(\'#/map/' + nx.id + '\')">' +
               esc(nx.title) + "<span>" + ((nx.nodes || []).length) + " machines</span></button>";
        }
      });
      h += "</div></div>";
    }

    h += '<div class="btn-row">' +
           btn("primary", "map", "Back to the whole plant", "Plant.go('#/map')") +
           btn("", "print", "Print this area", "window.print()") +
           btn("", "home", "Menu", "Plant.go('#/')") +
         "</div>";
    h += "</div></div>";

    view.className = "view wide";
    view.innerHTML = h;
    window.scrollTo(0, 0);

    var feeders = AREAS.filter(function (x) { return (x.to || []).indexOf(a.id) !== -1; });
    var targets = (a.to || []).map(areaById).filter(Boolean);

    var inLabel = feeders.length
      ? "From " + feeders.map(function (f) { return f.title; }).join(" and ")
      : "Raw material in";
    var outLabel = targets.length
      ? "On to " + targets.map(function (t) { return t.title; }).join(" and ")
      : "Out of this area";

    remountMap = function () {
      var simple = mapDetail === "simple"
        ? simplifyGraph(a.nodes, a.edges, inLabel, outLabel)
        : null;
      var useNodes = simple ? simple.nodes : (a.nodes || []);
      var useEdges = simple ? simple.edges : (a.edges || []);

      /* with fewer machines on screen they can be drawn bigger */
      var cellW = simple ? 168 : NODE_W;

      var jump = {
        __in__: feeders.length ? "#/map/" + feeders[0].id : null,
        __out__: targets.length ? "#/map/" + targets[0].id : null
      };

      paintMap({
        nodes: useNodes, edges: useEdges,
        W: cellW, H: NODE_H, gapX: simple ? 58 : 44, gapY: 24,
        labels: true, maxScale: simple ? 1.5 : 1.3,
        sizeOf: function (n) { return plateSize(n, cellW); },
        paint: function (n, p) {
          return n.handover
            ? drawHandover(n, p, a.plant, cellW, jump[n.id])
            : drawMachinePlate(n, p, a.plant, cellW);
        }
      });

      var hint = document.getElementById("detailHint");
      if (hint) {
        hint.textContent = simple
          ? simple.hidden + " conveyors and valves folded into the arrows"
          : (a.nodes || []).length + " machines, everything shown";
      }
    };
    remountMap();
  }

  /* =============================================================
     ONE MACHINE
     ============================================================= */

  /* On site an M number belongs to the motor, not to the screw or
     mill it turns. */
  function motorLine(tag) {
    var t = String(tag || "");
    if (!/^M\d/.test(t)) return "";
    var many = /[\u2013\/-]/.test(t);
    return '<p class="step-detail" style="margin:7px 0 0">' + esc(t) +
           (many ? " are the motors that drive this." : " is the motor that drives this.") + "</p>";
  }

  function renderMachine(id) {
    var hit = machineById(id);
    if (!hit) return renderNotFound();
    var n = hit.node, a = hit.area;
    var sk = skin(a.plant);

    var into = (a.edges || []).filter(function (e) { return e.to === id; });
    var outOf = (a.edges || []).filter(function (e) { return e.from === id; });

    var h = "";

    h += '<div class="machine-head" style="border-left-color:' + sk.accent + '">' +
           '<span class="machine-icon" style="color:' + sk.accent + '">' +
             '<svg viewBox="0 0 64 64" width="48" height="48">' +
               iconMarkup(n.type, 32, 32, 48, sk.accent, 1.5) +
             "</svg></span>" +
           '<div class="machine-headtext">' +
             (n.tag ? '<span class="machine-tag">' + esc(n.tag) + "</span> " : "") +
             '<span class="machine-tag">' + esc(a.title) + "</span>" +
             "<h1>" + esc(n.label) + "</h1>" +
             motorLine(n.tag) +
           "</div></div>";

    h += '<div class="btn-row" style="margin-top:0">' +
           btn("", "map", "See it on the area map", "Plant.go('#/map/" + a.id + "')") +
         "</div>";

    if (n.guess) {
      h += '<div class="callout warn"><strong>This one is my guess</strong>' +
           "I added this to fill a gap in the drawing. Check it before anyone relies on it.</div>";
    }
    if (n.note) {
      h += '<div class="callout info"><strong>Note</strong>' + esc(n.note) + "</div>";
    }

    /* normal running numbers, shown like instruments */
    if (n.values && n.values.length) {
      h += '<div class="card"><h3>What normal looks like</h3>' +
           '<p class="step-detail" style="margin:0 0 14px">Read off your control room screen. ' +
           "Confirm the proper ranges with your boss.</p>";
      h += '<div class="gauges">';
      n.values.forEach(function (v) {
        h += '<div class="gauge"><span class="gauge-k">' + esc(v.k) + "</span>" +
             '<span class="gauge-v">' + esc(v.v) + "</span></div>";
      });
      h += "</div></div>";
    }

    if (n.alarms && n.alarms.length) {
      h += '<div class="card"><h3>' + svgIcon("bell", 14) + " Alarms you will see on the screen</h3>" +
           '<ul class="step-checks alarm">';
      n.alarms.forEach(function (x) { h += "<li>" + esc(x) + "</li>"; });
      h += "</ul></div>";
    }

    /* what it is joined to */
    h += '<div class="card"><h3>What it is joined to</h3><div class="joined">';

    h += "<div><b>Comes from</b>";
    if (into.length) {
      h += '<div class="joined-list">';
      into.forEach(function (e) {
        var o = machineById(e.from);
        if (!o) return;
        h += '<button class="joined-btn" onclick="Plant.go(\'#/m/' + o.node.id + '\')">' +
             esc(o.node.tag ? o.node.tag + " \u2014 " + o.node.label : o.node.label) +
             "<span>" + esc((MAP.streams[e.stream] || {}).label || "") + "</span></button>";
      });
      h += "</div>";
    } else {
      var feeders = AREAS.filter(function (x) { return (x.to || []).indexOf(a.id) !== -1; });
      if (n.type === "pit") {
        h += '<p class="step-detail">Trucks tip straight in here. This is where the plant starts.</p>';
      } else if (feeders.length) {
        h += '<p class="step-detail">Fed from another area:</p><div class="joined-list">';
        feeders.forEach(function (f) {
          h += '<button class="joined-btn" onclick="Plant.go(\'#/map/' + f.id + '\')">' +
               esc(f.title) + "<span>whole area</span></button>";
        });
        h += "</div>";
      } else {
        h += '<p class="step-detail">Nothing drawn in yet.</p>';
      }
    }
    h += "</div>";

    h += "<div><b>Goes to</b>";
    if (outOf.length) {
      h += '<div class="joined-list">';
      outOf.forEach(function (e) {
        var o = machineById(e.to);
        if (!o) return;
        h += '<button class="joined-btn" onclick="Plant.go(\'#/m/' + o.node.id + '\')">' +
             esc(o.node.tag ? o.node.tag + " \u2014 " + o.node.label : o.node.label) +
             "<span>" + esc((MAP.streams[e.stream] || {}).label || "") + "</span></button>";
      });
      h += "</div>";
    } else if ((a.to || []).length) {
      h += '<p class="step-detail">On to another area:</p><div class="joined-list">';
      a.to.forEach(function (t) {
        var nx = areaById(t);
        if (nx) {
          h += '<button class="joined-btn" onclick="Plant.go(\'#/map/' + nx.id + '\')">' +
               esc(nx.title) + "<span>whole area</span></button>";
        }
      });
      h += "</div>";
    } else {
      h += '<p class="step-detail">Nothing drawn in yet.</p>';
    }
    h += "</div></div></div>";

    /* the empty sections, written as the questions to ask */
    var blanks = [
      { t: "How to start it", q: ["What do you check before you press start?",
                                  "What order do the buttons and valves go in?",
                                  "How do you know it has started properly?"] },
      { t: "How to stop it", q: ["Does it have to be run empty first?",
                                 "What gets isolated or locked out?",
                                 "What sets solid or burns if you just stop it?"] },
      { t: "Machine details", q: ["Make, model, serial, year.",
                                  "Motor size, capacity.",
                                  "Service interval and who services it."] },
      { t: "Photos", q: ["A photo of the machine and of its control panel.",
                         "Send them to me and I will put them on this page."] }
    ];
    h += '<div class="card-row">';
    blanks.forEach(function (b) {
      h += '<div class="card blank-card"><h3>' + esc(b.t) +
           ' <span class="badge draft">Not filled in</span></h3><ul class="step-checks">';
      b.q.forEach(function (q) { h += "<li>" + esc(q) + "</li>"; });
      h += "</ul></div>";
    });
    h += "</div>";

    /* fault pages that suit this kind of machine */
    var fids = TYPE_FAULTS[n.type] || [];
    if (fids.length) {
      h += "<h2>When this one plays up</h2>";
      fids.forEach(function (fid) {
        var f = byId(FAULTS, fid);
        if (!f) return;
        h += '<button class="result" onclick="Plant.go(\'#/t/' + f.id + '\')">' +
               '<span class="result-ico" style="color:' + accentFor("amber") + '">' +
                 (svgIcon(FAULT_ART[f.id], 22, 1.5) || svgIcon("wrench", 22)) + "</span>" +
               '<span class="result-body">' +
                 '<span class="result-kind">Fault finding</span>' +
                 '<span class="result-title">' + esc(f.title) + "</span>" +
                 '<span class="result-snip">' + esc(f.symptom || "") + "</span></span>" +
               '<span class="result-go">' + svgIcon("chevron", 18) + "</span></button>";
      });
    }

    h += '<div class="btn-row">' +
           btn("primary", "map", "Back to " + a.title, "Plant.go('#/map/" + a.id + "')") +
           btn("", "grid", "Whole plant", "Plant.go('#/map')") +
           btn("", "print", "Print", "window.print()") +
         "</div>";

    view.className = "view";
    view.innerHTML = h;
    window.scrollTo(0, 0);
  }

  /* =============================================================
     INTERVIEW SHEETS
     ============================================================= */

  var sendOpen = null;
  var saveTimer = null;

  function fieldHtml(key, q, value) {
    if (q.type === "long") {
      return '<textarea class="ans" rows="3" data-q="' + key + '" ' +
             'placeholder="Type the answer here">' + esc(value) + "</textarea>";
    }
    return '<input class="ans" type="text" data-q="' + key + '" value="' + esc(value) + '" ' +
           'placeholder="Type the answer here">';
  }

  function stepsHtml(key, arr) {
    var h = "";
    if (!arr.length) h += '<p class="step-detail">No steps written down yet.</p>';
    h += '<div class="isteps">';
    arr.forEach(function (st, i) {
      h += '<div class="istep">';
      h += '<div class="istep-head"><span class="step-no num">' + (i + 1) + "</span>" +
           '<button class="btn ghost small" onclick="Plant.removeStep(\'' + key + "'," + i +
           ')">Remove</button></div>';
      STEP_FIELDS.forEach(function (f) {
        var val = st[f.k] || "";
        h += '<label class="field wide"><span>' + esc(f.label) + "</span>";
        h += f.type === "long"
          ? '<textarea class="ans" rows="2" data-q="' + key + '" data-i="' + i + '" data-f="' +
            f.k + '">' + esc(val) + "</textarea>"
          : '<input class="ans" type="text" data-q="' + key + '" data-i="' + i + '" data-f="' +
            f.k + '" value="' + esc(val) + '">';
        h += "</label>";
      });
      h += "</div>";
    });
    h += "</div>";
    h += '<button class="btn primary" onclick="Plant.addStep(\'' + key + '\')">' +
         svgIcon("plus", 17) + "<span>Add another step</span></button>";
    return h;
  }

  function renderInterview(id) {
    var iv = byId(INTERVIEWS, id);
    if (!iv) return renderNotFound();
    var a = loadAnswers();
    var prog = countAnswered(iv);

    var h = "";
    h += '<div class="machine-head" style="border-left-color:' + accentFor("amber") + '">' +
           '<span class="machine-icon" style="color:' + accentFor("amber") + '">' +
             svgIcon("sheet", 36, 1.5) + "</span>" +
           '<div class="machine-headtext"><h1>' + esc(iv.title) + "</h1>" +
           '<p class="lede" style="margin:5px 0 0">' + esc(iv.subtitle || "") + "</p></div></div>";

    if (iv.intro) {
      h += '<div class="callout info"><strong>How to get good answers</strong>' +
           esc(iv.intro) + "</div>";
    }

    h += '<div class="progress-wrap"><div class="progress-card">' +
           '<span class="count" id="ansCount">' + prog.done + " of " + prog.total + " answered</span>" +
           '<span class="bar"><span id="ansBar" style="width:' +
             (prog.total ? Math.round(prog.done / prog.total * 100) : 0) + '%"></span></span>' +
           '<span class="saved-flag" id="savedFlag">Saves as you type</span>' +
         "</div></div>";

    iv.sections.forEach(function (s, si) {
      h += '<div class="card"><h3>' + esc(s.title) + "</h3>";
      if (s.hint) h += '<p class="step-detail" style="margin:0 0 6px">' + esc(s.hint) + "</p>";
      s.questions.forEach(function (q) {
        var key = iv.id + "." + q.id;
        h += '<div class="qblock">';
        h += '<label class="qlabel">' + esc(q.label) + "</label>";
        if (q.hint) h += '<p class="qhint">' + esc(q.hint) + "</p>";
        h += q.type === "steps"
          ? stepsHtml(key, Array.isArray(a[key]) ? a[key] : [])
          : fieldHtml(key, q, a[key] || "");
        h += "</div>";
      });
      h += "</div>";
      if (si === 0 && iv.linked) {
        h += '<div class="btn-row">' +
             btn("", "eye", "Open my example steps to read out to him",
                 "Plant.go('#/p/" + iv.linked + "')") + "</div>";
      }
    });

    h += '<div class="btn-row">' +
           btn("primary", "share", "Send these answers to Kiro", "Plant.showSend('" + iv.id + "')") +
           btn("", "print", "Print blank or filled in", "window.print()") +
           btn("", "home", "Back to the menu", "Plant.go('#/')") +
         "</div>";

    if (sendOpen === iv.id) {
      var txt = interviewText(iv);
      h += '<div class="card" id="sendCard"><h3>Your answers</h3>' +
           '<p class="step-detail" style="margin:0 0 12px">Copy this and paste it to me, or save it ' +
           "and send it however suits. Only the questions you answered are in here.</p>" +
           '<textarea id="sendText" class="sendbox" rows="14" readonly>' + esc(txt) + "</textarea>" +
           '<div class="btn-row" style="margin-bottom:0">' +
             btn("primary", "copy", "Copy it all", "Plant.copySend()") +
             (navigator.share ? btn("", "share", "Share", "Plant.shareSend('" + iv.id + "')") : "") +
             btn("", "download", "Save as a file", "Plant.downloadSend('" + iv.id + "')") +
           "</div></div>";
    }

    view.className = "view";
    view.innerHTML = h;
    bindAnswerInputs();

    if (sendOpen === iv.id) {
      var card = document.getElementById("sendCard");
      if (card) card.scrollIntoView({ block: "start" });
    } else {
      window.scrollTo(0, 0);
    }
  }

  function bindAnswerInputs() {
    var els = view.querySelectorAll(".ans");
    for (var i = 0; i < els.length; i++) els[i].addEventListener("input", onAnswerInput);
  }

  function onAnswerInput(e) {
    var el = e.target;
    var qid = el.getAttribute("data-q");
    var a = loadAnswers();

    if (el.hasAttribute("data-i")) {
      var i = Number(el.getAttribute("data-i"));
      var f = el.getAttribute("data-f");
      var arr = Array.isArray(a[qid]) ? a[qid] : [];
      while (arr.length <= i) arr.push({});
      arr[i][f] = el.value;
      a[qid] = arr;
    } else if (el.value === "") {
      delete a[qid];
    } else {
      a[qid] = el.value;
    }

    saveAnswers(a);

    var flag = document.getElementById("savedFlag");
    if (flag) {
      flag.textContent = "Saved";
      flag.classList.add("just");
      clearTimeout(saveTimer);
      saveTimer = setTimeout(function () {
        flag.textContent = "Saves as you type";
        flag.classList.remove("just");
      }, 1400);
    }

    var iv = byId(INTERVIEWS, qid.split(".")[0]);
    if (iv) {
      var p = countAnswered(iv);
      var c = document.getElementById("ansCount");
      var b = document.getElementById("ansBar");
      if (c) c.textContent = p.done + " of " + p.total + " answered";
      if (b) b.style.width = (p.total ? Math.round(p.done / p.total * 100) : 0) + "%";
    }
  }

  function addStep(key) {
    var a = loadAnswers();
    var arr = Array.isArray(a[key]) ? a[key] : [];
    arr.push({});
    a[key] = arr;
    saveAnswers(a);
    renderInterview(key.split(".")[0]);
    var blocks = view.querySelectorAll(".istep");
    if (blocks.length) blocks[blocks.length - 1].scrollIntoView({ block: "center" });
  }

  function removeStep(key, index) {
    var a = loadAnswers();
    var arr = Array.isArray(a[key]) ? a[key] : [];
    var st = arr[index] || {};
    var hasText = Object.keys(st).some(function (k) { return String(st[k] || "").trim(); });
    if (hasText && !confirm("Delete step " + (index + 1) + "? What you typed in it will be lost.")) return;
    arr.splice(index, 1);
    a[key] = arr;
    saveAnswers(a);
    renderInterview(key.split(".")[0]);
  }

  function interviewText(iv) {
    var a = loadAnswers();
    var out = [];
    out.push(iv.title.toUpperCase());
    if (INFO.site) out.push("Site: " + INFO.site);
    out.push("Filled in: " + new Date().toLocaleString());
    out.push("");

    iv.sections.forEach(function (s) {
      var lines = [];
      s.questions.forEach(function (q) {
        var v = a[iv.id + "." + q.id];
        if (q.type === "steps") {
          if (!Array.isArray(v)) return;
          var steps = [];
          v.forEach(function (st, i) {
            var bits = STEP_FIELDS.filter(function (f) { return String(st[f.k] || "").trim(); })
                                  .map(function (f) { return f.label + ": " + String(st[f.k]).trim(); });
            if (bits.length) steps.push("  " + (i + 1) + ". " + bits.join("  |  "));
          });
          if (steps.length) { lines.push("STEPS:"); lines = lines.concat(steps); lines.push(""); }
        } else if (String(v === undefined || v === null ? "" : v).trim()) {
          lines.push("Q: " + q.label);
          lines.push("A: " + String(v).trim());
          lines.push("");
        }
      });
      if (lines.length) {
        out.push("--- " + s.title + " ---");
        out = out.concat(lines);
      }
    });

    if (out.length <= 4) out.push("(Nothing filled in yet.)");
    return out.join("\n");
  }

  function showSend(id) { sendOpen = id; renderInterview(id); }

  function copySend() {
    var box = document.getElementById("sendText");
    if (!box) return;
    var done = function () { alert("Copied. Now paste it into the chat with Kiro."); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(box.value).then(done, function () { legacyCopy(box, done); });
    } else legacyCopy(box, done);
  }

  function legacyCopy(box, done) {
    box.removeAttribute("readonly");
    box.select();
    box.setSelectionRange(0, box.value.length);
    try { document.execCommand("copy"); done(); }
    catch (e) { alert("Copying did not work on this phone. Press and hold the text to copy it by hand."); }
    box.setAttribute("readonly", "readonly");
  }

  function shareSend(id) {
    var iv = byId(INTERVIEWS, id);
    if (!iv || !navigator.share) return;
    navigator.share({ title: iv.title, text: interviewText(iv) })["catch"](function () {});
  }

  function downloadSend(id) {
    var iv = byId(INTERVIEWS, id);
    if (!iv) return;
    saveTextFile(iv.id + "-answers-" + stamp() + ".txt", interviewText(iv), "text/plain");
  }

  /* =============================================================
     SETTINGS, BACKUP, UPDATE
     ============================================================= */

  function stamp() {
    var d = new Date();
    function p(n) { return (n < 10 ? "0" : "") + n; }
    return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  }

  function saveTextFile(name, text, mime) {
    try {
      var blob = new Blob([text], { type: (mime || "application/json") + ";charset=utf-8" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    } catch (e) {
      alert("This phone would not let me save the file. Use Copy instead and paste it somewhere safe.");
    }
  }

  function allStored() {
    var out = {};
    for (var i = 0; i < localStorage.length; i++) {
      var k = localStorage.key(i);
      if (k && k.indexOf(STORE_PREFIX) === 0 && k !== THEME_KEY) out[k] = localStorage.getItem(k);
    }
    return out;
  }

  function storedSummary() {
    var answers = loadAnswers();
    var tickLists = 0, ticks = 0;
    PROCS.forEach(function (p) {
      var st = loadState(p.id);
      var n = Object.keys(st.checked || {}).length;
      if (n) { tickLists++; ticks += n; }
    });
    return { answers: Object.keys(answers).length, tickLists: tickLists, ticks: ticks };
  }

  function themeCard(t) {
    var th = THEMES[t];
    return '<button class="theme-card' + (theme === t ? " on" : "") + '" ' +
             'onclick="Plant.setTheme(\'' + t + '\')">' +
             '<span class="theme-swatch">' +
               th.swatch.map(function (c) { return '<i style="background:' + c + '"></i>'; }).join("") +
             "</span>" +
             '<span class="theme-card-body"><b>' + esc(th.name) +
               (theme === t ? " \u2713" : "") + "</b>" +
               "<span>" + esc(th.blurb) + "</span></span>" +
           "</button>";
  }

  function renderSettings() {
    var v = window.PLANT_VERSION || { version: "?", built: "?", notes: "" };
    var s = storedSummary();

    var h = "<h1>Settings</h1>";
    h += '<p class="lede">How it looks, your backups, and the button that pulls down the ' +
         "latest copy.</p>";

    /* look and feel */
    h += '<div class="card"><h3>' + svgIcon("contrast", 14) + " How it looks</h3>" +
           '<p class="step-detail" style="margin:0 0 14px">Two complete looks. Pick whichever is ' +
           "easier to read where you use it. The dark one suits the control room, the bold one " +
           "suits bright light and gloves.</p>" +
           '<div class="theme-grid">' + themeCard("control") + themeCard("industrial") + "</div>" +
         "</div>";

    /* version + update */
    h += '<div class="card"><h3>Version</h3>' +
           '<div class="kv"><span>Installed on this device</span><b>Version ' + esc(v.version) +
             " \u00B7 " + esc(v.built) + "</b></div>" +
           (v.notes ? '<div class="kv"><span>What changed</span><b>' + esc(v.notes) + "</b></div>" : "") +
           '<div class="kv"><span>Latest available</span><b id="latestVer">Not checked yet</b></div>' +
           '<div class="btn-row" style="margin-bottom:0">' +
             btn("", "refresh", "Check for a new version", "Plant.checkVersion()") +
             btn("primary", "download", "Get the latest version now", "Plant.forceUpdate()") +
           "</div>" +
           '<p class="step-detail">The update button throws away the old saved copy of the app and ' +
           "pulls everything down fresh. You need internet for it. " +
           "<b>Your answers and ticks are not touched.</b></p>" +
         "</div>";

    /* backup */
    h += '<div class="card"><h3>Backup</h3>' +
           '<p class="step-detail" style="margin:0 0 14px">Everything you have typed lives on this ' +
           "device only. If you lose it, it is gone \u2014 unless you save a backup file somewhere " +
           "safe, like your email.</p>" +
           '<div class="kv"><span>Answers saved</span><b class="num">' + s.answers + "</b></div>" +
           '<div class="kv"><span>Checklists with ticks</span><b class="num">' + s.tickLists +
             " (" + s.ticks + " ticks)</b></div>" +
           '<div class="btn-row" style="margin-bottom:0">' +
             btn("primary", "download", "Save a backup file", "Plant.saveBackup()") +
           "</div></div>";

    /* restore */
    h += '<div class="card"><h3>Load a backup</h3>' +
           '<p class="step-detail" style="margin:0 0 12px">Pick a backup file you saved earlier. ' +
           "This replaces what is on this device now, so save a backup first if you are not sure.</p>" +
           '<input type="file" id="restoreFile" accept="application/json,.json" class="filepick">' +
           '<div class="btn-row" style="margin-bottom:0">' +
             btn("", "upload", "Load it", "Plant.loadBackup()") +
           "</div></div>";

    /* wipe */
    h += '<div class="card"><h3>Start again</h3>' +
           '<p class="step-detail" style="margin:0 0 12px">Wipes every answer and every tick on ' +
           "this device. It cannot be undone.</p>" +
           '<div class="btn-row" style="margin-bottom:0">' +
             btn("danger", "trash", "Clear everything on this device", "Plant.wipeAll()") +
           "</div></div>";

    h += '<div class="btn-row">' + btn("primary", "home", "Back to the menu", "Plant.go('#/')") + "</div>";

    view.className = "view";
    view.innerHTML = h;
    window.scrollTo(0, 0);
    checkVersion(true);
  }

  function checkVersion(quiet) {
    var el = document.getElementById("latestVer");
    if (el) el.textContent = "Checking\u2026";
    var installed = (window.PLANT_VERSION || {}).version;

    fetch("version.json?t=" + Date.now(), { cache: "no-store" })
      .then(function (r) { return r.json(); })
      .then(function (j) {
        if (!el) return;
        if (!j || !j.version) { el.textContent = "Could not check \u2014 no internet"; return; }
        el.innerHTML = String(j.version) === String(installed)
          ? "Version " + esc(j.version) + ' <span class="badge ok">Up to date</span>'
          : "Version " + esc(j.version) +
            ' <span class="badge draft">New version \u2014 tap the update button</span>';
      })["catch"](function () {
        if (el) el.textContent = "Could not check \u2014 no internet";
        if (!quiet) alert("Could not check. You need internet for that.");
      });
  }

  function forceUpdate() {
    if (!confirm("Get the latest version?\n\nThis needs internet. Your answers and ticks are kept.")) return;

    var clearCaches = (window.caches && caches.keys)
      ? caches.keys().then(function (keys) {
          return Promise.all(keys.map(function (k) { return caches["delete"](k); }));
        })
      : Promise.resolve();

    clearCaches
      .then(function () {
        if (navigator.serviceWorker && navigator.serviceWorker.getRegistrations) {
          return navigator.serviceWorker.getRegistrations().then(function (rs) {
            return Promise.all(rs.map(function (r) { return r.unregister(); }));
          });
        }
      })
      ["catch"](function () {})
      .then(function () {
        location.replace(location.pathname + "?fresh=" + Date.now());
      });
  }

  function saveBackup() {
    var payload = {
      app: "plant-guide",
      kind: "backup",
      appVersion: (window.PLANT_VERSION || {}).version || "?",
      saved: new Date().toISOString(),
      data: allStored()
    };
    saveTextFile("plant-guide-backup-" + stamp() + ".json", JSON.stringify(payload, null, 2));
  }

  function loadBackup() {
    var input = document.getElementById("restoreFile");
    if (!input || !input.files || !input.files.length) {
      alert("Pick a backup file first.");
      return;
    }
    var reader = new FileReader();
    reader.onload = function () {
      var payload;
      try { payload = JSON.parse(String(reader.result)); }
      catch (e) { alert("That file is not a Plant Guide backup."); return; }

      if (!payload || payload.app !== "plant-guide" || !payload.data) {
        alert("That file is not a Plant Guide backup.");
        return;
      }
      var keys = Object.keys(payload.data);
      if (!confirm("Load this backup?\n\nSaved: " + (payload.saved || "unknown") +
                   "\nItems: " + keys.length +
                   "\n\nThis replaces what is on this device now.")) return;

      Object.keys(allStored()).forEach(function (k) { localStorage.removeItem(k); });
      keys.forEach(function (k) {
        if (k.indexOf(STORE_PREFIX) === 0) localStorage.setItem(k, payload.data[k]);
      });
      alert("Backup loaded.");
      renderSettings();
    };
    reader.onerror = function () { alert("Could not read that file."); };
    reader.readAsText(input.files[0]);
  }

  function wipeAll() {
    if (!confirm("Clear every answer and tick on this device?")) return;
    if (!confirm("Really? This cannot be undone. Save a backup first if you are not sure.")) return;
    Object.keys(allStored()).forEach(function (k) { localStorage.removeItem(k); });
    alert("Cleared.");
    renderSettings();
  }

  /* =============================================================
     PROCEDURE BUILDER
     -------------------------------------------------------------
     Walk the plant with your boss and build the real startup and
     shutdown, one step at a time. Each step takes words and photos.
     You can add a step at the end, or slot one in between two you
     have already written.

     Photos are shrunk before they are saved, which keeps the file
     small enough to email and small enough to send back to me.
     ============================================================= */

  var MAX_PHOTO_PX = 1200;     /* long side after shrinking */
  var PHOTO_QUALITY = 0.72;
  var THUMB_PX = 200;

  var BUILDERS = {
    startup: {
      id: "startup",
      title: "Build the real Plant Startup",
      sub: "Walk the plant with your boss and add a step at a time",
      accent: "green",
      art: "play",
      intro: "Ask \u201Cwhat do you do first?\u201D then keep saying \u201Cand then?\u201D. " +
             "Take a photo at every step \u2014 the panel, the valve, the gauge, whatever he " +
             "points at. Photos save you writing a paragraph."
    },
    shutdown: {
      id: "shutdown",
      title: "Build the real Plant Shutdown",
      sub: "Same again, from last feed to plant dead",
      accent: "blue",
      art: "stop",
      intro: "Shutdown is mostly about emptying things in the right order before they cool " +
             "down. Photograph anything that has to be left running, drained or locked out."
    }
  };

  var STEP_EXTRAS = [
    { k: "check",  label: "How you know it worked" },
    { k: "danger", label: "What is dangerous here" },
    { k: "who",    label: "Who does it" },
    { k: "time",   label: "How long" }
  ];

  /* ---------- storage: IndexedDB where we can, otherwise localStorage ---------- */

  var DB_NAME = "plantguide-builder";
  var dbPromise = null;
  var idbBroken = false;

  function openDb() {
    if (idbBroken) return Promise.reject(new Error("no indexeddb"));
    if (dbPromise) return dbPromise;
    dbPromise = new Promise(function (resolve, reject) {
      if (!window.indexedDB) { idbBroken = true; reject(new Error("no indexeddb")); return; }
      var req;
      try { req = indexedDB.open(DB_NAME, 1); }
      catch (e) { idbBroken = true; reject(e); return; }
      req.onupgradeneeded = function () {
        var d = req.result;
        if (!d.objectStoreNames.contains("docs")) d.createObjectStore("docs");
        if (!d.objectStoreNames.contains("photos")) d.createObjectStore("photos");
      };
      req.onsuccess = function () { resolve(req.result); };
      req.onerror = function () { idbBroken = true; reject(req.error); };
      req.onblocked = function () { idbBroken = true; reject(new Error("blocked")); };
    });
    return dbPromise;
  }

  function idb(store, mode, fn) {
    return openDb().then(function (d) {
      return new Promise(function (resolve, reject) {
        var tx = d.transaction(store, mode);
        var rq = fn(tx.objectStore(store));
        tx.oncomplete = function () { resolve(rq && rq.result); };
        tx.onerror = function () { reject(tx.error); };
        tx.onabort = function () { reject(tx.error); };
      });
    });
  }

  function lsKey(kind, key) { return STORE_PREFIX + "b:" + kind + ":" + key; }

  function storeGet(kind, key) {
    return idb(kind === "photos" ? "photos" : "docs", "readonly", function (os) {
      return os.get(key);
    })["catch"](function () {
      try {
        var raw = localStorage.getItem(lsKey(kind, key));
        return raw ? JSON.parse(raw) : undefined;
      } catch (e) { return undefined; }
    });
  }

  function storePut(kind, key, value) {
    return idb(kind === "photos" ? "photos" : "docs", "readwrite", function (os) {
      return os.put(value, key);
    })["catch"](function () {
      try {
        localStorage.setItem(lsKey(kind, key), JSON.stringify(value));
        return true;
      } catch (e) {
        alert("This device would not let me save. If you are opening the app straight from a " +
              "folder, try the web link instead \u2014 browsers give it much more room.");
        throw e;
      }
    });
  }

  function storeDel(kind, key) {
    return idb(kind === "photos" ? "photos" : "docs", "readwrite", function (os) {
      return os["delete"](key);
    })["catch"](function () {
      try { localStorage.removeItem(lsKey(kind, key)); } catch (e) {}
    });
  }

  /* ---------- the document in memory ---------- */

  var buildDoc = null;     /* { id, by, date, steps: [...] } */
  var photoCache = {};     /* photoId -> { thumb, full } */

  function blankStep() {
    return {
      id: "s" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
      text: "", check: "", danger: "", who: "", time: "", photos: []
    };
  }

  function loadBuild(id) {
    return storeGet("docs", id).then(function (doc) {
      buildDoc = doc && doc.steps
        ? doc
        : { id: id, by: "", date: "", steps: [] };
      buildDoc.id = id;
      return buildDoc;
    });
  }

  var saveTimer2 = null;

  function saveBuild(immediate) {
    if (!buildDoc) return;
    var doc = JSON.parse(JSON.stringify(buildDoc));
    clearTimeout(saveTimer2);
    var run = function () {
      storePut("docs", doc.id, doc).then(function () { flashSaved(); });
    };
    if (immediate) run(); else saveTimer2 = setTimeout(run, 400);
  }

  function flashSaved() {
    var f = document.getElementById("buildSaved");
    if (!f) return;
    f.textContent = "Saved";
    f.classList.add("just");
    setTimeout(function () {
      f.textContent = "Saves as you type";
      f.classList.remove("just");
    }, 1300);
  }

  /* ---------- photos ---------- */

  function shrinkImage(file, maxPx, quality) {
    return new Promise(function (resolve, reject) {
      var reader = new FileReader();
      reader.onload = function () {
        var img = new Image();
        img.onload = function () {
          var w = img.naturalWidth, h = img.naturalHeight;
          var scale = Math.min(1, maxPx / Math.max(w, h));
          var cw = Math.max(1, Math.round(w * scale));
          var ch = Math.max(1, Math.round(h * scale));
          var c = document.createElement("canvas");
          c.width = cw; c.height = ch;
          var ctx = c.getContext("2d");
          ctx.fillStyle = "#fff";
          ctx.fillRect(0, 0, cw, ch);
          ctx.drawImage(img, 0, 0, cw, ch);
          try { resolve(c.toDataURL("image/jpeg", quality)); }
          catch (e) { reject(e); }
        };
        img.onerror = function () { reject(new Error("not a picture")); };
        img.src = reader.result;
      };
      reader.onerror = function () { reject(reader.error); };
      reader.readAsDataURL(file);
    });
  }

  function addPhotos(stepId, input) {
    var files = Array.prototype.slice.call(input.files || []);
    if (!files.length) return;
    input.value = "";

    var step = buildDoc.steps.filter(function (s) { return s.id === stepId; })[0];
    if (!step) return;

    setBusy(true, "Shrinking " + files.length + (files.length === 1 ? " photo" : " photos") + "\u2026");

    var chain = Promise.resolve();
    files.forEach(function (f) {
      chain = chain.then(function () {
        if (!/^image\//.test(f.type)) return null;
        return Promise.all([
          shrinkImage(f, MAX_PHOTO_PX, PHOTO_QUALITY),
          shrinkImage(f, THUMB_PX, 0.6)
        ]).then(function (both) {
          var pid = "p" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
          var rec = { id: pid, full: both[0], thumb: both[1], name: f.name || "photo" };
          photoCache[pid] = rec;
          step.photos.push(pid);
          return storePut("photos", pid, rec);
        });
      });
    });

    chain.then(function () {
      saveBuild(true);
      setBusy(false);
      renderBuilder(buildDoc.id, stepId);
    })["catch"](function (e) {
      setBusy(false);
      alert("Could not add that picture. " + (e && e.message ? e.message : ""));
    });
  }

  function removePhoto(stepId, pid) {
    if (!confirm("Remove this photo?")) return;
    var step = buildDoc.steps.filter(function (s) { return s.id === stepId; })[0];
    if (!step) return;
    step.photos = step.photos.filter(function (x) { return x !== pid; });
    delete photoCache[pid];
    storeDel("photos", pid);
    saveBuild(true);
    renderBuilder(buildDoc.id, stepId);
  }

  function loadPhotos(doc) {
    var ids = [];
    doc.steps.forEach(function (s) {
      (s.photos || []).forEach(function (p) { if (!photoCache[p]) ids.push(p); });
    });
    if (!ids.length) return Promise.resolve();
    return Promise.all(ids.map(function (id) {
      return storeGet("photos", id).then(function (rec) {
        if (rec) photoCache[id] = rec;
      })["catch"](function () {});
    }));
  }

  function setBusy(on, msg) {
    var el = document.getElementById("buildBusy");
    if (!el) return;
    el.textContent = on ? (msg || "Working\u2026") : "";
    el.style.display = on ? "" : "none";
  }

  /* ---------- step editing ---------- */

  function buildField(stepId, key, value) {
    buildDoc.steps.forEach(function (s) {
      if (s.id === stepId) s[key] = value;
    });
    saveBuild();
  }

  function addStepAt(index) {
    var step = blankStep();
    if (index === undefined || index === null || index > buildDoc.steps.length) {
      buildDoc.steps.push(step);
    } else {
      buildDoc.steps.splice(index, 0, step);
    }
    saveBuild(true);
    renderBuilder(buildDoc.id, step.id);
  }

  function moveStep(index, dir) {
    var j = index + dir;
    if (j < 0 || j >= buildDoc.steps.length) return;
    var tmp = buildDoc.steps[index];
    buildDoc.steps[index] = buildDoc.steps[j];
    buildDoc.steps[j] = tmp;
    saveBuild(true);
    renderBuilder(buildDoc.id, tmp.id);
  }

  function deleteStep(index) {
    var s = buildDoc.steps[index];
    if (!s) return;
    var hasStuff = String(s.text || "").trim() || (s.photos || []).length;
    if (hasStuff && !confirm("Delete step " + (index + 1) +
        "? The words and photos in it will be lost.")) return;
    (s.photos || []).forEach(function (p) { storeDel("photos", p); delete photoCache[p]; });
    buildDoc.steps.splice(index, 1);
    saveBuild(true);
    renderBuilder(buildDoc.id);
  }

  /* ---------- the page ---------- */

  function renderBuild(id) {
    var cfg = BUILDERS[id];
    if (!cfg) return renderNotFound();
    view.className = "view";
    view.innerHTML = '<p class="empty">Loading what you have written so far\u2026</p>';
    loadBuild(id)
      .then(function (doc) { return loadPhotos(doc); })
      .then(function () { renderBuilder(id); })
      ["catch"](function () {
        buildDoc = { id: id, by: "", date: "", steps: [] };
        renderBuilder(id);
      });
  }

  function photoCount(doc) {
    var n = 0;
    doc.steps.forEach(function (s) { n += (s.photos || []).length; });
    return n;
  }

  function renderBuilder(id, focusStepId) {
    var cfg = BUILDERS[id];
    var doc = buildDoc;
    var written = doc.steps.filter(function (s) { return String(s.text || "").trim(); }).length;
    var photos = photoCount(doc);

    var h = "";

    h += '<div class="machine-head" style="border-left-color:' + accentFor(cfg.accent) + '">' +
           '<span class="machine-icon" style="color:' + accentFor(cfg.accent) + '">' +
             svgIcon(cfg.art, 36, 1.5) + "</span>" +
           '<div class="machine-headtext"><h1>' + esc(cfg.title) + "</h1>" +
           '<p class="lede" style="margin:5px 0 0">' + esc(cfg.sub) + "</p></div></div>";

    h += '<div class="callout info"><strong>How to do this</strong>' + esc(cfg.intro) + "</div>";

    h += '<div class="card"><h3>Who is writing this</h3><div class="signoff">' +
           '<label class="field"><span>Your name</span>' +
             '<input id="buildBy" type="text" value="' + esc(doc.by) + '" placeholder="Your name">' +
           "</label>" +
           '<label class="field"><span>Date, and who you walked with</span>' +
             '<input id="buildDate" type="text" value="' + esc(doc.date) + '" ' +
             'placeholder="e.g. 8 Oct, with Dave">' +
           "</label></div></div>";

    h += '<div class="progress-wrap"><div class="progress-card">' +
           '<span class="count">' + doc.steps.length +
             (doc.steps.length === 1 ? " step" : " steps") + "</span>" +
           '<span class="count">' + photos + (photos === 1 ? " photo" : " photos") + "</span>" +
           '<span class="bar"><span style="width:' +
             (doc.steps.length ? Math.round(written / doc.steps.length * 100) : 0) + '%"></span></span>' +
           '<span class="saved-flag" id="buildSaved">Saves as you type</span>' +
           '<span class="saved-flag" id="buildBusy" style="display:none"></span>' +
         "</div></div>";

    if (!doc.steps.length) {
      h += '<div class="empty">No steps yet. Tap <b>Add the first step</b> below, ' +
           "write what he says, and take a photo.</div>";
    }

    doc.steps.forEach(function (s, i) {
      h += '<div class="bstep" id="bstep-' + s.id + '">';

      h += '<div class="bstep-head">' +
             '<span class="step-no num">' + (i + 1) + "</span>" +
             '<div class="bstep-tools">' +
               '<button class="btn small ghost" onclick="Plant.addStepAt(' + i + ')" ' +
                 'title="Put a new step in above this one">' + svgIcon("plus", 14) +
                 "<span>Insert above</span></button>" +
               '<button class="icon-btn" onclick="Plant.moveStep(' + i + ',-1)" ' +
                 'title="Move up" aria-label="Move up"' + (i === 0 ? " disabled" : "") + ">" +
                 svgIcon("back", 16) + "</button>" +
               '<button class="icon-btn" onclick="Plant.moveStep(' + i + ',1)" ' +
                 'title="Move down" aria-label="Move down"' +
                 (i === doc.steps.length - 1 ? " disabled" : "") + ">" +
                 svgIcon("next", 16) + "</button>" +
               '<button class="icon-btn danger" onclick="Plant.deleteStep(' + i + ')" ' +
                 'title="Delete this step" aria-label="Delete">' + svgIcon("trash", 16) +
               "</button>" +
             "</div></div>";

      h += '<label class="field wide"><span>What you do</span>' +
             '<textarea class="ans bstep-text" rows="3" data-step="' + s.id + '" data-k="text" ' +
             'placeholder="Write it the way he says it">' + esc(s.text) + "</textarea></label>";

      /* photos */
      h += '<div class="bphotos">';
      (s.photos || []).forEach(function (pid) {
        var rec = photoCache[pid];
        h += '<div class="bphoto">' +
               (rec
                 ? '<img src="' + rec.thumb + '" alt="step photo" ' +
                   'onclick="Plant.viewPhoto(\'' + pid + '\')">'
                 : '<div class="bphoto-missing">photo</div>') +
               '<button class="bphoto-x" onclick="Plant.removePhoto(\'' + s.id + "','" + pid +
                 '\')" title="Remove this photo" aria-label="Remove photo">&times;</button>' +
             "</div>";
      });
      h += '<label class="bphoto-add">' +
             svgIcon("camera", 22) +
             "<span>Add photo</span>" +
             '<input type="file" accept="image/*" capture="environment" multiple ' +
               'onchange="Plant.addPhotos(\'' + s.id + '\', this)">' +
           "</label>";
      h += "</div>";

      /* the optional extras, folded away so the page stays simple */
      h += '<details class="bextras"' + (s.check || s.danger || s.who || s.time ? " open" : "") + ">" +
             "<summary>Add the extra detail (optional)</summary>";
      STEP_EXTRAS.forEach(function (f) {
        h += '<label class="field wide"><span>' + esc(f.label) + "</span>" +
               '<input class="ans" type="text" data-step="' + s.id + '" data-k="' + f.k + '" ' +
               'value="' + esc(s[f.k] || "") + '"></label>';
      });
      h += "</details>";

      h += "</div>";
    });

    h += '<div class="btn-row">' +
           '<button class="btn primary wide" onclick="Plant.addStepAt()">' +
             svgIcon("plus", 18) + "<span>" +
             (doc.steps.length ? "Add another step at the end" : "Add the first step") +
             "</span></button>" +
         "</div>";

    /* ---- sharing ---- */
    h += '<h2>When you are done</h2>';
    h += '<div class="card"><h3>Send it to me, or to your boss</h3>' +
           '<p class="step-detail" style="margin:0 0 14px">Three ways out, depending on what ' +
           "you want to do with it.</p>" +
           '<div class="kv"><span><b>Make a report</b><br>One file with every step and every ' +
             "photo in it. Open it and print to PDF for your boss.</span>" +
             '<b><button class="btn small primary" onclick="Plant.buildReport()">' +
             svgIcon("download", 15) + "<span>Make report</span></button></b></div>" +
           '<div class="kv"><span><b>Save the photos</b><br>Saves each photo as its own file, ' +
             "already shrunk small enough to send me here without jamming the chat.</span>" +
             '<b><button class="btn small" onclick="Plant.buildPhotos()">' +
             svgIcon("download", 15) + "<span>Save " + photos + "</span></button></b></div>" +
           '<div class="kv"><span><b>Copy the words</b><br>All the writing as plain text, ' +
             "ready to paste straight into the chat with me.</span>" +
             '<b><button class="btn small" onclick="Plant.buildCopy()">' +
             svgIcon("copy", 15) + "<span>Copy</span></button></b></div>" +
         "</div>";

    h += '<div class="callout warn"><strong>Keep a backup</strong>' +
         "Everything here is saved on this device only. Make the report file now and then and " +
         "email it to yourself, so a lost phone does not lose the lot.</div>";

    h += '<div class="btn-row">' +
           btn("", "home", "Back to the menu", "Plant.go('#/')") +
           btn("", "eye", "See my example steps", "Plant.go('#/p/" + id + "-plant')") +
         "</div>";

    view.className = "view";
    view.innerHTML = h;

    /* keep what is typed */
    var by = document.getElementById("buildBy");
    var dt = document.getElementById("buildDate");
    by.addEventListener("input", function () { buildDoc.by = by.value; saveBuild(); });
    dt.addEventListener("input", function () { buildDoc.date = dt.value; saveBuild(); });

    var fields = view.querySelectorAll("[data-step]");
    for (var i = 0; i < fields.length; i++) {
      fields[i].addEventListener("input", function (e) {
        buildField(e.target.getAttribute("data-step"),
                   e.target.getAttribute("data-k"), e.target.value);
      });
    }

    if (focusStepId) {
      var el = document.getElementById("bstep-" + focusStepId);
      if (el) {
        el.scrollIntoView({ block: "center" });
        var ta = el.querySelector(".bstep-text");
        if (ta) ta.focus();
      }
    } else {
      window.scrollTo(0, 0);
    }
  }

  function viewPhoto(pid) {
    var rec = photoCache[pid];
    if (!rec) return;
    var w = window.open("", "_blank");
    if (!w) { alert("Your browser blocked the new tab."); return; }
    w.document.write('<title>Step photo</title>' +
      '<body style="margin:0;background:#111;display:grid;place-items:center;min-height:100vh">' +
      '<img src="' + rec.full + '" style="max-width:100%;max-height:100vh">');
    w.document.close();
  }

  /* ---------- sharing ---------- */

  function buildText(doc, cfg) {
    var out = [];
    out.push(cfg.title.toUpperCase());
    if (INFO.site) out.push("Site: " + INFO.site);
    if (doc.by) out.push("Written by: " + doc.by);
    if (doc.date) out.push("When: " + doc.date);
    out.push("Steps: " + doc.steps.length + "   Photos: " + photoCount(doc));
    out.push("");

    doc.steps.forEach(function (s, i) {
      out.push("STEP " + (i + 1));
      out.push(String(s.text || "").trim() || "(nothing written yet)");
      STEP_EXTRAS.forEach(function (f) {
        if (String(s[f.k] || "").trim()) out.push("  " + f.label + ": " + String(s[f.k]).trim());
      });
      var n = (s.photos || []).length;
      if (n) out.push("  Photos: " + n + " (file names step-" + pad2(i + 1) + "-1 onwards)");
      out.push("");
    });

    return out.join("\n");
  }

  function pad2(n) { return (n < 10 ? "0" : "") + n; }

  function buildCopy() {
    var txt = buildText(buildDoc, BUILDERS[buildDoc.id]);
    var done = function () { alert("Copied. Paste it into the chat with Kiro."); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(txt).then(done, function () { fallbackCopy(txt, done); });
    } else fallbackCopy(txt, done);
  }

  function fallbackCopy(txt, done) {
    var ta = document.createElement("textarea");
    ta.value = txt;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    try { document.execCommand("copy"); done(); }
    catch (e) { alert("Copying did not work. Use Make report instead."); }
    document.body.removeChild(ta);
  }

  function buildPhotos() {
    var doc = buildDoc;
    var jobs = [];
    doc.steps.forEach(function (s, i) {
      (s.photos || []).forEach(function (pid, j) {
        jobs.push({ pid: pid, name: doc.id + "-step-" + pad2(i + 1) + "-" + (j + 1) + ".jpg" });
      });
    });
    if (!jobs.length) { alert("No photos to save yet."); return; }
    if (!confirm("Save " + jobs.length + " photo" + (jobs.length === 1 ? "" : "s") +
                 " to your downloads?\n\nYour browser may ask you to allow several files.")) return;

    var i = 0;
    (function next() {
      if (i >= jobs.length) return;
      var job = jobs[i++];
      var rec = photoCache[job.pid];
      if (rec) saveDataUrl(job.name, rec.full);
      setTimeout(next, 350);
    })();
  }

  function saveDataUrl(name, dataUrl) {
    try {
      var parts = dataUrl.split(",");
      var bin = atob(parts[1]);
      var len = bin.length;
      var buf = new Uint8Array(len);
      for (var i = 0; i < len; i++) buf[i] = bin.charCodeAt(i);
      var blob = new Blob([buf], { type: "image/jpeg" });
      var url = URL.createObjectURL(blob);
      var a = document.createElement("a");
      a.href = url; a.download = name;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
    } catch (e) {}
  }

  function buildReport() {
    var doc = buildDoc, cfg = BUILDERS[doc.id];
    var esc2 = esc;

    var h = "<!DOCTYPE html><html lang=\"en\"><head><meta charset=\"utf-8\">" +
      '<meta name="viewport" content="width=device-width, initial-scale=1">' +
      "<title>" + esc2(cfg.title) + "</title><style>" +
      "body{font-family:system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;" +
      "max-width:820px;margin:0 auto;padding:28px 20px 60px;color:#16211c;line-height:1.55}" +
      "h1{font-size:26px;margin:0 0 6px}" +
      ".meta{color:#5a6b63;font-size:14px;margin:0 0 26px}" +
      ".note{background:#fff6e6;border:1px solid #f0c27a;border-left:5px solid #b45309;" +
      "padding:12px 16px;border-radius:8px;color:#7c4a02;font-size:14px;margin:0 0 26px}" +
      ".step{border:1px solid #dfe5e1;border-radius:12px;padding:18px 20px;margin:0 0 16px;" +
      "page-break-inside:avoid;break-inside:avoid}" +
      ".no{display:inline-grid;place-items:center;min-width:28px;height:28px;padding:0 7px;" +
      "background:#1f6f4a;color:#fff;border-radius:7px;font-weight:800;font-size:13px}" +
      ".what{font-size:17px;font-weight:600;margin:12px 0 0;white-space:pre-wrap}" +
      "dl{margin:14px 0 0;display:grid;grid-template-columns:auto 1fr;gap:4px 14px;font-size:14px}" +
      "dt{color:#5a6b63}dd{margin:0}" +
      ".shots{display:flex;flex-wrap:wrap;gap:10px;margin:14px 0 0}" +
      ".shots img{max-width:320px;width:100%;border:1px solid #dfe5e1;border-radius:8px}" +
      "footer{margin-top:34px;color:#5a6b63;font-size:13px;border-top:1px solid #dfe5e1;padding-top:14px}" +
      "@media print{.step{border-color:#999}body{padding:0}}" +
      "</style></head><body>";

    h += "<h1>" + esc2(cfg.title.replace(/^Build the real /, "")) + "</h1>";
    h += '<p class="meta">' + esc2(INFO.name) +
         (INFO.site ? " &middot; " + esc2(INFO.site) : "") + "<br>" +
         (doc.by ? "Written by " + esc2(doc.by) + ". " : "") +
         (doc.date ? esc2(doc.date) + ". " : "") +
         doc.steps.length + " steps, " + photoCount(doc) + " photos. " +
         "Saved " + new Date().toLocaleString() + ".</p>";

    h += '<div class="note"><b>Not approved yet.</b> This is what was written and photographed ' +
         "while walking the plant. It still has to be checked and signed off before anyone " +
         "works to it.</div>";

    doc.steps.forEach(function (s, i) {
      h += '<div class="step"><span class="no">' + (i + 1) + "</span>";
      h += '<p class="what">' + esc2(String(s.text || "").trim() || "(nothing written)") + "</p>";

      var rows = STEP_EXTRAS.filter(function (f) { return String(s[f.k] || "").trim(); });
      if (rows.length) {
        h += "<dl>";
        rows.forEach(function (f) {
          h += "<dt>" + esc2(f.label) + "</dt><dd>" + esc2(String(s[f.k]).trim()) + "</dd>";
        });
        h += "</dl>";
      }

      var shots = (s.photos || []).map(function (p) { return photoCache[p]; })
                                 .filter(Boolean);
      if (shots.length) {
        h += '<div class="shots">';
        shots.forEach(function (r) { h += '<img src="' + r.full + '" alt="">'; });
        h += "</div>";
      }
      h += "</div>";
    });

    h += "<footer>Made with the Plant Guide app. To turn this into a PDF, " +
         "print this page and choose Save as PDF.</footer></body></html>";

    saveTextFile(doc.id + "-procedure-" + stamp() + ".html", h, "text/html");
  }

  /* =============================================================
     SEARCH
     ============================================================= */

  var INDEX = null;

  function buildIndex() {
    var idx = [];

    PROCS.forEach(function (p) {
      var text = [p.title, p.subtitle, p.summary, (p.ppe || []).join(" ")];
      p.steps.forEach(function (s) {
        text.push(s.title, s.detail, s.warning, (s.checks || []).join(" "));
      });
      (p.warnings || []).forEach(function (w) { text.push(w.title, w.text); });
      idx.push({
        kind: p.category === "startup" || p.category === "shutdown" ? p.category : "procedure",
        art: PROC_ART[p.id] || "play",
        hash: "#/p/" + p.id,
        title: p.title,
        snip: p.subtitle || p.summary || "",
        text: text.join(" ").toLowerCase()
      });
    });

    FAULTS.forEach(function (f) {
      var text = [f.title, f.symptom, f.area];
      Object.keys(f.nodes).forEach(function (k) {
        var n = f.nodes[k];
        if (n.q) { text.push(n.q, n.hint); n.options.forEach(function (o) { text.push(o.label); }); }
        if (n.fix) { text.push(n.fix.title, n.fix.escalate, n.fix.steps.join(" ")); }
      });
      idx.push({
        kind: "fault", art: FAULT_ART[f.id] || "wrench",
        hash: "#/t/" + f.id, title: f.title, snip: f.symptom || "",
        text: text.join(" ").toLowerCase()
      });
    });

    Object.keys(BUILDERS).forEach(function (k) {
      var b = BUILDERS[k];
      idx.push({
        kind: "step builder", art: b.art,
        hash: "#/build/" + k, title: b.title, snip: b.sub,
        text: [b.title, b.sub, b.intro, "write build steps photos camera procedure"]
                .join(" ").toLowerCase()
      });
    });

    INTERVIEWS.forEach(function (iv) {
      var words = [iv.title, iv.subtitle, iv.intro];
      iv.sections.forEach(function (s) {
        words.push(s.title, s.hint);
        s.questions.forEach(function (q) { words.push(q.label, q.hint); });
      });
      idx.push({
        kind: "question sheet", art: "sheet",
        hash: "#/interview/" + iv.id, title: iv.title, snip: iv.subtitle || "",
        text: words.join(" ").toLowerCase()
      });
    });

    if (MAP) {
      AREAS.forEach(function (a) {
        idx.push({
          kind: "area", art: a.icon,
          hash: "#/map/" + a.id, title: a.title, snip: a.summary || "",
          text: [a.title, a.summary, a.note, MAP.plants[a.plant].label].join(" ").toLowerCase()
        });
      });
      allMachines().forEach(function (hit) {
        var n = hit.node;
        var vals = (n.values || []).map(function (v) { return v.k + " " + v.v; }).join(" ");
        idx.push({
          kind: "machine", art: n.type,
          hash: "#/m/" + n.id,
          title: (n.tag ? n.tag + " \u2014 " : "") + n.label,
          snip: hit.area.title,
          text: [n.tag, n.label, n.type, n.note, vals, (n.alarms || []).join(" "), hit.area.title]
                  .join(" ").toLowerCase()
        });
      });
    }
    return idx;
  }

  function renderSearch(q) {
    if (!INDEX) INDEX = buildIndex();
    var needle = String(q || "").trim().toLowerCase();

    var h = "<h1>Search</h1>";
    h += '<p class="lede">Looking for &ldquo;' + esc(q) + "&rdquo;</p>";

    if (!needle) {
      h += '<p class="empty">Type something in the box at the top.</p>';
    } else {
      var hits = INDEX.filter(function (r) { return r.text.indexOf(needle) !== -1; });
      hits = hits.filter(function (r) { return r.title.toLowerCase().indexOf(needle) !== -1; })
                 .concat(hits.filter(function (r) { return r.title.toLowerCase().indexOf(needle) === -1; }));

      if (!hits.length) {
        h += '<p class="empty">Nothing found. Try a shorter word, like &ldquo;press&rdquo; ' +
             "or &ldquo;steam&rdquo;.</p>";
      } else {
        h += '<p class="lede">' + hits.length + " page" + (hits.length === 1 ? "" : "s") +
             " mention it.</p>";
        hits.forEach(function (r) {
          h += '<button class="result" onclick="Plant.go(\'' + r.hash + '\')">' +
                 '<span class="result-ico">' + (svgIcon(r.art, 22, 1.5) || svgIcon("sheet", 22)) +
                 "</span>" +
                 '<span class="result-body">' +
                   '<span class="result-kind">' + esc(r.kind) + "</span>" +
                   '<span class="result-title">' + esc(r.title) + "</span>" +
                   '<span class="result-snip">' + esc(r.snip) + "</span></span>" +
                 '<span class="result-go">' + svgIcon("chevron", 18) + "</span></button>";
        });
      }
    }

    h += '<div class="btn-row">' + btn("primary", "home", "Back to the menu", "Plant.go('#/')") + "</div>";

    view.className = "view";
    view.innerHTML = h;
    window.scrollTo(0, 0);
  }

  function onSearchSubmit(ev) {
    ev.preventDefault();
    var q = document.getElementById("searchInput").value;
    go("#/search/" + encodeURIComponent(q));
    return false;
  }

  /* =============================================================
     NOT FOUND
     ============================================================= */

  function renderNotFound() {
    view.className = "view";
    view.innerHTML = "<h1>Page not found</h1>" +
      '<p class="lede">That page is not in the book yet.</p>' +
      '<div class="btn-row">' + btn("primary", "home", "Back to the menu", "Plant.go('#/')") + "</div>";
  }

  /* =============================================================
     ROUTER
     ============================================================= */

  function route() {
    var h = location.hash.replace(/^#/, "");
    var parts = h.split("/").filter(function (x) { return x !== ""; });

    /* leaving the map always drops full screen */
    if (parts[0] !== "map") {
      document.body.classList.remove("map-full");
      remountMap = null;
    }

    if (!parts.length) return renderHome();
    if (parts[0] === "p" && parts[1]) return renderProcedure(parts[1]);
    if (parts[0] === "trouble") return renderFaultList();
    if (parts[0] === "t" && parts[1]) return renderFault(parts[1]);
    if (parts[0] === "map") return parts[1] ? renderArea(parts[1]) : renderMapOverview();
    if (parts[0] === "m" && parts[1]) return renderMachine(parts[1]);
    if (parts[0] === "interview" && parts[1]) {
      if (sendOpen && sendOpen !== parts[1]) sendOpen = null;
      return renderInterview(parts[1]);
    }
    if (parts[0] === "build" && parts[1]) return renderBuild(parts[1]);
    if (parts[0] === "settings") return renderSettings();
    if (parts[0] === "search") return renderSearch(decodeURIComponent(parts.slice(1).join("/") || ""));
    return renderNotFound();
  }

  /* =============================================================
     START UP
     ============================================================= */

  var resizeTimer = null;

  function init() {
    loadTheme();
    loadDetail();

    var nameEl = document.getElementById("plantName");
    if (nameEl) nameEl.textContent = INFO.name;

    var footEl = document.getElementById("footMeta");
    if (footEl) {
      var v = window.PLANT_VERSION || {};
      footEl.textContent = (INFO.revision || "") + (v.version ? " \u00B7 v" + v.version : "");
    }

    var themeBtn = document.getElementById("themeBtn");
    if (themeBtn) themeBtn.addEventListener("click", flipTheme);

    window.addEventListener("hashchange", route);

    window.addEventListener("resize", function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        if (remountMap) { mapZoom = null; remountMap(); }
      }, 160);
    });

    /* Esc leaves full screen */
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && document.body.classList.contains("map-full")) mapFull();
    });

    route();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  return {
    go: go,
    setTheme: setTheme,
    flipTheme: flipTheme,
    toggleStep: toggleStep,
    resetChecks: resetChecks,
    answer: answer,
    flowBack: flowBack,
    flowRestart: flowRestart,
    onSearchSubmit: onSearchSubmit,
    mapToggle: mapToggle,
    mapZoomBy: mapZoomBy,
    mapZoomFit: mapZoomFit,
    mapFull: mapFull,
    setDetail: setDetail,
    addStep: addStep,
    removeStep: removeStep,
    addStepAt: addStepAt,
    moveStep: moveStep,
    deleteStep: deleteStep,
    addPhotos: addPhotos,
    removePhoto: removePhoto,
    viewPhoto: viewPhoto,
    buildReport: buildReport,
    buildPhotos: buildPhotos,
    buildCopy: buildCopy,
    showSend: showSend,
    copySend: copySend,
    shareSend: shareSend,
    downloadSend: downloadSend,
    checkVersion: checkVersion,
    forceUpdate: forceUpdate,
    saveBackup: saveBackup,
    loadBackup: loadBackup,
    wipeAll: wipeAll
  };
})();
