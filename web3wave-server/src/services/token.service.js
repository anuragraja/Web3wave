import MongoTokenRepository from "../repositories/implementations/tokenImplementation.js"
import config from "../config/environment.js"
import jwt from "jsonwebtoken"
import { AppError } from "../utils/appError.js";

const { JWT_SECRET, REFRESH_SECRET, REFRESH_EXPIRES_IN } = config;

class TokenService {
    constructor() {
        this.tokenservice = new MongoTokenRepository()
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
            role: this._getSafeRole(user),
            isVerified: user.isVerified || false,
        };
    }

    async createToken(userId) {
        const user = await this.tokenservice.createToken(userId)

        if (!user) throw new AppError("Failed to authenticate user", 500);

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

        return {
            user,
            token,
            refreshToken,
        };
    }



}

export default TokenService