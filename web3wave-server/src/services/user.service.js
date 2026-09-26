import MongoUserRepository from "../repositories/implementations/userImplementation.js";
import MongoRoleRepository from "../repositories/implementations/roleImplementation.js";
import RedisCacheRepository from "../repositories/implementations/redisCacheRepository.js";
import { AppError } from "../utils/appError.js";
import jwt from "jsonwebtoken";
import config from "../config/environment.js";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import logger from "../utils/logger.js";
import { ROLES } from "../constants/roles.js";
import crypto from "crypto";
import { sendVerificationEmail } from "./sendMailService/sendEmailOTP.js";
import { sendWelcomeEmail } from "./sendMailService/sendWelcomeEmail.js";
import { sendPasswordResetEmail } from "./sendMailService/sendResetPasswordEmail.js";

const { JWT_SECRET, REFRESH_SECRET, REFRESH_EXPIRES_IN, GOOGLE_ID } = config;

class UserService {
    constructor() {
        this.userRepository = new MongoUserRepository();
        this.roleRepository = new MongoRoleRepository();
        this.cacheRepository = new RedisCacheRepository();
    }

    async saveRefreshToken(userId, refreshToken) {
        await this.cacheRepository.set(
            `refresh:${userId}`,
            refreshToken,
            7 * 24 * 3600,
        );
    }

    _getSafeRole(user) {
        return user.role
            ? {
                _id: user.role._id,
                name: user.role.name,
                description: user.role.description,
            }
            : null;
    }

    _getSafeUserPayload(user) {
        return {
            _id: user._id,
            email: user.email,
            name: user.name,
            number: user.number || user.phoneNumber || null,
            googleId: user.googleId || null,
            role: this._getSafeRole(user),
            isVerified: user.isVerified || false,
        };
    }

    _hashValue(str) {
        return crypto.createHash("sha256").update(str).digest("hex");
    }

    async sendVerificationOtp(email, name) {
        const normalizedEmail = email.toLowerCase().trim();
        const cooldownKey = `email_verify_resend:${normalizedEmail}`;
        const isCooldown = await this.cacheRepository.get(cooldownKey);
        if (isCooldown) {
            throw new AppError("Please wait before requesting another verification code", 429);
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const hashedOtp = this._hashValue(otp);

        await this.cacheRepository.set(`email_verify:${normalizedEmail}`, hashedOtp, 300);
        await this.cacheRepository.set(`email_verify_attempts:${normalizedEmail}`, 0, 300);
        await this.cacheRepository.set(cooldownKey, "1", 60);

        await sendVerificationEmail({ to: normalizedEmail, name, otp, type: "verification" });
        return true;
    }

    async register(userData) {
        const email = userData.email.toLowerCase().trim();
        const cacheKey = `user:email:${email}`;

        const existingUser = await this.userRepository.findUserByEmail(email);

        if (existingUser) {
            throw new AppError("Email already exists", 409);
        }

        const userRole = await this.roleRepository.findOrCreateRole(
            ROLES.USER,
            "Standard User Role"
        );

        const newUserData = {
            name: userData.name,
            email,
            password: userData.password,
            number: userData.number,
            roleId: userRole._id,
            isVerified: false,
        };

        const user = await this.userRepository.createUser(newUserData);
        const userWithRole = await this.userRepository.findUserById(user._id);

        if (!userWithRole) throw new AppError("Failed to fetch created user", 500);

        const safeUser = this._getSafeUserPayload(userWithRole);

        await this.cacheRepository.set(
            `user:id:${userWithRole._id}`,
            JSON.stringify(safeUser),
            3600,
        );
        await this.cacheRepository.set(
            cacheKey,
            JSON.stringify(safeUser),
            3600,
        );

        await this.sendVerificationOtp(safeUser.email, safeUser.name);

        return {
            requiresOtp: true,
            email: safeUser.email,
            message: "Registration successful! A 6-digit verification code has been sent to your email.",
        };
    }

    async verifyEmail({ email, otp }) {
        if (!email || !otp) {
            throw new AppError("Email and OTP are required", 400);
        }
        const normalizedEmail = email.toLowerCase().trim();
        const inputOtp = otp.toString().trim();

        const attemptsKey = `email_verify_attempts:${normalizedEmail}`;
        const attempts = (await this.cacheRepository.get(attemptsKey)) || 0;
        if (Number(attempts) >= 5) {
            throw new AppError("Too many failed attempts. Please request a new verification code.", 429);
        }

        const storedHashedOtp = await this.cacheRepository.get(`email_verify:${normalizedEmail}`);
        if (!storedHashedOtp) {
            throw new AppError("Verification code expired or invalid", 400);
        }

        const inputHashedOtp = this._hashValue(inputOtp);
        if (inputHashedOtp !== storedHashedOtp) {
            await this.cacheRepository.set(attemptsKey, Number(attempts) + 1, 300);
            throw new AppError("Invalid verification code", 400);
        }

        const user = await this.userRepository.findUserByEmail(normalizedEmail);
        if (!user) throw new AppError("User not found", 404);

        await this.userRepository.updateUser(user._id, { isVerified: true });
        await this.cacheRepository.del(`email_verify:${normalizedEmail}`);
        await this.cacheRepository.del(attemptsKey);
        await this.cacheRepository.del(`email_verify_resend:${normalizedEmail}`);
        await this.cacheRepository.del(`user:id:${user._id}`);
        await this.cacheRepository.del(`user:email:${normalizedEmail}`);

        const userWithRole = await this.userRepository.findUserById(user._id);
        const safeUser = this._getSafeUserPayload(userWithRole);

        const jwtPayload = {
            id: safeUser._id,
            email: safeUser.email,
            name: safeUser.name,
            role: safeUser?.role?.name,
            isVerified: true,
        };

        const token = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: "24h" });
        const refreshToken = jwt.sign({ id: userWithRole._id }, REFRESH_SECRET, {
            expiresIn: REFRESH_EXPIRES_IN,
        });

