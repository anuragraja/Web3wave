/**
 * Utility to sanitize error messages before presenting them in UI components.
 * Prevents internal backend errors, IP addresses, stack traces, and database/vendor details
 * from being exposed directly to end users.
 */

const TECHNICAL_PATTERNS = [
  // IP addresses & URLs
  /(?:\d{1,3}\.){3}\d{1,3}/,
  /(?:[0-9a-fA-F]{1,4}:){2,7}[0-9a-fA-F]{1,4}/,
  /https?:\/\//i,
  
  // Third-party email services & infra
  /brevo/i,
  /sendinblue/i,
  /authorised_ips/i,
  /authorised/i,
  /api_key/i,
  /smtp/i,
  /mailgun/i,
  /sendgrid/i,
  
  // Database & ORM error indicators
  /mongo/i,
  /mongoose/i,
  /duplicate key/i,
  /e11000/i,
  /prisma/i,
  /sql/i,
  /sequelize/i,
  
  // System / Runtime / Code error patterns
  /econnrefused/i,
  /etimedout/i,
  /enotfound/i,
  /cannot read property/i,
  /is not defined/i,
  /is not a function/i,
  /syntaxerror/i,
  /typeerror/i,
  /referenceerror/i,
  /node_modules/i,
  /stack trace/i,
  /at\s+[a-z0-9_$.]+\s+\(/i,
  /\.env/i,
  /mongodb_uri/i,
  /jwt_secret/i,
  /502 bad gateway/i,
  /503 service unavailable/i,
  /504 gateway timeout/i,
];

export function sanitizeErrorMessage(
  rawMessage: string | null | undefined,
  fallbackMessage: string = "An unexpected error occurred. Please try again."
): string {
  if (!rawMessage || typeof rawMessage !== "string") {
    return fallbackMessage;
  }

  const trimmed = rawMessage.trim();
  if (!trimmed) return fallbackMessage;

  // Check if raw message contains technical/sensitive patterns
  const isTechnical = TECHNICAL_PATTERNS.some((pattern) => pattern.test(trimmed));

  if (isTechnical) {
    if (/brevo|mail|smtp|sendinblue/i.test(trimmed)) {
      return "Email service is temporarily unavailable. Please try again later.";
    }
    if (/econnrefused|etimedout|enotfound|network error/i.test(trimmed)) {
      return "Unable to connect to service. Please check your internet connection or try again later.";
    }
    if (/mongo|mongoose|e11000|duplicate key/i.test(trimmed)) {
      if (/duplicate key/i.test(trimmed) || /e11000/i.test(trimmed)) {
        return "An account with this information already exists.";
      }
      return "Database error. Please try again later.";
    }
    return fallbackMessage;
  }

  return trimmed;
}
