/* =============================================================
   Plant Guide — app logic
   Plain JavaScript, no internet needed, no build step.
   You should not need to edit this file to change content.
   Content lives in data/procedures.js and data/troubleshooting.js
   ============================================================= */

var Plant = (function () {
  "use strict";

  var STORE_PREFIX = "plantguide:v1:";
  var view = document.getElementById("view");

  var PROCS  = window.PLANT_PROCEDURES || [];
  var FAULTS = window.PLANT_FAULTS || [];
  var INFO   = window.PLANT_INFO || { name: "Plant Guide", site: "", revision: "" };
  var MAP    = window.PLANT_MAP || null;
  var ICONS  = window.MACHINE_ICONS || {};
  var INTERVIEWS  = window.PLANT_INTERVIEWS || [];
  var STEP_FIELDS = window.PLANT_STEP_FIELDS || [];

  var NODE_W = 108, NODE_H = 82;
  var mapZoom = 0;  /* 0 means "work it out from the screen size" */
  var mapStreams = { solids: true, meal: true, tallow: true, water: true, steam: false };

  /* ---------------- helpers ---------------- */

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
      ? '<span class="badge ok">Signed off</span>'
      : '<span class="badge draft">Draft &mdash; needs sign-off</span>';
  }

  function go(hash) { location.hash = hash; }

  /* ---------------- saved checklist state ---------------- */

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

  /* ---------------- home ---------------- */

  function tile(hash, icon, title, sub, cls) {
    return '<button class="tile ' + (cls || "") + '" onclick="Plant.go(\'' + hash + '\')">' +
             '<span class="tile-icon">' + icon + '</span>' +
             '<span class="tile-title">' + esc(title) + '</span>' +
             '<span class="tile-sub">' + esc(sub) + '</span>' +
           '</button>';
  }

  function renderHome() {
    var h = "";
    h += '<h1>' + esc(INFO.name) + '</h1>';
    h += '<p class="lede">Pick what you need. Every job is a step-by-step list you can tick off as you go.</p>';

    h += '<div class="tile-grid">';
    procsIn("startup").forEach(function (p) {
      h += tile("#/p/" + p.id, p.icon || "\u25B6", p.title, p.subtitle || "", "big");
    });
    procsIn("shutdown").forEach(function (p) {
      h += tile("#/p/" + p.id, p.icon || "\u25A0", p.title, p.subtitle || "", "big");
    });
    h += tile("#/trouble", "\u{1F527}", "Something has gone wrong", FAULTS.length + " faults, step by step", "warn");
    if (MAP) {
      h += tile("#/map", "\u{1F5FA}", "Plant Map",
                MAP.nodes.length + " machines \u2014 tap any one for its details", "map");
    }
    h += '</div>';

    h += '<h2>Lines</h2><div class="tile-grid">';
    procsIn("line").forEach(function (p) {
      h += tile("#/p/" + p.id, p.icon || "\u2699", p.title, p.subtitle || "");
    });
    h += '</div>';

    h += '<h2>Support jobs</h2><div class="tile-grid">';
    procsIn("support").forEach(function (p) {
      h += tile("#/p/" + p.id, p.icon || "\u2699", p.title, p.subtitle || "");
    });
    h += '</div>';

    if (INTERVIEWS.length) {
      h += '<h2>Fill in your plant</h2>';
      h += '<p class="lede">The questions to ask your boss, with a box under each one to type the answer ' +
           'straight in. It saves as you go.</p>';
      h += '<div class="tile-grid">';
      INTERVIEWS.forEach(function (iv) {
        var p = countAnswered(iv);
        h += tile("#/interview/" + iv.id, iv.icon || "\u270E", iv.title,
                  p.done + " of " + p.total + " answered", "sheet");
      });
      h += '</div>';
    }

    h += '<h2>Set up</h2><div class="tile-grid">';
    h += tile("#/settings", "\u2699", "Settings", "Backup, restore and updates");
    h += '</div>';

    h += '<div class="callout info" style="margin-top:28px"><strong>This copy is not finished yet</strong>' +
         'The steps you can see are examples to show the shape of the book. Go through them with your boss, ' +
         'correct them, and they become your real plant manual.</div>';

    view.innerHTML = h;
  }

  /* ---------------- procedure page ---------------- */

  function renderProcedure(id) {
    var p = byId(PROCS, id);
    if (!p) return renderNotFound();

    var state = loadState(id);
    var h = "";

    h += '<h1>' + esc(p.title) + '</h1>';
    h += '<p class="lede">' + esc(p.subtitle || "") + ' &nbsp; ' + statusBadge(p.status) + '</p>';

    if (p.summary) {
      h += '<div class="card"><h3>What this job is</h3><div>' + esc(p.summary) + '</div>';
      h += '<div class="step-meta" style="margin-top:12px">';
      if (p.duration) h += '<span>How long: <b>' + esc(p.duration) + '</b></span>';
      if (p.who) h += '<span>Who: <b>' + esc(p.who) + '</b></span>';
      h += '<span>Steps: <b>' + p.steps.length + '</b></span>';
      h += '</div></div>';
    }

    if (p.ppe && p.ppe.length) {
      h += '<div class="card"><h3>Wear this before you start</h3><ul class="chips" style="margin:0">';
      p.ppe.forEach(function (x) { h += '<li>' + esc(x) + '</li>'; });
      h += '</ul></div>';
    }

    (p.warnings || []).forEach(function (w) {
      h += '<div class="callout ' + (w.type === "danger" ? "danger" : "warn") + '">' +
             '<strong>' + esc(w.title) + '</strong>' +
             esc(w.text) + '</div>';
    });

    /* sign off */
    h += '<div class="card"><h3>Who is doing this job</h3><div class="signoff">' +
           '<label class="field">Name' +
             '<input id="sign-by" type="text" value="' + esc(state.by) + '" placeholder="Your name">' +
           '</label>' +
           '<label class="field">Date and shift' +
             '<input id="sign-date" type="text" value="' + esc(state.date) + '" placeholder="e.g. 3 Oct, day shift">' +
           '</label>' +
         '</div></div>';

    /* progress */
    h += '<div class="progress-wrap"><div class="progress-card">' +
           '<span class="count" id="progCount">0 of ' + p.steps.length + ' done</span>' +
           '<span class="bar"><span id="progBar"></span></span>' +
           '<button class="btn ghost" onclick="Plant.resetChecks(\'' + p.id + '\')">Clear ticks</button>' +
         '</div></div>';

    /* steps */
    h += '<ol class="steps">';
    p.steps.forEach(function (s, i) {
      var done = !!state.checked[i];
      h += '<li class="step' + (done ? " done" : "") + '" id="step-' + i + '">' +
             '<input class="step-check" type="checkbox" ' + (done ? "checked" : "") +
               ' onchange="Plant.toggleStep(\'' + p.id + '\',' + i + ',this.checked)" ' +
               ' aria-label="Step ' + (i + 1) + ' done">' +
             '<div class="step-body">' +
               '<div><span class="step-no">' + (i + 1) + '</span><span class="step-title">' + esc(s.title) + '</span></div>';
      if (s.detail) h += '<p class="step-detail">' + esc(s.detail) + '</p>';
      if (s.warning) h += '<div class="step-warn"><b>Careful:</b> ' + esc(s.warning) + '</div>';
      if (s.checks && s.checks.length) {
        h += '<ul class="step-checks">';
        s.checks.forEach(function (c) { h += '<li>' + esc(c) + '</li>'; });
        h += '</ul>';
      }
      if (s.who || s.time) {
        h += '<div class="step-meta">';
        if (s.who) h += '<span>Who: <b>' + esc(s.who) + '</b></span>';
        if (s.time) h += '<span>Time: <b>' + esc(s.time) + '</b></span>';
        h += '</div>';
      }
      h += '</div></li>';
    });
    h += '</ol>';

    h += '<div class="btn-row">' +
           '<button class="btn primary" onclick="Plant.go(\'#/\')">Back to the menu</button>' +
           '<button class="btn" onclick="window.print()">Print / save as PDF</button>' +
           '<button class="btn" onclick="Plant.go(\'#/trouble\')">Something has gone wrong</button>' +
         '</div>';

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

  /* ---------------- troubleshooting ---------------- */

  function renderFaultList() {
    var h = '<h1>Something has gone wrong</h1>';
    h += '<p class="lede">Pick what you are seeing. The app will ask you a few simple questions and take you to the fix.</p>';

    var areas = [];
    FAULTS.forEach(function (f) { if (areas.indexOf(f.area) === -1) areas.push(f.area); });

    areas.forEach(function (area) {
      h += '<h2>' + esc(area) + '</h2>';
      FAULTS.filter(function (f) { return f.area === area; }).forEach(function (f) {
        h += '<button class="result" onclick="Plant.go(\'#/t/' + f.id + '\')">' +
               '<span class="result-kind">' + (f.icon || "") + ' Fault</span>' +
               '<span class="result-title">' + esc(f.title) + '</span>' +
               '<span class="result-snip">' + esc(f.symptom || "") + '</span>' +
             '</button>';
      });
    });

    h += '<div class="callout warn" style="margin-top:24px"><strong>If anyone could get hurt, stop first</strong>' +
         'Press the emergency stop, isolate and lock out the machine, and get your supervisor. ' +
         'Fault finding comes after people are safe.</div>';

    h += '<div class="btn-row"><button class="btn primary" onclick="Plant.go(\'#/\')">Back to the menu</button></div>';
    view.innerHTML = h;
    window.scrollTo(0, 0);
  }

  var flow = null; /* { faultId, nodeId, trail: [{q, a}] } */

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

    h += '<h1>' + esc(f.title) + '</h1>';
    h += '<p class="lede">' + esc(f.area) + ' &nbsp; ' + statusBadge(f.status) + '</p>';

    if (flow.trail.length) {
      h += '<ul class="trail">';
      flow.trail.forEach(function (t) {
        h += '<li>' + esc(t.q) + ' &nbsp;&mdash;&nbsp; you said <b>' + esc(t.a) + '</b></li>';
      });
      h += '</ul>';
    }

    if (node && node.q) {
      h += '<div class="ask-card">' +
             '<p class="ask-q">' + esc(node.q) + '</p>' +
             (node.hint ? '<p class="ask-hint">' + esc(node.hint) + '</p>' : "") +
             '<div class="ask-options">';
      node.options.forEach(function (o, i) {
        h += '<button class="ask-option" onclick="Plant.answer(' + i + ')">' + esc(o.label) + '</button>';
      });
      h += '</div></div>';
    } else if (node && node.fix) {
      h += '<div class="fix-head"><h2>Do this: ' + esc(node.fix.title) + '</h2></div>';
      h += '<ol class="steps">';
      node.fix.steps.forEach(function (s, i) {
        h += '<li class="step"><div class="step-body">' +
               '<div><span class="step-no">' + (i + 1) + '</span><span class="step-title">' + esc(s) + '</span></div>' +
             '</div></li>';
      });
      h += '</ol>';
      if (node.fix.escalate) {
        h += '<div class="callout danger"><strong>When to stop and call someone</strong>' + esc(node.fix.escalate) + '</div>';
      }
    } else {
      h += '<div class="callout danger"><strong>This path is not written yet</strong>' +
           'Ask your boss what happens here, and we will add it.</div>';
    }

    h += '<div class="btn-row">';
    if (flow.trail.length) h += '<button class="btn" onclick="Plant.flowBack()">Go back one question</button>';
    h += '<button class="btn" onclick="Plant.flowRestart()">Start this fault again</button>' +
         '<button class="btn" onclick="Plant.go(\'#/trouble\')">Pick a different fault</button>' +
         '<button class="btn primary" onclick="Plant.go(\'#/\')">Back to the menu</button>' +
         '</div>';

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

  /* ---------------- plant map ---------------- */

  function mapNode(id) {
    if (!MAP) return null;
    for (var i = 0; i < MAP.nodes.length; i++) if (MAP.nodes[i].id === id) return MAP.nodes[i];
    return null;
  }

  function iconMarkup(type, cx, cy, box, color, width) {
    var art = ICONS[type] || ICONS.generic;
    var s = box / 24;
    return '<g transform="translate(' + (cx - box / 2) + ',' + (cy - box / 2) + ') scale(' + s + ')" ' +
           'fill="none" stroke="' + color + '" stroke-width="' + (width || 1.5) + '" ' +
           'stroke-linecap="round" stroke-linejoin="round">' + art + '</g>';
  }

  function wrapLabel(text, maxChars) {
    var words = String(text).split(" ");
    var lines = [], cur = "";
    for (var i = 0; i < words.length; i++) {
      var test = cur ? cur + " " + words[i] : words[i];
      if (test.length > maxChars && cur) { lines.push(cur); cur = words[i]; }
      else cur = test;
    }
    if (cur) lines.push(cur);
    if (lines.length > 2) lines = [lines[0], lines.slice(1).join(" ")];
    return lines;
  }

  function edgePath(a, b) {
    var hw = NODE_W / 2, hh = NODE_H / 2;
    var dx = b.x - a.x, dy = b.y - a.y;

    /* straight across */
    if (Math.abs(dy) < 2 && dx > 0) return "M" + (a.x + hw) + " " + a.y + " H" + (b.x - hw);

    /* straight back — loop over the top */
    if (Math.abs(dy) < 2 && dx < 0) {
      var yy = a.y - hh - 26;
      return "M" + a.x + " " + (a.y - hh) + " V" + yy + " H" + b.x + " V" + (b.y - hh);
    }

    /* forwards and across — step in the middle */
    if (dx > NODE_W) {
      var ax = a.x + hw, bx = b.x - hw, mx = (ax + bx) / 2;
      return "M" + ax + " " + a.y + " H" + mx + " V" + b.y + " H" + bx;
    }

    /* mostly up or down — drop first, then step across near the end */
    var sy = dy > 0 ? a.y + hh : a.y - hh;
    var ey = dy > 0 ? b.y - hh : b.y + hh;
    var jog = dy > 0 ? ey - 28 : ey + 28;
    return "M" + a.x + " " + sy + " V" + jog + " H" + b.x + " V" + ey;
  }

  function autoZoom() {
    var w = view.clientWidth || 900;
    var z = w / MAP.canvas.width;
    return Math.max(0.42, Math.min(1, Math.round(z * 100) / 100));
  }

  function renderMap() {
    if (!MAP) return renderNotFound();
    if (!mapZoom) mapZoom = autoZoom();

    var h = '<h1>Plant Map</h1>';
    h += '<p class="lede">Tap any machine for its own page. Drag the map to move around.</p>';

    h += '<div class="callout warn"><strong>First draft, built from your notes</strong>' +
         'The two lines follow what you told me. Anything with an orange <b>?</b> on it is me ' +
         'guessing to fill a gap \u2014 check those first and tell me what is wrong.</div>';

    /* controls */
    h += '<div class="map-controls">';
    h += '<div class="map-chips">';
    Object.keys(MAP.streams).forEach(function (k) {
      var s = MAP.streams[k];
      h += '<button class="map-chip' + (mapStreams[k] ? " on" : "") + '" ' +
             'style="--chip:' + s.color + '" onclick="Plant.mapToggle(\'' + k + '\')">' +
             '<span class="dot"></span>' + esc(s.label) + '</button>';
    });
    h += '</div>';
    h += '<div class="map-zoom">' +
           '<button class="btn" onclick="Plant.mapZoomBy(-0.15)" aria-label="Zoom out">&minus;</button>' +
           '<span class="zoom-val">' + Math.round(mapZoom * 100) + '%</span>' +
           '<button class="btn" onclick="Plant.mapZoomBy(0.15)" aria-label="Zoom in">+</button>' +
           '<button class="btn" onclick="Plant.mapZoomFit()">Fit</button>' +
         '</div></div>';

    /* the drawing */
    var W = MAP.canvas.width, H = MAP.canvas.height;
    var svg = '<svg class="plantmap" viewBox="0 0 ' + W + ' ' + H + '" ' +
              'width="' + Math.round(W * mapZoom) + '" height="' + Math.round(H * mapZoom) + '" ' +
              'xmlns="http://www.w3.org/2000/svg">';

    /* arrow heads, one per stream colour */
    svg += "<defs>";
    Object.keys(MAP.streams).forEach(function (k) {
      svg += '<marker id="arw-' + k + '" viewBox="0 0 10 10" refX="9" refY="5" ' +
             'markerWidth="6" markerHeight="6" orient="auto-start-reverse">' +
             '<path d="M0 1 L9 5 L0 9 z" fill="' + MAP.streams[k].color + '"/></marker>';
    });
    svg += "</defs>";

    /* section backgrounds */
    svg += '<g opacity=".55">' +
      '<rect x="20" y="40" width="' + (W - 40) + '" height="160" rx="18" fill="#f0f7f3"/>' +
      '<rect x="36" y="258" width="715" height="146" rx="18" fill="#f0f2f1"/>' +
      '<rect x="770" y="212" width="810" height="348" rx="18" fill="#fdf6ea"/>' +
      '<rect x="20" y="566" width="' + (W - 40) + '" height="280" rx="18" fill="#f1f4fc"/>' +
      '</g>';
    svg += '<g class="map-sectionlabel">' +
      '<text x="36" y="66">OVINE LINE</text>' +
      '<text x="52" y="282">SERVICES</text>' +
      '<text x="786" y="240">TALLOW \u2014 SHARED</text>' +
      '<text x="36" y="592">MBM / MIXED LINE</text>' +
      '</g>';

    /* edges first, so they sit behind the machines */
    MAP.edges.forEach(function (e) {
      if (!mapStreams[e.stream]) return;
      var a = mapNode(e.from), b = mapNode(e.to);
      if (!a || !b) return;
      var col = MAP.streams[e.stream].color;
      svg += '<path d="' + edgePath(a, b) + '" fill="none" stroke="' + col + '" ' +
             'stroke-width="2.4" stroke-linejoin="round" ' +
             (e.dashed ? 'stroke-dasharray="7 6" ' : "") +
             'marker-end="url(#arw-' + e.stream + ')"/>';
    });

    /* edge labels, only when zoomed in enough to read them */
    if (mapZoom >= 0.62) {
      MAP.edges.forEach(function (e) {
        if (!e.label || !mapStreams[e.stream]) return;
        var a = mapNode(e.from), b = mapNode(e.to);
        if (!a || !b) return;
        var lx = (a.x + b.x) / 2, ly = (a.y + b.y) / 2 - 8;
        svg += '<text class="map-edgelabel" x="' + lx + '" y="' + ly + '" ' +
               'fill="' + MAP.streams[e.stream].color + '">' + esc(e.label) + '</text>';
      });
    }

    /* machines */
    MAP.nodes.forEach(function (n) {
      var ln = MAP.lines[n.line] || MAP.lines.utility;
      var x = n.x - NODE_W / 2, y = n.y - NODE_H / 2;
      svg += '<g class="mnode" onclick="Plant.go(\'#/m/' + n.id + '\')">';
      svg += '<rect x="' + x + '" y="' + y + '" width="' + NODE_W + '" height="' + NODE_H + '" ' +
             'rx="12" fill="' + ln.fill + '" stroke="' + ln.stroke + '" stroke-width="2"/>';
      svg += iconMarkup(n.type, n.x, n.y - 17, 27, ln.stroke, 1.4);
      wrapLabel(n.label, 15).forEach(function (line, i) {
        svg += '<text class="map-nodelabel" x="' + n.x + '" y="' + (n.y + 13 + i * 13) + '" ' +
               'fill="' + ln.text + '">' + esc(line) + '</text>';
      });
      if (n.guess) {
        svg += '<circle cx="' + (x + NODE_W - 12) + '" cy="' + (y + 12) + '" r="9" ' +
               'fill="#fff6e6" stroke="#b45309" stroke-width="1.6"/>';
        svg += '<text class="map-guess" x="' + (x + NODE_W - 12) + '" y="' + (y + 16) + '">?</text>';
      }
      svg += "</g>";
    });

    svg += "</svg>";

    h += '<div class="map-wrap" id="mapWrap">' + svg + "</div>";

    /* legend */
    h += '<div class="card"><h3>What the colours mean</h3><ul class="chips" style="margin:0">';
    Object.keys(MAP.lines).forEach(function (k) {
      var l = MAP.lines[k];
      h += '<li style="background:' + l.fill + ';border-color:' + l.stroke + ';color:' + l.text + '">' +
           esc(l.label) + '</li>';
    });
    h += '</ul><p class="step-detail" style="margin-top:12px">' +
         'Dashed arrows are either a choice of route or something I am not sure about. ' +
         'A machine with an orange <b>?</b> is a guess.</p></div>';

    h += '<div class="btn-row">' +
           '<button class="btn primary" onclick="Plant.go(\'#/\')">Back to the menu</button>' +
           '<button class="btn" onclick="window.print()">Print the map</button>' +
         '</div>';

    view.innerHTML = h;
    window.scrollTo(0, 0);
    enableDragScroll(document.getElementById("mapWrap"));
  }

  /* lets you drag the map around with a mouse, like a touch screen */
  function enableDragScroll(el) {
    if (!el) return;
    var down = false, sx = 0, sy = 0, sl = 0, st = 0;
    el.addEventListener("mousedown", function (e) {
      down = true; sx = e.pageX; sy = e.pageY; sl = el.scrollLeft; st = el.scrollTop;
      el.classList.add("grabbing");
    });
    window.addEventListener("mouseup", function () { down = false; el.classList.remove("grabbing"); });
    el.addEventListener("mousemove", function (e) {
      if (!down) return;
      e.preventDefault();
      el.scrollLeft = sl - (e.pageX - sx);
      el.scrollTop = st - (e.pageY - sy);
    });
  }

  function mapToggle(stream) { mapStreams[stream] = !mapStreams[stream]; renderMap(); }
  function mapZoomBy(d) {
    mapZoom = Math.max(0.3, Math.min(1.6, Math.round((mapZoom + d) * 100) / 100));
    renderMap();
  }
  function mapZoomFit() { mapZoom = autoZoom(); renderMap(); }

  /* ---------------- one machine ---------------- */

  function renderMachine(id) {
    var n = mapNode(id);
    if (!n) return renderNotFound();
    var ln = MAP.lines[n.line] || MAP.lines.utility;

    var into = MAP.edges.filter(function (e) { return e.to === id; });
    var outOf = MAP.edges.filter(function (e) { return e.from === id; });

    var h = "";
    h += '<div class="machine-head" style="background:' + ln.fill + ';border-color:' + ln.stroke + '">' +
           '<svg class="machine-icon" viewBox="0 0 64 64" width="64" height="64">' +
             iconMarkup(n.type, 32, 32, 52, ln.stroke, 1.6) +
           '</svg>' +
           '<div><h1 style="margin:0">' + esc(n.label) + '</h1>' +
           '<p class="lede" style="margin:4px 0 0">' + esc(ln.label) +
             (n.status ? " &middot; " + esc(n.status) : "") + '</p></div>' +
         '</div>';

    if (n.guess) {
      h += '<div class="callout warn"><strong>This one is my guess</strong>' +
           'I put this machine here to fill a gap. Check it with your boss before anyone relies on it.</div>';
    }

    h += '<div class="card"><h3>What it does</h3><div>' + esc(n.whatItDoes || "Not written down yet.") + '</div></div>';

    /* what it is joined to */
    h += '<div class="card"><h3>What it is joined to</h3>';
    h += '<div class="joined"><div><b>Comes from</b>';
    if (into.length) {
      h += '<div class="joined-list">';
      into.forEach(function (e) {
        var o = mapNode(e.from);
        h += '<button class="joined-btn" onclick="Plant.go(\'#/m/' + o.id + '\')">' +
             esc(o.label) + ' <span>' + esc(MAP.streams[e.stream].label) + '</span></button>';
      });
      h += "</div>";
    } else h += '<p class="step-detail">Nothing drawn in yet.</p>';
    h += '</div><div><b>Goes to</b>';
    if (outOf.length) {
      h += '<div class="joined-list">';
      outOf.forEach(function (e) {
        var o = mapNode(e.to);
        h += '<button class="joined-btn" onclick="Plant.go(\'#/m/' + o.id + '\')">' +
             esc(o.label) + ' <span>' + esc(MAP.streams[e.stream].label) + '</span></button>';
      });
      h += "</div>";
    } else h += '<p class="step-detail">Nothing drawn in yet.</p>';
    h += "</div></div></div>";

    /* the empty sections, written as the questions to ask */
    var blanks = [
      { t: "How to start it", q: ["What do you check before you press start?",
                                  "What order do the buttons and valves go in?",
                                  "How do you know it has started properly?"] },
      { t: "How to stop it", q: ["Does it have to be run empty first?",
                                 "What gets isolated or locked out?",
                                 "What sets solid or burns if you just stop it?"] },
      { t: "Normal running numbers", q: ["Temperatures, pressures, amps, speed, feed rate.",
                                         "What is too high, and what is too low?"] },
      { t: "Machine details", q: ["Make, model, serial, year.",
                                  "Motor size, capacity.",
                                  "Service interval and who services it."] },
      { t: "Photos", q: ["A photo of the machine and of its control panel.",
                         "Send them to me and I will put them on this page."] }
    ];

    blanks.forEach(function (b) {
      h += '<div class="card blank-card"><h3>' + esc(b.t) +
           ' <span class="badge draft">Not filled in yet</span></h3><ul class="step-checks">';
      b.q.forEach(function (q) { h += "<li>" + esc(q) + "</li>"; });
      h += "</ul></div>";
    });

    /* faults */
    if (n.faults && n.faults.length) {
      h += '<h2>When this one plays up</h2>';
      n.faults.forEach(function (fid) {
        var f = byId(FAULTS, fid);
        if (!f) return;
        h += '<button class="result" onclick="Plant.go(\'#/t/' + f.id + '\')">' +
               '<span class="result-kind">Fault finding</span>' +
               '<span class="result-title">' + esc(f.title) + '</span>' +
               '<span class="result-snip">' + esc(f.symptom || "") + '</span>' +
             '</button>';
      });
    }

    h += '<div class="btn-row">' +
           '<button class="btn primary" onclick="Plant.go(\'#/map\')">Back to the map</button>' +
           '<button class="btn" onclick="Plant.go(\'#/\')">Menu</button>' +
           '<button class="btn" onclick="window.print()">Print</button>' +
         '</div>';

    view.innerHTML = h;
    window.scrollTo(0, 0);
  }

  /* ---------------- your answers (saved on this device) ---------------- */

  var ANSWER_KEY = STORE_PREFIX + "answers";

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

  /* ---------------- interview sheets ---------------- */

  var sendOpen = null;

  function fieldHtml(key, q, value) {
    if (q.type === "long") {
      return '<textarea class="ans" rows="3" data-q="' + key + '" ' +
             'placeholder="Type the answer here">' + esc(value) + "</textarea>";
    }
    return '<input class="ans" type="text" data-q="' + key + '" value="' + esc(value) + '" ' +
           'placeholder="Type the answer here">';
  }

  function stepsHtml(key, arr) {
    var h = '<div class="isteps">';
    arr.forEach(function (st, i) {
      h += '<div class="istep">';
      h += '<div class="istep-head"><span class="step-no">' + (i + 1) + "</span>" +
           '<button class="btn ghost small" onclick="Plant.removeStep(\'' + key + "'," + i + ')">Remove</button></div>';
      STEP_FIELDS.forEach(function (f) {
        var val = st[f.k] || "";
        h += '<label class="field wide"><span>' + esc(f.label) + "</span>";
        h += f.type === "long"
          ? '<textarea class="ans" rows="2" data-q="' + key + '" data-i="' + i + '" data-f="' + f.k + '">' + esc(val) + "</textarea>"
          : '<input class="ans" type="text" data-q="' + key + '" data-i="' + i + '" data-f="' + f.k + '" value="' + esc(val) + '">';
        h += "</label>";
      });
      h += "</div>";
    });
    h += "</div>";
    h += '<button class="btn primary" onclick="Plant.addStep(\'' + key + '\')">+ Add another step</button>';
    if (!arr.length) {
      h = '<p class="step-detail">No steps written down yet.</p>' + h;
    }
    return h;
  }

  function renderInterview(id) {
    var iv = byId(INTERVIEWS, id);
    if (!iv) return renderNotFound();
    var a = loadAnswers();
    var prog = countAnswered(iv);

    var h = "";
    h += "<h1>" + esc(iv.title) + "</h1>";
    h += '<p class="lede">' + esc(iv.subtitle || "") + "</p>";
    if (iv.intro) h += '<div class="callout info"><strong>How to get good answers</strong>' + esc(iv.intro) + "</div>";

    h += '<div class="progress-wrap"><div class="progress-card">' +
           '<span class="count" id="ansCount">' + prog.done + " of " + prog.total + " answered</span>" +
           '<span class="bar"><span id="ansBar" style="width:' +
             (prog.total ? Math.round(prog.done / prog.total * 100) : 0) + '%"></span></span>' +
           '<span class="saved-flag" id="savedFlag">Saves as you type</span>' +
         "</div></div>";

    iv.sections.forEach(function (s, si) {
      h += '<div class="card"><h3>' + esc(s.title) + "</h3>";
      if (s.hint) h += '<p class="step-detail" style="margin-top:0">' + esc(s.hint) + "</p>";
      s.questions.forEach(function (q) {
        var key = iv.id + "." + q.id;
        h += '<div class="qblock">';
        h += '<label class="qlabel" for="' + key + '">' + esc(q.label) + "</label>";
        if (q.hint) h += '<p class="qhint">' + esc(q.hint) + "</p>";
        if (q.type === "steps") {
          h += stepsHtml(key, Array.isArray(a[key]) ? a[key] : []);
        } else {
          h += fieldHtml(key, q, a[key] || "");
        }
        h += "</div>";
      });
      h += "</div>";
      if (si === 0 && iv.linked) {
        h += '<div class="btn-row"><button class="btn" onclick="Plant.go(\'#/p/' + iv.linked +
             '\')">Open my example steps to read out to him</button></div>';
      }
    });

    h += '<div class="btn-row">' +
           '<button class="btn primary" onclick="Plant.showSend(\'' + iv.id + '\')">Send these answers to Kiro</button>' +
           '<button class="btn" onclick="window.print()">Print blank or filled in</button>' +
           '<button class="btn" onclick="Plant.go(\'#/\')">Back to the menu</button>' +
         "</div>";

    if (sendOpen === iv.id) {
      var txt = interviewText(iv);
      h += '<div class="card" id="sendCard"><h3>Your answers</h3>' +
           '<p class="step-detail" style="margin-top:0">Copy this and paste it to me, or save it and send it ' +
           'however suits. Only the questions you answered are in here.</p>' +
           '<textarea id="sendText" class="sendbox" rows="14" readonly>' + esc(txt) + "</textarea>" +
           '<div class="btn-row" style="margin-bottom:0">' +
             '<button class="btn primary" onclick="Plant.copySend()">Copy it all</button>' +
             (navigator.share ? '<button class="btn" onclick="Plant.shareSend(\'' + iv.id + '\')">Share</button>' : "") +
             '<button class="btn" onclick="Plant.downloadSend(\'' + iv.id + '\')">Save as a file</button>' +
           "</div></div>";
    }

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

  var saveTimer = null;

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

    var ivId = qid.split(".")[0];
    var iv = byId(INTERVIEWS, ivId);
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

  /* ---------------- settings, backup, update ---------------- */

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
      if (k && k.indexOf(STORE_PREFIX) === 0) out[k] = localStorage.getItem(k);
    }
    return out;
  }

  function storedSummary() {
    var answers = loadAnswers();
    var answerCount = Object.keys(answers).length;
    var tickLists = 0, ticks = 0;
    PROCS.forEach(function (p) {
      var st = loadState(p.id);
      var n = Object.keys(st.checked || {}).length;
      if (n) { tickLists++; ticks += n; }
    });
    return { answers: answerCount, tickLists: tickLists, ticks: ticks };
  }

  function renderSettings() {
    var v = window.PLANT_VERSION || { version: "?", built: "?", notes: "" };
    var s = storedSummary();

    var h = "<h1>Settings</h1>";
    h += '<p class="lede">Your version, your backups, and the button that pulls down the latest copy.</p>';

    /* version + update */
    h += '<div class="card"><h3>Version</h3>' +
           '<div class="kv"><span>Installed on this phone</span><b>Version ' + esc(v.version) +
             " &middot; " + esc(v.built) + "</b></div>" +
           (v.notes ? '<div class="kv"><span>What changed</span><b>' + esc(v.notes) + "</b></div>" : "") +
           '<div class="kv"><span>Latest available</span><b id="latestVer">Not checked yet</b></div>' +
           '<div class="btn-row" style="margin-bottom:0">' +
             '<button class="btn" onclick="Plant.checkVersion()">Check for a new version</button>' +
             '<button class="btn primary" onclick="Plant.forceUpdate()">Get the latest version now</button>' +
           "</div>" +
           '<p class="step-detail">The update button throws away the old saved copy of the app and pulls ' +
           'everything down fresh. You need internet for it. <b>Your answers and ticks are not touched.</b></p>' +
         "</div>";

    /* backup */
    h += '<div class="card"><h3>Backup</h3>' +
           '<p class="step-detail" style="margin-top:0">Everything you have typed lives on this phone only. ' +
           'If you lose the phone, it is gone \u2014 unless you save a backup file somewhere safe, like your email.</p>' +
           '<div class="kv"><span>Answers saved</span><b>' + s.answers + "</b></div>" +
           '<div class="kv"><span>Checklists with ticks</span><b>' + s.tickLists + " (" + s.ticks + " ticks)</b></div>" +
           '<div class="btn-row" style="margin-bottom:0">' +
             '<button class="btn primary" onclick="Plant.saveBackup()">Save a backup file</button>' +
           "</div></div>";

    /* restore */
    h += '<div class="card"><h3>Load a backup</h3>' +
           '<p class="step-detail" style="margin-top:0">Pick a backup file you saved earlier. ' +
           'This replaces what is on this phone now, so save a backup first if you are not sure.</p>' +
           '<input type="file" id="restoreFile" accept="application/json,.json" class="filepick">' +
           '<div class="btn-row" style="margin-bottom:0">' +
             '<button class="btn" onclick="Plant.loadBackup()">Load it</button>' +
           "</div></div>";

    /* wipe */
    h += '<div class="card"><h3>Start again</h3>' +
           '<p class="step-detail" style="margin-top:0">Wipes every answer and every tick on this phone. ' +
           'It cannot be undone.</p>' +
           '<div class="btn-row" style="margin-bottom:0">' +
             '<button class="btn danger" onclick="Plant.wipeAll()">Clear everything on this phone</button>' +
           "</div></div>";

    h += '<div class="btn-row"><button class="btn primary" onclick="Plant.go(\'#/\')">Back to the menu</button></div>';

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
        if (String(j.version) === String(installed)) {
          el.innerHTML = "Version " + esc(j.version) + ' <span class="badge ok">Up to date</span>';
        } else {
          el.innerHTML = "Version " + esc(j.version) +
            ' <span class="badge draft">New version \u2014 tap the update button</span>';
        }
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
                   "\n\nThis replaces what is on this phone now.")) return;

      /* clear ours first so an old leftover does not survive */
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
    if (!confirm("Clear every answer and tick on this phone?")) return;
    if (!confirm("Really? This cannot be undone. Save a backup first if you are not sure.")) return;
    Object.keys(allStored()).forEach(function (k) { localStorage.removeItem(k); });
    alert("Cleared.");
    renderSettings();
  }

  /* ---------------- search ---------------- */

  function buildIndex() {
    var idx = [];
    PROCS.forEach(function (p) {
      var text = [p.title, p.subtitle, p.summary, (p.ppe || []).join(" ")];
      p.steps.forEach(function (s) {
        text.push(s.title, s.detail, s.warning, (s.checks || []).join(" "));
      });
      (p.warnings || []).forEach(function (w) { text.push(w.title, w.text); });
      idx.push({
        kind: p.category === "startup" || p.category === "shutdown" ? p.category : "line",
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
        kind: "fault",
        hash: "#/t/" + f.id,
        title: f.title,
        snip: f.symptom || "",
        text: text.join(" ").toLowerCase()
      });
    });
    INTERVIEWS.forEach(function (iv) {
      var words = [iv.title, iv.subtitle, iv.intro];
      iv.sections.forEach(function (s) {
        words.push(s.title, s.hint);
        s.questions.forEach(function (q) { words.push(q.label, q.hint); });
      });
      idx.push({
        kind: "sheet",
        hash: "#/interview/" + iv.id,
        title: iv.title,
        snip: iv.subtitle || "",
        text: words.join(" ").toLowerCase()
      });
    });
    if (MAP) {
      MAP.nodes.forEach(function (n) {
        idx.push({
          kind: "machine",
          hash: "#/m/" + n.id,
          title: n.label,
          snip: n.whatItDoes || "",
          text: [n.label, n.type, n.whatItDoes, n.status, (MAP.lines[n.line] || {}).label]
                  .join(" ").toLowerCase()
        });
      });
    }
    return idx;
  }

  var INDEX = null;

  function renderSearch(q) {
    if (!INDEX) INDEX = buildIndex();
    var needle = String(q || "").trim().toLowerCase();
    var h = '<h1>Search</h1><p class="lede">Looking for &ldquo;' + esc(q) + '&rdquo;</p>';

    if (!needle) {
      h += '<p class="empty">Type something in the box at the top.</p>';
    } else {
      var hits = INDEX.filter(function (r) { return r.text.indexOf(needle) !== -1; });
      if (!hits.length) {
        h += '<p class="empty">Nothing found. Try a shorter word, like &ldquo;press&rdquo; or &ldquo;steam&rdquo;.</p>';
      } else {
        h += '<p class="lede">' + hits.length + ' page' + (hits.length === 1 ? "" : "s") + ' mention it.</p>';
        hits.forEach(function (r) {
          h += '<button class="result" onclick="Plant.go(\'' + r.hash + '\')">' +
                 '<span class="result-kind">' + esc(r.kind) + '</span>' +
                 '<span class="result-title">' + esc(r.title) + '</span>' +
                 '<span class="result-snip">' + esc(r.snip) + '</span>' +
               '</button>';
        });
      }
    }

    h += '<div class="btn-row"><button class="btn primary" onclick="Plant.go(\'#/\')">Back to the menu</button></div>';
    view.innerHTML = h;
    window.scrollTo(0, 0);
  }

  function onSearchSubmit(ev) {
    ev.preventDefault();
    var q = document.getElementById("searchInput").value;
    go("#/search/" + encodeURIComponent(q));
    return false;
  }

  /* ---------------- not found ---------------- */

  function renderNotFound() {
    view.innerHTML = '<h1>Page not found</h1>' +
      '<p class="lede">That page is not in the book yet.</p>' +
      '<div class="btn-row"><button class="btn primary" onclick="Plant.go(\'#/\')">Back to the menu</button></div>';
  }

  /* ---------------- router ---------------- */

  function route() {
    var h = location.hash.replace(/^#/, "");
    var parts = h.split("/").filter(function (x) { return x !== ""; });

    if (!parts.length) return renderHome();
    if (parts[0] === "p" && parts[1]) return renderProcedure(parts[1]);
    if (parts[0] === "trouble") return renderFaultList();
    if (parts[0] === "t" && parts[1]) return renderFault(parts[1]);
    if (parts[0] === "map") return renderMap();
    if (parts[0] === "m" && parts[1]) return renderMachine(parts[1]);
    if (parts[0] === "interview" && parts[1]) {
      if (sendOpen && sendOpen !== parts[1]) sendOpen = null;
      return renderInterview(parts[1]);
    }
    if (parts[0] === "settings") return renderSettings();
    if (parts[0] === "search") return renderSearch(decodeURIComponent(parts.slice(1).join("/") || ""));
    return renderNotFound();
  }

  function init() {
    document.getElementById("plantName").textContent = INFO.name;
    document.getElementById("footMeta").textContent =
      (INFO.site ? INFO.site + " \u00B7 " : "") + (INFO.revision || "");
    window.addEventListener("hashchange", route);
    route();
  }

  document.addEventListener("DOMContentLoaded", init);

  return {
    go: go,
    toggleStep: toggleStep,
    resetChecks: resetChecks,
    answer: answer,
    flowBack: flowBack,
    flowRestart: flowRestart,
    onSearchSubmit: onSearchSubmit,
    mapToggle: mapToggle,
    mapZoomBy: mapZoomBy,
    mapZoomFit: mapZoomFit,
    addStep: addStep,
    removeStep: removeStep,
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
