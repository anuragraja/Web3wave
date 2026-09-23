import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true,
            index: true,
        },

        password: {
            type: String,
            select: false,
        },
        number: {
            type: String,
            required: false,
            sparse: true,
            trim: true,
        },

        roleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Role",
            index: true,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

       
        googleId: {
            type: String,
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

userSchema.pre("save", async function () {
    if (!this.isModified("password") || !this.password) return;

    this.password = await bcrypt.hash(this.password, 10);
});




export default mongoose.model("User", userSchema);