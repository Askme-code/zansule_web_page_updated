const CACHE_NAME = "zanzibar-tourism-cache-v1"
const TILE_CACHE_NAME = "zanzibar-map-tiles-v1"
const DATA_CACHE_NAME = "zanzibar-data-cache-v1"

// Assets to cache immediately on service worker install
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/nearby-tours.html",
  "/style.css",
  "/css/nearby-tours.css",
  "/script.js",
  "/js/nearby-tours.js",
  "/js/offline-maps.js",
  "/images/offline-map-placeholder.jpg",
  "https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.1/css/all.min.css",
  "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css",
  "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js",
  "https://unpkg.com/leaflet.offline@1.1.0/dist/leaflet.offline.min.js",
]

// Install event - cache static assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Caching static assets")
        return cache.addAll(STATIC_ASSETS)
      })
      .then(() => self.skipWaiting()),
  )
})

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  const currentCaches = [CACHE_NAME, TILE_CACHE_NAME, DATA_CACHE_NAME]
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return cacheNames.filter((cacheName) => !currentCaches.includes(cacheName))
      })
      .then((cachesToDelete) => {
        return Promise.all(
          cachesToDelete.map((cacheToDelete) => {
            return caches.delete(cacheToDelete)
          }),
        )
      })
      .then(() => self.clients.claim()),
  )
})

// Helper function to determine if a request is for a map tile
function isMapTile(url) {
  return url.includes("tile.openstreetmap.org")
}

// Helper function to determine if a request is for API data
function isApiData(url) {
  return url.includes("/api/") || url.includes("tour-data.json")
}

// Fetch event - serve from cache or network
self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url)

  // Handle map tile requests
  if (isMapTile(url.href)) {
    event.respondWith(handleMapTileRequest(event.request))
    return
  }

  // Handle API data requests
  if (isApiData(url.href)) {
    event.respondWith(handleApiRequest(event.request))
    return
  }

  // Handle regular requests
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        return response
      }

      // Clone the request because it's a one-time use stream
      const fetchRequest = event.request.clone()

      return fetch(fetchRequest)
        .then((response) => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== "basic") {
            return response
          }

          // Clone the response because it's a one-time use stream
          const responseToCache = response.clone()

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })

          return response
        })
        .catch((error) => {
          console.log("Fetch failed; returning offline fallback", error)
          return caches.match("/offline.html")
        })
    }),
  )
})

// Handle map tile requests
function handleMapTileRequest(request) {
  return caches.match(request).then((response) => {
    // Return cached tile if available
    if (response) {
      return response
    }

    // Otherwise fetch from network and cache
    return fetch(request)
      .then((response) => {
        if (!response || response.status !== 200) {
          return response
        }

        const responseToCache = response.clone()
        caches.open(TILE_CACHE_NAME).then((cache) => {
          cache.put(request, responseToCache)
        })

        return response
      })
      .catch((error) => {
        console.log("Tile fetch failed:", error)
        // Return a placeholder tile or transparent tile for offline use
        return new Response(null, {
          status: 404,
          statusText: "Not Found",
        })
      })
  })
}

// Handle API data requests
function handleApiRequest(request) {
  // Try to get fresh data from network first
  return fetch(request)
    .then((response) => {
      if (!response || response.status !== 200) {
        throw new Error("Network response was not ok")
      }

      const responseToCache = response.clone()
      caches.open(DATA_CACHE_NAME).then((cache) => {
        cache.put(request, responseToCache)
      })

      return response
    })
    .catch((error) => {
      console.log("API fetch failed, falling back to cache", error)
      return caches.match(request)
    })
}

// Listen for messages from clients
self.addEventListener("message", (event) => {
  if (event.data && event.data.action === "skipWaiting") {
    self.skipWaiting()
  }

  // Handle download map area message
  if (event.data && event.data.action === "downloadMapArea") {
    const { bounds, minZoom, maxZoom } = event.data
    // This would be handled by the actual implementation
    console.log("Received request to download map area:", bounds, minZoom, maxZoom)
  }
})
