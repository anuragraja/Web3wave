import express from "express";
import {
    register,
    verifyEmail,
    resendVerification,
    login,
    forgotPassword,
    verifyResetOtp,
    confirmResetPassword,
    refreshToken,
    logout,
} from "../controllers/company.auth.controller.js";
import {
    registerCompanyValidator,
    loginCompanyValidator,
    verifyCompanyEmailValidator,
    resendCompanyVerificationValidator,
    forgotCompanyPasswordValidator,
    verifyCompanyResetOtpValidator,
    confirmCompanyResetPasswordValidator,
} from "../middlewares/validators/company.auth.validation.js";
import {
    authRateLimiter,
    sensitiveAuthRateLimiter,
} from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/register", sensitiveAuthRateLimiter, registerCompanyValidator, register);
router.post("/verify-email", sensitiveAuthRateLimiter, verifyCompanyEmailValidator, verifyEmail);
router.post("/resend-verification", sensitiveAuthRateLimiter, resendCompanyVerificationValidator, resendVerification);
router.post("/login", sensitiveAuthRateLimiter, loginCompanyValidator, login);
router.post("/forgot-password", sensitiveAuthRateLimiter, forgotCompanyPasswordValidator, forgotPassword);
router.post("/verify-reset-otp", sensitiveAuthRateLimiter, verifyCompanyResetOtpValidator, verifyResetOtp);
router.post("/confirm-reset-password", sensitiveAuthRateLimiter, confirmCompanyResetPasswordValidator, confirmResetPassword);
router.post("/refresh", authRateLimiter, refreshToken);
router.post("/logout", authRateLimiter, logout);

export default router;
