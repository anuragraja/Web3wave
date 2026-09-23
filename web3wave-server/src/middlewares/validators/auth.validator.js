import Joi from "joi";
import { AppError } from "../../utils/appError.js";

const registerSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "A valid email address is required",
        "any.required": "Email is required",
    }),
    password: Joi.string().min(4).required().messages({
        "string.min": "Password must be at least 4 characters long",
        "any.required": "Password is required",
    }),
    name: Joi.string().required().messages({
        "any.required": "Name is required",
    }),
    number: Joi.string().min(10).required().messages({
        "string.min": "Phone number must be at least 10 digits long",
        "any.required": "Phone number is required",
    }),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "A valid email address is required",
        "any.required": "Email is required",
    }),
    password: Joi.string().required().messages({
        "any.required": "Password is required",
    }),
});

const googleAuthSchema = Joi.object({
    idToken: Joi.string().required().messages({
        "any.required": "Google ID token is required",
        "string.empty": "Google ID token is required",
    }),
});

const resetPasswordSchema = Joi.object({
    oldPassword: Joi.string().required().messages({
        "any.required": "Old password is required",
        "string.empty": "Old password is required",
    }),
    newPassword: Joi.string().required().messages({
        "any.required": "New password is required",
        "string.empty": "New password is required",
    }),
});

const verifyEmailSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "A valid email address is required",
        "any.required": "Email is required",
    }),
    otp: Joi.string().length(6).pattern(/^\d+$/).required().messages({
        "string.length": "OTP must be exactly 6 digits",
        "string.pattern.base": "OTP must contain only digits",
        "any.required": "OTP is required",
    }),
});

const resendOtpSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "A valid email address is required",
        "any.required": "Email is required",
    }),
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "A valid email address is required",
        "any.required": "Email is required",
    }),
});

const verifyResetOtpSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "A valid email address is required",
        "any.required": "Email is required",
    }),
    otp: Joi.string().length(6).pattern(/^\d+$/).required().messages({
        "string.length": "OTP must be exactly 6 digits",
        "string.pattern.base": "OTP must contain only digits",
        "any.required": "OTP is required",
    }),
});

const confirmResetPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "A valid email address is required",
        "any.required": "Email is required",
    }),
    resetToken: Joi.string().required().messages({
        "any.required": "Reset authorization token is required",
    }),
    newPassword: Joi.string().min(4).required().messages({
        "string.min": "Password must be at least 4 characters long",
        "any.required": "New password is required",
    }),
});

const validate = (schema) => (req, res, next) => {
    const { error } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
    if (error) {
        return next(
            new AppError(error.details.map((d) => d.message).join(", "), 400)
        );
    }
    next();
};

export const registerValidator = validate(registerSchema);
export const loginValidator = validate(loginSchema);
export const googleAuthValidator = validate(googleAuthSchema);
export const resetPasswordValidator = validate(resetPasswordSchema);
export const verifyEmailValidator = validate(verifyEmailSchema);
export const resendOtpValidator = validate(resendOtpSchema);
export const forgotPasswordValidator = validate(forgotPasswordSchema);
export const verifyResetOtpValidator = validate(verifyResetOtpSchema);
export const confirmResetPasswordValidator = validate(confirmResetPasswordSchema);
