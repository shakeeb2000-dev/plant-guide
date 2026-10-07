#!/usr/bin/env node
/* =============================================================
   Squashes the whole app into one file you can email around.

       node build-one-file.js

   It reads index.html, pulls the CSS and every script inline, and
   writes PLANT-GUIDE-single-file.html. That one file opens on any
   phone or PC with no folder, no internet and no install.
   ============================================================= */

"use strict";

var fs = require("fs");
var path = require("path");

var ROOT = __dirname;
var SRC = path.join(ROOT, "index.html");
var OUT = path.join(ROOT, "PLANT-GUIDE-single-file.html");

function read(rel) {
  return fs.readFileSync(path.join(ROOT, rel), "utf8");
}

function main() {
  var html = read("index.html");

  /* 1. the stylesheet link becomes a <style> block */
  html = html.replace(
    /[ \t]*<link rel="stylesheet" href="styles\.css">\s*/,
    "\n<style>\n" + read("styles.css").trim() + "\n</style>\n"
  );

  /* 2. every <script src="..."> becomes the file itself */
  var pulled = [];
  html = html.replace(/[ \t]*<script src="([^"]+)"><\/script>\s*/g, function (m, src) {
    var file = src.replace(/^\.\//, "");
    var full = path.join(ROOT, file);
    if (!fs.existsSync(full)) {
      console.warn("  ! skipped missing file: " + file);
      return "";
    }
    pulled.push(file);
    return "\n<script>\n/* ---- " + file + " ---- */\n" +
           fs.readFileSync(full, "utf8").trim() + "\n</script>\n";
  });

  /* 3. things that only make sense as a folder on a web server */
  html = html.replace(/[ \t]*<link rel="manifest"[^>]*>\s*/, "");
  html = html.replace(/[ \t]*<link rel="apple-touch-icon"[^>]*>\s*/, "");

  /* the icon becomes a data url so the tab still shows it */
  if (fs.existsSync(path.join(ROOT, "icons/icon.svg"))) {
    var svg = read("icons/icon.svg");
    var dataUrl = "data:image/svg+xml;base64," + Buffer.from(svg, "utf8").toString("base64");
    html = html.replace(/<link rel="icon"[^>]*>/,
                        '<link rel="icon" href="' + dataUrl + '" type="image/svg+xml">');
  }

  /* the service worker cannot register from a single file, and the
     update check has no version.json to read — strip both */
  html = html.replace(
    /<script>\s*\/\* Makes the app work with no internet[\s\S]*?<\/script>\s*/,
    "<!-- service worker left out of the single-file copy -->\n"
  );

  html = html.replace(
    /<title>([^<]*)<\/title>/,
    "<title>$1</title>\n<!-- Single-file copy. Built by build-one-file.js on " +
    new Date().toISOString().slice(0, 10) + ". Edit the folder, not this file. -->"
  );

  fs.writeFileSync(OUT, html, "utf8");

  var kb = (Buffer.byteLength(html, "utf8") / 1024).toFixed(0);
  console.log("Built " + path.basename(OUT) + "  (" + kb + " KB)");
  console.log("Pulled in:");
  pulled.forEach(function (f) { console.log("  - " + f); });

  /* a quick sanity check so a broken build does not go out quietly */
  var problems = [];
  if (/<script src=/.test(html)) problems.push("a <script src> was left behind");
  if (/<link rel="stylesheet"/.test(html)) problems.push("the stylesheet link was left behind");
  if (html.indexOf("window.PLANT_PROCEDURES") === -1) problems.push("the procedures did not go in");
  if (html.indexOf("window.PLANT_MAP") === -1) problems.push("the plant map did not go in");
  if (html.indexOf("var Plant =") === -1) problems.push("app.js did not go in");

  if (problems.length) {
    console.error("\nPROBLEMS:");
    problems.forEach(function (p) { console.error("  ! " + p); });
    process.exit(1);
  }
  console.log("\nChecks passed.");
}

main();
