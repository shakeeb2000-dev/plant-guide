/* Squashes the whole app into one single HTML file you can email to a phone.
   Run it with:  node build-one-file.js
   Re-run it any time the content in data/ changes. */

const fs = require("fs");
const path = require("path");

const here = __dirname;
const read = (p) => fs.readFileSync(path.join(here, p), "utf8");

const html = read("index.html");
const css = read("styles.css");
const machineIcons = read("machine-icons.js");
const plantMap = read("data/plant-map.js");
const procedures = read("data/procedures.js");
const troubleshooting = read("data/troubleshooting.js");
const app = read("app.js");

const bundle = [machineIcons, plantMap, procedures, troubleshooting, app].join("\n");

if (/<\/script/i.test(bundle) || /<\/style/i.test(css)) {
  console.error("Content contains a closing script/style tag and cannot be inlined safely.");
  process.exit(1);
}

let out = html
  .replace('<link rel="stylesheet" href="styles.css">', "<style>\n" + css + "\n</style>")
  .replace(
    /<script src="machine-icons\.js"><\/script>\s*<script src="data\/plant-map\.js"><\/script>\s*<script src="data\/procedures\.js"><\/script>\s*<script src="data\/troubleshooting\.js"><\/script>\s*<script src="app\.js"><\/script>/,
    "<script>\n" + bundle + "\n</script>"
  )
  /* These only make sense on a real web address, so drop them from the single file. */
  .replace(/^\s*<link rel="manifest"[^>]*>\s*$/m, "")
  .replace(/^\s*<link rel="icon"[^>]*>\s*$/m, "")
  .replace(/^\s*<link rel="apple-touch-icon"[^>]*>\s*$/m, "")
  .replace(/\n<script>\s*\/\* Makes the app work with no internet[\s\S]*?<\/script>\n/, "\n");

if (out.includes("styles.css") || out.includes('src="app.js"') || out.includes("serviceWorker")) {
  console.error("Inlining failed — index.html no longer matches the expected tags.");
  process.exit(1);
}

const target = path.join(here, "PLANT-GUIDE-single-file.html");
fs.writeFileSync(target, out, "utf8");
console.log("Wrote " + target + "  (" + Math.round(out.length / 1024) + " KB)");
