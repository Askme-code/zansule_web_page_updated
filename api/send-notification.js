// This file would be deployed as a serverless function
// on platforms like Vercel, Netlify, or AWS Lambda
const nodemailer = require("nodemailer")

// Environment variables would be set in your hosting platform
const EMAIL_USER = process.env.EMAIL_USER
const EMAIL_PASS = process.env.EMAIL_PASS
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "kimumilangali@gmail.com"

// Create a transporter object using SMTP
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Replace with your SMTP host
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
})

module.exports = async (req, res) => {
  // Set CORS headers for cross-origin requests
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type")

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    return res.status(200).end()
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { type, data } = req.body

    if (!type || !data) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    let subject, html

    // Format email based on submission type
    if (type === "contact") {
      subject = `New Contact Form Submission: ${data.subject}`
      html = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Subject:</strong> ${data.subject}</p>
        <p><strong>Tour Interest:</strong> ${data.tour}</p>
        <h3>Message:</h3>
        <p>${data.message}</p>
        <p>
          <a href="${process.env.WEBSITE_URL || "https://your-website.com"}/admin/index.html">
            View in Admin Dashboard
          </a>
        </p>
      `
    } else if (type === "booking") {
      subject = `New Tour Booking Request: ${data.tourType}`
      html = `
        <h2>New Tour Booking Request</h2>
        <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        <p><strong>Name:</strong> ${data.firstName} ${data.lastName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Country:</strong> ${data.country}</p>
        <h3>Tour Details:</h3>
        <p><strong>Tour:</strong> ${data.tourType}</p>
        <p><strong>Tour Date:</strong> ${data.tourDate}</p>
        <p><strong>Duration:</strong> ${data.tourDuration}</p>
        <p><strong>Guests:</strong> ${data.adults} adults${data.children > 0 ? ` + ${data.children} children` : ""}</p>
        <p><strong>Accommodation:</strong> ${data.accommodation}${data.accommodation === "Yes" ? ` (${data.accommodationType})` : ""}</p>
        <p><strong>Pickup Location:</strong> ${data.pickupLocation}</p>
        ${data.specialRequests ? `<p><strong>Special Requests:</strong> ${data.specialRequests}</p>` : ""}
        <p>
          <a href="${process.env.WEBSITE_URL || "https://your-website.com"}/admin/index.html">
            View in Admin Dashboard
          </a>
        </p>
      `
    } else {
      return res.status(400).json({ error: "Invalid submission type" })
    }

    // Send email
    const info = await transporter.sendMail({
      from: `"Zansule Tour & Safari" <${EMAIL_USER}>`,
      to: ADMIN_EMAIL,
      subject: subject,
      html: html,
    })

    return res.status(200).json({
      message: "Email notification sent successfully",
      messageId: info.messageId,
    })
  } catch (error) {
    console.error("Error sending email notification:", error)
    return res.status(500).json({ error: "Failed to send email notification" })
  }
}
