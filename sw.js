/* Service worker — makes the app work with no internet.
   The cache name carries the version, so bumping the version
   throws the old copy away and pulls everything down fresh.
   Keep this version in step with version.js and version.json. */

var VERSION = "6";
var CACHE = "plant-guide-v" + VERSION;

var FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./version.js",
  "./version.json",
  "./machine-icons.js",
  "./data/plant-map.js",
  "./data/interviews.js",
  "./data/procedures.js",
  "./data/troubleshooting.js",
  "./manifest.json",
  "./icons/icon.svg",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      /* one missing file must not stop the whole install */
      return Promise.all(FILES.map(function (f) {
        return c.add(new Request(f, { cache: "reload" }))["catch"](function () {});
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches["delete"](k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;

  var url = new URL(req.url);
  if (url.origin !== location.origin) return;

  /* version.json must always come from the network when there is one,
     otherwise the update check would read its own cached copy */
  if (url.pathname.indexOf("version.json") !== -1) {
    e.respondWith(
      fetch(req, { cache: "no-store" })["catch"](function () { return caches.match(req); })
    );
    return;
  }

  /* everything else: cache first, that is what makes it work offline */
  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && res.ok && res.type === "basic") {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      })["catch"](function () {
        if (req.mode === "navigate") return caches.match("./index.html");
      });
    })
  );
});
