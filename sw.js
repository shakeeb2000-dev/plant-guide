/* Service worker — this is what makes the app work with no internet.
   If you change any content, bump CACHE_VERSION by one so phones pick
   up the new version instead of the old cached one. */

var CACHE_VERSION = "plant-guide-v2";

var FILES = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./machine-icons.js",
  "./data/plant-map.js",
  "./data/procedures.js",
  "./data/troubleshooting.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png"
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      /* Add one at a time so a single missing file does not fail the whole install. */
      return Promise.all(
        FILES.map(function (url) {
          return cache.add(new Request(url, { cache: "reload" }))["catch"](function () {});
        })
      );
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.filter(function (k) { return k !== CACHE_VERSION; })
            .map(function (k) { return caches["delete"](k); })
      );
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (event) {
  var req = event.request;
  if (req.method !== "GET") return;

  /* Page loads: try the network for a fresh copy, fall back to the cached page. */
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE_VERSION).then(function (c) { c.put("./index.html", copy); });
        return res;
      })["catch"](function () {
        return caches.match("./index.html").then(function (hit) {
          return hit || caches.match("./");
        });
      })
    );
    return;
  }

  /* Everything else: use the cache first, it is faster and works offline. */
  event.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && res.status === 200 && res.type === "basic") {
          var copy = res.clone();
          caches.open(CACHE_VERSION).then(function (c) { c.put(req, copy); });
        }
        return res;
      });
    })
  );
});
