import Joi from "joi";
import { AppError } from "../../utils/appError.js";

const registerCompanySchema = Joi.object({
    companyName: Joi.string().min(2).max(100).required().messages({
        "string.min": "Company name must be at least 2 characters long",
        "string.max": "Company name cannot exceed 100 characters",
        "any.required": "Company name is required",
    }),
    email: Joi.string().email().required().messages({
        "string.email": "A valid company email address is required",
        "any.required": "Company email is required",
    }),
    phone: Joi.string().min(7).max(20).messages({
        "string.min": "Phone number must be at least 7 characters long",
        "string.max": "Phone number cannot exceed 20 characters",
    }),
    number: Joi.string().min(7).max(20).messages({
        "string.min": "Phone number must be at least 7 characters long",
        "string.max": "Phone number cannot exceed 20 characters",
    }),
    website: Joi.string().allow("", null),
    role: Joi.string().allow("", null),
    password: Joi.string().min(6).required().messages({
        "string.min": "Password must be at least 6 characters long",
        "any.required": "Password is required",
    }),
}).or("phone", "number").messages({
    "object.missing": "Phone number is required",
});

const loginCompanySchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "A valid company email address is required",
        "any.required": "Company email is required",
    }),
    password: Joi.string().required().messages({
        "any.required": "Password is required",
    }),
});

const verifyCompanyEmailSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "A valid company email address is required",
        "any.required": "Company email is required",
    }),
    otp: Joi.string().length(6).pattern(/^\d+$/).required().messages({
        "string.length": "OTP must be exactly 6 digits",
        "string.pattern.base": "OTP must contain only digits",
        "any.required": "OTP is required",
    }),
});

const resendCompanyVerificationSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "A valid company email address is required",
        "any.required": "Company email is required",
    }),
});

const forgotCompanyPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "A valid company email address is required",
        "any.required": "Company email is required",
    }),
});

const verifyCompanyResetOtpSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "A valid company email address is required",
        "any.required": "Company email is required",
    }),
    otp: Joi.string().length(6).pattern(/^\d+$/).required().messages({
        "string.length": "OTP must be exactly 6 digits",
        "string.pattern.base": "OTP must contain only digits",
        "any.required": "OTP is required",
    }),
});

const confirmCompanyResetPasswordSchema = Joi.object({
    email: Joi.string().email().required().messages({
        "string.email": "A valid company email address is required",
        "any.required": "Company email is required",
    }),
    resetToken: Joi.string().required().messages({
        "any.required": "Reset authorization token is required",
    }),
    newPassword: Joi.string().min(6).required().messages({
        "string.min": "New password must be at least 6 characters long",
        "any.required": "New password is required",
    }),
});

const validate = (schema) => (req, _res, next) => {
    if (req.body && !req.body.phone && req.body.number) {
        req.body.phone = req.body.number;
    }
    const { error, value } = schema.validate(req.body, {
        abortEarly: false,
        stripUnknown: true,
    });
    if (error) {
        return next(
            new AppError(error.details.map((d) => d.message).join(", "), 400)
        );
    }
    req.body = value;
    if (!req.body.phone && req.body.number) {
        req.body.phone = req.body.number;
    }
    next();
};

export const registerCompanyValidator = validate(registerCompanySchema);
export const loginCompanyValidator = validate(loginCompanySchema);
export const verifyCompanyEmailValidator = validate(verifyCompanyEmailSchema);
export const resendCompanyVerificationValidator = validate(resendCompanyVerificationSchema);
export const forgotCompanyPasswordValidator = validate(forgotCompanyPasswordSchema);
export const verifyCompanyResetOtpValidator = validate(verifyCompanyResetOtpSchema);
export const confirmCompanyResetPasswordValidator = validate(confirmCompanyResetPasswordSchema);
export const verifyCompanyLoginOtpValidator = validate(verifyCompanyEmailSchema);
export const resendCompanyLoginOtpValidator = validate(resendCompanyVerificationSchema);

