import UserService from "../services/user.service.js";
import { AppError } from "../utils/appError.js";
import AuthService from "../services/auth.service.js";
import { redisClient } from "../config/redis.js";
import config from "../config/environment.js";
import jwt from "jsonwebtoken";

const isProduction = config.NODE_ENV === "production";
const getCookieOptions = (maxAge) => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    ...(maxAge ? { maxAge } : {}),
});

class AuthController {
    constructor() {
        this.userService = new UserService();
        this.authService = new AuthService();
    }

    refreshTokenController = async (req, res, next) => {
        try {
            const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;
            if (!refreshToken) throw new AppError("Unauthorized", 401);

            const tokens = await this.userService.refresh(refreshToken);

            res.cookie("token", tokens.token, getCookieOptions(24 * 60 * 60 * 1000));
            res.cookie("refreshToken", tokens.refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));

            res.status(200).json({ success: true, data: tokens });
        } catch (err) {
            next(err);
        }
    };

    register = async (req, res, next) => {
        try {
            const userData = req.body;
            const result = await this.userService.register(userData);
            if (result.token) {
                res.cookie("token", result.token, getCookieOptions(24 * 60 * 60 * 1000));
                res.cookie("refreshToken", result.refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
            }

            res.status(201).json({ success: true, data: result, ...result });
        } catch (error) {
            next(error);
        }
    };

    login = async (req, res, next) => {
        try {
            const { email, password } = req.body;
            const result = await this.userService.login({ email, password });
            if (result.token) {
                res.cookie("token", result.token, getCookieOptions(24 * 60 * 60 * 1000));
                res.cookie("refreshToken", result.refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
            }

            res.status(200).json({ success: true, data: result, ...result });
        } catch (error) {
            next(error);
        }
    };

    googleAuth = async (req, res, next) => {
        try {
            const { idToken } = req.body;
            const result = await this.userService.googleAuth({ idToken });
            res.cookie("token", result.token, getCookieOptions(24 * 60 * 60 * 1000));
            res.cookie("refreshToken", result.refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));

            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };

    getUser = async (req, res, next) => {
        try {
            const { id } = req.params;
            const user = await this.userService.getUser(id);
            res.status(200).json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    };

    updateUser = async (req, res, next) => {
        try {
            const { id } = req.params;
            const userData = req.body;
            const user = await this.userService.updateUser(id, userData);
            res.status(200).json({ success: true, data: user });
        } catch (error) {
            next(error);
        }
    };

    logout = async (req, res, next) => {
        try {
            const token =
                req.cookies?.token ||
                req.header("Authorization")?.replace("Bearer ", "");
            const refreshToken =
                req.cookies?.refreshToken || req.body?.refreshToken;

            if (token) {
                try {
                    const decoded = this.authService.verifyToken(token);
                    const exp = decoded.exp * 1000;
                    const ttl = Math.floor((exp - Date.now()) / 1000);
                    if (ttl > 0) {
                        await redisClient.setEx(`bl_${token}`, ttl, "blacklisted");
                    }
                    const userId = decoded.id || decoded.userId;
                    if (userId) {
                        await redisClient.del(`refresh:${userId}`);
                    }
                } catch {
                    // Ignore expired or invalid token during logout
                }
            }

            if (refreshToken) {
                try {
                    const decodedRefresh = jwt.verify(refreshToken, config.REFRESH_SECRET);
                    if (decodedRefresh?.id) {
                        await redisClient.del(`refresh:${decodedRefresh.id}`);
                    }
                } catch {
                    // Ignore invalid refresh token during logout
                }
            }

            const clearOptions = {
                httpOnly: true,
                secure: isProduction,
                sameSite: isProduction ? "none" : "lax",
            };

            res.clearCookie("token", clearOptions);
            res.clearCookie("refreshToken", clearOptions);

            res
                .status(200)
                .json({ success: true, message: "Logged out successfully" });
        } catch (error) {
            next(error);
        }
    };

    resetPassword = async (req, res, next) => {
        try {
            const { oldPassword, newPassword } = req.body;

            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized",
                });
            }

            const result = await this.userService.resetPassword(
                userId,
                oldPassword,
                newPassword
            );

            if (result) {
                return res.status(200).json({
                    success: true,
                    message: "Password updated successfully",
                });
            }
        } catch (error) {
            if (error.message === "Old password is incorrect") {
                return res.status(401).json({ success: false, message: error.message });
            }
            next(error);
        }
    };

    verifyEmail = async (req, res, next) => {
        try {
            const { email, otp } = req.body;
            const result = await this.userService.verifyEmail({ email, otp });
            if (result.token) {
                res.cookie("token", result.token, getCookieOptions(24 * 60 * 60 * 1000));
                res.cookie("refreshToken", result.refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
            }
            res.status(200).json({ success: true, data: result, ...result });
        } catch (error) {
            next(error);
        }
    };

    verifyLoginOtp = async (req, res, next) => {
        try {
            const { email, otp } = req.body;
            const result = await this.userService.verifyLoginOtp({ email, otp });
            if (result.token) {
                res.cookie("token", result.token, getCookieOptions(24 * 60 * 60 * 1000));
                res.cookie("refreshToken", result.refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
            }
            res.status(200).json({ success: true, data: result, ...result });
        } catch (error) {
            next(error);
        }
    };

    resendLoginOtp = async (req, res, next) => {
        try {
            const { email } = req.body;
            const result = await this.userService.resendLoginOtp({ email });
            res.status(200).json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    };

    resendVerificationOtp = async (req, res, next) => {
        try {
            const { email } = req.body;
            const result = await this.userService.resendVerificationOtp({ email });
            res.status(200).json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    };

    forgotPassword = async (req, res, next) => {
        try {
            const { email } = req.body;
            const result = await this.userService.forgotPassword({ email });
            res.status(200).json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    };

    verifyResetOtp = async (req, res, next) => {
        try {
            const { email, otp } = req.body;
            const result = await this.userService.verifyResetOtp({ email, otp });
            res.status(200).json({ success: true, data: result });
        } catch (error) {
            next(error);
        }
    };

    confirmResetPassword = async (req, res, next) => {
        try {
            const { email, resetToken, newPassword } = req.body;
            const result = await this.userService.confirmResetPassword({
                email,
                resetToken,
                newPassword,
            });
            res.status(200).json({ success: true, ...result });
        } catch (error) {
            next(error);
        }
    };
}

export default new AuthController();
