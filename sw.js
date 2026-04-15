const CACHE_NAME = 'smart-pwa-v1.0.0';
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './shared/global.css',
    './shared/auth-check.js',
    './modules/login/login.html',
    './modules/login/login.css',
    './modules/login/login.js',
    './modules/dashboard/dashboard.html',
    './modules/dashboard/dashboard.css',
    './modules/dashboard/dashboard.js'
];

// Install: Simpan semua aset ke cache
self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
});

// Activate: Smart Cache Management (Hapus cache lama)
self.addEventListener('activate', (e) => {
    e.waitUntil(caches.keys().then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    )));
});

// Fetch: Offline Mode Strategy (Stale-While-Revalidate)
self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(cached => {
            const networked = fetch(e.request).then(res => {
                caches.open(CACHE_NAME).then(c => c.put(e.request, res.clone()));
                return res;
            }).catch(() => cached);
            return cached || networked;
        })
    );
});
