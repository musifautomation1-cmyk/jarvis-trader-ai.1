const CACHE_NAME = "jarvis-trader-v8";

self.addEventListener("install", event => {
 self.skipWaiting();
});

self.addEventListener("activate", event => {
 event.waitUntil(
  caches.keys().then(keys =>
   Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ).then(() => self.clients.claim())
 );
});

self.addEventListener("fetch", event => {
 const req = event.request;
 const url = new URL(req.url);
 if (req.method !== "GET" || url.origin !== self.location.origin) return;

 event.respondWith(
  fetch(req).then(response => {
   if (response.ok) {
    const copy = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(req, copy));
   }
   return response;
  }).catch(() => caches.match(req).then(cached => cached || caches.match("./index.html")))
 );
});
