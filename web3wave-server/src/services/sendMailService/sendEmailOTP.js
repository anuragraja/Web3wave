import config from "../../config/environment.js";
import logger from "../../utils/logger.js";
const{ BREVO_API_KEY, BREVO_SENDER_MAIL, BREVO_SENDER_NAME } = config;


export async function sendVerificationEmail({ to, name, otp }) {
    const apiKey = BREVO_API_KEY;
    if (!apiKey) {
        logger.error("Brevo API key is not configured");
        throw new Error("Brevo API key is missing");
    }

    const recipientName = name || to.split("@")[0];
    const senderEmail = BREVO_SENDER_MAIL;
    const senderName = BREVO_SENDER_NAME;

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #f4f7f6; margin: 0; padding: 20px; color: #333; }
                .container { max-width: 550px; background: #ffffff; border-radius: 8px; margin: 20px auto; padding: 30px; box-shadow: 0 2px 8px rgba(0,0,0,0.06); }
                .header { text-align: center; border-bottom: 1px solid #eeeeee; padding-bottom: 20px; }
                .header h1 { color: #1a202c; font-size: 24px; margin: 0; }
                .content { padding: 20px 0; text-align: center; }
                .otp-box { font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #3182ce; background: #ebf8ff; padding: 15px 25px; border-radius: 8px; display: inline-block; margin: 20px 0; }
                .footer { text-align: center; font-size: 12px; color: #a0aec0; border-top: 1px solid #eeeeee; padding-top: 15px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Verify Your Email Address</h1>
                </div>
                <div class="content">
                    <p>Hello <strong>${recipientName}</strong>,</p>
                    <p>Thank you for signing up with Web3Wave! Use the following 6-digit OTP code to verify your email address:</p>
                    <div class="otp-box">${otp}</div>
                    <p>This verification code is valid for <strong>5 minutes</strong>. Do not share this code with anyone.</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} ${senderName}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers: {
            "accept": "application/json",
            "api-key": apiKey,
            "content-type": "application/json",
        },
        body: JSON.stringify({
            sender: { name: senderName, email: senderEmail },
            to: [{ email: to, name: recipientName }],
            subject: "Verify your email address - Web3Wave",
            htmlContent,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logger.error("Failed to send verification email via Brevo:", errorData);
        throw new Error("Failed to send verification email");
    }

    logger.info(`Verification OTP sent successfully to ${to}`);
    return true;
}
