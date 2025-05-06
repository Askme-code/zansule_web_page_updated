import { Chart } from "@/components/ui/chart"
import * as bootstrap from "bootstrap"
import $ from "jquery"

document.addEventListener("DOMContentLoaded", () => {
  // Demo credentials
  const DEMO_USERNAME = "admin"
  const DEMO_PASSWORD = "password"

  // DOM elements
  const loginSection = document.getElementById("loginSection")
  const dashboardSection = document.getElementById("dashboardSection")
  const loginForm = document.getElementById("loginForm")
  const loginError = document.getElementById("loginError")
  const logoutBtn = document.getElementById("logoutBtn")
  const navLinks = document.querySelectorAll(".sidebar .nav-link")
  const tabContents = document.querySelectorAll(".tab-content")
  const refreshDataBtn = document.getElementById("refreshData")
  const exportDataBtn = document.getElementById("exportData")
  const dateRangeBtn = document.getElementById("dateRangeBtn")
  const totalSubmissionsEl = document.getElementById("totalSubmissions")
  const totalBookingsEl = document.getElementById("totalBookings")
  const unreadMessagesEl = document.getElementById("unreadMessages")
  const contactCountEl = document.getElementById("contactCount")
  const bookingCountEl = document.getElementById("bookingCount")
  const recentSubmissionsTable = document.getElementById("recentSubmissionsTable")
  const contactSubmissionsTable = document.getElementById("contactSubmissionsTable")
  const bookingSubmissionsTable = document.getElementById("bookingSubmissionsTable")
  const selectAllContact = document.getElementById("selectAllContact")
  const selectAllBooking = document.getElementById("selectAllBooking")
  const deleteAllContactBtn = document.getElementById("deleteAllContactBtn")
  const deleteAllBookingBtn = document.getElementById("deleteAllBookingBtn")
  const contactSearch = document.getElementById("contactSearch")
  const bookingSearch = document.getElementById("bookingSearch")
  const submissionModal = new bootstrap.Modal(document.getElementById("submissionModal"))
  const submissionModalBody = document.getElementById("submissionModalBody")
  const markAsReadBtn = document.getElementById("markAsReadBtn")
  const addNoteBtn = document.getElementById("addNoteBtn")
  const deleteSubmissionBtn = document.getElementById("deleteSubmissionBtn")
  const noteModal = new bootstrap.Modal(document.getElementById("noteModal"))
  const noteText = document.getElementById("noteText")
  const saveNoteBtn = document.getElementById("saveNoteBtn")
  const confirmationModal = new bootstrap.Modal(document.getElementById("confirmationModal"))
  const confirmationModalBody = document.getElementById("confirmationModalBody")
  const confirmActionBtn = document.getElementById("confirmActionBtn")
  const accountSettingsForm = document.getElementById("accountSettingsForm")
  const notificationSettingsForm = document.getElementById("notificationSettingsForm")
  const exportAllDataBtn = document.getElementById("exportAllData")
  const clearAllDataBtn = document.getElementById("clearAllData")
  const saveDataSettingsBtn = document.getElementById("saveDataSettings")

  // State variables
  let currentTab = "overview"
  let contactSubmissions = []
  let bookingSubmissions = []
  let currentSubmission = null
  let actionCallback = null

  // Check if user is logged in
  function checkAuth() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
    if (isLoggedIn) {
      loginSection.classList.add("d-none")
      dashboardSection.classList.remove("d-none")
      loadDashboardData()
    } else {
      loginSection.classList.remove("d-none")
      dashboardSection.classList.add("d-none")
    }
  }

  // Handle login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const username = document.getElementById("username").value
      const password = document.getElementById("password").value

      if (username === DEMO_USERNAME && password === DEMO_PASSWORD) {
        localStorage.setItem("isLoggedIn", "true")
        loginError.classList.add("d-none")
        checkAuth()
      } else {
        loginError.classList.remove("d-none")
      }
    })
  }

  // Handle logout
  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault()
      localStorage.removeItem("isLoggedIn")
      checkAuth()
    })
  }

  // Tab navigation
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const tabId = this.getAttribute("data-tab")

      // Update active tab
      navLinks.forEach((navLink) => navLink.classList.remove("active"))
      this.classList.add("active")

      // Show selected tab content
      tabContents.forEach((content) => content.classList.add("d-none"))
      document.getElementById(tabId).classList.remove("d-none")

      currentTab = tabId

      // Load tab-specific data
      if (tabId === "contact") {
        renderContactSubmissions()
      } else if (tabId === "booking") {
        renderBookingSubmissions()
      }
    })
  })

  // Generate sample data
  function generateSampleData() {
    // Generate contact submissions if not already in localStorage
    if (!localStorage.getItem("contactSubmissions")) {
      const sampleContactSubmissions = [
        {
          id: "c1",
          date: "2023-05-15T10:30:00",
          name: "John Smith",
          email: "john.smith@example.com",
          subject: "Safari Blue Tour Inquiry",
          message:
            "Hello, I'm interested in the Safari Blue tour. Do you offer private tours for families? We are a group of 5 people.",
          tour: "Safari Blue",
          status: "unread",
          notes: [],
        },
        {
          id: "c2",
          date: "2023-05-14T14:45:00",
          name: "Maria Garcia",
          email: "maria.garcia@example.com",
          subject: "Stone Town Tour Questions",
          message:
            "Hi there, I'd like to know more about the Stone Town tour. How long does it take and what are the main attractions we'll visit?",
          tour: "Stone Town Tour",
          status: "read",
          notes: ["Customer called to confirm details on May 15th"],
        },
        {
          id: "c3",
          date: "2023-05-13T09:15:00",
          name: "David Johnson",
          email: "david.johnson@example.com",
          subject: "General Inquiry",
          message: "I'm planning a trip to Zanzibar in July. What tours would you recommend for a first-time visitor?",
          tour: "General Inquiry",
          status: "unread",
          notes: [],
        },
        {
          id: "c4",
          date: "2023-05-12T16:20:00",
          name: "Sarah Williams",
          email: "sarah.williams@example.com",
          subject: "Spice Tour Availability",
          message: "Hello, I'm wondering if you have availability for the Spice Tour on June 10th for 2 people?",
          tour: "Spice Tour",
          status: "read",
          notes: ["Confirmed availability", "Sent pricing information"],
        },
        {
          id: "c5",
          date: "2023-05-11T11:05:00",
          name: "Michael Brown",
          email: "michael.brown@example.com",
          subject: "Dolphin Tour Question",
          message:
            "Hi, I'm interested in the Dolphin Tour but I'm concerned about the ethical aspects. Can you tell me more about how you approach dolphin watching?",
          tour: "Dolphin Tour",
          status: "unread",
          notes: [],
        },
      ]

      localStorage.setItem("contactSubmissions", JSON.stringify(sampleContactSubmissions))
      contactSubmissions = sampleContactSubmissions
    } else {
      contactSubmissions = JSON.parse(localStorage.getItem("contactSubmissions"))
    }

    // Generate booking submissions if not already in localStorage
    if (!localStorage.getItem("bookingSubmissions")) {
      const sampleBookingSubmissions = [
        {
          id: "b1",
          date: "2023-05-15T09:45:00",
          firstName: "Robert",
          lastName: "Davis",
          email: "robert.davis@example.com",
          phone: "+1234567890",
          country: "United States",
          tourType: "Safari Blue",
          tourDate: "2023-06-20",
          tourDuration: "Full Day",
          adults: 2,
          children: 0,
          accommodation: "No",
          pickupLocation: "Zanzibar Serena Hotel",
          specialRequests: "We are vegetarians, please ensure vegetarian food options.",
          status: "pending",
          notes: [],
        },
        {
          id: "b2",
          date: "2023-05-14T13:30:00",
          firstName: "Emma",
          lastName: "Wilson",
          email: "emma.wilson@example.com",
          phone: "+4412345678",
          country: "United Kingdom",
          tourType: "Stone Town Tour",
          tourDate: "2023-06-15",
          tourDuration: "Half Day",
          adults: 3,
          children: 1,
          accommodation: "Yes",
          accommodationType: "Standard",
          pickupLocation: "DoubleTree Resort by Hilton",
          specialRequests: "We have a child who is 5 years old. Is the tour suitable for children?",
          status: "confirmed",
          notes: ["Confirmed child-friendly tour", "Arranged special guide"],
        },
        {
          id: "b3",
          date: "2023-05-13T10:15:00",
          firstName: "Thomas",
          lastName: "Anderson",
          email: "thomas.anderson@example.com",
          phone: "+4987654321",
          country: "Germany",
          tourType: "Spice Tour",
          tourDate: "2023-07-05",
          tourDuration: "Half Day",
          adults: 2,
          children: 0,
          accommodation: "No",
          pickupLocation: "Melia Zanzibar",
          specialRequests: "",
          status: "pending",
          notes: [],
        },
        {
          id: "b4",
          date: "2023-05-12T15:40:00",
          firstName: "Sophie",
          lastName: "Martin",
          email: "sophie.martin@example.com",
          phone: "+3312345678",
          country: "France",
          tourType: "Prison Island Tour",
          tourDate: "2023-06-25",
          tourDuration: "Half Day",
          adults: 4,
          children: 0,
          accommodation: "No",
          pickupLocation: "Park Hyatt Zanzibar",
          specialRequests: "One person in our group has mobility issues. Is this tour accessible?",
          status: "confirmed",
          notes: ["Arranged accessible transportation"],
        },
        {
          id: "b5",
          date: "2023-05-11T08:20:00",
          firstName: "James",
          lastName: "Taylor",
          email: "james.taylor@example.com",
          phone: "+6112345678",
          country: "Australia",
          tourType: "Serengeti Safari",
          tourDate: "2023-07-15",
          tourDuration: "3 Days",
          adults: 2,
          children: 2,
          accommodation: "Yes",
          accommodationType: "Luxury",
          pickupLocation: "Zanzibar International Airport",
          specialRequests: "We would like to celebrate our anniversary during the trip if possible.",
          status: "pending",
          notes: ["Planning special anniversary surprise"],
        },
      ]

      localStorage.setItem("bookingSubmissions", JSON.stringify(sampleBookingSubmissions))
      bookingSubmissions = sampleBookingSubmissions
    } else {
      bookingSubmissions = JSON.parse(localStorage.getItem("bookingSubmissions"))
    }
  }

  // Load dashboard data
  function loadDashboardData() {
    generateSampleData()

    // Update counts
    const totalSubmissionsCount = contactSubmissions.length + bookingSubmissions.length
    const totalBookingsCount = bookingSubmissions.length
    const unreadMessagesCount =
      contactSubmissions.filter((submission) => submission.status === "unread").length +
      bookingSubmissions.filter((submission) => submission.status === "pending").length

    totalSubmissionsEl.textContent = totalSubmissionsCount
    totalBookingsEl.textContent = totalBookingsCount
    unreadMessagesEl.textContent = unreadMessagesCount
    contactCountEl.textContent = contactSubmissions.length
    bookingCountEl.textContent = bookingSubmissions.length

    // Render recent submissions
    renderRecentSubmissions()

    // Render tour chart
    renderTourChart()
  }

  // Render recent submissions
  function renderRecentSubmissions() {
    // Combine and sort all submissions by date (newest first)
    const allSubmissions = [
      ...contactSubmissions.map((submission) => ({
        ...submission,
        type: "contact",
      })),
      ...bookingSubmissions.map((submission) => ({
        ...submission,
        type: "booking",
        name: `${submission.firstName} ${submission.lastName}`,
      })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5)

    // Clear table
    recentSubmissionsTable.innerHTML = ""

    // Add submissions to table
    allSubmissions.forEach((submission) => {
      const row = document.createElement("tr")

      const dateCell = document.createElement("td")
      const date = new Date(submission.date)
      dateCell.textContent = date.toLocaleDateString()

      const nameCell = document.createElement("td")
      nameCell.textContent = submission.name

      const typeCell = document.createElement("td")
      typeCell.innerHTML =
        submission.type === "contact"
          ? '<span class="badge badge-info">Contact</span>'
          : '<span class="badge badge-primary">Booking</span>'

      const statusCell = document.createElement("td")
      if (submission.type === "contact") {
        statusCell.innerHTML =
          submission.status === "unread"
            ? '<span class="badge badge-unread">Unread</span>'
            : '<span class="badge badge-read">Read</span>'
      } else {
        if (submission.status === "pending") {
          statusCell.innerHTML = '<span class="badge badge-pending">Pending</span>'
        } else if (submission.status === "confirmed") {
          statusCell.innerHTML = '<span class="badge badge-confirmed">Confirmed</span>'
        } else {
          statusCell.innerHTML = '<span class="badge badge-cancelled">Cancelled</span>'
        }
      }

      const actionCell = document.createElement("td")
      const viewBtn = document.createElement("button")
      viewBtn.className = "btn btn-sm btn-outline-primary"
      viewBtn.innerHTML = '<i class="fas fa-eye"></i>'
      viewBtn.addEventListener("click", () => {
        viewSubmissionDetails(submission)
      })
      actionCell.appendChild(viewBtn)

      row.appendChild(dateCell)
      row.appendChild(nameCell)
      row.appendChild(typeCell)
      row.appendChild(statusCell)
      row.appendChild(actionCell)

      recentSubmissionsTable.appendChild(row)
    })
  }

  // Render tour chart
  function renderTourChart() {
    // Count bookings by tour type
    const tourCounts = {}

    bookingSubmissions.forEach((booking) => {
      if (tourCounts[booking.tourType]) {
        tourCounts[booking.tourType]++
      } else {
        tourCounts[booking.tourType] = 1
      }
    })

    // Prepare data for chart
    const labels = Object.keys(tourCounts)
    const data = Object.values(tourCounts)

    // Create chart
    const ctx = document.getElementById("tourChart").getContext("2d")
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: ["#d4af37", "#1a2639", "#f8f1d9", "#28a745", "#dc3545", "#17a2b8"],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        legend: {
          position: "bottom",
          labels: {
            boxWidth: 12,
          },
        },
        title: {
          display: true,
          text: "Bookings by Tour Type",
        },
      },
    })
  }

  // Render contact submissions
  function renderContactSubmissions() {
    // Sort contact submissions by date (newest first)
    const sortedSubmissions = [...contactSubmissions].sort((a, b) => new Date(b.date) - new Date(a.date))

    // Clear table
    contactSubmissionsTable.innerHTML = ""

    // Add submissions to table
    sortedSubmissions.forEach((submission) => {
      const row = document.createElement("tr")
      row.className = submission.status === "unread" ? "table-warning" : ""

      const checkboxCell = document.createElement("td")
      const checkboxDiv = document.createElement("div")
      checkboxDiv.className = "custom-control custom-checkbox"

      const checkbox = document.createElement("input")
      checkbox.type = "checkbox"
      checkbox.className = "custom-control-input contact-checkbox"
      checkbox.id = `contact-${submission.id}`
      checkbox.setAttribute("data-id", submission.id)

      const checkboxLabel = document.createElement("label")
      checkboxLabel.className = "custom-control-label"
      checkboxLabel.setAttribute("for", `contact-${submission.id}`)

      checkboxDiv.appendChild(checkbox)
      checkboxDiv.appendChild(checkboxLabel)
      checkboxCell.appendChild(checkboxDiv)

      const dateCell = document.createElement("td")
      const date = new Date(submission.date)
      dateCell.textContent = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`

      const nameCell = document.createElement("td")
      nameCell.textContent = submission.name

      const emailCell = document.createElement("td")
      emailCell.textContent = submission.email

      const subjectCell = document.createElement("td")
      subjectCell.textContent = submission.subject

      const statusCell = document.createElement("td")
      statusCell.innerHTML =
        submission.status === "unread"
          ? '<span class="badge badge-unread">Unread</span>'
          : '<span class="badge badge-read">Read</span>'

      const actionCell = document.createElement("td")

      const viewBtn = document.createElement("button")
      viewBtn.className = "btn btn-sm btn-outline-primary mr-1"
      viewBtn.innerHTML = '<i class="fas fa-eye"></i>'
      viewBtn.addEventListener("click", () => {
        viewSubmissionDetails(submission)
      })

      const deleteBtn = document.createElement("button")
      deleteBtn.className = "btn btn-sm btn-outline-danger"
      deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>'
      deleteBtn.addEventListener("click", () => {
        showConfirmationModal("Are you sure you want to delete this submission?", () => {
          deleteSubmission(submission.id, "contact")
        })
      })

      actionCell.appendChild(viewBtn)
      actionCell.appendChild(deleteBtn)

      row.appendChild(checkboxCell)
      row.appendChild(dateCell)
      row.appendChild(nameCell)
      row.appendChild(emailCell)
      row.appendChild(subjectCell)
      row.appendChild(statusCell)
      row.appendChild(actionCell)

      contactSubmissionsTable.appendChild(row)
    })
  }

  // Render booking submissions
  function renderBookingSubmissions() {
    // Sort booking submissions by date (newest first)
    const sortedSubmissions = [...bookingSubmissions].sort((a, b) => new Date(b.date) - new Date(a.date))

    // Clear table
    bookingSubmissionsTable.innerHTML = ""

    // Add submissions to table
    sortedSubmissions.forEach((submission) => {
      const row = document.createElement("tr")
      row.className = submission.status === "pending" ? "table-warning" : ""

      const checkboxCell = document.createElement("td")
      const checkboxDiv = document.createElement("div")
      checkboxDiv.className = "custom-control custom-checkbox"

      const checkbox = document.createElement("input")
      checkbox.type = "checkbox"
      checkbox.className = "custom-control-input booking-checkbox"
      checkbox.id = `booking-${submission.id}`
      checkbox.setAttribute("data-id", submission.id)

      const checkboxLabel = document.createElement("label")
      checkboxLabel.className = "custom-control-label"
      checkboxLabel.setAttribute("for", `booking-${submission.id}`)

      checkboxDiv.appendChild(checkbox)
      checkboxDiv.appendChild(checkboxLabel)
      checkboxCell.appendChild(checkboxDiv)

      const dateCell = document.createElement("td")
      const date = new Date(submission.date)
      dateCell.textContent = `${date.toLocaleDateString()} ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`

      const nameCell = document.createElement("td")
      nameCell.textContent = `${submission.firstName} ${submission.lastName}`

      const tourCell = document.createElement("td")
      tourCell.textContent = submission.tourType

      const tourDateCell = document.createElement("td")
      tourDateCell.textContent = submission.tourDate

      const guestsCell = document.createElement("td")
      guestsCell.textContent = `${submission.adults} adults${submission.children > 0 ? ` + ${submission.children} children` : ""}`

      const statusCell = document.createElement("td")
      if (submission.status === "pending") {
        statusCell.innerHTML = '<span class="badge badge-pending">Pending</span>'
      } else if (submission.status === "confirmed") {
        statusCell.innerHTML = '<span class="badge badge-confirmed">Confirmed</span>'
      } else {
        statusCell.innerHTML = '<span class="badge badge-cancelled">Cancelled</span>'
      }

      const actionCell = document.createElement("td")

      const viewBtn = document.createElement("button")
      viewBtn.className = "btn btn-sm btn-outline-primary mr-1"
      viewBtn.innerHTML = '<i class="fas fa-eye"></i>'
      viewBtn.addEventListener("click", () => {
        viewSubmissionDetails(submission)
      })

      const deleteBtn = document.createElement("button")
      deleteBtn.className = "btn btn-sm btn-outline-danger"
      deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>'
      deleteBtn.addEventListener("click", () => {
        showConfirmationModal("Are you sure you want to delete this booking?", () => {
          deleteSubmission(submission.id, "booking")
        })
      })

      actionCell.appendChild(viewBtn)
      actionCell.appendChild(deleteBtn)

      row.appendChild(checkboxCell)
      row.appendChild(dateCell)
      row.appendChild(nameCell)
      row.appendChild(tourCell)
      row.appendChild(tourDateCell)
      row.appendChild(guestsCell)
      row.appendChild(statusCell)
      row.appendChild(actionCell)

      bookingSubmissionsTable.appendChild(row)
    })
  }

  // View submission details
  function viewSubmissionDetails(submission) {
    currentSubmission = submission

    let detailsHTML = ""

    if (submission.type === "contact" || !submission.type) {
      // Contact submission
      const date = new Date(submission.date)

      detailsHTML = `
        <div class="row">
          <div class="col-md-6">
            <p><strong>Date:</strong> ${date.toLocaleDateString()} ${date.toLocaleTimeString()}</p>
            <p><strong>Name:</strong> ${submission.name}</p>
            <p><strong>Email:</strong> ${submission.email}</p>
            <p><strong>Subject:</strong> ${submission.subject}</p>
            <p><strong>Tour Interest:</strong> ${submission.tour}</p>
            <p><strong>Status:</strong> <span class="badge ${submission.status === "unread" ? "badge-unread" : "badge-read"}">${submission.status === "unread" ? "Unread" : "Read"}</span></p>
          </div>
          <div class="col-md-6">
            <div class="card">
              <div class="card-header">
                <h5 class="mb-0">Message</h5>
              </div>
              <div class="card-body">
                <p>${submission.message}</p>
              </div>
            </div>
          </div>
        </div>
      `

      // Add notes section if there are notes
      if (submission.notes && submission.notes.length > 0) {
        detailsHTML += `
          <div class="row mt-4">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h5 class="mb-0">Notes</h5>
                </div>
                <div class="card-body">
                  <ul class="list-group">
                    ${submission.notes.map((note) => `<li class="list-group-item">${note}</li>`).join("")}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        `
      }

      // Update modal buttons
      markAsReadBtn.textContent = submission.status === "unread" ? "Mark as Read" : "Mark as Unread"
      markAsReadBtn.style.display = "block"
    } else {
      // Booking submission
      const date = new Date(submission.date)

      detailsHTML = `
        <div class="row">
          <div class="col-md-6">
            <p><strong>Date:</strong> ${date.toLocaleDateString()} ${date.toLocaleTimeString()}</p>
            <p><strong>Name:</strong> ${submission.firstName} ${submission.lastName}</p>
            <p><strong>Email:</strong> ${submission.email}</p>
            <p><strong>Phone:</strong> ${submission.phone}</p>
            <p><strong>Country:</strong> ${submission.country}</p>
            <p><strong>Status:</strong> <span class="badge ${submission.status === "pending" ? "badge-pending" : submission.status === "confirmed" ? "badge-confirmed" : "badge-cancelled"}">${submission.status.charAt(0).toUpperCase() + submission.status.slice(1)}</span></p>
          </div>
          <div class="col-md-6">
            <p><strong>Tour:</strong> ${submission.tourType}</p>
            <p><strong>Tour Date:</strong> ${submission.tourDate}</p>
            <p><strong>Duration:</strong> ${submission.tourDuration}</p>
            <p><strong>Guests:</strong> ${submission.adults} adults${submission.children > 0 ? ` + ${submission.children} children` : ""}</p>
            <p><strong>Accommodation:</strong> ${submission.accommodation}${submission.accommodation === "Yes" ? ` (${submission.accommodationType})` : ""}</p>
            <p><strong>Pickup Location:</strong> ${submission.pickupLocation}</p>
          </div>
        </div>
      `

      // Add special requests if any
      if (submission.specialRequests) {
        detailsHTML += `
          <div class="row mt-4">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h5 class="mb-0">Special Requests</h5>
                </div>
                <div class="card-body">
                  <p>${submission.specialRequests}</p>
                </div>
              </div>
            </div>
          </div>
        `
      }

      // Add notes section if there are notes
      if (submission.notes && submission.notes.length > 0) {
        detailsHTML += `
          <div class="row mt-4">
            <div class="col-12">
              <div class="card">
                <div class="card-header">
                  <h5 class="mb-0">Notes</h5>
                </div>
                <div class="card-body">
                  <ul class="list-group">
                    ${submission.notes.map((note) => `<li class="list-group-item">${note}</li>`).join("")}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        `
      }

      // Update modal buttons
      markAsReadBtn.textContent = submission.status === "pending" ? "Mark as Confirmed" : "Mark as Pending"
      markAsReadBtn.style.display = "block"
    }

    // Update modal content
    submissionModalBody.innerHTML = detailsHTML

    // Show modal
    submissionModal.show()
  }

  // Mark submission as read/unread or change status
  markAsReadBtn.addEventListener("click", function () {
    if (currentSubmission) {
      if (currentSubmission.type === "contact" || !currentSubmission.type) {
        // Toggle contact submission status
        const newStatus = currentSubmission.status === "unread" ? "read" : "unread"
        updateSubmissionStatus(currentSubmission.id, "contact", newStatus)

        // Update button text
        this.textContent = newStatus === "unread" ? "Mark as Read" : "Mark as Unread"
      } else {
        // Toggle booking submission status
        const newStatus = currentSubmission.status === "pending" ? "confirmed" : "pending"
        updateSubmissionStatus(currentSubmission.id, "booking", newStatus)

        // Update button text
        this.textContent = newStatus === "pending" ? "Mark as Confirmed" : "Mark as Pending"
      }

      // Update status in modal
      const statusSpan = submissionModalBody.querySelector(".badge")
      if (statusSpan) {
        if (currentSubmission.type === "contact" || !currentSubmission.type) {
          statusSpan.className = `badge ${currentSubmission.status === "unread" ? "badge-unread" : "badge-read"}`
          statusSpan.textContent = currentSubmission.status === "unread" ? "Unread" : "Read"
        } else {
          statusSpan.className = `badge ${currentSubmission.status === "pending" ? "badge-pending" : "badge-confirmed"}`
          statusSpan.textContent = currentSubmission.status.charAt(0).toUpperCase() + currentSubmission.status.slice(1)
        }
      }
    }
  })

  // Update submission status
  function updateSubmissionStatus(id, type, status) {
    if (type === "contact") {
      const index = contactSubmissions.findIndex((submission) => submission.id === id)
      if (index !== -1) {
        contactSubmissions[index].status = status
        localStorage.setItem("contactSubmissions", JSON.stringify(contactSubmissions))

        // Update current submission
        if (currentSubmission && currentSubmission.id === id) {
          currentSubmission.status = status
        }

        // Refresh data
        if (currentTab === "contact") {
          renderContactSubmissions()
        } else if (currentTab === "overview") {
          loadDashboardData()
        }
      }
    } else if (type === "booking") {
      const index = bookingSubmissions.findIndex((submission) => submission.id === id)
      if (index !== -1) {
        bookingSubmissions[index].status = status
        localStorage.setItem("bookingSubmissions", JSON.stringify(bookingSubmissions))

        // Update current submission
        if (currentSubmission && currentSubmission.id === id) {
          currentSubmission.status = status
        }

        // Refresh data
        if (currentTab === "booking") {
          renderBookingSubmissions()
        } else if (currentTab === "overview") {
          loadDashboardData()
        }
      }
    }
  }

  // Add note to submission
  addNoteBtn.addEventListener("click", () => {
    // Reset note text
    noteText.value = ""

    // Show note modal
    noteModal.show()
  })

  // Save note
  saveNoteBtn.addEventListener("click", () => {
    const note = noteText.value.trim()

    if (note && currentSubmission) {
      if (currentSubmission.type === "contact" || !currentSubmission.type) {
        // Add note to contact submission
        const index = contactSubmissions.findIndex((submission) => submission.id === currentSubmission.id)
        if (index !== -1) {
          if (!contactSubmissions[index].notes) {
            contactSubmissions[index].notes = []
          }
          contactSubmissions[index].notes.push(note)
          localStorage.setItem("contactSubmissions", JSON.stringify(contactSubmissions))

          // Update current submission
          if (!currentSubmission.notes) {
            currentSubmission.notes = []
          }
          currentSubmission.notes.push(note)
        }
      } else {
        // Add note to booking submission
        const index = bookingSubmissions.findIndex((submission) => submission.id === currentSubmission.id)
        if (index !== -1) {
          if (!bookingSubmissions[index].notes) {
            bookingSubmissions[index].notes = []
          }
          bookingSubmissions[index].notes.push(note)
          localStorage.setItem("bookingSubmissions", JSON.stringify(bookingSubmissions))

          // Update current submission
          if (!currentSubmission.notes) {
            currentSubmission.notes = []
          }
          currentSubmission.notes.push(note)
        }
      }

      // Hide note modal
      noteModal.hide()

      // Update submission details
      viewSubmissionDetails(currentSubmission)
    }
  })

  // Delete submission
  deleteSubmissionBtn.addEventListener("click", () => {
    if (currentSubmission) {
      const type = currentSubmission.type || "contact"
      showConfirmationModal(`Are you sure you want to delete this ${type} submission?`, () => {
        deleteSubmission(currentSubmission.id, type)
        submissionModal.hide()
      })
    }
  })

  // Delete submission
  function deleteSubmission(id, type) {
    if (type === "contact") {
      contactSubmissions = contactSubmissions.filter((submission) => submission.id !== id)
      localStorage.setItem("contactSubmissions", JSON.stringify(contactSubmissions))

      // Refresh data
      if (currentTab === "contact") {
        renderContactSubmissions()
      } else if (currentTab === "overview") {
        loadDashboardData()
      }
    } else if (type === "booking") {
      bookingSubmissions = bookingSubmissions.filter((submission) => submission.id !== id)
      localStorage.setItem("bookingSubmissions", JSON.stringify(bookingSubmissions))

      // Refresh data
      if (currentTab === "booking") {
        renderBookingSubmissions()
      } else if (currentTab === "overview") {
        loadDashboardData()
      }
    }
  }

  // Show confirmation modal
  function showConfirmationModal(message, callback) {
    confirmationModalBody.textContent = message
    actionCallback = callback
    confirmationModal.show()
  }

  // Confirm action
  confirmActionBtn.addEventListener("click", () => {
    if (actionCallback) {
      actionCallback()
      actionCallback = null
    }
    confirmationModal.hide()
  })

  // Select all contact submissions
  if (selectAllContact) {
    selectAllContact.addEventListener("change", function () {
      const checkboxes = document.querySelectorAll(".contact-checkbox")
      checkboxes.forEach((checkbox) => {
        checkbox.checked = this.checked
      })
    })
  }

  // Select all booking submissions
  if (selectAllBooking) {
    selectAllBooking.addEventListener("change", function () {
      const checkboxes = document.querySelectorAll(".booking-checkbox")
      checkboxes.forEach((checkbox) => {
        checkbox.checked = this.checked
      })
    })
  }

  // Delete all selected contact submissions
  if (deleteAllContactBtn) {
    deleteAllContactBtn.addEventListener("click", () => {
      const selectedCheckboxes = document.querySelectorAll(".contact-checkbox:checked")
      if (selectedCheckboxes.length > 0) {
        showConfirmationModal(
          `Are you sure you want to delete ${selectedCheckboxes.length} contact submissions?`,
          () => {
            const selectedIds = Array.from(selectedCheckboxes).map((checkbox) => checkbox.getAttribute("data-id"))
            contactSubmissions = contactSubmissions.filter((submission) => !selectedIds.includes(submission.id))
            localStorage.setItem("contactSubmissions", JSON.stringify(contactSubmissions))

            // Refresh data
            renderContactSubmissions()

            // Uncheck "select all" checkbox
            if (selectAllContact) {
              selectAllContact.checked = false
            }
          },
        )
      }
    })
  }

  // Delete all selected booking submissions
  if (deleteAllBookingBtn) {
    deleteAllBookingBtn.addEventListener("click", () => {
      const selectedCheckboxes = document.querySelectorAll(".booking-checkbox:checked")
      if (selectedCheckboxes.length > 0) {
        showConfirmationModal(
          `Are you sure you want to delete ${selectedCheckboxes.length} booking submissions?`,
          () => {
            const selectedIds = Array.from(selectedCheckboxes).map((checkbox) => checkbox.getAttribute("data-id"))
            bookingSubmissions = bookingSubmissions.filter((submission) => !selectedIds.includes(submission.id))
            localStorage.setItem("bookingSubmissions", JSON.stringify(bookingSubmissions))

            // Refresh data
            renderBookingSubmissions()

            // Uncheck "select all" checkbox
            if (selectAllBooking) {
              selectAllBooking.checked = false
            }
          },
        )
      }
    })
  }

  // Search contact submissions
  if (contactSearch) {
    contactSearch.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase()
      const rows = contactSubmissionsTable.querySelectorAll("tr")

      rows.forEach((row) => {
        const name = row.cells[2].textContent.toLowerCase()
        const email = row.cells[3].textContent.toLowerCase()
        const subject = row.cells[4].textContent.toLowerCase()

        if (name.includes(searchTerm) || email.includes(searchTerm) || subject.includes(searchTerm)) {
          row.style.display = ""
        } else {
          row.style.display = "none"
        }
      })
    })
  }

  // Search booking submissions
  if (bookingSearch) {
    bookingSearch.addEventListener("input", function () {
      const searchTerm = this.value.toLowerCase()
      const rows = bookingSubmissionsTable.querySelectorAll("tr")

      rows.forEach((row) => {
        const name = row.cells[2].textContent.toLowerCase()
        const tour = row.cells[3].textContent.toLowerCase()
        const date = row.cells[4].textContent.toLowerCase()

        if (name.includes(searchTerm) || tour.includes(searchTerm) || date.includes(searchTerm)) {
          row.style.display = ""
        } else {
          row.style.display = "none"
        }
      })
    })
  }

  // Refresh data
  if (refreshDataBtn) {
    refreshDataBtn.addEventListener("click", () => {
      loadDashboardData()
      showNotification("Dashboard data refreshed successfully!")
    })
  }

  // Export data
  if (exportDataBtn) {
    exportDataBtn.addEventListener("click", () => {
      const data = {
        contactSubmissions,
        bookingSubmissions,
      }

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2))
      const downloadAnchorNode = document.createElement("a")
      downloadAnchorNode.setAttribute("href", dataStr)
      downloadAnchorNode.setAttribute("download", "zansule_submissions_export.json")
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()

      showNotification("Data exported successfully!")
    })
  }

  // Export all data
  if (exportAllDataBtn) {
    exportAllDataBtn.addEventListener("click", () => {
      const data = {
        contactSubmissions,
        bookingSubmissions,
      }

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2))
      const downloadAnchorNode = document.createElement("a")
      downloadAnchorNode.setAttribute("href", dataStr)
      downloadAnchorNode.setAttribute("download", "zansule_submissions_export.json")
      document.body.appendChild(downloadAnchorNode)
      downloadAnchorNode.click()
      downloadAnchorNode.remove()

      showNotification("All data exported successfully!")
    })
  }

  // Clear all data
  if (clearAllDataBtn) {
    clearAllDataBtn.addEventListener("click", () => {
      showConfirmationModal("Are you sure you want to clear all data? This action cannot be undone.", () => {
        localStorage.removeItem("contactSubmissions")
        localStorage.removeItem("bookingSubmissions")

        contactSubmissions = []
        bookingSubmissions = []

        loadDashboardData()

        showNotification("All data cleared successfully!")
      })
    })
  }

  // Save data settings
  if (saveDataSettingsBtn) {
    saveDataSettingsBtn.addEventListener("click", () => {
      const dataRetention = document.getElementById("dataRetention").value
      localStorage.setItem("dataRetention", dataRetention)

      showNotification("Data settings saved successfully!")
    })
  }

  // Account settings form
  if (accountSettingsForm) {
    accountSettingsForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const currentPassword = document.getElementById("currentPassword").value
      const newPassword = document.getElementById("newPassword").value
      const confirmPassword = document.getElementById("confirmPassword").value

      if (currentPassword && newPassword && confirmPassword) {
        if (currentPassword !== DEMO_PASSWORD) {
          showNotification("Current password is incorrect!", "error")
          return
        }

        if (newPassword !== confirmPassword) {
          showNotification("New passwords do not match!", "error")
          return
        }

        // In a real application, you would update the password in the database
        // For this demo, we'll just show a success message
        showNotification("Password updated successfully!")

        // Clear password fields
        document.getElementById("currentPassword").value = ""
        document.getElementById("newPassword").value = ""
        document.getElementById("confirmPassword").value = ""
      } else {
        showNotification("Account settings saved successfully!")
      }
    })
  }

  // Notification settings form
  if (notificationSettingsForm) {
    notificationSettingsForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // In a real application, you would save these settings to the database
      // For this demo, we'll just show a success message
      showNotification("Notification preferences saved successfully!")
    })
  }

  // Email notification settings
  const emailSettingsForm = document.getElementById("emailSettingsForm")
  if (emailSettingsForm) {
    // Load saved settings
    const emailSettings = JSON.parse(localStorage.getItem("emailSettings") || "{}")

    // Set form values from saved settings
    document.getElementById("notificationEmail").value = emailSettings.email || ""
    document.getElementById("emailNotificationsEnabled").checked = emailSettings.enabled !== false
    document.getElementById("contactNotifications").checked = emailSettings.contactEnabled !== false
    document.getElementById("bookingNotifications").checked = emailSettings.bookingEnabled !== false

    // Handle form submission
    emailSettingsForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form values
      const email = document.getElementById("notificationEmail").value.trim()
      const enabled = document.getElementById("emailNotificationsEnabled").checked
      const contactEnabled = document.getElementById("contactNotifications").checked
      const bookingEnabled = document.getElementById("bookingNotifications").checked

      // Validate email
      if (enabled && !email) {
        showNotification("Please enter a notification email address", "error")
        return
      }

      // Save settings
      const emailSettings = {
        email,
        enabled,
        contactEnabled,
        bookingEnabled,
        lastUpdated: new Date().toISOString(),
      }

      localStorage.setItem("emailSettings", JSON.stringify(emailSettings))

      // Show success message
      showNotification("Email notification settings saved successfully!")
    })
  }

  // Test email notification
  const testEmailBtn = document.getElementById("testEmailBtn")
  if (testEmailBtn) {
    testEmailBtn.addEventListener("click", async () => {
      const emailSettings = JSON.parse(localStorage.getItem("emailSettings") || "{}")

      if (!emailSettings.enabled || !emailSettings.email) {
        showNotification("Email notifications are not enabled or no email address is set", "error")
        return
      }

      // Show loading state
      testEmailBtn.disabled = true
      testEmailBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Sending...'

      try {
        // Send test email
        const response = await fetch("https://your-api-endpoint.com/api/send-notification", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            type: "test",
            data: {
              email: emailSettings.email,
              testTime: new Date().toISOString(),
            },
          }),
        })

        const data = await response.json()

        if (response.ok) {
          showNotification("Test email sent successfully!")
        } else {
          throw new Error(data.error || "Failed to send test email")
        }
      } catch (error) {
        console.error("Error sending test email:", error)
        showNotification(`Error sending test email: ${error.message}`, "error")
      } finally {
        // Reset button state
        testEmailBtn.disabled = false
        testEmailBtn.innerHTML = "Send Test Email"
      }
    })
  }

  // Show notification
  function showNotification(message, type = "success") {
    const notification = document.createElement("div")
    notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`
    notification.style.top = "20px"
    notification.style.right = "20px"
    notification.style.zIndex = "9999"
    notification.innerHTML = `
      ${message}
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
    `

    document.body.appendChild(notification)

    // Auto-dismiss after 5 seconds
    setTimeout(() => {
      $(notification).alert("close")
    }, 5000)
  }

  // Initialize
  checkAuth()
})
