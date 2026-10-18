/* SolarLog service worker. Cache do app shell; API sempre na rede. */
const CACHE = "solarlog-v9";
const SHELL = ["./", "index.html", "app.css?v=9", "app.js?v=9", "manifest.webmanifest", "icon.svg"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const u = new URL(e.request.url);
  if (e.request.method !== "GET") return;                 // login/POST: rede
  if (u.hostname.includes("areswatt.com")) return;        // API: nunca cacheia

  const isNav = e.request.mode === "navigate" ||
    (e.request.headers.get("accept") || "").includes("text/html");

  if (isNav) {
    // HTML: network-first, para o deploy novo aparecer na hora; cache é fallback offline
    e.respondWith(
      fetch(e.request).then((r) => {
        if (r.ok && u.origin === location.origin) caches.open(CACHE).then((c) => c.put(e.request, r.clone()));
        return r;
      }).catch(() => caches.match(e.request).then((hit) => hit || caches.match("index.html")))
    );
    return;
  }
  // assets (versionados por ?v=): cache-first, atualiza em background
  e.respondWith(
    caches.match(e.request).then((hit) => {
      const net = fetch(e.request).then((r) => {
        if (r.ok && u.origin === location.origin) caches.open(CACHE).then((c) => c.put(e.request, r.clone()));
        return r;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
