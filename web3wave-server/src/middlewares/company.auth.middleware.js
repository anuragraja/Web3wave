import jwt from "jsonwebtoken";
import config from "../config/environment.js";
import { AppError } from "../utils/appError.js";
import { redisClient } from "../config/redis.js";

export const authenticateCompanyJWT = async (req, _res, next) => {
    try {
        const token =
            req.cookies?.token ||
            req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            throw new AppError("Access denied. No token provided.", 401);
        }

        let isBlacklisted = false;
        try {
            if (redisClient && redisClient.isOpen) {
                isBlacklisted = await redisClient.get(`bl_${token}`);
            }
        } catch (redisErr) {
            // Gracefully ignore Redis error
        }
        if (isBlacklisted) {
            throw new AppError("Token has been logged out.", 401);
        }

        const decoded = jwt.verify(token, config.JWT_SECRET);
        req.companyId = decoded.id;
        req.company = decoded;
        next();
    } catch (error) {
        if (error instanceof AppError) {
            return next(error);
        }
        next(new AppError("Invalid or expired token.", 401));
    }
};
