import crypto from "crypto";
import dns from "dns/promises";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { AppError } from "../utils/appError.js";
import config from "../config/environment.js";
import logger from "../utils/logger.js";
import MongoCompanyRepository from "../repositories/implementations/companyAuthImplementation.js";
import RedisCacheRepository from "../repositories/implementations/redisCacheRepository.js";
import { sendVerificationEmail } from "./sendMailService/sendEmailOTP.js";
import { sendWelcomeEmail } from "./sendMailService/sendWelcomeEmail.js";
import { sendPasswordResetEmail } from "./sendMailService/sendResetPasswordEmail.js";

const FREE_EMAIL_DOMAINS = new Set([
    "gmail.com",
    "yahoo.com",
    "outlook.com",
    "hotmail.com",
    "icloud.com",
    "aol.com",
    "zoho.com",
    "protonmail.com",
    "gmx.com",
    "yandex.com",
    "live.com",
    "mail.com",
]);

const DISPOSABLE_EMAIL_DOMAINS = new Set([
    "10minutemail.com",
    "temp-mail.org",
    "mailinator.com",
    "guerrillamail.com",
    "trashmail.com",
    "dispostable.com",
    "getnada.com",
    "tempmail.net",
    "yopmail.com",
    "sharklasers.com",
    "throwawaymail.com",
    "maildrop.cc",
]);

const { JWT_SECRET, REFRESH_SECRET, REFRESH_EXPIRES_IN } = config;

class CompanyAuthService {
    constructor() {
        this.companyRepository = new MongoCompanyRepository();
        this.cacheRepository = new RedisCacheRepository();
    }

    _hashValue(str) {
        return crypto.createHash("sha256").update(str).digest("hex");
    }

    async _validateCompanyDomain(email) {
        const domain = email.split("@")[1]?.toLowerCase();
        if (!domain) {
            throw new AppError("Invalid email domain format", 400);
        }

        if (FREE_EMAIL_DOMAINS.has(domain)) {
            throw new AppError(
                "Personal/free email addresses are not permitted for company registration. Please use an official company domain email.",
                400
            );
        }

        if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
            throw new AppError(
                "Disposable email addresses are not permitted.",
                400
            );
        }

