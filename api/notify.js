export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { title, date, category, location_name, contact_email, submitter_name, time, description } = req.body

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + process.env.RESEND_API_KEY,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'onboarding@resend.dev',
      to: 'rockwallcountyevents@gmail.com',
      subject: 'New Event Submission: ' + title,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: #111827; padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 20px;">New Event Submission</h1>
            <p style="color: #9ca3af; margin: 4px 0 0 0;">Rockwall County Events</p>
          </div>
          <div style="background: #f9fafb; padding: 24px; border-radius: 0 0 12px 12px; border: 1px solid #e5e7eb;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase; width: 140px;">Event Name</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #111827; font-weight: 600;">${title}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase;">Date</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #111827;">${date}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase;">Time</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #111827;">${time || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase;">Category</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #111827;">${category}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase;">Location</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #111827;">${location_name || 'Not specified'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase;">Submitted By</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #111827;">${submitter_name || 'Anonymous'}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase;">Contact Email</td>
                <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; color: #111827;">${contact_email}</td>
              </tr>
              ${description ? `
              <tr>
                <td style="padding: 10px; font-weight: bold; color: #6b7280; font-size: 12px; text-transform: uppercase; vertical-align: top;">Description</td>
                <td style="padding: 10px; color: #111827;">${description}</td>
              </tr>
              ` : ''}
            </table>
            <div style="margin-top: 24px; text-align: center;">
              <a href="https://www.rockwallcountyevents.com/admin" style="background: #111827; color: white; padding: 12px 32px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">
                Review in Admin Panel
              </a>
            </div>
          </div>
        </div>
      `
    })
  })

  if (response.ok) {
    return res.status(200).json({ success: true })
  } else {
    const error = await response.text()
    console.error('Resend error:', error)
    return res.status(500).json({ error: 'Failed to send email' })
  }
}
