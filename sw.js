/* 홈 화면에 추가된 뒤에도 늘 새것을 본다.
   캐시를 먼저 보게 하면 새로 구운 것이 폰에 안 닿는다. 실제로 그래서
   잠금 화면이 사람들 폰에 계속 떴던 적이 있다. 네트워크가 먼저다. */
const C = "gmpx-20260927034650";
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", e => e.waitUntil(
  caches.keys()
    .then(k => Promise.all(k.filter(x => x !== C).map(x => caches.delete(x))))
    .then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  /* 이름표(?v=)가 붙은 자료와 상품 사진은 **끼어들지 않는다** (2026-09-26).
     브라우저 캐시가 이미 들고 있다(자료 1년 · 사진 4시간). 끼어들면
     7MB 를 저장소에 또 써 넣고, 앱이 정한 받는 순서(priority)도 잃는다. */
  const u = new URL(e.request.url);
  if (u.searchParams.has("v") || u.pathname.startsWith("/big/")) return;
  e.respondWith(fetch(e.request).then(r => {
    const c = r.clone();
    caches.open(C).then(x => x.put(e.request, c)).catch(() => {});
    return r;
  }).catch(() => caches.match(e.request)));
});
