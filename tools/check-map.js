#!/usr/bin/env node
/* =============================================================
   Checks the plant map for mistakes before you publish it.

       node tools/check-map.js

   It catches the things that are easy to do by hand and hard to
   spot on screen:

     - an arrow pointing at a machine that does not exist
     - the same machine id used twice
     - an arrow using a stream colour that is not defined
     - an area feeding into an area that does not exist
     - a machine with no arrows at all

   Exits with an error code if anything is wrong, so it can be
   wired into a release step later.
   ============================================================= */

"use strict";

var path = require("path");

global.window = {};
require(path.join(path.dirname(__dirname), "data", "plant-map.js"));

var MAP = global.window.PLANT_MAP;
var INFO = global.window.PLANT_INFO || {};

var problems = [];
var warnings = [];

function problem(msg) { problems.push(msg); }
function warn(msg) { warnings.push(msg); }

if (!MAP || !MAP.areas) {
  console.error("Could not read the plant map at all.");
  process.exit(1);
}

var streamKeys = Object.keys(MAP.streams || {});
var plantKeys = Object.keys(MAP.plants || {});
var areaIds = MAP.areas.map(function (a) { return a.id; });

var totalNodes = 0, totalEdges = 0, totalGuesses = 0, totalAlarms = 0;
var seenGlobally = {};

MAP.areas.forEach(function (a) {
  if (areaIds.filter(function (x) { return x === a.id; }).length > 1) {
    problem("area id used twice: " + a.id);
  }
  if (plantKeys.indexOf(a.plant) === -1) {
    problem(a.id + ": unknown plant group \"" + a.plant + "\"");
  }

  var ids = {};
  (a.nodes || []).forEach(function (n) {
    totalNodes++;
    if (n.guess) totalGuesses++;
    if (n.alarms) totalAlarms += n.alarms.length;

    if (ids[n.id]) problem(a.id + ": machine id used twice \"" + n.id + "\"");
    ids[n.id] = { used: false };

    if (seenGlobally[n.id]) {
      problem("machine id \"" + n.id + "\" is in both " + seenGlobally[n.id] + " and " + a.id);
    }
    seenGlobally[n.id] = a.id;

    if (!n.label) problem(a.id + ": machine \"" + n.id + "\" has no label");
    if (!n.type) problem(a.id + ": machine \"" + n.id + "\" has no type");
  });

  (a.edges || []).forEach(function (e) {
    totalEdges++;
    if (!ids[e.from]) problem(a.id + ": arrow from a machine that does not exist, \"" + e.from + "\"");
    else ids[e.from].used = true;

    if (!ids[e.to]) problem(a.id + ": arrow to a machine that does not exist, \"" + e.to + "\"");
    else ids[e.to].used = true;

    if (streamKeys.indexOf(e.stream) === -1) {
      problem(a.id + ": arrow " + e.from + " to " + e.to + " uses unknown stream \"" + e.stream + "\"");
    }
    if (e.from === e.to) problem(a.id + ": arrow from " + e.from + " to itself");
  });

  Object.keys(ids).forEach(function (id) {
    if (!ids[id].used && (a.nodes || []).length > 1) {
      warn(a.id + ": \"" + id + "\" has no arrows in or out");
    }
  });

  (a.to || []).forEach(function (t) {
    if (areaIds.indexOf(t) === -1) problem(a.id + ": feeds into \"" + t + "\", which is not an area");
    if (t === a.id) problem(a.id + ": feeds into itself");
  });
});

/* ---------- report ---------- */

console.log(INFO.name || "Plant map");
console.log("");
console.log("  Areas        " + MAP.areas.length);
console.log("  Machines     " + totalNodes);
console.log("  Connections  " + totalEdges);
console.log("  Streams      " + streamKeys.length);
console.log("  Still guesses " + totalGuesses);
console.log("  Alarms listed " + totalAlarms);
console.log("");

if (warnings.length) {
  console.log("Worth a look (" + warnings.length + "):");
  warnings.forEach(function (w) { console.log("  - " + w); });
  console.log("");
}

if (problems.length) {
  console.error("PROBLEMS (" + problems.length + "):");
  problems.forEach(function (p) { console.error("  ! " + p); });
  process.exit(1);
}

console.log("No problems found.");
