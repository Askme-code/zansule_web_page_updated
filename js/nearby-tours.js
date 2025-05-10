// Tour locations with coordinates (latitude, longitude)
const tourLocations = [
  {
    id: 1,
    name: "Stone Town Tour",
    location: "Stone Town, Zanzibar",
    coordinates: { lat: -6.1631, lng: 39.1885 },
    description: "Walk through the UNESCO World Heritage site and explore the rich history and culture of Zanzibar.",
    image:
      "https://images.unsplash.com/photo-1489493585363-d69421e0edd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 45,
    type: "Cultural",
    duration: "3-4 hours",
  },
  {
    id: 2,
    name: "Safari Blue",
    location: "Fumba, Zanzibar",
    coordinates: { lat: -6.3167, lng: 39.2667 },
    description: "Experience the ultimate sea adventure with snorkeling, swimming, and a delicious seafood lunch.",
    image:
      "https://images.unsplash.com/photo-1589664810433-136a8ae7c0d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 65,
    type: "Water",
    duration: "Full day",
  },
  {
    id: 3,
    name: "Prison Island Tour",
    location: "Changuu Island, Zanzibar",
    coordinates: { lat: -6.1167, lng: 39.1667 },
    description: "Explore the historic Prison Island and meet the giant tortoises while enjoying crystal clear waters.",
    image:
      "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 50,
    type: "Wildlife",
    duration: "Half day",
  },
  {
    id: 4,
    name: "Spice Tour",
    location: "Kizimbani, Zanzibar",
    coordinates: { lat: -6.0667, lng: 39.25 },
    description:
      "Discover why Zanzibar is known as the Spice Island with a guided tour through aromatic spice plantations.",
    image:
      "https://images.unsplash.com/photo-1523805009345-7448845a9e53?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 40,
    type: "Cultural",
    duration: "3-4 hours",
  },
  {
    id: 5,
    name: "Jozani Forest",
    location: "Jozani, Zanzibar",
    coordinates: { lat: -6.2333, lng: 39.4167 },
    description: "Visit the home of the rare Red Colobus monkeys and explore the lush mangrove forest ecosystem.",
    image:
      "https://images.unsplash.com/photo-1544535830-9df3f56fff6a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 45,
    type: "Nature",
    duration: "2-3 hours",
  },
  {
    id: 6,
    name: "Sea Turtle Nungwi",
    location: "Nungwi, Zanzibar",
    coordinates: { lat: -5.7264, lng: 39.2987 },
    description: "Visit the turtle conservation sanctuary in Nungwi and swim with these magnificent creatures.",
    image:
      "https://images.unsplash.com/photo-1591025207163-942350e47db2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 55,
    type: "Wildlife",
    duration: "Half day",
  },
  {
    id: 7,
    name: "Dolphin Kizimkazi",
    location: "Kizimkazi, Zanzibar",
    coordinates: { lat: -6.4333, lng: 39.4667 },
    description: "Swim with dolphins in their natural habitat and enjoy the beautiful southern beaches of Zanzibar.",
    image:
      "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 60,
    type: "Wildlife",
    duration: "Half day",
  },
  {
    id: 8,
    name: "Snorkelling Blue Lagoon",
    location: "Mnemba Island, Zanzibar",
    coordinates: { lat: -5.8167, lng: 39.3833 },
    description:
      "Explore the vibrant underwater world of the Blue Lagoon with its colorful coral reefs and marine life.",
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 55,
    type: "Water",
    duration: "Half day",
  },
  {
    id: 9,
    name: "Nakupenda Sand Bank",
    location: "Stone Town, Zanzibar",
    coordinates: { lat: -6.15, lng: 39.1667 },
    description: "Visit the stunning Nakupenda sandbank that appears during low tide and enjoy a seafood BBQ lunch.",
    image:
      "https://images.unsplash.com/photo-1506953823976-52e1fdc0149a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 50,
    type: "Beach",
    duration: "Full day",
  },
  {
    id: 10,
    name: "Paje Beach",
    location: "Paje, Zanzibar",
    coordinates: { lat: -6.2667, lng: 39.5333 },
    description: "Experience the beautiful white sand beach of Paje, perfect for kitesurfing and relaxation.",
    image:
      "https://images.unsplash.com/photo-1589664810433-136a8ae7c0d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
    price: 0,
    type: "Beach",
    duration: "Full day",
  },
]

