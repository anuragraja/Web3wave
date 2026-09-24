import ICacheRepository from "../contracts/ICacheRepo.js";
import { redisClient } from "../../config/redis.js";
import { AppError } from "../../utils/appError.js";

class RedisCacheRepository extends ICacheRepository {
    async get(key) {
        try {
            const data = await redisClient.get(key);
            if (!data) return null;
            try {
                return JSON.parse(data);
            } catch {
                return data;
            }
        } catch (error) {
            throw new AppError("Failed to get cache", 500, error);
        }
    }

    async set(key, value, ttl) {
        try {
            await redisClient.setEx(key, ttl, JSON.stringify(value));
        } catch (error) {
            throw new AppError("Failed to set cache", 500, error);
        }
    }

    async del(key) {
        try {
            await redisClient.del(key);
        } catch (error) {
            throw new AppError("Failed to delete cache", 500, error);
        }
    }
}

export default RedisCacheRepository;
