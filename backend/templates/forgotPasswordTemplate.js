export const forgotPasswordTemplate = (resetLink, userName = "User") => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Password Reset</title>
    <style>
      body {
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        background-color: #f9f9ff;
        color: #333;
        margin: 0;
        padding: 0;
      }
      .container {
        max-width: 600px;
        margin: 40px auto;
        background-color: #ffffff;
        border-radius: 12px;
        box-shadow: 0 6px 20px rgba(0,0,0,0.08);
        overflow: hidden;
      }
      .header {
        background: linear-gradient(135deg, #6a38c2, #5b30a6);
        color: #fff;
        padding: 24px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
      }
      .body {
        padding: 30px 25px;
        line-height: 1.6;
        font-size: 16px;
        color: #444;
      }
      .footer {
        text-align: center;
        font-size: 13px;
        color: #777;
        border-top: 1px solid #eee;
        padding: 20px;
      }
      @media (max-width: 600px) {
        .body {
          padding: 20px;
        }
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>Password Reset Request</h1>
      </div>
      <div class="body">
        <p>Hi <strong>${userName}</strong>,</p>
        <p>We received a request to reset your password for your Job Portal account.</p>
        <p>Click the button below to set a new password. This link will expire in <strong>1 hour</strong>.</p>

        <p style="text-align:center; margin-top: 30px;">
          <a href="${resetLink}"
             target="_blank"
             rel="noopener noreferrer"
             style="
               display: inline-block;
               background: linear-gradient(135deg, #6a38c2, #5b30a6);
               color: #ffffff;
               text-decoration: none;
               padding: 12px 24px;
               border-radius: 8px;
               font-weight: 600;
               letter-spacing: 0.3px;
               transition: all 0.3s ease;
               font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
             ">
            Reset Password
          </a>
        </p>

        <p>If you didn’t request a password reset, please ignore this email. Your account will remain secure.</p>
        <p>Best regards,<br><strong>The Job Portal Team</strong></p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} Job Portal. All rights reserved.<br />
        This is an automated message. Please do not reply.
      </div>
    </div>
  </body>
  </html>
  `;
};
