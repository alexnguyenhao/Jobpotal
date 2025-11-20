// templates/applicantJobTemplate.js

export const applicantJobTemplate = (
  candidateName,
  jobTitle,
  status,
  companyName = "Our Company"
) => {
  const isAccepted = status.toLowerCase() === "accepted";

  // Cấu hình nội dung dựa trên status
  const title = isAccepted ? "Congratulations! 🎉" : "Application Update";
  const color = isAccepted ? "#6A38C2" : "#4a5568"; // Tím (thương hiệu) hoặc Xám
  const subjectText = isAccepted
    ? "Application Accepted"
    : "Application Status Update";

  const messageBody = isAccepted
    ? `
      <p>We are pleased to inform you that your application for the position of <strong>${jobTitle}</strong> at <strong>${companyName}</strong> has been <span style="color: #16a34a; font-weight: bold;">ACCEPTED</span>.</p>
      <p>Our recruitment team was impressed with your profile and we would like to move forward with the next steps.</p>
      <p>Please keep an eye on your email/phone for further instructions from the recruiter.</p>
    `
    : `
      <p>Thank you for your interest in the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
      <p>After careful consideration, we regret to inform you that we will not be moving forward with your application at this time.</p>
      <p>We appreciate the time you took to apply and encourage you to apply for future openings that match your skills.</p>
    `;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #ffffff;">
      
      <div style="text-align: center; padding-bottom: 20px; border-bottom: 1px solid #f0f0f0;">
        <h2 style="color: ${color}; margin: 0;">${title}</h2>
        <p style="color: #666; font-size: 14px; margin-top: 5px;">${subjectText}</p>
      </div>

      <div style="padding: 20px 0; color: #333; line-height: 1.6;">
        <p>Dear <strong>${candidateName}</strong>,</p>
        ${messageBody}
        <br/>
        <p>Best regards,</p>
        <p><strong>${companyName} Recruitment Team</strong></p>
      </div>

      <div style="text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #f0f0f0; font-size: 12px; color: #999;">
        <p>&copy; ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
      </div>
    </div>
  `;
};
