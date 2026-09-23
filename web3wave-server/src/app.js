import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import companyAuthRoutes from "./routes/company.auth.route.js";
import userRoutes from "./routes/user.route.js";
import { AppError } from "./utils/appError.js";
import logger from "./utils/logger.js";

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

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