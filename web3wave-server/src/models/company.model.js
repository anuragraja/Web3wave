import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const companySchema = new mongoose.Schema(
    {
        companyName: {
            type: String,
            required: true,
            trim: true,
            minlength: 2,
            maxlength: 100,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            required: true, 
            select: false,

        },
        isVerified: {
            type: Boolean,
            default: false,
        },

        resetPasswordToken: {
            type: String,
        },

        resetPasswordExpires: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

companySchema.pre("save", async function () {
    if (!this.isModified("password") || !this.password) return;

    this.password = await bcrypt.hash(this.password, 10);
});


export default mongoose.model("Company", companySchema);