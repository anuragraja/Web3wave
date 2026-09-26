import mongoose from "mongoose";
import { EVENT_CATEGORIES, EVENT_STATUS } from "../constants/events.js";

const eventSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        slug: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        category: {
            type: String,
            required: true,
            enum: Object.values(EVENT_CATEGORIES),
            uppercase: true,
            index: true,
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        capacity: {
            type: Number,
            required: true,
            min: 1,
        },
        date: {
            type: Date,
            required: true,
            index: true,
        },
        startTime: {
            type: String,
            required: true,
            trim: true,
        },
        endTime: {
            type: String,
            trim: true,
        },
        location: {
            type: String,
            required: true,
            trim: true,
        },
        organizerName: {
            type: String,
            required: true,
            trim: true,
        },
        organizerEmail: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
        },
        organizerPhone: {
            type: String,
            trim: true,
        },
        poster: {
            type: String,
            trim: true,
        },
        status: {
            type: String,
            enum: Object.values(EVENT_STATUS),
            default: EVENT_STATUS.DRAFT,
            uppercase: true,
            index: true,
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },
    },
    {
        timestamps: true,
    }
);

eventSchema.index({ title: "text", description: "text", location: "text", organizerName: "text" });

export default mongoose.model("Event", eventSchema);