        await this.saveRefreshToken(userWithRole._id, refreshToken);

        try {
            await sendWelcomeEmail({ to: normalizedEmail, name: user.name });
        } catch (error) {
            logger.warn(`Failed to send welcome email to ${normalizedEmail}: ${error.message}`);
        }

        return {
            user: safeUser,
            token,
            refreshToken,
            message: "Email verified successfully! You are now signed in.",
        };
    }

    async resendVerificationOtp({ email }) {
        if (!email) throw new AppError("Email is required", 400);
        const normalizedEmail = email.toLowerCase().trim();
        const user = await this.userRepository.findUserByEmail(normalizedEmail);

        if (!user) {
            return { message: "If an unverified account exists, a new verification code has been sent." };
        }
        if (user.isVerified) {
            throw new AppError("Account email is already verified. Please sign in.", 400);
        }

        await this.sendVerificationOtp(user.email, user.name);
        return { message: "Verification code sent successfully" };
    }

    async login({ email, password }) {
        if (!email || !password) {
            throw new AppError("Invalid credentials", 401);
        }

        const normalizedEmail = email.toLowerCase().trim();
        const user = await this.userRepository.findUserByEmail(normalizedEmail);

        if (!user || !user.password) {
            throw new AppError("Invalid credentials", 401);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new AppError("Invalid credentials", 401);

        const roleName = (typeof user.role === "object" ? user.role?.name : user.role) || "";
        const isAdmin = roleName.toLowerCase() === ROLES.ADMIN.toLowerCase();

        if (isAdmin) {
            const cooldownKey = `login_otp_cooldown:${normalizedEmail}`;
            const isCooldown = await this.cacheRepository.get(cooldownKey);
            if (isCooldown) {
                throw new AppError("A verification code was recently sent. Please wait before requesting another code.", 429);
            }

            const otp = crypto.randomInt(100000, 999999).toString();
            const hashedOtp = this._hashValue(otp);

            await this.cacheRepository.set(`login_otp:${normalizedEmail}`, hashedOtp, 300);
            await this.cacheRepository.set(`login_otp_attempts:${normalizedEmail}`, 0, 300);
            await this.cacheRepository.set(cooldownKey, "1", 60);

            await sendVerificationEmail({
                to: normalizedEmail,
                name: user.name,
                otp,
                type: "login",
            });

            return {
                requiresOtp: true,
                email: normalizedEmail,
                message: "A 6-digit verification code has been sent to your email.",
            };
        }

        const safeUser = this._getSafeUserPayload(user);

        const jwtPayload = {
            id: safeUser._id,
            email: safeUser.email,
            name: safeUser.name,
            role: safeUser?.role?.name,
            isVerified: safeUser?.isVerified,
        };

        const token = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: "24h" });
        const refreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, {
            expiresIn: REFRESH_EXPIRES_IN,
        });

        await this.saveRefreshToken(user._id, refreshToken);

        return {
            user: safeUser,
            token,
            refreshToken,
            message: "Login successful!",
        };
    }

    async verifyLoginOtp({ email, otp }) {
        if (!email || !otp) {
            throw new AppError("Email and OTP are required", 400);
        }

        const normalizedEmail = email.toLowerCase().trim();
        const inputOtp = otp.toString().trim();

        const attemptsKey = `login_otp_attempts:${normalizedEmail}`;
        const attempts = (await this.cacheRepository.get(attemptsKey)) || 0;
        if (Number(attempts) >= 5) {
            throw new AppError("Too many failed attempts. Please request a new verification code.", 429);
        }

        const storedHashedOtp = await this.cacheRepository.get(`login_otp:${normalizedEmail}`);
        if (!storedHashedOtp) {
            throw new AppError("Verification code expired or invalid", 400);
        }

        const inputHashedOtp = this._hashValue(inputOtp);
        if (inputHashedOtp !== storedHashedOtp) {
            await this.cacheRepository.set(attemptsKey, Number(attempts) + 1, 300);
            throw new AppError("Invalid verification code", 400);
        }

        const user = await this.userRepository.findUserByEmail(normalizedEmail);
        if (!user) throw new AppError("User not found", 404);

        await this.cacheRepository.del(`login_otp:${normalizedEmail}`);
        await this.cacheRepository.del(attemptsKey);
        await this.cacheRepository.del(`login_otp_cooldown:${normalizedEmail}`);

        if (!user.isVerified) {
            await this.userRepository.updateUser(user._id, { isVerified: true });
            await this.cacheRepository.del(`user:id:${user._id}`);
            await this.cacheRepository.del(`user:email:${normalizedEmail}`);
        }

        const userWithRole = await this.userRepository.findUserById(user._id);
        if (!userWithRole) throw new AppError("Failed to authenticate user", 500);

        const safeUser = this._getSafeUserPayload(userWithRole);

        const jwtPayload = {
            id: safeUser._id,
            email: safeUser.email,
            name: safeUser.name,
            role: safeUser?.role?.name,
            isVerified: true,
        };

        const token = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: "24h" });
        const refreshToken = jwt.sign({ id: userWithRole._id }, REFRESH_SECRET, {
            expiresIn: REFRESH_EXPIRES_IN,
        });

        await this.saveRefreshToken(userWithRole._id, refreshToken);

        return {
            user: safeUser,
            token,
            refreshToken,
            message: "Login successful!",
        };
    }

    async resendLoginOtp({ email }) {
        if (!email) throw new AppError("Email is required", 400);
        const normalizedEmail = email.toLowerCase().trim();
        const user = await this.userRepository.findUserByEmail(normalizedEmail);

        if (!user) {
            return { message: "If an account exists, a new verification code has been sent." };
        }

        const cooldownKey = `login_otp_cooldown:${normalizedEmail}`;
        const isCooldown = await this.cacheRepository.get(cooldownKey);
        if (isCooldown) {
            throw new AppError("Please wait before requesting another verification code", 429);
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const hashedOtp = this._hashValue(otp);

        await this.cacheRepository.set(`login_otp:${normalizedEmail}`, hashedOtp, 300);
        await this.cacheRepository.set(`login_otp_attempts:${normalizedEmail}`, 0, 300);
        await this.cacheRepository.set(cooldownKey, "1", 60);

        await sendVerificationEmail({
            to: normalizedEmail,
            name: user.name,
            otp,
            type: "login",
        });

        return { message: "A new verification code has been sent to your email." };
    }

    async forgotPassword({ email }) {
        if (!email) throw new AppError("Email is required", 400);
        const normalizedEmail = email.toLowerCase().trim();
        const genericMessage = "If an account exists for this email, a verification code has been sent.";

        const user = await this.userRepository.findUserByEmail(normalizedEmail);
        if (!user) {
            return { message: genericMessage };
        }

        const cooldownKey = `password_reset_resend:${normalizedEmail}`;
        const isCooldown = await this.cacheRepository.get(cooldownKey);
        if (isCooldown) {
            return { message: genericMessage };
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const hashedOtp = this._hashValue(otp);

        await this.cacheRepository.set(`password_reset:${normalizedEmail}`, hashedOtp, 300);
        await this.cacheRepository.set(`password_reset_attempts:${normalizedEmail}`, 0, 300);
        await this.cacheRepository.set(cooldownKey, "1", 60);

        try {
            await sendPasswordResetEmail({ to: normalizedEmail, name: user.name, otp });
        } catch (error) {
            logger.warn(`Failed to send password reset email to ${normalizedEmail}: ${error.message}`);
        }

        return { message: genericMessage };
    }

    async resendResetOtp({ email }) {
        if (!email) throw new AppError("Email is required", 400);
        return await this.forgotPassword({ email });
    }

    async verifyResetOtp({ email, otp }) {
        if (!email || !otp) {
            throw new AppError("Email and OTP are required", 400);
        }
        const normalizedEmail = email.toLowerCase().trim();
        const inputOtp = otp.toString().trim();

        const attemptsKey = `password_reset_attempts:${normalizedEmail}`;
        const attempts = (await this.cacheRepository.get(attemptsKey)) || 0;
        if (Number(attempts) >= 5) {
            throw new AppError("Too many failed attempts. Please request a new password reset code.", 429);
        }

        const storedHashedOtp = await this.cacheRepository.get(`password_reset:${normalizedEmail}`);
        if (!storedHashedOtp) {
            throw new AppError("Reset code expired or invalid", 400);
        }

        const inputHashedOtp = this._hashValue(inputOtp);
        if (inputHashedOtp !== storedHashedOtp) {
            await this.cacheRepository.set(attemptsKey, Number(attempts) + 1, 300);
            throw new AppError("Invalid reset code", 400);
        }

        await this.cacheRepository.del(`password_reset:${normalizedEmail}`);
        await this.cacheRepository.del(attemptsKey);
        await this.cacheRepository.del(`password_reset_resend:${normalizedEmail}`);

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedResetToken = this._hashValue(resetToken);

        await this.cacheRepository.set(`reset_auth:${normalizedEmail}`, hashedResetToken, 600);

        return { message: "Reset code verified successfully", resetToken };
    }

    async confirmResetPassword({ email, resetToken, newPassword }) {
        if (!email || !resetToken || !newPassword) {
            throw new AppError("Email, resetToken, and newPassword are required", 400);
        }
        const normalizedEmail = email.toLowerCase().trim();
        const storedHashedToken = await this.cacheRepository.get(`reset_auth:${normalizedEmail}`);

        if (!storedHashedToken) {
            throw new AppError("Password reset authorization expired or invalid", 400);
        }

        const inputHashedToken = this._hashValue(resetToken.trim());
        if (inputHashedToken !== storedHashedToken) {
            throw new AppError("Invalid password reset authorization token", 400);
        }

        const user = await this.userRepository.findUserByEmail(normalizedEmail);
        if (!user) throw new AppError("User not found", 404);

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await this.userRepository.updateUser(user._id, { password: hashedPassword });

        await this.cacheRepository.del(`reset_auth:${normalizedEmail}`);
        await this.cacheRepository.del(`refresh:${user._id}`);
        await this.cacheRepository.del(`user:id:${user._id}`);
        await this.cacheRepository.del(`user:email:${normalizedEmail}`);

        return { message: "Password reset successfully. Please sign in." };
    }

    async googleAuth({ idToken }) {
        if (!idToken) throw new AppError("Google ID token is required", 400);

        let googlePayload;
        try {
            const response = await fetch(
                `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
            );
            if (!response.ok) {
                throw new Error("Token validation request failed");
            }
            googlePayload = await response.json();
        } catch (error) {
            throw new AppError("Invalid or expired Google authentication token", 401);
        }

        if (!googlePayload || !googlePayload.sub || !googlePayload.email) {
            throw new AppError("Invalid Google user payload", 401);
        }

        if (googlePayload.email_verified !== "true" && googlePayload.email_verified !== true) {
            throw new AppError("Google account email is not verified", 401);
        }

        if (GOOGLE_ID) {
            const allowedGoogleIds = GOOGLE_ID.split(",").map((id) => id.trim()).filter(Boolean);
            if (allowedGoogleIds.length > 0 && !allowedGoogleIds.includes(googlePayload.aud)) {
                logger.error(`Google client ID mismatch: received ${googlePayload.aud}`);
                throw new AppError("Unauthorized: Google Client ID mismatch", 401);
            }
        }

        const googleId = googlePayload.sub;
        const email = googlePayload.email.toLowerCase().trim();
        const name = googlePayload.name || email.split("@")[0];

        let userWithRole = await this.userRepository.findUserByGoogleId(googleId);

        if (!userWithRole) {
            userWithRole = await this.userRepository.findUserByEmail(email);

            if (userWithRole) {
                await this.userRepository.updateUser(userWithRole._id, {
                    googleId,
                    isVerified: true,
                });
                userWithRole = await this.userRepository.findUserById(userWithRole._id);
            } else {
                const userRole = await this.roleRepository.findOrCreateRole(
                    ROLES.USER,
                    "Standard User Role"
                );

                try {
                    const newUser = await this.userRepository.createUser({
                        email,
                        name,
                        googleId,
                        roleId: userRole._id,
                        isVerified: true,
                    });

                    userWithRole = await this.userRepository.findUserById(newUser._id);

                    try {
                        await sendWelcomeEmail({ to: email, name });
                    } catch (emailErr) {
                        logger.warn(`Failed to send welcome email to Google user ${email}: ${emailErr.message}`);
                    }
                } catch (createError) {
                    if (createError.statusCode === 409 || createError.code === 11000) {
                        userWithRole = await this.userRepository.findUserByEmail(email);
                        if (userWithRole) {
                            await this.userRepository.updateUser(userWithRole._id, {
                                googleId,
                                isVerified: true,
                            });
                            userWithRole = await this.userRepository.findUserById(userWithRole._id);
                        }
                    } else {
                        throw createError;
                    }
                }
            }
        }

        if (!userWithRole) {
            throw new AppError("Failed to authenticate Google user", 500);
        }

        const safeUser = this._getSafeUserPayload(userWithRole);

        const jwtPayload = {
            id: safeUser._id,
            email: safeUser.email,
            name: safeUser.name,
            role: safeUser?.role?.name,
            isVerified: safeUser?.isVerified,
        };

        const token = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: "24h" });
        const refreshToken = jwt.sign({ id: userWithRole._id }, REFRESH_SECRET, {
            expiresIn: REFRESH_EXPIRES_IN,
        });

        try {
            await this.saveRefreshToken(userWithRole._id, refreshToken);
        } catch (redisErr) {
            logger.warn(`Failed to cache refresh token in Redis for user ${safeUser._id}: ${redisErr.message}`);
        }

        return {
            user: safeUser,
            token,
            refreshToken,
        };
    }

    async refresh(refreshToken) {
        if (!refreshToken) throw new AppError("Unauthorized", 401);

        let payload;
        try {
            payload = jwt.verify(refreshToken, REFRESH_SECRET);
        } catch (err) {
            throw new AppError("Invalid refresh token", 401);
        }

        const stored = await this.cacheRepository.get(`refresh:${payload.id}`);
        if (!stored || stored !== refreshToken) {
            throw new AppError("Invalid refresh token", 401);
        }

        const user = await this.userRepository.findUserById(payload.id);
        if (!user) throw new AppError("User not found", 404);

        const jwtPayload = {
            id: user._id,
            email: user.email,
            isVerified: user.isVerified,
        };

        if (user.role) {
            jwtPayload.role = this._getSafeRole(user);
        }

        const token = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: "24h" });

        const newRefreshToken = jwt.sign({ id: user._id }, REFRESH_SECRET, {
            expiresIn: REFRESH_EXPIRES_IN,
        });

        await this.saveRefreshToken(user._id, newRefreshToken);

        return { token, refreshToken: newRefreshToken };
    }

    async getUser(id) {
        const cacheKey = `user:id:${id}`;
        const cached = await this.cacheRepository.get(cacheKey);

        if (cached) {
            return JSON.parse(cached);
        }

        const user = await this.userRepository.findUserById(id);
        if (!user) throw new AppError("User not found", 404);

        const safeUser = this._getSafeUserPayload(user);
        await this.cacheRepository.set(cacheKey, JSON.stringify(safeUser), 3600);
        return safeUser;
    }

    async getAllUsers(page = 1, limit = 10, search = "") {
        const result = await this.userRepository.findAllUsers(page, limit, search);
        return result;
    }
    async updateUser(id, userData) {
        const user = await this.userRepository.updateUser(id, userData);
        if (!user) throw new AppError("User not found", 404);
        const safeUser = this._getSafeUserPayload(user);
        await this.cacheRepository.set(
            `user:id:${id}`,
            JSON.stringify(safeUser),
            3600,
        );

        if (userData.email && userData.email !== user.email) {
            await this.cacheRepository.del(`user:email:${userData.email}`);
        }
        await this.cacheRepository.set(
            `user:email:${user.email}`,
            JSON.stringify(safeUser),
            3600,
        );

        return safeUser;
    }

    async updateMe(userId, updates) {
        if (!userId) throw new AppError("Unauthorized", 401);

        const updated = await this.userRepository.updateUser(userId, updates);
        if (!updated) throw new AppError("User not found", 404);

        const safeUser = this._getSafeUserPayload(updated);

        await this.cacheRepository.set(
            `user:id:${userId}`,
            JSON.stringify(safeUser),
            3600,
        );

        const oldEmailKey = updates.email ? `user:email:${updates.email}` : null;

        await this.cacheRepository.set(
            `user:email:${updated.email}`,
            JSON.stringify({ ...safeUser, password: updated.password }),
            3600,
        );

        if (oldEmailKey && updates.email !== updated.email) {
            await this.cacheRepository.del(oldEmailKey);
        }

        return safeUser;
    }

    async deleteUser(userId) {
        return User.findByIdAndDelete(userId);
    }

    async resetPassword(userId, oldPassword, newPassword) {
        const user = await this.userRepository.findUserById(userId, {
            select: "+password",
        });
        if (!user) throw new AppError("User not found", 404);

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) throw new AppError("Old password is incorrect", 400);

        const hashed = await bcrypt.hash(newPassword, 10);

        await this.userRepository.updateUser(userId, { password: hashed });

        await this.cacheRepository.del(`user:id:${userId}`);
        await this.cacheRepository.del(`user:email:${user.email}`);

        return true;
    }

    async findUser(query) {
        const users = await this.userRepository.findUser(query);
        return users;
    }
    async updateUserRole(userId, newRoleId) {
       
        await this.userRepository.updateUser(userId, { roleId: newRoleId });

      
        const updatedUser = await this.userRepository.findUserById(userId, true);

        if (!updatedUser) {
            throw new AppError("User not found", 404);
        }

      
        const safeUser = {
            _id: updatedUser._id,
            email: updatedUser.email,
            name: updatedUser.name,
            number: updatedUser.number,
            isVerified: updatedUser.isVerified,
            role: updatedUser.roleId
                ? { _id: updatedUser.roleId._id, name: updatedUser.roleId.name }
                : null,
        };
        await this.cacheRepository.set(
            `user:id:${userId}`,
            JSON.stringify(safeUser),
            3600,
        );

        await this.cacheRepository.set(
            `user:email:${updatedUser.email}`,
            JSON.stringify(safeUser),
            3600,
        );

        return safeUser;
    }


  
    async blastUsers({ userIds, subject, message }) {
        if (!userIds || userIds.length === 0) {
            throw new AppError("No users selected", 400);
        }

        const users = await this.userRepository.findUsersByIds(userIds);

        if (!users || users.length === 0) {
            throw new AppError("No users found", 404);
        }

        let successCount = 0;
        const validUsers = users.filter((u) => u.email);

        const apiKey = config.BREVO_API_KEY;
        const senderEmail = config.BREVO_SENDER_MAIL || "aakashredon@gmail.com";
        const senderName = config.BREVO_SENDER_NAME || "Web3Wave";

        await Promise.all(
            validUsers.map(async (user) => {
                try {
                    if (apiKey) {
                        await fetch("https://api.brevo.com/v3/smtp/email", {
                            method: "POST",
                            headers: {
                                accept: "application/json",
                                "api-key": apiKey,
                                "content-type": "application/json",
                            },
                            body: JSON.stringify({
                                sender: { name: senderName, email: senderEmail },
                                to: [{ email: user.email, name: user.name || user.email.split("@")[0] }],
                                subject,
                                htmlContent: `<div><p>Hello ${user.name || "Builder"},</p><p>${message}</p></div>`,
                            }),
                        });
                    }
                    successCount++;
                } catch (error) {
                    logger.error(`Failed sending blast email to ${user.email}:`, error);
                }
            })
        );

        logger.info(`Blast processed for ${successCount} users`);

        return {
            message: `Blast sent successfully to ${successCount} users.`,
        };
    }

}

export default UserService;
