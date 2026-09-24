import mongoose from "mongoose";
import config from "./environment.js";
import Role from "../models/role.model.js";
import { ROLES } from "../constants/roles.js";
import logger from "../utils/logger.js";

const { MONGODB_URI } = config;

let isEventListenersAttached = false;

function attachConnectionListeners() {
    if (isEventListenersAttached) return;
    isEventListenersAttached = true;

    mongoose.connection.on("connected", () => {
        logger.info("MongoDB connection established.");
    });

    mongoose.connection.on("error", (err) => {
        logger.error(`MongoDB runtime connection error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
        logger.warn("MongoDB disconnected. Mongoose will automatically attempt reconnection.");
    });
}

export async function connectDB() {
    if (!MONGODB_URI) {
        throw new Error("MONGODB_URI is not configured in environment variables (.env).");
    }

    attachConnectionListeners();

    try {
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
            maxPoolSize: 10,
            minPoolSize: 2,
        });

        logger.info("MongoDB connected successfully");

        // Seed default roles idempotently with modern returnDocument option
        await Role.findOneAndUpdate(
            { name: ROLES.USER },
            { name: ROLES.USER, description: "Standard User Role" },
            { upsert: true, returnDocument: "after" }
        );
        await Role.findOneAndUpdate(
            { name: ROLES.ADMIN },
            { name: ROLES.ADMIN, description: "Administrator Role" },
            { upsert: true, returnDocument: "after" }
        );
    } catch (error) {
        logger.error(`MongoDB connection failed: ${error.message}`);
        if (error.message.includes("bad auth") || error.message.includes("Authentication failed")) {
            logger.error("MongoDB Atlas authentication failed. Please update MONGODB_URI with valid Atlas credentials in .env");
        }
        throw error;
    }
}
