import sgEmail from "@sendgrid/mail";
import dotenv from "dotenv";
dotenv.config();

sgEmail.setApiKey(process.env.SENDGRID_API_KEY);

const fromEmail = process.env.FROM_EMAIL;
export const sendEmail = async (to, subject, html) => {
  const msg = {
    to,
    from: `JobPortal <${fromEmail}>`,
    subject,
    html,
  };
  try {
    await sgEmail.send(msg);
    console.log("Email sent Successfully");
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    if (error.response) {
      console.error("SendGrid response:", error.response.body);
    }
    return false;
  }
};
