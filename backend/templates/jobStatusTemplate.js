export const jobStatusTemplate = (
  recruiterName,
  jobTitle,
  status, // "open" hoặc "closed"
  reason = ""
) => {
  const currentStatus = status?.toLowerCase() || "";

  let title = "";
  let headerColor = "";
  let statusText = "";
  let statusColor = "";
  let messageContent = "";

  switch (currentStatus) {
    case "open":
      title = "Job Posting Reopened ✅";
      headerColor = "linear-gradient(135deg, #16a34a, #15803d)";
      statusText = "OPEN";
      statusColor = "#16a34a";
      messageContent = `
        <p>Good news! Your job posting <strong>"${jobTitle}"</strong> has been <strong style="color:${statusColor};">REOPENED</strong> by the administrator.</p>
        <p>Candidates can now view and apply for this job on the platform.</p>
        <p>You can manage applications directly from your dashboard.</p>
      `;
      break;

    case "closed":
      title = "Job Posting Closed 🔒";
      headerColor = "linear-gradient(135deg, #4b5563, #374151)";
      statusText = "CLOSED";
      statusColor = "#4b5563";
      messageContent = `
        <p>Your job posting <strong>"${jobTitle}"</strong> has been <strong style="color:${statusColor};">CLOSED</strong>.</p>
        <p>This job is no longer accepting new applications.</p>
        ${
          reason
            ? `<div style="background-color:#f3f4f6; border-left:4px solid #4b5563; padding:10px; margin:15px 0;">
                <strong>Reason:</strong> ${reason}
               </div>`
            : ""
        }
      `;
      break;

    default:
      title = "Job Status Update";
      headerColor = "linear-gradient(135deg, #6366f1, #4f46e5)";
      statusText = status.toUpperCase();
      statusColor = "#6366f1";
      messageContent = `
        <p>The status of your job <strong>"${jobTitle}"</strong> has been updated to 
        <strong style="color:${statusColor};">${statusText}</strong>.</p>
      `;
  }

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background-color: #f4f6fb; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; 
                     box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden; }
        .header { background: ${headerColor}; padding: 30px; text-align: center; color: white; }
        .body { padding: 30px; color: #333; line-height: 1.6; }
        .footer { text-align: center; font-size: 12px; color: #888; padding: 20px; background: #f9f9f9; }
        .btn { display: inline-block; padding: 10px 20px; background-color: ${statusColor}; color: white; 
               text-decoration: none; border-radius: 5px; margin-top: 15px; font-weight: bold; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="margin:0; font-size:24px;">${title}</h1>
        </div>
        <div class="body">
          <p>Dear <strong>${recruiterName}</strong>,</p>
          ${messageContent}
          <br>
          <p>Best regards,<br><strong>JobPortal Admin Team</strong></p>
        </div>
        <div class="footer">
          © ${new Date().getFullYear()} JobPortal. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;
};
