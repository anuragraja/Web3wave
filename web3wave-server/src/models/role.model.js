import mongoose from "mongoose";
import { ROLES } from "../constants/roles.js";

const roleSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        enum: [ROLES.ADMIN, ROLES.USER],
        lowercase: true,
        index: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

export default mongoose.model("Role", roleSchema);