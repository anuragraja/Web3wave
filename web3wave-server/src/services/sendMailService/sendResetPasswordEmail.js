import config from "../../config/environment.js";
import logger from "../../utils/logger.js";
const { BREVO_API_KEY, BREVO_SENDER_MAIL, BREVO_SENDER_NAME } = config;

export async function sendPasswordResetEmail({ to, name, otp }) {
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
                .header h1 { color: #c53030; font-size: 24px; margin: 0; }
                .content { padding: 20px 0; text-align: center; }
                .otp-box { font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #c53030; background: #fff5f5; padding: 15px 25px; border-radius: 8px; display: inline-block; margin: 20px 0; }
                .warning { font-size: 13px; color: #718096; margin-top: 15px; }
                .footer { text-align: center; font-size: 12px; color: #a0aec0; border-top: 1px solid #eeeeee; padding-top: 15px; margin-top: 20px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>Password Reset Request</h1>
                </div>
                <div class="content">
                    <p>Hello <strong>${recipientName}</strong>,</p>
                    <p>We received a request to reset your password for your Web3Wave account. Use the following 6-digit code to proceed:</p>
                    <div class="otp-box">${otp}</div>
                    <p>This code is valid for <strong>5 minutes</strong>.</p>
                    <p class="warning">If you did not request a password reset, please ignore this email or contact support if you have concerns.</p>
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
            subject: "Reset your password - Web3Wave",
            htmlContent,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        logger.error("Failed to send password reset email via Brevo:", errorData);
        throw new Error("Failed to send password reset email");
    }

    logger.info(`Password reset OTP sent successfully to ${to}`);
    return true;
}
