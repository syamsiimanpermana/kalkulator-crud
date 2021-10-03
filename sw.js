const staticCacheName = "site-static-v4";
const assets = [
  "/",
  "/index.html",
  "/js/app.js",
  "/img/dish.png",
  "/style.css",
  "/offline.html",
  "js/script.js",
  "/js/db.js",
];
self.addEventListener("install", (event) => {
  // console.log('serviceworker has been installed');
  event.waitUntil(
    caches.open(staticCacheName).then((cache) => {
      cache.addAll(assets);
    })
  );
});
//
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      // console.log(keys)
      return Promise.all(
        keys
          .filter((key) => key !== staticCacheName)
          .map((key) => caches.delete(key))
      );
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((cacheRes) => {
        return cacheRes || fetch(event.request);
      })
      .catch(() => {
        return caches.match("/offline.html");
      })
  );
});
