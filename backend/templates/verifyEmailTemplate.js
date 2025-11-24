export const verifyEmailTemplate = ({ fullName, verificationLink }) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify your email</title>
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6fb; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
      .header { background: linear-gradient(135deg, #6a38c2, #5b30a6); padding: 30px; text-align: center; color: white; }
      .body { padding: 30px; color: #333; line-height: 1.6; }
      .btn { display: inline-block; background: #6a38c2; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 20px; }
      .footer { text-align: center; font-size: 12px; color: #888; padding: 20px; border-top: 1px solid #eee; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin:0; font-size:24px;">Email Verification</h1>
      </div>
      <div class="body">
        <p>Hi <strong>${fullName}</strong>,</p>
        <p>Thank you for signing up with <strong>Job Portal</strong>. To create your account, please verify your email address by clicking the button below:</p>
        <div style="text-align: center;">
          <a href="${verificationLink}" class="btn">Verify Email Now</a>
        </div>
        <p style="font-size: 14px; color: #666; margin-top: 20px;">If you did not create an account, you can safely ignore this email.</p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} Job Portal. All rights reserved.<br>
        Need help? Contact us at support@jobportal.com
      </div>
    </div>
  </body>
  </html>
  `;
};