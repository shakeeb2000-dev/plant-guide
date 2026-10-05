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
    mapZoomFit: mapZoomFit
  };
})();
