export const applicantJobTemplate = (
  candidateName,
  jobTitle,
  status,
  companyName = "Our Company"
) => {
  const isAccepted = status.toLowerCase() === "accepted";
  const statusColor = isAccepted ? "#16a34a" : "#64748b";
  const title = isAccepted ? "Application Accepted! 🎉" : "Application Update";
  const headerColor = isAccepted 
    ? "linear-gradient(135deg, #16a34a, #15803d)" // Gradient Xanh lá
    : "linear-gradient(135deg, #64748b, #475569)"; // Gradient Xám

  const messageBody = isAccepted
    ? `<p>We are pleased to inform you that your application for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been <strong style="color: #16a34a;">ACCEPTED</strong>.</p>
       <p>Our recruitment team was impressed with your profile. We will contact you shortly with the next steps.</p>`
    : `<p>Thank you for your interest in the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
       <p>After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.</p>
       <p>We encourage you to apply for future openings that match your skills.</p>`;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
      body { font-family: 'Segoe UI', sans-serif; background-color: #f4f6fb; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden; }
      .header { background: ${headerColor}; padding: 30px; text-align: center; color: white; }
      .body { padding: 30px; color: #333; line-height: 1.6; }
      .footer { text-align: center; font-size: 12px; color: #888; padding: 20px; background: #f9f9f9; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin:0; font-size:24px;">${title}</h1>
      </div>
      <div class="body">
        <p>Dear <strong>${candidateName}</strong>,</p>
        ${messageBody}
        <br>
        <p>Best regards,<br><strong>${companyName} Recruitment Team</strong></p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} ${companyName}. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};