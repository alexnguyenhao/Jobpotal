export const userStatusTemplate = (fullName, email, status) => {
  const isActive = status === "active";
  const title = isActive ? "Account Reactivated 🟢" : "Account Suspended 🔴";
  const headerColor = isActive
    ? "linear-gradient(135deg, #16a34a, #15803d)" // Xanh lá
    : "linear-gradient(135deg, #ef4444, #b91c1c)"; // Đỏ

  const messageBody = isActive
    ? `<p>Good news! Your account associated with <strong>${email}</strong> has been <strong style="color: #16a34a;">REACTIVATED</strong>.</p>
       <p>You can now log in and access all features of our platform normally.</p>`
    : `<p>We regret to inform you that your account associated with <strong>${email}</strong> has been <strong style="color: #ef4444;">SUSPENDED</strong> due to a violation of our terms of service.</p>
       <p>If you believe this is a mistake, please contact our support team.</p>`;

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
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
      <div class="header"><h1 style="margin:0; font-size:24px;">${title}</h1></div>
      <div class="body">
        <p>Dear <strong>${fullName}</strong>,</p>
        ${messageBody}
        <br><p>Best regards,<br><strong>JobPortal Admin Team</strong></p>
      </div>
      <div class="footer">© ${new Date().getFullYear()} JobPortal. All rights reserved.</div>
    </div>
  </body>
  </html>
  `;
};
