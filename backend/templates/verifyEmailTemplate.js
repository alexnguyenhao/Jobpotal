export const verifyEmailTemplate = ({ fullName, verificationLink }) => {
  const appName = "JobPortal";
  const supportEmail = "support@yourdomain.com";
  const companyAddress = "123 Main St, City, Country";

  return `
  <!DOCTYPE html>
  <html lang="en">
  <head><meta charset="UTF-8"><title>${appName} – Verify your email</title></head>
  <body style="background:#f4f6fb; font-family:Arial,sans-serif;">
    <div style="max-width:600px;margin:0 auto;background:white;padding:24px;border-radius:12px;">
      <h2 style="color:#111827;">Hi ${fullName},</h2>
      <p>Please verify your email by clicking the button below:</p>
      <p style="text-align:center;">
        <a href="${verificationLink}" 
           style="background:#6d28d9;color:white;padding:12px 24px;
                  border-radius:8px;text-decoration:none;font-weight:bold;">
          Verify Email
        </a>
      </p>
      <p style="font-size:13px;color:#555;">
        If you did not create a ${appName} account, you can safely ignore this message.
      </p>
      <hr style="border:none;border-top:1px solid #eee;margin:20px 0;" />
      <p style="font-size:12px;color:#999;text-align:center;">
        © ${new Date().getFullYear()} ${appName} • ${companyAddress}<br/>
        Need help? Contact us at <a href="mailto:${supportEmail}">${supportEmail}</a>
      </p>
    </div>
  </body>
  </html>
  `;
};
