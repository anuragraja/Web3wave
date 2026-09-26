import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import companyAuthRoutes from "./routes/company.auth.route.js";
import userRoutes from "./routes/user.route.js";
import adminRoutes from "./routes/admin/index.js";
import eventRoutes from "./routes/event.route.js";
import { AppError } from "./utils/appError.js";
import logger from "./utils/logger.js";
import  {corsOptions} from "./config/corsOption.js";

import config from "./config/environment.js";
const {ALLOWED_ORIGINS} = config;

const app = express();

const rawOrigins = ALLOWED_ORIGINS || "http://localhost:3000,http://127.0.0.1:3000";
const allowedOrigins = rawOrigins
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

import healthRoutes from "./routes/health.route.js";
import mongoose from "mongoose";

app.use("/health", healthRoutes);
app.use("/api/health", healthRoutes);

app.use("/api", (req, res, next) => {
    if (req.path === "/health" || req.path.startsWith("/health/")) return next();
    if (mongoose.connection.readyState !== 1) {
        logger.error("Database connection failure: MONGODB_URI is disconnected or unreachable.");
        return res.status(503).json({
            success: false,
            message: "Database service is currently unavailable. Please try again later.",
        });
    }
    next();
});

import subscriberRoutes from "./routes/subscriber.route.js";

app.use("/api/auth", authRoutes);
app.use("/api/company/auth", companyAuthRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/subscribers", subscriberRoutes);


app.use((req, res, _next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

app.use((err, req, res, _next) => {
    const statusCode = err.statusCode || 500;

    if (statusCode >= 500) {
        logger.error("Server Error:", err);
    }

    let message = "Internal server error. Please try again later.";

    if (err instanceof AppError && statusCode < 500) {
        message = err.message;
    } else if (err instanceof AppError && statusCode >= 500) {
        // Sanitize any internal technical strings even if wrapped in AppError
        const isTechnical = /brevo|ip|http|https|mongodb|mongoose|database|sql|redis|econnrefused|timeout|api_key|secret/i.test(err.message);
        message = isTechnical ? "Service temporarily unavailable. Please try again later." : err.message;
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
});

export default app;