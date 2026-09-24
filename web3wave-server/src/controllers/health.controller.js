import mongoose from "mongoose";
import { redisClient } from "../config/redis.js";

/**
 * Lightweight public health check endpoint for monitoring services (e.g., UptimeRobot)
 * GET /health or GET /api/health
 */
export const getHealth = (req, res) => {
    res.status(200).json({
        success: true,
        status: "UP",
        service: "API",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
};

/**
 * Deep health check endpoint checking database and Redis dependencies
 * GET /health/deep or GET /api/health/deep
 */
export const getDeepHealth = (req, res) => {
    const dbConnected = mongoose.connection.readyState === 1;
    let redisConnected = false;

    try {
        if (redisClient && redisClient.isOpen) {
            redisConnected = true;
        }
    } catch (_err) {
        redisConnected = false;
    }

    const isHealthy = dbConnected;

    res.status(isHealthy ? 200 : 503).json({
        success: isHealthy,
        status: isHealthy ? "UP" : "DEGRADED",
        service: "API",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        dependencies: {
            database: dbConnected ? "connected" : "disconnected",
            redis: redisConnected ? "connected" : "disconnected",
        },
    });
};

export default {
    getHealth,
    getDeepHealth,
};
