export const resetPasswordTemplate = (fullName, resetLink) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      ... (Copy phần style của bạn vào đây) ...
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>Password Reset Request</h1></div>
        <div class="body">
          <p>Hi <strong>${fullName}</strong>,</p>
          <p>Click the button below to reset password. Valid for 1 hour.</p>
          <a href="${resetLink}" class="button">Reset Password</a>
        </div>
        ...
      </div>
    </body>
    </html>
  `;
};
