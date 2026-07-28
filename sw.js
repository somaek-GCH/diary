const CACHE_NAME = 'diary-cache-v3';
const FILES_TO_CACHE = [
  './diary-prototype.html',
  './manifest.json',
  './icon-192-v2.png',
  './icon-512-v2.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// 네트워크 우선: 서버에서 최신 파일을 먼저 받아오고, 오프라인일 때만 캐시를 쓴다.
// (개발 중에는 이게 훨씬 안전합니다 — 파일을 고쳐도 항상 최신본이 보임)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const resClone = res.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
