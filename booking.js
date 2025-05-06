document.addEventListener("DOMContentLoaded", () => {
  // Initialize date picker
  flatpickr(".datepicker", {
    minDate: "today",
    dateFormat: "Y-m-d",
    disableMobile: "true",
  })

  // Show/hide accommodation options based on selection
  const accommodationYes = document.getElementById("accommodationYes")
  const accommodationNo = document.getElementById("accommodationNo")
  const accommodationOptions = document.getElementById("accommodationOptions")

  if (accommodationYes && accommodationNo && accommodationOptions) {
    accommodationYes.addEventListener("change", function () {
      if (this.checked) {
        accommodationOptions.classList.remove("d-none")
      }
    })

    accommodationNo.addEventListener("change", function () {
      if (this.checked) {
        accommodationOptions.classList.add("d-none")
      }
    })
  }

  // Form validation and AJAX submission
  const bookingForm = document.getElementById("bookingForm")
  if (bookingForm) {
    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Basic form validation
      const firstName = document.getElementById("firstName").value
      const lastName = document.getElementById("lastName").value
      const email = document.getElementById("email").value
      const phone = document.getElementById("phone").value
      const tourType = document.getElementById("tourType").value
      const tourDate = document.getElementById("tourDate").value
      const adults = document.getElementById("adults").value
      const termsCheck = document.getElementById("termsCheck").checked

      if (!firstName || !lastName || !email || !phone || !tourType || !tourDate || !adults || !termsCheck) {
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
      const submitBtn = bookingForm.querySelector('button[type="submit"]')
      const originalBtnText = submitBtn.innerHTML
      submitBtn.disabled = true
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Processing...'

      // Prepare form data
      const formData = new FormData(bookingForm)

      // Add names to form fields that might be missing them
      if (!formData.has("firstName")) formData.append("firstName", firstName)
      if (!formData.has("lastName")) formData.append("lastName", lastName)
      if (!formData.has("email")) formData.append("email", email)
      if (!formData.has("phone")) formData.append("phone", phone)
      if (!formData.has("tourType")) formData.append("tourType", tourType)
      if (!formData.has("tourDate")) formData.append("tourDate", tourDate)
      if (!formData.has("adults")) formData.append("adults", adults)

      // Submit form using fetch API
      fetch(bookingForm.action, {
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
          bookingForm.reset()
          showNotification(
            "Thank you for your booking request! We will contact you shortly to confirm your tour.",
            "success",
          )

          // Scroll to top of form
          const formContainer = document.querySelector(".booking-form-container")
          if (formContainer) {
            formContainer.scrollIntoView({ behavior: "smooth" })
          }

          // Save booking submission to localStorage for admin dashboard
          const submission = {
            id: "b" + Date.now(),
            date: new Date().toISOString(),
            firstName: firstName,
            lastName: lastName,
            email: email,
            phone: phone,
            country: document.getElementById("country").value,
            tourType: tourType,
            tourDate: tourDate,
            tourDuration: document.getElementById("tourDuration").value,
            adults: adults,
            children: document.getElementById("children").value || 0,
            accommodation: document.querySelector('input[name="accommodation"]:checked').value,
            accommodationType: document.getElementById("accommodationType")
              ? document.getElementById("accommodationType").value
              : "",
            pickupLocation: document.getElementById("pickupLocation").value,
            specialRequests: document.getElementById("specialRequests").value,
            status: "pending",
            notes: [],
          }

          saveBookingSubmission(submission)

          // Add this line to send email notification
          sendEmailNotification("booking", submission)
        })
        .catch((error) => {
          // Error - show error message
          showNotification(
            "Oops! There was a problem submitting your booking. Please try again or contact us directly.",
            "error",
          )
          console.error("Error:", error)
        })
        .finally(() => {
          // Reset button state
          submitBtn.disabled = false
          submitBtn.innerHTML = originalBtnText
        })
    })
  }

  // Save booking submission to localStorage for admin dashboard
  function saveBookingSubmission(submission) {
    const bookingSubmissions = JSON.parse(localStorage.getItem("bookingSubmissions") || "[]")
    bookingSubmissions.push(submission)
    localStorage.setItem("bookingSubmissions", JSON.stringify(bookingSubmissions))
  }

  // Update form based on tour selection
  const tourTypeSelect = document.getElementById("tourType")
  const tourDurationSelect = document.getElementById("tourDuration")

  if (tourTypeSelect && tourDurationSelect) {
    tourTypeSelect.addEventListener("change", function () {
      const selectedTour = this.value

      // Set appropriate default duration based on tour type
      if (
        selectedTour === "Prison Island Tour" ||
        selectedTour === "Stone Town Tour" ||
        selectedTour === "Spice Tour" ||
        selectedTour === "Jozani Forest"
      ) {
        tourDurationSelect.value = "Half Day"
      } else if (selectedTour === "Safari Blue" || selectedTour === "Dolphin Tour") {
        tourDurationSelect.value = "Full Day"
      } else if (selectedTour === "Serengeti Safari" || selectedTour === "Ngorongoro Crater") {
        tourDurationSelect.value = "3 Days"
      }
    })
  }

  // Show different form fields based on tour type
  document.getElementById("tourType").addEventListener("change", function () {
    const selectedTour = this.value
    const durationSelect = document.getElementById("tourDuration")

    // Reset duration options
    while (durationSelect.options.length > 0) {
      durationSelect.remove(0)
    }

    // Add appropriate duration options based on tour type
    if (selectedTour === "Mount Kilimanjaro") {
      addOption(durationSelect, "5 Days", "5 Days")
      addOption(durationSelect, "6 Days", "6 Days")
      addOption(durationSelect, "7 Days", "7 Days", true)
      addOption(durationSelect, "8 Days", "8 Days")

      // Show climbing experience field if it exists
      if (document.getElementById("climbingExperience")) {
        document.getElementById("climbingExperience").closest(".form-group").classList.remove("d-none")
      }
    } else if (selectedTour === "Mount Meru") {
      addOption(durationSelect, "3 Days", "3 Days")
      addOption(durationSelect, "4 Days", "4 Days", true)

      // Show climbing experience field if it exists
      if (document.getElementById("climbingExperience")) {
        document.getElementById("climbingExperience").closest(".form-group").classList.remove("d-none")
      }
    } else if (
      selectedTour === "Serengeti Safari" ||
      selectedTour === "Ngorongoro Crater" ||
      selectedTour === "Mikumi National Park"
    ) {
      addOption(durationSelect, "1 Day", "1 Day")
      addOption(durationSelect, "2 Days", "2 Days")
      addOption(durationSelect, "3 Days", "3 Days", true)
      addOption(durationSelect, "5 Days", "5 Days")
      addOption(durationSelect, "7 Days", "7 Days")

      // Hide climbing experience field if it exists
      if (document.getElementById("climbingExperience")) {
        document.getElementById("climbingExperience").closest(".form-group").classList.add("d-none")
      }
    } else {
      // Default options for other tours
      addOption(durationSelect, "Half Day", "Half Day")
      addOption(durationSelect, "Full Day", "Full Day", true)
      addOption(durationSelect, "2 Days", "2 Days")
      addOption(durationSelect, "3 Days", "3 Days")

      // Hide climbing experience field if it exists
      if (document.getElementById("climbingExperience")) {
        document.getElementById("climbingExperience").closest(".form-group").classList.add("d-none")
      }
    }
  })

  // Helper function to add options to select
  function addOption(selectElement, text, value, selected = false) {
    const option = document.createElement("option")
    option.text = text
    option.value = value
    if (selected) {
      option.selected = true
    }
    selectElement.add(option)
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

  // Add the sendEmailNotification function to booking.js
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
