#!/usr/bin/env node
/* =============================================================
   A tiny local web server, just for testing on this machine.

       node tools/serve.js          then open http://localhost:8080
       node tools/serve.js 3000     to use a different port

   You only need this to test the offline bits (the service worker
   and the update check), because those need a real web address.
   For everything else just open index.html straight in a browser.
   ============================================================= */

"use strict";

var http = require("http");
var fs = require("fs");
var path = require("path");

var ROOT = path.dirname(__dirname);
var PORT = Number(process.argv[2]) || 8080;

var TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js":   "text/javascript; charset=utf-8",
  ".css":  "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg":  "image/svg+xml",
  ".png":  "image/png",
  ".md":   "text/plain; charset=utf-8"
};

http.createServer(function (req, res) {
  var url = decodeURIComponent(req.url.split("?")[0]);
  if (url === "/") url = "/index.html";

  var full = path.join(ROOT, url);
  if (full.indexOf(ROOT) !== 0) {
    res.writeHead(403); res.end("no");
    return;
  }

  fs.readFile(full, function (err, buf) {
    if (err) {
      res.writeHead(404, { "Content-Type": "text/plain" });
      res.end("Not found: " + url);
      return;
    }
    res.writeHead(200, {
      "Content-Type": TYPES[path.extname(full)] || "application/octet-stream",
      "Cache-Control": "no-store"
    });
    res.end(buf);
  });
}).listen(PORT, function () {
  console.log("Plant Guide is at  http://localhost:" + PORT);
  console.log("Press Ctrl+C to stop.");
});
