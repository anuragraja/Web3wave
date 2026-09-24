import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many requests from this IP, please try again after 15 minutes",
    },
});

export const sensitiveAuthRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: process.env.NODE_ENV === "test" ? 1000 : 50,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        success: false,
        message: "Too many sensitive authentication attempts from this IP, please try again after 15 minutes",
    },
});
