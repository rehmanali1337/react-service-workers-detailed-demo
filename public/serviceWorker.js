const CACHE_NAME = 'VERSION1'
const urlsToCache = [
    '/',
    '/serviceWorker.js',
    '/index.html',
    '/robots.txt',
    '/manifest.json',
    '/static/js/0.chunk.js',
    '/static/js/bundle.js',
    '/static/js/main.chunk.js',
    '/favicon.ico',
    '/logo192.png'
]

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache)
        })
    )
})

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(matchedResource => {
            // We got the requested resource matched in the cache
            // Now we need to return the cached resource
            if (matchedResource) {
                // The requested resource is found in cache, Now return it.
                return matchedResource
            }
            // The requested resource was not found in the cache so send back a response from network.
            return fetch(event.request).then((response) => {
                // First of all check if there is a response from the network or response is not from some other regions.
                // This means that requests to third party assets aren't cached as well
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    // If there is no valid response then return that without caching it,
                    return response
                }

                // If we got a valid reponse the we will create a copy of the response
                // The copy of the response will be stored in the cache and the original reponse 
                // will be returned
                const responseCopy = response.clone()

                // Cache the copy of the response
                caches.open(CACHE_NAME).then((cache) => {
                    // Store the copy of the response for the next time
                    cache.put(event.request, responseCopy).then(() => {
                        // The new source successfully cached!
                        console.log('New source added to the cache!')
                    }).catch((error) => {
                        // Could not cache new source!
                        console.log('Error adding the new source to the cache!')
                        console.log(error)
                    })
                })

                // return the original reponse back!
                return response
            }).catch((reason) => {
                // If failed to fetch from network.
                // Means if the internet is down then we can serve somthing else here as well!
                // This will happen mostly if there are some API calls to fetch data from the network.
                console.log("Resource not matched!")
                return caches.match('offline.html')
            })
        })
    )
})