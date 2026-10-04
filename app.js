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
    onSearchSubmit: onSearchSubmit
  };
})();
