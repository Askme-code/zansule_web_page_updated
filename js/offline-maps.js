// Offline Maps functionality
class OfflineMaps {
  constructor() {
    this.map = null
    this.tileLayer = null
    this.offlineTileLayer = null
    this.isOfflineMode = false
    this.downloadProgressElement = null
    this.savedAreasElement = null
    this.offlineControl = null
    this.tourLocations = []
    this.isDownloading = false
    this.downloadProgress = 0
    this.totalTiles = 0
    this.downloadedTiles = 0

    // Bind methods
    this.initOfflineMap = this.initOfflineMap.bind(this)
    this.toggleOfflineMode = this.toggleOfflineMode.bind(this)
    this.downloadMapArea = this.downloadMapArea.bind(this)
    this.showSavedAreas = this.showSavedAreas.bind(this)
    this.deleteSavedArea = this.deleteSavedArea.bind(this)
    this.updateDownloadProgress = this.updateDownloadProgress.bind(this)
    this.registerServiceWorker = this.registerServiceWorker.bind(this)
  }

  // Initialize offline map functionality
  async initOfflineMap(map, tourLocations) {
    // Store references
    this.map = map
    this.tourLocations = tourLocations

    // Register service worker
    await this.registerServiceWorker()

    // Create UI elements
    this.createOfflineControls()

    // Initialize offline layer
    if (typeof L !== "undefined" && typeof L.tileLayer.offline !== "undefined") {
      // Create the offline tile layer
      this.offlineTileLayer = L.tileLayer.offline("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: "abc",
        minZoom: 10,
        maxZoom: 16,
      })

      // Create the online tile layer
      this.tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        subdomains: "abc",
      }).addTo(this.map)

      // Check if we're offline
      if (!navigator.onLine) {
        this.toggleOfflineMode(true)
      }

      // Listen for online/offline events
      window.addEventListener("online", () => {
        this.updateOfflineStatus()
      })

      window.addEventListener("offline", () => {
        this.updateOfflineStatus()
      })

      // Load saved areas
      this.showSavedAreas()
    } else {
      console.warn("Leaflet.offline not available. Offline maps will not work.")
    }
  }

  // Register service worker
  async registerServiceWorker() {
    if ("serviceWorker" in navigator) {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js")
        console.log("ServiceWorker registration successful with scope: ", registration.scope)
      } catch (error) {
        console.log("ServiceWorker registration failed: ", error)
      }
    }
  }

  // Create UI controls for offline functionality
  createOfflineControls() {
    // Create offline control container
    const offlineControlContainer = document.createElement("div")
    offlineControlContainer.className = "leaflet-control-offline leaflet-control"

    // Create offline toggle button
    const offlineToggle = document.createElement("button")
    offlineToggle.className = "offline-toggle-btn"
    offlineToggle.innerHTML = '<i class="fas fa-wifi"></i>'
    offlineToggle.title = "Toggle Offline Mode"
    offlineToggle.addEventListener("click", () => this.toggleOfflineMode())

    // Create download area button
    const downloadBtn = document.createElement("button")
    downloadBtn.className = "download-area-btn"
    downloadBtn.innerHTML = '<i class="fas fa-download"></i>'
    downloadBtn.title = "Download Current Map Area"
    downloadBtn.addEventListener("click", () => this.downloadMapArea())

    // Create saved areas button
    const savedAreasBtn = document.createElement("button")
    savedAreasBtn.className = "saved-areas-btn"
    savedAreasBtn.innerHTML = '<i class="fas fa-save"></i>'
    savedAreasBtn.title = "View Saved Areas"
    savedAreasBtn.addEventListener("click", () => this.toggleSavedAreasPanel())

    // Create download progress element
    this.downloadProgressElement = document.createElement("div")
    this.downloadProgressElement.className = "download-progress"
    this.downloadProgressElement.style.display = "none"

    // Create saved areas panel
    this.savedAreasElement = document.createElement("div")
    this.savedAreasElement.className = "saved-areas-panel"
    this.savedAreasElement.style.display = "none"
    this.savedAreasElement.innerHTML = '<h4>Saved Map Areas</h4><div class="saved-areas-list"></div>'

    // Add elements to container
    offlineControlContainer.appendChild(offlineToggle)
    offlineControlContainer.appendChild(downloadBtn)
    offlineControlContainer.appendChild(savedAreasBtn)
    offlineControlContainer.appendChild(this.downloadProgressElement)
    offlineControlContainer.appendChild(this.savedAreasElement)

    // Create custom Leaflet control
    this.offlineControl = L.Control.extend({
      options: {
        position: "topright",
      },

      onAdd: () => offlineControlContainer,
    })

    // Add control to map
    new this.offlineControl().addTo(this.map)

    // Add offline status indicator to the page
    const statusContainer = document.getElementById("location-status")
    if (statusContainer) {
      const offlineStatus = document.createElement("div")
      offlineStatus.id = "offline-status"
      offlineStatus.className = "offline-status"
      statusContainer.appendChild(offlineStatus)

      this.updateOfflineStatus()
    }
  }

  // Toggle offline mode
  toggleOfflineMode(forceOffline = null) {
    // If forceOffline is provided, use that value, otherwise toggle
    this.isOfflineMode = forceOffline !== null ? forceOffline : !this.isOfflineMode

    if (this.isOfflineMode) {
      // Switch to offline layer
      if (this.tileLayer) {
        this.map.removeLayer(this.tileLayer)
      }
      if (this.offlineTileLayer) {
        this.offlineTileLayer.addTo(this.map)
      }

      // Update UI
      document.querySelectorAll(".offline-toggle-btn").forEach((btn) => {
        btn.innerHTML = '<i class="fas fa-wifi-slash"></i>'
        btn.title = "Switch to Online Mode"
        btn.classList.add("offline-active")
      })

      // Show offline notification
      this.showNotification("Offline mode activated. Using saved map data.", "info")
    } else {
      // Switch to online layer
      if (this.offlineTileLayer) {
        this.map.removeLayer(this.offlineTileLayer)
      }
      if (this.tileLayer) {
        this.tileLayer.addTo(this.map)
      }

      // Update UI
      document.querySelectorAll(".offline-toggle-btn").forEach((btn) => {
        btn.innerHTML = '<i class="fas fa-wifi"></i>'
        btn.title = "Switch to Offline Mode"
        btn.classList.remove("offline-active")
      })

      // Show online notification
      this.showNotification("Online mode activated. Using live map data.", "success")
    }

    this.updateOfflineStatus()
  }

  // Update offline status indicator
  updateOfflineStatus() {
    const statusElement = document.getElementById("offline-status")
    if (!statusElement) return

    if (!navigator.onLine) {
      // Browser is offline
      statusElement.innerHTML = '<i class="fas fa-wifi-slash text-danger"></i> Offline Mode'
      statusElement.classList.add("is-offline")

      // Force offline mode
      if (!this.isOfflineMode) {
        this.toggleOfflineMode(true)
      }

      // Show offline notification
      this.showNotification("You are offline. Using saved map data.", "warning")
    } else {
      // Browser is online
      if (this.isOfflineMode) {
        statusElement.innerHTML = '<i class="fas fa-wifi-slash text-warning"></i> Offline Mode (Online Available)'
        statusElement.classList.add("is-offline")
      } else {
        statusElement.innerHTML = '<i class="fas fa-wifi text-success"></i> Online Mode'
        statusElement.classList.remove("is-offline")
      }
    }
  }

  // Download current map area
  async downloadMapArea() {
    if (!this.map || !this.offlineTileLayer || this.isDownloading) return

    // Get current map bounds and zoom
    const bounds = this.map.getBounds()
    const minZoom = 10
    const maxZoom = 16

    // Confirm download
    const tilesEstimate = this.estimateTileCount(bounds, minZoom, maxZoom)
    const storageEstimate = Math.round((tilesEstimate * 15) / 1024) // Rough estimate: 15KB per tile

    if (
      !confirm(
        `This will download approximately ${tilesEstimate} map tiles (about ${storageEstimate} MB) for offline use. Continue?`,
      )
    ) {
      return
    }

    try {
      this.isDownloading = true
      this.downloadedTiles = 0
      this.totalTiles = tilesEstimate
      this.downloadProgress = 0

      // Show progress
      this.downloadProgressElement.style.display = "block"
      this.downloadProgressElement.innerHTML = `
        <div class="progress-text">Downloading map tiles: 0%</div>
        <div class="progress">
          <div class="progress-bar" role="progressbar" style="width: 0%"></div>
        </div>
      `

      // Start download
      await this.offlineTileLayer.saveTiles(bounds, minZoom, maxZoom, this.updateDownloadProgress, (error) => {
        console.error("Error saving tiles", error)
        this.showNotification("Error downloading map tiles. Please try again.", "error")
        this.isDownloading = false
        this.downloadProgressElement.style.display = "none"
      })

      // Save area metadata
      const areaName = prompt("Enter a name for this saved area:", "Zanzibar Area")
      if (areaName) {
        const savedAreas = this.getSavedAreas()
        const newArea = {
          id: Date.now().toString(),
          name: areaName,
          date: new Date().toISOString(),
          bounds: {
            north: bounds.getNorth(),
            south: bounds.getSouth(),
            east: bounds.getEast(),
            west: bounds.getWest(),
          },
          minZoom,
          maxZoom,
          tileCount: this.downloadedTiles,
        }

        savedAreas.push(newArea)
        localStorage.setItem("offlineMapAreas", JSON.stringify(savedAreas))
      }

      // Update UI
      this.showSavedAreas()
      this.showNotification("Map area successfully downloaded for offline use!", "success")
    } catch (error) {
      console.error("Error in downloadMapArea", error)
      this.showNotification("Error downloading map tiles. Please try again.", "error")
    } finally {
      this.isDownloading = false
      this.downloadProgressElement.style.display = "none"
    }
  }

  // Update download progress
  updateDownloadProgress(progress, total) {
    this.downloadedTiles = progress
    this.totalTiles = total || this.totalTiles
    this.downloadProgress = Math.round((progress / this.totalTiles) * 100)

    // Update progress UI
    if (this.downloadProgressElement) {
      this.downloadProgressElement.querySelector(".progress-text").textContent =
        `Downloading map tiles: ${this.downloadProgress}% (${progress}/${this.totalTiles})`

      this.downloadProgressElement.querySelector(".progress-bar").style.width = `${this.downloadProgress}%`
    }
  }

  // Estimate tile count for a given bounds and zoom levels
  estimateTileCount(bounds, minZoom, maxZoom) {
    let count = 0

    for (let zoom = minZoom; zoom <= maxZoom; zoom++) {
      const northEast = bounds.getNorthEast()
      const southWest = bounds.getSouthWest()

      const neTile = this.latLngToTile(northEast.lat, northEast.lng, zoom)
      const swTile = this.latLngToTile(southWest.lat, southWest.lng, zoom)

      const tilesX = Math.abs(neTile.x - swTile.x) + 1
      const tilesY = Math.abs(neTile.y - swTile.y) + 1

      count += tilesX * tilesY
    }

    return count
  }

  // Convert lat/lng to tile coordinates
  latLngToTile(lat, lng, zoom) {
    const n = Math.pow(2, zoom)
    const x = Math.floor(((lng + 180) / 360) * n)
    const y = Math.floor(
      ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * n,
    )
    return { x, y }
  }

  // Toggle saved areas panel
  toggleSavedAreasPanel() {
    if (this.savedAreasElement.style.display === "none") {
      this.savedAreasElement.style.display = "block"
      this.showSavedAreas()
    } else {
      this.savedAreasElement.style.display = "none"
    }
  }

  // Show saved areas
  showSavedAreas() {
    if (!this.savedAreasElement) return

    const savedAreas = this.getSavedAreas()
    const listElement = this.savedAreasElement.querySelector(".saved-areas-list")

    if (savedAreas.length === 0) {
      listElement.innerHTML = "<p>No saved map areas yet. Use the download button to save an area for offline use.</p>"
      return
    }

    let html = ""
    savedAreas.forEach((area) => {
      const date = new Date(area.date).toLocaleDateString()
      const size = Math.round((area.tileCount * 15) / 1024) // Rough estimate: 15KB per tile

      html += `
        <div class="saved-area-item" data-id="${area.id}">
          <div class="saved-area-info">
            <h5>${area.name}</h5>
            <p>Saved on ${date} • ~${size} MB</p>
          </div>
          <div class="saved-area-actions">
            <button class="btn-view-area" title="View Area">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn-delete-area" title="Delete Area">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `
    })

    listElement.innerHTML = html

    // Add event listeners
    listElement.querySelectorAll(".btn-view-area").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.closest(".saved-area-item").dataset.id
        this.viewSavedArea(id)
      })
    })

    listElement.querySelectorAll(".btn-delete-area").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = e.target.closest(".saved-area-item").dataset.id
        this.deleteSavedArea(id)
      })
    })
  }

  // View a saved area
  viewSavedArea(id) {
    const savedAreas = this.getSavedAreas()
    const area = savedAreas.find((a) => a.id === id)

    if (!area) return

    // Create LatLngBounds from the saved bounds
    const bounds = L.latLngBounds(
      L.latLng(area.bounds.south, area.bounds.west),
      L.latLng(area.bounds.north, area.bounds.east),
    )

    // Fit map to the bounds
    this.map.fitBounds(bounds)

    // Switch to offline mode
    if (!this.isOfflineMode) {
      this.toggleOfflineMode(true)
    }

    // Hide saved areas panel
    this.savedAreasElement.style.display = "none"

    // Show notification
    this.showNotification(`Viewing offline area: ${area.name}`, "info")
  }

  // Delete a saved area
  deleteSavedArea(id) {
    if (!confirm("Are you sure you want to delete this saved map area? This cannot be undone.")) {
      return
    }

    const savedAreas = this.getSavedAreas()
    const updatedAreas = savedAreas.filter((a) => a.id !== id)

    localStorage.setItem("offlineMapAreas", JSON.stringify(updatedAreas))

    // Update UI
    this.showSavedAreas()

    // Show notification
    this.showNotification("Map area deleted successfully.", "info")
  }

  // Get saved areas from localStorage
  getSavedAreas() {
    const areasJson = localStorage.getItem("offlineMapAreas")
    return areasJson ? JSON.parse(areasJson) : []
  }

  // Show notification
  showNotification(message, type = "info") {
    // Check if showNotification function exists in the global scope
    if (typeof window.showNotification === "function") {
      window.showNotification(message, type)
    } else {
      // Fallback notification
      const notificationElement = document.createElement("div")
      notificationElement.className = `notification notification-${type}`
      notificationElement.innerHTML = `
        <div class="notification-content">
          <i class="fas fa-info-circle"></i>
          <span>${message}</span>
        </div>
        <button class="notification-close">
          <i class="fas fa-times"></i>
        </button>
      `

      document.body.appendChild(notificationElement)

      // Add close button functionality
      notificationElement.querySelector(".notification-close").addEventListener("click", () => {
        notificationElement.remove()
      })

      // Auto-remove after 5 seconds
      setTimeout(() => {
        if (document.body.contains(notificationElement)) {
          notificationElement.remove()
        }
      }, 5000)
    }
  }
}

// Initialize when the page loads
document.addEventListener("DOMContentLoaded", () => {
  // Create global instance
  window.offlineMaps = new OfflineMaps()

  // Add script for leaflet.offline if not already loaded
  if (typeof L === "undefined") {
    const scriptLeaflet = document.createElement("script")
    scriptLeaflet.src = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
    scriptLeaflet.onload = () => {
      if (typeof L !== "undefined" && typeof L.tileLayer.offline === "undefined") {
        const script = document.createElement("script")
        script.src = "https://unpkg.com/leaflet.offline@1.1.0/dist/leaflet.offline.min.js"
        document.head.appendChild(script)
      }
    }
    document.head.appendChild(scriptLeaflet)
  } else {
    if (typeof L !== "undefined" && typeof L.tileLayer.offline === "undefined") {
      const script = document.createElement("script")
      script.src = "https://unpkg.com/leaflet.offline@1.1.0/dist/leaflet.offline.min.js"
      document.head.appendChild(script)
    }
  }
})
