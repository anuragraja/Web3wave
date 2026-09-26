import AuthService from "../services/auth.service.js";
import { AppError } from "../utils/appError.js";
import { redisClient } from "../config/redis.js";

const authService = new AuthService();

export const authenticateJWT = async (req, res, next) => {
    try {
        const token =
            req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "");
        if (!token) {
            throw new AppError("Access denied. No token provided.", 401);
        }

        let isBlacklisted = false;
        try {
            if (redisClient && redisClient.isOpen) {
                isBlacklisted = await redisClient.get(`bl_${token}`);
            }
        } catch (redisErr) {
            // Gracefully ignore Redis failure for blacklist check if Redis is down
        }
        if (isBlacklisted) {
            throw new AppError("Token has been logged out.", 401);
        }

        const decoded = authService.verifyToken(token);
        req.userId = decoded.id || decoded.userId;
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError("Invalid or expired token.", 401));
    }
};
