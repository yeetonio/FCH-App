const CACHE_NAME = 'fch-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon.svg',
  './style.css',
  './script-placeholder.js' // does not exist — kept to avoid failing cache on some hosts
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).catch(()=>{})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => { if(k !== CACHE_NAME) return caches.delete(k); }))).catch(()=>{})
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => {
      if(r) return r;
      // fetch, cache, return
      return fetch(e.request).then(resp => {
        // only cache GET html/css/js/svg/png requests successfully responded
        try{
          if(e.request.method === 'GET' && resp && resp.status === 200 && resp.type !== 'opaque') {
            const respClone = resp.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(e.request, respClone));
          }
        } catch(err){}
        return resp;
      }).catch(()=> caches.match('./index.html'));
    })
  );
});
