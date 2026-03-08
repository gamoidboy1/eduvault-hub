const CACHE_NAME = 'acadex-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/css/base.css',
    '/css/components.css',
    '/css/layout.css',
    '/js/app.js',
    '/js/data/dummy.js',
    '/js/data/csvLoader.js',
    '/assets/logo.png'
];

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS).catch(() => {
                // Ignore failures to cache (e.g. icons not yet generated)
            });
        })
    );
});

self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then((res) => {
            return res || fetch(e.request);
        })
    );
});
