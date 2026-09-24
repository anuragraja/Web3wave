import express from "express";
import authController from "../controllers/auth.controller.js";
import {
    registerValidator,
    loginValidator,
    googleAuthValidator,
    resetPasswordValidator,
    verifyEmailValidator,
    resendOtpValidator,
    forgotPasswordValidator,
    verifyResetOtpValidator,
    confirmResetPasswordValidator,
    verifyLoginOtpValidator,
    resendLoginOtpValidator,
} from "../middlewares/validators/auth.validator.js";
import { authenticateJWT } from "../middlewares/auth.middleware.js";
import {
    authRateLimiter,
    sensitiveAuthRateLimiter,
} from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/register", sensitiveAuthRateLimiter, registerValidator, authController.register);
router.post("/login", sensitiveAuthRateLimiter, loginValidator, authController.login);
router.post("/verify-login-otp", sensitiveAuthRateLimiter, verifyLoginOtpValidator, authController.verifyLoginOtp);
router.post("/resend-login-otp", sensitiveAuthRateLimiter, resendLoginOtpValidator, authController.resendLoginOtp);
router.post("/google", sensitiveAuthRateLimiter, googleAuthValidator, authController.googleAuth);
router.post("/refresh", authRateLimiter, authController.refreshTokenController);
router.post("/logout", authRateLimiter, authController.logout);

router.post("/verify-email", sensitiveAuthRateLimiter, verifyEmailValidator, authController.verifyEmail);
router.post("/resend-verification", sensitiveAuthRateLimiter, resendOtpValidator, authController.resendVerificationOtp);
router.post("/forgot-password", sensitiveAuthRateLimiter, forgotPasswordValidator, authController.forgotPassword);
router.post("/verify-reset-otp", sensitiveAuthRateLimiter, verifyResetOtpValidator, authController.verifyResetOtp);
router.post("/confirm-reset-password", sensitiveAuthRateLimiter, confirmResetPasswordValidator, authController.confirmResetPassword);

router.put(
    "/reset-password",
    authRateLimiter,
    authenticateJWT,
    resetPasswordValidator,
    authController.resetPassword
);

export default router;
