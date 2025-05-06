document.addEventListener("DOMContentLoaded", () => {
  // Initialize GLightbox
  const lightbox = GLightbox({
    touchNavigation: true,
    loop: true,
    autoplayVideos: true,
  })

  // Gallery filtering
  const filterButtons = document.querySelectorAll(".btn-filter")
  const galleryItems = document.querySelectorAll(".gallery-item")

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"))

      // Add active class to clicked button
      button.classList.add("active")

      // Get filter value
      const filterValue = button.getAttribute("data-filter")

      // Filter gallery items
      galleryItems.forEach((item) => {
        if (filterValue === "all" || item.classList.contains(filterValue)) {
          item.style.display = "block"

          // Add animation
          setTimeout(() => {
            item.style.opacity = "1"
            item.style.transform = "scale(1)"
          }, 100)
        } else {
          item.style.opacity = "0"
          item.style.transform = "scale(0.8)"

          setTimeout(() => {
            item.style.display = "none"
          }, 300)
        }
      })
    })
  })

  // Load more functionality (simulation)
  const loadMoreBtn = document.getElementById("load-more")
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      // Show loading state
      loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Loading...'

      // Simulate loading delay
      setTimeout(() => {
        // In a real implementation, you would load more images from a server
        // For this demo, we'll just show a message
        loadMoreBtn.innerHTML = "All Images Loaded"
        loadMoreBtn.disabled = true

        // Show notification
        showNotification("All gallery images have been loaded!", "success")
      }, 1500)
    })
  }

  // Lazy loading for gallery images
  if ("loading" in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]')
    images.forEach((img) => {
      if (img.dataset.src) {
        img.src = img.dataset.src
      }
    })
  } else {
    // Fallback for browsers that don't support lazy loading
    const script = document.createElement("script")
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js"
    document.body.appendChild(script)
  }

  // Gallery contact form AJAX submission
  const galleryContactForm = document.getElementById("galleryContactForm")
  if (galleryContactForm) {
    galleryContactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Basic form validation
      const name = document.getElementById("galleryName").value
      const email = document.getElementById("galleryEmail").value
      const message = document.getElementById("galleryMessage").value
      const subject = document.getElementById("gallerySubject").value || "Gallery Page Inquiry"

      if (!name || !email || !message) {
        showNotification("Please fill in all required fields", "error")
        return
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        showNotification("Please enter a valid email address", "error")
        return
      }

      // Show loading state
      const submitBtn = galleryContactForm.querySelector('button[type="submit"]')
      const originalBtnText = submitBtn.innerHTML
      submitBtn.disabled = true
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...'

      // Prepare form data
      const formData = new FormData(galleryContactForm)

      // Submit form using fetch API
      fetch(galleryContactForm.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      })
        .then((response) => {
          if (response.ok) {
            return response.json()
          } else {
            throw new Error("Network response was not ok")
          }
        })
        .then((data) => {
          // Success - clear form and show success message
          galleryContactForm.reset()
          showNotification("Thank you! Your message has been sent successfully.", "success")

          // Save submission to localStorage for admin dashboard
          const submission = {
            id: "c" + Date.now(),
            date: new Date().toISOString(),
            name: name,
            email: email,
            subject: subject,
            message: message,
            tour: "Gallery Inquiry",
            status: "unread",
            notes: [],
          }

          saveSubmission(submission)

          // Add this line to send email notification
          sendEmailNotification("contact", submission)
        })
        .catch((error) => {
          // Error - show error message
          showNotification("Oops! There was a problem sending your message. Please try again.", "error")
          console.error("Error:", error)
        })
        .finally(() => {
          // Reset button state
          submitBtn.disabled = false
          submitBtn.innerHTML = originalBtnText
        })
    })
  }

  // Save submission to localStorage for admin dashboard
  function saveSubmission(submission) {
    const contactSubmissions = JSON.parse(localStorage.getItem("contactSubmissions") || "[]")
    contactSubmissions.push(submission)
    localStorage.setItem("contactSubmissions", JSON.stringify(contactSubmissions))
  }

  // Use the global showNotification function from script.js if it exists
  // Otherwise define it locally
  if (typeof window.showNotification !== "function") {
    window.showNotification = (message, type = "success") => {
      const notification = document.createElement("div")
      notification.className = `notification ${type}`
      notification.innerHTML = `<i class="fas ${type === "success" ? "fa-check-circle" : "fa-exclamation-circle"}"></i> ${message}`
      document.body.appendChild(notification)

      setTimeout(() => {
        notification.classList.add("show")
      }, 100)

      setTimeout(() => {
        notification.classList.remove("show")
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 500)
      }, 5000)
    }
  }

  // Add the sendEmailNotification function to gallery.js
  // This is the same function as in script.js
  async function sendEmailNotification(type, data) {
    try {
      // Check if email notifications are enabled
      const emailSettings = JSON.parse(localStorage.getItem("emailSettings") || "{}")

      if (!emailSettings.enabled) {
        return // Email notifications are disabled
      }

      // Check if this type of notification is enabled
      if (type === "contact" && !emailSettings.contactEnabled) {
        return
      }

      if (type === "booking" && !emailSettings.bookingEnabled) {
        return
      }

      // Send notification to API endpoint
      const response = await fetch("https://your-api-endpoint.com/api/send-notification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type,
          data,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        console.error("Failed to send email notification:", result.error)
      }
    } catch (error) {
      console.error("Error sending email notification:", error)
    }
  }
})
