import config from "../../config/environment.js";
import logger from "../../utils/logger.js";
import { AppError } from "../../utils/appError.js";

const { BREVO_API_KEY, BREVO_SENDER_MAIL, BREVO_SENDER_NAME, NODE_ENV } = config;

export async function sendVerificationEmail({ to, name, otp, type = "verification" }) {
    const apiKey = BREVO_API_KEY;
    if (!apiKey) {
        logger.error("Brevo API key is not configured in environment variables (BREVO_API_KEY).");
        throw new AppError("Email service is temporarily unavailable. Please configure BREVO_API_KEY.", 503);
    }

    const recipientName = name || to.split("@")[0];
    const senderEmail = BREVO_SENDER_MAIL || "aakashredon@gmail.com";
    const senderName = BREVO_SENDER_NAME || "Web3Wave";

    const isLogin = type === "login";
    const title = isLogin ? "Login Verification Code" : "Verify Your Email Address";
    const subject = isLogin
        ? "Your Web3Wave Login Verification Code"
        : "Verify your email address - Web3Wave";
    const introText = isLogin
        ? "You requested to sign in to Web3Wave. Use the following 6-digit OTP code to complete your login:"
        : "Thank you for joining Web3Wave! Use the following 6-digit OTP code to verify your email address:";

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0c0d12; margin: 0; padding: 20px; color: #f4f4f5; }
                .container { max-width: 540px; background: #18181b; border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 16px; margin: 20px auto; padding: 32px; box-shadow: 0 8px 30px rgba(0,0,0,0.5); }
                .header { text-align: center; border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 24px; }
                .brand { font-size: 22px; font-weight: 800; color: #f43f5e; letter-spacing: -0.5px; }
                .title { color: #ffffff; font-size: 20px; font-weight: 700; margin: 12px 0 0; }
                .content { padding: 24px 0; text-align: center; }
                .message { font-size: 14px; line-height: 1.6; color: #a1a1aa; margin-bottom: 24px; text-align: left; }
                .otp-box { font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #ffffff; background: linear-gradient(135deg, rgba(244,63,94,0.15), rgba(244,63,94,0.05)); border: 1px solid rgba(244,63,94,0.3); padding: 18px 28px; border-radius: 12px; display: inline-block; margin: 12px 0 20px; font-family: monospace; }
                .expiry { font-size: 13px; color: #71717a; margin-top: 10px; }
                .warning { font-size: 12px; color: #ef4444; margin-top: 16px; }
                .footer { text-align: center; font-size: 11px; color: #52525b; border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 20px; margin-top: 24px; font-family: monospace; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="brand">Web3Wave</div>
                    <div class="title">${title}</div>
                </div>
                <div class="content">
                    <p class="message">Hello <strong>${recipientName}</strong>,<br><br>${introText}</p>
                    <div class="otp-box">${otp}</div>
                    <p class="expiry">This verification code expires in <strong>5 minutes</strong>.</p>
                    <p class="warning">If you did not request this code, please ignore this email or secure your account.</p>
                </div>
                <div class="footer">
                    <p>&copy; ${new Date().getFullYear()} ${senderName}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    try {
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
                subject,
                htmlContent,
            }),
            signal: controller.signal,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            const errMsg = errorData?.message || response.statusText;
            if (errMsg.includes("unrecognised IP address") || errMsg.includes("authorised_ips")) {
                const ipMatch = errMsg.match(/(?:\d{1,3}\.){3}\d{1,3}|(?:[0-9a-fA-F]{1,4}:){2,7}[0-9a-fA-F]{1,4}/);
                const ip = ipMatch ? ipMatch[0] : "";
                logger.error(`Brevo IP Whitelist Error: ${errMsg}. Please authorize your IP at https://app.brevo.com/security/authorised_ips`);
                throw new AppError(
                    `Brevo email service requires IP authorization (${ip}). Please add your IP to https://app.brevo.com/security/authorised_ips`,
                    502
                );
            } else {
                logger.error("Failed to send verification email via Brevo:", errorData);
            }
            throw new AppError(`Failed to send verification email: ${errMsg}`, 502);
        }

        logger.info(`Verification OTP (${type}) sent successfully to ${to}`);
        return true;
    } catch (error) {
        if (error.name === "AbortError") {
            logger.error("Brevo request timed out after 10000ms");
            throw new AppError("Email service timed out. Please try again.", 504);
        }
        throw error;
    } finally {
        clearTimeout(timeout);
    }
}
