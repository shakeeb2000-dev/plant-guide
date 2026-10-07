#!/usr/bin/env node
/* =============================================================
   Bumps the version number in the three places that must agree:
   version.js, version.json and sw.js.

       node tools/bump-version.js "what changed"

   If the cache name in sw.js does not match, phones keep serving
   the old app forever. That is why this exists.
   ============================================================= */

"use strict";

var fs = require("fs");
var path = require("path");

var ROOT = path.dirname(__dirname);
var notes = process.argv.slice(2).join(" ").trim();

function file(rel) { return path.join(ROOT, rel); }
function read(rel) { return fs.readFileSync(file(rel), "utf8"); }
function write(rel, text) { fs.writeFileSync(file(rel), text, "utf8"); }

function today() {
  var d = new Date();
  function p(n) { return (n < 10 ? "0" : "") + n; }
  return d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
}

function main() {
  var current = JSON.parse(read("version.json"));
  var next = String(Number(current.version) + 1);
  var built = today();
  var text = notes || current.notes || "";

  write("version.json", JSON.stringify({
    version: next, built: built, notes: text
  }, null, 2) + "\n");

  var js = read("version.js")
    .replace(/version:\s*"[^"]*"/, 'version: "' + next + '"')
    .replace(/built:\s*"[^"]*"/, 'built: "' + built + '"')
    .replace(/notes:\s*"[^"]*"/, 'notes: ' + JSON.stringify(text));
  write("version.js", js);

  var sw = read("sw.js").replace(/var VERSION = "[^"]*"/, 'var VERSION = "' + next + '"');
  write("sw.js", sw);

  console.log("Version " + current.version + " -> " + next + "  (" + built + ")");
  if (text) console.log("Notes: " + text);
  console.log("\nUpdated version.js, version.json and sw.js.");
  console.log("Now run:  node build-one-file.js");
}

main();
