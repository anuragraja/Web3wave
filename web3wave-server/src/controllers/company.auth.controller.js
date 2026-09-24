import CompanyAuthService from "../services/company.auth.service.js";
import config from "../config/environment.js";

const companyAuthService = new CompanyAuthService();

const isProduction = config.NODE_ENV === "production";
const getCookieOptions = (maxAge) => ({
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    ...(maxAge ? { maxAge } : {}),
});

export async function register(req, res, next) {
    try {
        const result = await companyAuthService.register(req.body);
        if (result.token) {
            res.cookie("token", result.token, getCookieOptions(24 * 60 * 60 * 1000));
            res.cookie("refreshToken", result.refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
        }
        return res.status(201).json({ success: true, data: result, ...result });
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
        if (result.token) {
            res.cookie("token", result.token, getCookieOptions(24 * 60 * 60 * 1000));
            res.cookie("refreshToken", result.refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
        }
        return res.status(200).json({ success: true, data: result, ...result });
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

        if (result.token) {
            res.cookie("token", result.token, getCookieOptions(24 * 60 * 60 * 1000));
            res.cookie("refreshToken", result.refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
        }

        return res.status(200).json({ success: true, data: result, ...result });
    } catch (error) {
        next(error);
    }
}

export async function verifyLoginOtp(req, res, next) {
    try {
        const result = await companyAuthService.verifyLoginOtp({
            email: req.body.email,
            otp: req.body.otp,
        });

        if (result.token) {
            res.cookie("token", result.token, getCookieOptions(24 * 60 * 60 * 1000));
            res.cookie("refreshToken", result.refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
        }

        return res.status(200).json({ success: true, data: result, ...result });
    } catch (error) {
        next(error);
    }
}

export async function resendLoginOtp(req, res, next) {
    try {
        const result = await companyAuthService.resendLoginOtp(req.body.email);
        return res.status(200).json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
}

export async function getMe(req, res, next) {
    try {
        const companyId = req.companyId;
        if (!companyId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }
        const company = await companyAuthService.companyRepository.findCompanyById(companyId);
        if (!company) {
            return res.status(404).json({ success: false, message: "Company not found" });
        }
        return res.status(200).json({
            success: true,
            data: {
                id: company._id,
                companyName: company.companyName,
                email: company.email,
                phone: company.phone,
                role: "company",
                isVerified: company.isVerified,
            },
        });
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

        res.cookie("token", result.token, getCookieOptions(24 * 60 * 60 * 1000));
        res.cookie("refreshToken", result.refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));

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

        const clearOptions = {
            httpOnly: true,
            secure: isProduction,
            sameSite: isProduction ? "none" : "lax",
        };

        res.clearCookie("token", clearOptions);
        res.clearCookie("refreshToken", clearOptions);

        return res
            .status(200)
            .json({ success: true, message: "Logged out successfully" });
    } catch (error) {
        next(error);
    }
}