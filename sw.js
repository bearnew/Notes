var cacheKey = new Date().toISOString();

// 需要被缓存的文件
var cacheFileList = [
    './test.html',
    './co.js'
]

self.addEventListener('install', function (event) {
    event.waitUntil({
        caches.open(cacheKey).then(cache => {
            return cache.addAll(cacheFileList);
        })
    })
})

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request).then(response => {
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    )
})
