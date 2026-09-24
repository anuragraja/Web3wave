import app from "./src/app.js";
import config from "./src/config/environment.js";
import { connectRedis } from "./src/config/redis.js";
import { connectDB } from "./src/config/db.js";
import logger from "./src/utils/logger.js";

const { PORT } = config;

async function startServer() {
    try {
        try {
            await connectDB();
        } catch (dbError) {
            logger.warn("⚠️ MongoDB connection failed on boot. Server is listening on port " + PORT + " with /api/health available.");
            logger.warn("👉 Please update MONGODB_URI with valid Atlas credentials in web3wave-server/.env.");
        }

        try {
            await connectRedis();
        } catch (redisError) {
            logger.warn("⚠️ Redis initialization failed: " + redisError.message);
        }

        app.listen(PORT, () => {
            logger.info(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        logger.error("Fatal error starting server:", error);
    }
}

startServer();
