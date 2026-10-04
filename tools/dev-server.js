/* Tiny local web server, only used for testing the app over a real web address.
   Not needed for GitHub Pages.   Run:  node tools/dev-server.js  */
const http = require("http");
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");
const port = Number(process.argv[2] || 8899);
const types = { ".html":"text/html; charset=utf-8", ".js":"text/javascript; charset=utf-8",
  ".css":"text/css; charset=utf-8", ".json":"application/manifest+json; charset=utf-8",
  ".png":"image/png", ".md":"text/plain; charset=utf-8" };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0].split("#")[0]);
  if (p.endsWith("/")) p += "index.html";
  const file = path.join(root, p);
  if (!file.startsWith(root)) { res.writeHead(403).end(); return; }
  fs.readFile(file, (err, buf) => {
    if (err) { res.writeHead(404, {"Content-Type":"text/plain"}).end("not found"); return; }
    res.writeHead(200, {"Content-Type": types[path.extname(file)] || "application/octet-stream"});
    res.end(buf);
  });
}).listen(port, () => console.log("serving on " + port));
