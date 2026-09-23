import CompanyAuthService from "../services/company.auth.service.js";

const companyAuthService = new CompanyAuthService();

export async function register(req, res, next) {
    try {
        const result = await companyAuthService.register(req.body);
        return res.status(201).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
}

export async function verifyEmail(req, res, next) {
    try {
        const result = await companyAuthService.verifyEmail({
            email: req.body.email,
            otp: req.body.otp,
        });
        return res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
}

export async function resendVerification(req, res, next) {
    try {
        const result = await companyAuthService.resendVerification(req.body.email);
        return res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
}

export async function login(req, res, next) {
    try {
        const result = await companyAuthService.login({
            email: req.body.email,
            password: req.body.password,
        });

        res.cookie("token", result.token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function forgotPassword(req, res, next) {
    try {
        const result = await companyAuthService.forgotPassword(req.body.email);
        return res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
}

export async function verifyResetOtp(req, res, next) {
    try {
        const result = await companyAuthService.verifyResetOtp({
            email: req.body.email,
            otp: req.body.otp,
        });
        return res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
}

export async function confirmResetPassword(req, res, next) {
    try {
        const result = await companyAuthService.confirmResetPassword({
            email: req.body.email,
            resetToken: req.body.resetToken,
            newPassword: req.body.newPassword,
        });
        return res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
}

export async function refreshToken(req, res, next) {
    try {
        const token = req.cookies?.refreshToken || req.body?.refreshToken;
        const result = await companyAuthService.refresh(token);

        res.cookie("token", result.token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.cookie("refreshToken", result.refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({ success: true, data: result });
    } catch (error) {
        next(error);
    }
}

export async function logout(req, res, next) {
    try {
        const token =
            req.cookies?.token ||
            req.header("Authorization")?.replace("Bearer ", "");

        await companyAuthService.logout(token);

        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        return res
            .status(200)
            .json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
}