        try {
            const mxRecords = await dns.resolveMx(domain);
            if (!mxRecords || mxRecords.length === 0) {
                throw new AppError(
                    "The email domain does not have valid MX records and cannot receive emails.",
                    400
                );
            }
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError(
                "Unable to verify domain MX records. Please ensure domain is valid.",
                400
            );
        }
    }

    async sendVerificationOtp(email, companyName) {
        const normalizedEmail = email.toLowerCase().trim();
        const cooldownKey = `company_email_verify_resend:${normalizedEmail}`;
        const isCooldown = await this.cacheRepository.get(cooldownKey);
        if (isCooldown) {
            throw new AppError(
                "Please wait before requesting another verification code",
                429
            );
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const hashedOtp = this._hashValue(otp);

        await this.cacheRepository.set(
            `company_email_verify:${normalizedEmail}`,
            hashedOtp,
            300
        );
        await this.cacheRepository.set(
            `company_email_verify_attempts:${normalizedEmail}`,
            0,
            300
        );
        await this.cacheRepository.set(cooldownKey, "1", 60);

        await sendVerificationEmail({
            to: normalizedEmail,
            name: companyName,
            otp,
            type: "verification",
        });
        return true;
    }

    async register({ companyName, email, phone, password }) {
        const normalizedEmail = email.toLowerCase().trim();

        await this._validateCompanyDomain(normalizedEmail);

        const existingCompany =
            await this.companyRepository.findCompanyByEmail(normalizedEmail);

        if (existingCompany) {
            throw new AppError(
                "This company email is already registered.",
                409
            );
        }

        const company = await this.companyRepository.createCompany({
            companyName: companyName.trim(),
            email: normalizedEmail,
            phone: phone.trim(),
            password,
            isVerified: false,
        });

        if (!company) {
            throw new AppError("Failed to create company account", 500);
        }

        await this.sendVerificationOtp(normalizedEmail, company.companyName);

        return {
            requiresOtp: true,
            email: normalizedEmail,
            message:
                "Company registered successfully! A 6-digit verification code has been sent to your business email.",
        };
    }

    async verifyEmail({ email, otp }) {
        if (!email || !otp) {
            throw new AppError("Company email and OTP are required", 400);
        }

        const normalizedEmail = email.toLowerCase().trim();
        const inputOtp = otp.toString().trim();

        const attemptsKey = `company_email_verify_attempts:${normalizedEmail}`;
        const attempts = (await this.cacheRepository.get(attemptsKey)) || 0;
        if (Number(attempts) >= 5) {
            throw new AppError(
                "Too many failed attempts. Please request a new verification code.",
                429
            );
        }

        const storedHashedOtp = await this.cacheRepository.get(
            `company_email_verify:${normalizedEmail}`
        );
        if (!storedHashedOtp) {
            throw new AppError("Verification code expired or invalid", 400);
        }

        const inputHashedOtp = this._hashValue(inputOtp);
        if (inputHashedOtp !== storedHashedOtp) {
            await this.cacheRepository.set(attemptsKey, Number(attempts) + 1, 300);
            throw new AppError("Invalid verification code", 400);
        }

        const company =
            await this.companyRepository.findCompanyByEmail(normalizedEmail);

        if (!company) {
            throw new AppError("Company account not found", 404);
        }

        const updatedCompany = await this.companyRepository.updateCompany(
            company._id,
            { isVerified: true }
        );

        if (!updatedCompany) {
            throw new AppError("Failed to verify company email", 500);
        }

        await this.cacheRepository.del(
            `company_email_verify:${normalizedEmail}`
        );
        await this.cacheRepository.del(attemptsKey);
        await this.cacheRepository.del(
            `company_email_verify_resend:${normalizedEmail}`
        );

        const jwtPayload = {
            id: updatedCompany._id,
            email: updatedCompany.email,
            companyName: updatedCompany.companyName,
            role: "company",
            isVerified: true,
        };

        const token = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: "24h" });
        const refreshToken = jwt.sign(
            { id: updatedCompany._id, type: "company" },
            REFRESH_SECRET,
            { expiresIn: REFRESH_EXPIRES_IN || "7d" }
        );

        await this.cacheRepository.set(
            `refresh:company:${updatedCompany._id}`,
            refreshToken,
            7 * 24 * 3600
        );

        try {
            await sendWelcomeEmail({
                to: normalizedEmail,
                name: updatedCompany.companyName,
            });
        } catch (error) {
            logger.warn(
                `Failed to send welcome email to company ${normalizedEmail}: ${error.message}`
            );
        }

        return {
            company: {
                id: updatedCompany._id,
                companyName: updatedCompany.companyName,
                email: updatedCompany.email,
                phone: updatedCompany.phone,
            },
            token,
            refreshToken,
            message: "Company email verified successfully! Welcome to Web3Wave.",
        };
    }

    async resendVerification(email) {
        if (!email) throw new AppError("Company email is required", 400);

        const normalizedEmail = email.toLowerCase().trim();
        const company =
            await this.companyRepository.findCompanyByEmail(normalizedEmail);

        if (!company) {
            return {
                message:
                    "If an unverified company account exists, a new verification code has been sent.",
            };
        }
        if (company.isVerified) {
            throw new AppError("Company email is already verified. Please sign in.", 400);
        }

        await this.sendVerificationOtp(company.email, company.companyName);

        return { message: "Verification code sent successfully" };
    }

    async login({ email, password }) {
        if (!email || !password) {
            throw new AppError("Email and password are required", 400);
        }

        const normalizedEmail = email.toLowerCase().trim();
        const company =
            await this.companyRepository.findCompanyByEmailWithPassword(
                normalizedEmail
            );

        if (!company || !company.password) {
            throw new AppError("Invalid email or password.", 401);
        }

        const isMatch = await bcrypt.compare(password, company.password);
        if (!isMatch) {
            throw new AppError("Invalid email or password.", 401);
        }

        const cooldownKey = `company_login_otp_cooldown:${normalizedEmail}`;
        const isCooldown = await this.cacheRepository.get(cooldownKey);
        if (isCooldown) {
            throw new AppError("A verification code was recently sent. Please wait before requesting another code.", 429);
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const hashedOtp = this._hashValue(otp);

        await this.cacheRepository.set(
            `company_login_otp:${normalizedEmail}`,
            hashedOtp,
            300
        );
        await this.cacheRepository.set(
            `company_login_otp_attempts:${normalizedEmail}`,
            0,
            300
        );
        await this.cacheRepository.set(cooldownKey, "1", 60);

        await sendVerificationEmail({
            to: normalizedEmail,
            name: company.companyName,
            otp,
            type: "login",
        });

        return {
            requiresOtp: true,
            email: normalizedEmail,
            message: "A 6-digit verification code has been sent to your business email.",
        };
    }

    async verifyLoginOtp({ email, otp }) {
        if (!email || !otp) {
            throw new AppError("Company email and OTP are required", 400);
        }

        const normalizedEmail = email.toLowerCase().trim();
        const inputOtp = otp.toString().trim();

        const attemptsKey = `company_login_otp_attempts:${normalizedEmail}`;
        const attempts = (await this.cacheRepository.get(attemptsKey)) || 0;
        if (Number(attempts) >= 5) {
            throw new AppError(
                "Too many failed attempts. Please request a new verification code.",
                429
            );
        }

        const storedHashedOtp = await this.cacheRepository.get(
            `company_login_otp:${normalizedEmail}`
        );
        if (!storedHashedOtp) {
            throw new AppError("Verification code expired or invalid", 400);
        }

        const inputHashedOtp = this._hashValue(inputOtp);
        if (inputHashedOtp !== storedHashedOtp) {
            await this.cacheRepository.set(attemptsKey, Number(attempts) + 1, 300);
            throw new AppError("Invalid verification code", 400);
        }

        const company =
            await this.companyRepository.findCompanyByEmail(normalizedEmail);
        if (!company) {
            throw new AppError("Company account not found", 404);
        }

        await this.cacheRepository.del(`company_login_otp:${normalizedEmail}`);
        await this.cacheRepository.del(attemptsKey);
        await this.cacheRepository.del(`company_login_otp_cooldown:${normalizedEmail}`);

        if (!company.isVerified) {
            await this.companyRepository.updateCompany(company._id, { isVerified: true });
            company.isVerified = true;
        }

        const jwtPayload = {
            id: company._id,
            email: company.email,
            companyName: company.companyName,
            role: "company",
            isVerified: true,
        };

        const token = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: "24h" });
        const refreshToken = jwt.sign(
            { id: company._id, type: "company" },
            REFRESH_SECRET,
            { expiresIn: REFRESH_EXPIRES_IN || "7d" }
        );

        await this.cacheRepository.set(
            `refresh:company:${company._id}`,
            refreshToken,
            7 * 24 * 3600
        );

        return {
            company: {
                id: company._id,
                companyName: company.companyName,
                email: company.email,
                phone: company.phone,
            },
            token,
            refreshToken,
            message: "Company login successful!",
        };
    }

    async resendLoginOtp({ email }) {
        if (!email) throw new AppError("Company email is required", 400);

        const normalizedEmail = email.toLowerCase().trim();
        const company =
            await this.companyRepository.findCompanyByEmail(normalizedEmail);

        if (!company) {
            return { message: "If an account exists, a new verification code has been sent." };
        }

        const cooldownKey = `company_login_otp_cooldown:${normalizedEmail}`;
        const isCooldown = await this.cacheRepository.get(cooldownKey);
        if (isCooldown) {
            throw new AppError("Please wait before requesting another verification code", 429);
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const hashedOtp = this._hashValue(otp);

        await this.cacheRepository.set(
            `company_login_otp:${normalizedEmail}`,
            hashedOtp,
            300
        );
        await this.cacheRepository.set(
            `company_login_otp_attempts:${normalizedEmail}`,
            0,
            300
        );
        await this.cacheRepository.set(cooldownKey, "1", 60);

        await sendVerificationEmail({
            to: normalizedEmail,
            name: company.companyName,
            otp,
            type: "login",
        });

        return { message: "A new verification code has been sent to your business email." };
    }

    async forgotPassword(email) {
        if (!email) throw new AppError("Company email is required", 400);

        const normalizedEmail = email.toLowerCase().trim();
        const genericMessage = {
            message:
                "If an account exists with this email, a password reset code has been sent.",
        };

        const company =
            await this.companyRepository.findCompanyByEmail(normalizedEmail);

        if (!company) {
            return genericMessage;
        }

        const cooldownKey = `company_password_reset_resend:${normalizedEmail}`;
        const isCooldown = await this.cacheRepository.get(cooldownKey);

        if (isCooldown) {
            return genericMessage;
        }

        const otp = crypto.randomInt(100000, 999999).toString();
        const hashedOtp = this._hashValue(otp);

        await this.cacheRepository.set(
            `company_password_reset:${normalizedEmail}`,
            hashedOtp,
            300
        );
        await this.cacheRepository.set(
            `company_password_reset_attempts:${normalizedEmail}`,
            0,
            300
        );
        await this.cacheRepository.set(cooldownKey, "1", 60);

        try {
            await sendPasswordResetEmail({
                to: normalizedEmail,
                name: company.companyName,
                otp,
            });
        } catch (error) {
            logger.error(
                `Failed to send password reset email to company ${normalizedEmail}:`,
                error
            );
        }

        return genericMessage;
    }

    async verifyResetOtp({ email, otp }) {
        if (!email || !otp) {
            throw new AppError("Company email and OTP are required", 400);
        }

        const normalizedEmail = email.toLowerCase().trim();
        const attemptsKey = `company_password_reset_attempts:${normalizedEmail}`;
        const attempts = (await this.cacheRepository.get(attemptsKey)) || 0;

        if (Number(attempts) >= 5) {
            throw new AppError(
                "Too many failed attempts. Please request a new password reset code.",
                429
            );
        }

        const storedHashedOtp = await this.cacheRepository.get(
            `company_password_reset:${normalizedEmail}`
        );

        if (!storedHashedOtp) {
            throw new AppError("Reset code expired or invalid", 400);
        }

        const inputHashedOtp = this._hashValue(otp.toString().trim());

        if (inputHashedOtp !== storedHashedOtp) {
            await this.cacheRepository.set(
                attemptsKey,
                Number(attempts) + 1,
                300
            );
            throw new AppError("Invalid reset code", 400);
        }

        await this.cacheRepository.del(
            `company_password_reset:${normalizedEmail}`
        );
        await this.cacheRepository.del(attemptsKey);
        await this.cacheRepository.del(
            `company_password_reset_resend:${normalizedEmail}`
        );

        const resetToken = crypto.randomBytes(32).toString("hex");
        const hashedResetToken = this._hashValue(resetToken);

        await this.cacheRepository.set(
            `company_reset_auth:${normalizedEmail}`,
            hashedResetToken,
            600
        );

        return {
            message: "Reset code verified successfully",
            resetToken,
        };
    }

    async confirmResetPassword({ email, resetToken, newPassword }) {
        if (!email || !resetToken || !newPassword) {
            throw new AppError(
                "Email, resetToken, and newPassword are required",
                400
            );
        }

        const normalizedEmail = email.toLowerCase().trim();
        const storedHashedToken = await this.cacheRepository.get(
            `company_reset_auth:${normalizedEmail}`
        );

        if (!storedHashedToken) {
            throw new AppError(
                "Password reset authorization expired or invalid",
                400
            );
        }

        const inputHashedToken = this._hashValue(resetToken.trim());

        if (inputHashedToken !== storedHashedToken) {
            throw new AppError(
                "Invalid password reset authorization token",
                400
            );
        }

        const company =
            await this.companyRepository.findCompanyByEmail(normalizedEmail);

        if (!company) {
            throw new AppError("Company account not found", 404);
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.companyRepository.updateCompanyPassword(
            company._id,
            hashedPassword
        );

        await this.cacheRepository.del(
            `company_reset_auth:${normalizedEmail}`
        );
        await this.cacheRepository.del(`refresh:company:${company._id}`);

        return { message: "Company password reset successfully." };
    }

    async refresh(refreshToken) {
        if (!refreshToken) throw new AppError("Unauthorized", 401);

        let payload;
        try {
            payload = jwt.verify(refreshToken, REFRESH_SECRET);
        } catch (err) {
            throw new AppError("Invalid refresh token", 401);
        }

        if (payload.type !== "company") {
            throw new AppError("Invalid refresh token type", 401);
        }

        const stored = await this.cacheRepository.get(
            `refresh:company:${payload.id}`
        );
        if (!stored || stored !== refreshToken) {
            throw new AppError("Invalid refresh token", 401);
        }

        const company = await this.companyRepository.findCompanyById(payload.id);
        if (!company) throw new AppError("Company not found", 404);

        const jwtPayload = {
            id: company._id,
            email: company.email,
            companyName: company.companyName,
            role: "company",
            isVerified: company.isVerified,
        };

        const token = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: "24h" });
        const newRefreshToken = jwt.sign(
            { id: company._id, type: "company" },
            REFRESH_SECRET,
            { expiresIn: REFRESH_EXPIRES_IN || "7d" }
        );

        await this.cacheRepository.set(
            `refresh:company:${company._id}`,
            newRefreshToken,
            7 * 24 * 3600
        );

        return { token, refreshToken: newRefreshToken };
    }

    async logout(token) {
        if (!token) return true;

        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const exp = decoded.exp * 1000;
            const ttl = Math.floor((exp - Date.now()) / 1000);
            if (ttl > 0) {
                await this.cacheRepository.set(`bl_${token}`, "blacklisted", ttl);
            }
        } catch (err) {
            // Ignore token verification errors during logout
        }
        return true;
    }
}

export default CompanyAuthService;