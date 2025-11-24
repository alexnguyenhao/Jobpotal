export const twoFactorAuthTemplate = (otp) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>2FA Verification Code</title>
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6fb; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05); }
      .header { background: linear-gradient(135deg, #6a38c2, #5b30a6); padding: 24px; text-align: center; color: #ffffff; }
      .content { padding: 30px 24px; text-align: center; color: #333333; }
      .otp-box { background-color: #f0f0f0; border-radius: 8px; padding: 16px; margin: 24px 0; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #6a38c2; display: inline-block; }
      .footer { background-color: #f9f9f9; padding: 16px; text-align: center; font-size: 12px; color: #888888; border-top: 1px solid #eeeeee; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin:0; font-size: 24px;">Login Verification</h1>
      </div>
      <div class="content">
        <p style="font-size: 16px; margin-bottom: 20px;">Here is your One-Time Password (OTP) to verify your identity:</p>
        
        <div class="otp-box">${otp}</div>
        
        <p style="color: #dc2626; font-size: 14px; margin-top: 20px;">This code expires in <strong>5 minutes</strong>.</p>
        <p style="font-size: 14px; color: #666;">If you did not request this code, please ignore this email or contact support immediately.</p>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} Job Portal. All rights reserved.
      </div>
    </div>
  </body>
  </html>
  `;
};