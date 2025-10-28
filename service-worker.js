self.addEventListener('install', e => {
  e.waitUntil(caches.open('fch-v1').then(cache => cache.addAll([
    '/',
    '/index.html',
    '/manifest.json',
    '/icon.svg',
    '/style.css',
    '/script.js'
  ])));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
