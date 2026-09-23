import mongoose from "mongoose";
import config from "./environment.js";
import Role from "../models/role.model.js";
import { ROLES } from "../constants/roles.js";

const { MONGODB_URI } = config;

export async function connectDB() {
    await mongoose.connect(MONGODB_URI);
    console.log("MongoDB connected successfully");

    await Role.findOneAndUpdate(
        { name: ROLES.USER },
        { name: ROLES.USER, description: "Standard User Role" },
        { upsert: true, new: true }
    );
    await Role.findOneAndUpdate(
        { name: ROLES.ADMIN },
        { name: ROLES.ADMIN, description: "Administrator Role" },
        { upsert: true, new: true }
    );
}

