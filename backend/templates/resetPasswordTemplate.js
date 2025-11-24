export const resetPasswordTemplate = (fullName, resetLink) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <title>Reset Password</title>
    <style>
      body { font-family: 'Segoe UI', sans-serif; background-color: #f4f6fb; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.05); overflow: hidden; }
      .header { background: linear-gradient(135deg, #6a38c2, #5b30a6); padding: 24px; text-align: center; color: white; }
      .body { padding: 30px; color: #333; line-height: 1.6; }
      .btn { display: inline-block; background: #6a38c2; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; }
      .footer { text-align: center; font-size: 12px; color: #888; padding: 20px; border-top: 1px solid #eee; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin:0; font-size:24px;">Password Reset</h1>
      </div>
      <div class="body">
        <p>Hi <strong>${fullName}</strong>,</p>
        <p>You have requested to reset your password. Click the link below to proceed:</p>
        <div style="text-align: center; margin: 25px 0;">
          <a href="${resetLink}" class="btn">Reset Password</a>
        </div>
        <p>This link is valid for 1 hour.</p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} Job Portal. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};