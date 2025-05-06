# Email Notification API Deployment Guide

This guide explains how to deploy the email notification API as a serverless function.

## Prerequisites

- A Vercel, Netlify, or AWS account for serverless function hosting
- A Gmail account or other SMTP email provider
- Node.js and npm installed on your local machine

## Deployment Steps

### 1. Set up environment variables

You'll need to set the following environment variables in your hosting platform:

- `EMAIL_USER`: Your SMTP email username (e.g., your Gmail address)
- `EMAIL_PASS`: Your SMTP email password or app password
- `ADMIN_EMAIL`: The email address where notifications should be sent
- `WEBSITE_URL`: The URL of your website (for links in the emails)

### 2. Deploy to Vercel

1. Install the Vercel CLI:
   \`\`\`
   npm install -g vercel
   \`\`\`

2. Navigate to the project directory and run:
   \`\`\`
   vercel
   \`\`\`

3. Follow the prompts to deploy your project.

4. Set environment variables in the Vercel dashboard:
   - Go to your project settings
   - Navigate to the "Environment Variables" section
   - Add the required variables

### 3. Deploy to Netlify

1. Install the Netlify CLI:
   \`\`\`
   npm install -g netlify-cli
   \`\`\`

2. Navigate to the project directory and run:
   \`\`\`
   netlify deploy
   \`\`\`

3. Follow the prompts to deploy your project.

4. Set environment variables in the Netlify dashboard:
   - Go to your site settings
   - Navigate to the "Build & deploy" > "Environment" section
   - Add the required variables

### 4. Update API endpoint in your website code

After deployment, you'll receive a URL for your API endpoint. Update the following files with this URL:

- `script.js`
- `booking.js`
- `gallery.js`
- `admin.js`

Replace `https://your-api-endpoint.com/api/send-notification` with your actual API endpoint URL.

## Testing

1. Log in to your admin dashboard
2. Go to the Settings tab
3. Configure your email notification settings
4. Click the "Send Test Email" button to verify that everything is working

## Troubleshooting

- If you're using Gmail, you may need to create an "App Password" instead of using your regular password
- Make sure your SMTP provider allows sending emails from your serverless function
- Check the function logs in your hosting platform for any errors
