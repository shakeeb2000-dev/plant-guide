/* Bumps the app version in all three places at once, so phones know a new
   copy exists and drop the old cached one.

   Run:  node tools/bump-version.js  ["what changed"]
*/

const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");

const notes = process.argv.slice(2).join(" ").trim();

const current = JSON.parse(fs.readFileSync(path.join(root, "version.json"), "utf8"));
const next = String(Number(current.version) + 1);
const built = new Date().toISOString().slice(0, 10);
const text = notes || current.notes;

/* version.json — read fresh from the network to spot new versions */
fs.writeFileSync(
  path.join(root, "version.json"),
  JSON.stringify({ version: next, built: built, notes: text }, null, 2) + "\n"
);

/* version.js — travels with the cached app, so it is the installed version */
fs.writeFileSync(
  path.join(root, "version.js"),
  '/* The version that is actually installed on this device.\n' +
  '   Bump it with:  node tools/bump-version.js  (keeps version.json and sw.js in step) */\n' +
  "window.PLANT_VERSION = {\n" +
  '  version: "' + next + '",\n' +
  '  built: "' + built + '",\n' +
  '  notes: ' + JSON.stringify(text) + "\n" +
  "};\n"
);

/* sw.js — changing this name is what throws the old cache away */
const swPath = path.join(root, "sw.js");
let sw = fs.readFileSync(swPath, "utf8");
const before = sw;
sw = sw.replace(/var CACHE_VERSION = "plant-guide-v\d+";/, 'var CACHE_VERSION = "plant-guide-v' + next + '";');
if (sw === before) {
  console.error("Could not find CACHE_VERSION in sw.js — check it by hand.");
  process.exit(1);
}
fs.writeFileSync(swPath, sw);

console.log("Version " + current.version + " -> " + next + "  (" + built + ")");
console.log("Now run:  node build-one-file.js");