// Save tour locations to localStorage for offline access
function saveTourLocationsOffline() {
  localStorage.setItem("offlineTourLocations", JSON.stringify(tourLocations))
}

// Get tour locations from localStorage if offline
function getOfflineTourLocations() {
  const offlineData = localStorage.getItem("offlineTourLocations")
  return offlineData ? JSON.parse(offlineData) : tourLocations
}

// Calculate distance between two coordinates using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371 // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1)
  const dLon = deg2rad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c // Distance in km
  return distance
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

// Get user's current location
function getUserLocation() {
  const locationStatus = document.getElementById("location-status")
  const nearbyToursContainer = document.getElementById("nearby-tours-container")

  if (!navigator.geolocation) {
    locationStatus.textContent = "Geolocation is not supported by your browser"
    showFallbackTours()
    return
  }

  locationStatus.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Locating you...'

  // Check if we have cached location
  const cachedLocation = localStorage.getItem("userLocation")
  const cachedTimestamp = localStorage.getItem("userLocationTimestamp")
  const now = Date.now()

  // Use cached location if it's less than 10 minutes old
  if (cachedLocation && cachedTimestamp && now - Number.parseInt(cachedTimestamp) < 600000) {
    const location = JSON.parse(cachedLocation)
    processUserLocation(location.latitude, location.longitude)
    return
  }

  navigator.geolocation.getCurrentPosition(
    // Success callback
    (position) => {
      const userLat = position.coords.latitude
      const userLng = position.coords.longitude

      // Cache the location
      localStorage.setItem(
        "userLocation",
        JSON.stringify({
          latitude: userLat,
          longitude: userLng,
        }),
      )
      localStorage.setItem("userLocationTimestamp", Date.now().toString())

      processUserLocation(userLat, userLng)
    },
    // Error callback
    (error) => {
      console.error("Error getting location:", error)
      let errorMessage = "Unable to determine your location. "

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage += "You denied the request for geolocation."
          break
        case error.POSITION_UNAVAILABLE:
          errorMessage += "Location information is unavailable."
          break
        case error.TIMEOUT:
          errorMessage += "The request to get your location timed out."
          break
        case error.UNKNOWN_ERROR:
          errorMessage += "An unknown error occurred."
          break
      }

      locationStatus.innerHTML = `<i class="fas fa-exclamation-circle text-danger"></i> ${errorMessage}`
      showFallbackTours()
    },
    // Options
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    },
  )
}

// Process user location
function processUserLocation(userLat, userLng) {
  const locationStatus = document.getElementById("location-status")

  // Get tour locations (from offline storage if needed)
  const locations = navigator.onLine ? tourLocations : getOfflineTourLocations()

  // Calculate distance to each tour location
  const toursWithDistance = locations.map((tour) => {
    const distance = calculateDistance(userLat, userLng, tour.coordinates.lat, tour.coordinates.lng)

    return {
      ...tour,
      distance: distance,
    }
  })

  // Sort tours by distance
  const sortedTours = toursWithDistance.sort((a, b) => a.distance - b.distance)

  // Update UI
  locationStatus.innerHTML = '<i class="fas fa-map-marker-alt text-success"></i> We found your location!'
  displayNearbyTours(sortedTours)
  initMap(userLat, userLng, sortedTours)
}

