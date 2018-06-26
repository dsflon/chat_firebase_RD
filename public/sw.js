const VERSION = '1.0.0';

const CACHE_NAME = 'chatText' + VERSION;
const DATA_CACHE_NAME = 'chatTextData' + VERSION;

const CACHE_FILE = [
    './',
    './index.html',
    './bundle.js',
    './vendor.js'
];

self.addEventListener('install', function(event) {

    console.log('ServiceWorker installing');

    event.waitUntil(
        caches.open(CACHE_NAME).then(function(cache) {
            console.log('ServiceWorker Caching app shell');
            return cache.addAll(CACHE_FILE).then(() => {
                self.skipWaiting();
            });
        })
    );

});

self.addEventListener('activate', function(event) {

    console.log('ServiceWorker activating');

    event.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== CACHE_NAME) {
                    console.log('ServiceWorker removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );

    return self.clients.claim();

});

self.addEventListener('fetch', function(event) {

    console.log('ServiceWorker fetching ', event.request.url);

    // var baseUrl = 'https://query.yahooapis.com/';
    //
    // if (event.request.url.indexOf(baseUrl) > -1) {
    //
    //     console.log('fetch request for feed data');
    //
    //     event.respondWith(
    //         caches.open(DATA_CACHE_NAME).then(function(cache) {
    //             return fetch(event.request).then(function(response){
    //                 cache.put(event.request.url, response.clone());
    //                 return response;
    //             });
    //         })
    //     );
    //
    // } else {

        // console.log('fetch request for app shell');

        event.respondWith(
            caches.match(event.request).then(function(response) {
                return response || fetch(event.request);
            })
        );

    // }

});
