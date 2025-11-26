export const companyStatusTemplate = (
  recruiterName,
  companyName,
  isVerified
) => {
  // Xác định trạng thái để đổi màu và tiêu đề
  const isApproved = isVerified; // true = Active, false = Inactive

  // Tiêu đề Email
  const title = isApproved ? "Company Verified! 🚀" : "Company Deactivated ⚠️";

  // Màu Gradient Header:
  // - Approved: Xanh lá (giống Accepted cũ)
  // - Deactivated: Đỏ (Cảnh báo)
  const headerColor = isApproved
    ? "linear-gradient(135deg, #16a34a, #15803d)" // Xanh lá
    : "linear-gradient(135deg, #ef4444, #b91c1c)"; // Đỏ

  // Nội dung Email
  const messageBody = isApproved
    ? `<p>We are pleased to inform you that your company profile <strong>${companyName}</strong> has been successfully <strong style="color: #16a34a;">VERIFIED</strong> by our administrators.</p>
       <p>You now have full access to recruit talents, post unlimited jobs, and manage applications on our platform.</p>
       <p>Start posting your first job today!</p>`
    : `<p>We are writing to inform you that your company profile <strong>${companyName}</strong> has been <strong style="color: #ef4444;">DEACTIVATED</strong> by the administrator.</p>
       <p>This action effectively pauses your ability to post new jobs or interact with candidates.</p>
       <p>If you believe this is a mistake or need more information, please reply to this email.</p>`;

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
        <p>Dear <strong>${recruiterName}</strong>,</p>
        ${messageBody}
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