// Display nearby tours
function displayNearbyTours(tours) {
  const container = document.getElementById("nearby-tours-list")
  container.innerHTML = ""

  tours.forEach((tour) => {
    const distanceText =
      tour.distance < 1 ? `${(tour.distance * 1000).toFixed(0)} meters away` : `${tour.distance.toFixed(1)} km away`

    const tourCard = document.createElement("div")
    tourCard.className = "col-lg-4 col-md-6 mb-4"
    tourCard.innerHTML = `
      <div class="card h-100">
        <span class="tour-type">${tour.type}</span>
        ${tour.price > 0 ? `<span class="price-tag">$${tour.price}</span>` : ""}
        <span class="distance-tag">${distanceText}</span>
        <img class="card-img-top" src="${tour.image}" alt="${tour.name}" loading="lazy" onerror="this.src='images/placeholder-tour.jpg'">
        <div class="card-body">
          <h4 class="card-title">${tour.name}</h4>
          <p class="location-text"><i class="fas fa-map-marker-alt"></i> ${tour.location}</p>
          <p class="card-text">${tour.description}</p>
          <div class="card-buttons">
            <button class="btn btn-outline-primary view-on-map-btn" data-tour-id="${tour.id}">View on Map</button>
            <a href="booking.html" class="btn btn-primary" onclick="bookTour('${tour.name}')">Book Now</a>
          </div>
        </div>
      </div>
    `

    container.appendChild(tourCard)
  })

  // Add event listeners to "View on Map" buttons
  document.querySelectorAll(".view-on-map-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const tourId = Number.parseInt(this.getAttribute("data-tour-id"))
      const tour = tours.find((t) => t.id === tourId)

      if (tour) {
        // Scroll to map
        document.getElementById("map-container").scrollIntoView({ behavior: "smooth" })

        // Center map on this tour and open popup
        if (window.tourMap && window.tourMarkers) {
          window.tourMap.setView([tour.coordinates.lat, tour.coordinates.lng], 13)
          window.tourMarkers[tourId].openPopup()
        }
      }
    })
  })
}

// Show fallback tours when geolocation fails
function showFallbackTours() {
  const container = document.getElementById("nearby-tours-list")
  container.innerHTML = ""

  // Get tour locations (from offline storage if needed)
  const locations = navigator.onLine ? tourLocations : getOfflineTourLocations()

  // Just display all tours without distance info
  locations.forEach((tour) => {
    const tourCard = document.createElement("div")
    tourCard.className = "col-lg-4 col-md-6 mb-4"
    tourCard.innerHTML = `
      <div class="card h-100">
        <span class="tour-type">${tour.type}</span>
        ${tour.price > 0 ? `<span class="price-tag">$${tour.price}</span>` : ""}
        <img class="card-img-top" src="${tour.image}" alt="${tour.name}" loading="lazy" onerror="this.src='images/placeholder-tour.jpg'">
        <div class="card-body">
          <h4 class="card-title">${tour.name}</h4>
          <p class="location-text"><i class="fas fa-map-marker-alt"></i> ${tour.location}</p>
          <p class="card-text">${tour.description}</p>
          <div class="card-buttons">
            <button class="btn btn-outline-primary view-on-map-btn" data-tour-id="${tour.id}">View on Map</button>
            <a href="booking.html" class="btn btn-primary" onclick="bookTour('${tour.name}')">Book Now</a>
          </div>
        </div>
      </div>
    `

    container.appendChild(tourCard)
  })

  // Initialize map with all tours
  initMap(-6.1631, 39.1885, locations) // Center on Stone Town
}

// Initialize the map
function initMap(userLat, userLng, tours) {
  const mapContainer = document.getElementById("map-container")
  const mapElement = document.getElementById("map")

  if (!mapElement) return

  // If Leaflet is not loaded, load it dynamically
  if (typeof L === "undefined") {
    const linkElement = document.createElement("link")
    linkElement.rel = "stylesheet"
    linkElement.href = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
    document.head.appendChild(linkElement)

    const scriptElement = document.createElement("script")
    scriptElement.src = "https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
    document.head.appendChild(scriptElement)

    scriptElement.onload = () => {
      createMap(userLat, userLng, tours)
    }
  } else {
    createMap(userLat, userLng, tours)
  }
}

