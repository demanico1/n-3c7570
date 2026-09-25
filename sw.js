/* 홈 화면에 추가된 뒤에도 늘 새것을 본다.
   캐시를 먼저 보게 하면 새로 구운 것이 폰에 안 닿는다. 실제로 그래서
   잠금 화면이 사람들 폰에 계속 떴던 적이 있다. 네트워크가 먼저다. */
const C = "gmpx-20260925223125";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(
  caches.keys()
    .then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x))))
    .then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(r => {
    const c = r.clone();
    caches.open(C).then(x => x.put(e.request, c)).catch(() => {});
    return r;
  }).catch(() => caches.match(e.request)));
});
