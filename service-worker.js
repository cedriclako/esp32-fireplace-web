const CACHE_NAME = "fireplace-cache-v1";

const FILES_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon_stove.png",
  "/self_regulated_bg.jpg",
  "/icon_valcourt.png",
  "/screenshot_mobile.png",
  "/screenshot_wide.png"
];


// 🧱 INSTALL: Mise en cache initiale
self.addEventListener("install", event => {
  self.skipWaiting(); // force l'activation immédiate
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

// 🔁 ACTIVATE: Nettoyage des anciens caches
self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  return self.clients.claim(); // devient actif pour toutes les pages
});

// 🌐 FETCH: Réponse depuis cache ou réseau
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Renvoie du cache ou tentative depuis le réseau
      return response || fetch(event.request).catch(() => {
        // Optionnel: fallback offline ici
        if (event.request.destination === "document") {
          return caches.match("/index.html");
        }
      });
    })
  );
});
