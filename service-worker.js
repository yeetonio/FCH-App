// service-worker.js
const CACHE_NAME = "fch-cache-v2"; // bump version each update
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./manifest.json",
  "./icon.png",
  "./icon.svg"
];

// Install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // activate immediately
});

// Activate + clean old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.map((name) => {
        if (name !== CACHE_NAME) return caches.delete(name);
      }))
    )
  );
  self.clients.claim(); // take control of all pages
});

// Fetch
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return (
        cachedResponse ||
        fetch(event.request).then((response) => {
          return response;
        })
      );
    })
  );
});
