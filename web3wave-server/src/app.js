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
        return res.status(503).json({
            success: false,
            message: "Database is currently disconnected. Please verify your MONGODB_URI in web3wave-server/.env",
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