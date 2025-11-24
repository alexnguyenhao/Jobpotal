export const jobApplicationSuccessTemplate = (candidateName, jobTitle, companyName, jobsUrl = "#") => {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Application Received</title>
    <style>
      body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f6fb; margin: 0; padding: 0; }
      .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
      .header { background: linear-gradient(135deg, #6a38c2, #5b30a6); padding: 30px; text-align: center; color: white; }
      .body { padding: 30px; color: #333; line-height: 1.6; }
      .job-card { background-color: #f8f9fa; border-left: 4px solid #6a38c2; padding: 15px; margin: 20px 0; border-radius: 4px; }
      .btn { display: inline-block; background: #6a38c2; color: white; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold; margin-top: 10px; }
      .footer { text-align: center; font-size: 12px; color: #888; padding: 20px; border-top: 1px solid #eee; background: #f9f9f9; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1 style="margin:0; font-size:24px;">Application Received! 🚀</h1>
      </div>
      <div class="body">
        <p>Hi <strong>${candidateName}</strong>,</p>
        <p>Good news! We have successfully received your application for the following position:</p>
        
        <div class="job-card">
          <p style="margin: 0; font-weight: bold; font-size: 18px; color: #333;">${jobTitle}</p>
          <p style="margin: 5px 0 0; color: #666;">at ${companyName}</p>
        </div>

        <p><strong>What happens next?</strong></p>
        <p>The recruitment team at <strong>${companyName}</strong> will review your profile. If your qualifications match their requirements, they will contact you directly via email or phone.</p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="${jobsUrl}" class="btn">Browse More Jobs</a>
        </div>
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} Job Portal. All rights reserved.<br>
        Good luck with your job search!
      </div>
    </div>
  </body>
  </html>
  `;
};