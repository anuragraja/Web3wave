import config from "../../config/environment.js";
import logger from "../../utils/logger.js";
const { BREVO_API_KEY, BREVO_SENDER_MAIL, BREVO_SENDER_NAME } = config;

export async function sendEventNotificationEmail({ to, event }) {
    const apiKey = BREVO_API_KEY;
    if (!apiKey) {
        logger.error("Brevo API key is missing. Skipping event email notification.");
        return false;
    }

    const recipientEmail = to;
    const senderEmail = BREVO_SENDER_MAIL || "notifications@web3wave.in";
    const senderName = BREVO_SENDER_NAME || "Web3Wave Events";

    const formattedDate = event.date
        ? new Date(event.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "TBA";

    const posterHtml = event.poster
        ? `<div style="text-align: center; margin-bottom: 20px;">
             <img src="${event.poster}" alt="${event.title}" style="max-width: 100%; height: auto; border-radius: 12px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
           </div>`
        : "";

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Event: ${event.title}</title>
            <style>
                body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #0d0d12; margin: 0; padding: 20px; color: #e2e8f0; }
                .container { max-width: 580px; background: #13131a; border-radius: 16px; margin: 20px auto; padding: 32px; border: 1px solid #2d2d3a; box-shadow: 0 8px 32px rgba(0,0,0,0.4); }
                .badge { display: inline-block; background-color: rgba(244, 63, 94, 0.15); color: #fb7185; border: 1px solid rgba(244, 63, 94, 0.3); font-size: 11px; font-weight: bold; text-transform: uppercase; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px; }
                .header h1 { color: #ffffff; font-size: 24px; margin: 0 0 8px 0; font-weight: 800; line-height: 1.2; }
                .content { padding: 16px 0; line-height: 1.6; }
                .info-box { background: #1a1a24; border-radius: 12px; border: 1px solid #2e2e3e; padding: 16px; margin: 20px 0; }
                .info-row { display: flex; margin-bottom: 8px; font-size: 13px; }
                .info-label { color: #94a3b8; width: 100px; font-weight: 600; text-transform: uppercase; font-size: 10px; letter-spacing: 0.5px; }
                .info-val { color: #f8fafc; font-weight: 500; }
                .desc { background: #161620; padding: 16px; border-radius: 12px; border-left: 3px solid #f43f5e; color: #cbd5e1; font-size: 14px; margin-top: 16px; }
                .footer { text-align: center; font-size: 12px; color: #64748b; border-top: 1px solid #222230; padding-top: 20px; margin-top: 24px; }
                .btn { display: block; text-align: center; background: linear-gradient(135deg, #f43f5e, #a855f7); color: #ffffff !important; text-decoration: none; font-weight: bold; padding: 14px 24px; border-radius: 12px; margin-top: 24px; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="badge">✨ New Web3Wave Event Published</div>
                <div class="header">
                    <h1>${event.title}</h1>
                </div>
                
                ${posterHtml}

                <div class="content">
                    <p style="color: #94a3b8; font-size: 14px; margin: 0 0 16px 0;">
                        A new session has just been published on the Web3Wave community calendar!
                    </p>

                    <div class="info-box">
                        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
                            <tr>
                                <td style="padding: 6px 0; color: #94a3b8; font-weight: bold; width: 110px;">CATEGORY</td>
                                <td style="padding: 6px 0; color: #f43f5e; font-weight: bold;">${event.category}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #94a3b8; font-weight: bold;">DATE & TIME</td>
                                <td style="padding: 6px 0; color: #ffffff;">${formattedDate} at ${event.startTime || "TBA"}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #94a3b8; font-weight: bold;">VENUE</td>
                                <td style="padding: 6px 0; color: #ffffff;">${event.location}</td>
                            </tr>
                            <tr>
                                <td style="padding: 6px 0; color: #94a3b8; font-weight: bold;">HOST</td>
                                <td style="padding: 6px 0; color: #ffffff;">${event.organizerName}</td>
                            </tr>
                        </table>
                    </div>

                    <div class="desc">
                        <strong>Session Overview:</strong><br />
                        ${event.description}
                    </div>

                    <a href="https://web3wave.in/events" class="btn">View Details & Reserve Your Seat →</a>
                </div>

                <div class="footer">
                    <p>You received this email because you subscribed to Web3Wave event updates.</p>
                    <p>&copy; ${new Date().getFullYear()} ${senderName}. All rights reserved.</p>
                </div>
            </div>
        </body>
        </html>
    `;

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
                to: [{ email: recipientEmail }],
                subject: `🚀 New Event: ${event.title}`,
                htmlContent,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            logger.error(`Failed to send event notification email to ${recipientEmail}:`, errorData);
            return false;
        }

        logger.info(`Event notification email sent successfully to ${recipientEmail}`);
        return true;
    } catch (err) {
        logger.error(`Error sending event email to ${recipientEmail}:`, err);
        return false;
    }
}
