import mongoose from "mongoose";

const eventRegistrationSchema = new mongoose.Schema(
    {
        eventId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Event",
            required: true,
            index: true,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
            index: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            index: true,
        },
        role: {
            type: String,
            default: "Developer",
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

eventRegistrationSchema.index({ eventId: 1, email: 1 }, { unique: true });

export default mongoose.model("EventRegistration", eventRegistrationSchema);
