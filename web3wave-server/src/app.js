import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import companyAuthRoutes from "./routes/company.auth.route.js";
import userRoutes from "./routes/user.route.js";
import { AppError } from "./utils/appError.js";
import logger from "./utils/logger.js";

import config from "./config/environment.js";

const app = express();

const rawOrigins = config.ALLOWED_ORIGINS || "http://localhost:3000,http://127.0.0.1:3000";
const allowedOrigins = rawOrigins
    .split(",")
    .map((origin) => origin.trim().replace(/\/$/, ""))
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            const normalizedOrigin = origin.replace(/\/$/, "");
            if (
                allowedOrigins.includes(normalizedOrigin) ||
                (config.NODE_ENV !== "production" &&
                    (normalizedOrigin.includes("localhost") || normalizedOrigin.includes("127.0.0.1")))
            ) {
                return callback(null, true);
            }
            return callback(new AppError(`Origin ${origin} not allowed by CORS`, 403));
        },
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser());

import mongoose from "mongoose";

app.get("/api/health", (req, res) => {
    res.json({
        status: "ok",
        uptime: process.uptime(),
        database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    });
});

app.use("/api", (req, res, next) => {
    if (req.path === "/health") return next();
    if (mongoose.connection.readyState !== 1) {
        return res.status(503).json({
            success: false,
            message: "Database is currently disconnected. Please verify your MONGODB_URI in web3wave-server/.env",
        });
    }
    next();
});

app.use("/api/auth", authRoutes);
app.use("/api/company/auth", companyAuthRoutes);
app.use("/api/users", userRoutes);

app.use((err, req, res, _next) => {
    const statusCode = err.statusCode || 500;
    const message = (err instanceof AppError)
        ? err.message
        : "Internal server error";

    if (statusCode >= 500) {
        logger.error("Unhandled Error:", err);
    }

    res.status(statusCode).json({
        success: false,
        message,
    });
});

export default app;