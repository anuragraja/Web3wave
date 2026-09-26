import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        frequency: {
            type: String,
            default: "Every New Event",
            trim: true,
        },
        isSubscribed: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Subscriber", subscriberSchema);