// Create the map with markers
function createMap(userLat, userLng, tours) {
  // Clear previous map if it exists
  if (window.tourMap) {
    window.tourMap.remove()
  }

  // Create map
  window.tourMap = L.map("map").setView([userLat, userLng], 11)

  // Add OpenStreetMap tiles
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(window.tourMap)

  // Add user marker
  const userIcon = L.divIcon({
    html: '<i class="fas fa-user-circle" style="font-size: 24px; color: #0066ff;"></i>',
    className: "user-marker",
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  })

  L.marker([userLat, userLng], { icon: userIcon })
    .addTo(window.tourMap)
    .bindPopup("<strong>Your Location</strong>")
    .openPopup()

  // Add tour markers
  window.tourMarkers = {}

  tours.forEach((tour) => {
    const tourIcon = L.divIcon({
      html: `<i class="fas fa-map-marker-alt" style="font-size: 24px; color: ${getTourTypeColor(tour.type)};"></i>`,
      className: "tour-marker",
      iconSize: [24, 36],
      iconAnchor: [12, 36],
    })

    const marker = L.marker([tour.coordinates.lat, tour.coordinates.lng], { icon: tourIcon })
      .addTo(window.tourMap)
      .bindPopup(`
        <div class="map-popup">
          <img src="${tour.image}" alt="${tour.name}" style="width: 100%; height: 100px; object-fit: cover; border-radius: 4px;" onerror="this.src='images/placeholder-tour.jpg'">
          <h5>${tour.name}</h5>
          <p><strong>${tour.type}</strong> • ${tour.duration}</p>
          ${tour.distance ? `<p><i class="fas fa-walking"></i> ${tour.distance.toFixed(1)} km away</p>` : ""}
          <p>${tour.description.substring(0, 100)}...</p>
          <a href="booking.html?tour=${encodeURIComponent(tour.name)}" class="btn btn-sm btn-primary">Book Now</a>
        </div>
      `)

    window.tourMarkers[tour.id] = marker
  })

  // Initialize offline maps functionality if available
  if (window.offlineMaps) {
    window.offlineMaps.initOfflineMap(window.tourMap, tours)
  }
}

// Get color based on tour type
function getTourTypeColor(type) {
  switch (type) {
    case "Cultural":
      return "#d4af37" // Gold
    case "Water":
      return "#1e90ff" // Dodger blue
    case "Wildlife":
      return "#32cd32" // Lime green
    case "Nature":
      return "#228b22" // Forest green
    case "Beach":
      return "#ff7f50" // Coral
    default:
      return "#0c4b33" // Default secondary color
  }
}

// Initialize when the page loads
document.addEventListener("DOMContentLoaded", () => {
  const nearbyToursSection = document.getElementById("nearby-tours")

  if (nearbyToursSection) {
    // Save tour locations for offline use
    saveTourLocationsOffline()

    // Get user location
    getUserLocation()

    // Add refresh button functionality
    const refreshButton = document.getElementById("refresh-location")
    if (refreshButton) {
      refreshButton.addEventListener("click", getUserLocation)
    }

    // Add filter functionality
    const filterButtons = document.querySelectorAll(".filter-btn")

    filterButtons.forEach((button) => {
      button.addEventListener("click", function () {
        // Remove active class from all buttons
        filterButtons.forEach((btn) => btn.classList.remove("active"))

        // Add active class to clicked button
        this.classList.add("active")

        const filterValue = this.getAttribute("data-filter")

        // Filter tours
        const tourCards = document.querySelectorAll("#nearby-tours-list .card")

        tourCards.forEach((card) => {
          const tourType = card.querySelector(".tour-type").textContent
          const parentElement = card.closest(".col-lg-4")

          if (filterValue === "all" || tourType === filterValue) {
            parentElement.style.display = "block"
          } else {
            parentElement.style.display = "none"
          }
        })
      })
    })

    // Add online/offline event listeners
    window.addEventListener("online", () => {
      showNotification("You are back online! Refreshing data...", "success")
      getUserLocation()
    })

    window.addEventListener("offline", () => {
      showNotification("You are offline. Using saved data.", "warning")
      // We'll continue to use cached data
    })
  }
})

// Show notification
function showNotification(message, type = "info") {
  const notificationElement = document.createElement("div")
  notificationElement.className = `notification notification-${type}`
  notificationElement.innerHTML = `
    <div class="notification-content">
      <i class="fas fa-${type === "success" ? "check-circle" : type === "warning" ? "exclamation-triangle" : type === "error" ? "times-circle" : "info-circle"}"></i>
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
