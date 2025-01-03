"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.login = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userComponent_1 = require("../../components/v1/userComponent");
const errors_1 = require("../../types/errors");
const request_types_1 = require("../../types/request.types");
const redisClient_1 = require("../../config/redisClient");
const login = async (req, res, next) => {
    try {
        const validatedData = request_types_1.LoginRequestSchema.parse(req.body);
        const { email, password } = validatedData;
        const user = await (0, userComponent_1.verifyUser)(email);
        if (!user) {
            throw new errors_1.AppError(errors_1.HttpStatusCode.UNAUTHORIZED, "auth_error", "Invalid email or password");
        }
        const hashedPassword = user.password;
        const passwordMatch = await bcryptjs_1.default.compare(password, hashedPassword);
        if (!passwordMatch) {
            throw new errors_1.AppError(errors_1.HttpStatusCode.UNAUTHORIZED, "auth_error", "Invalid email or password");
        }
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const jwtRefreshKey = process.env.JWT_REFRESH_KEY;
        if (!jwtSecretKey) {
            throw new errors_1.AppError(errors_1.HttpStatusCode.INTERNAL_SERVER, "config_error", "JWT secret key not configured");
        }
        const data = {
            time: Date(),
            name: user.name,
            id: user.id,
            exp: Math.floor(Date.now() / 1000) + Number(process.env.EXPIRESIN || "3600"),
        };
        const refreshData = {
            time: Date(),
            name: user.name,
            id: user._id,
            exp: Math.floor(Date.now() / 1000) +
                Number(process.env.REFRESH_TOKEN_EXPIRESIN),
        };
        const token = jsonwebtoken_1.default.sign(data, jwtSecretKey);
        const refreshToken = jsonwebtoken_1.default.sign(refreshData, jwtRefreshKey);
        (0, redisClient_1.saveRefreshToken)(refreshToken, user._id, Number(process.env.REFRESH_TOKEN_EXPIRESIN));
        res.status(errors_1.HttpStatusCode.OK).json({
            status: "success",
            token,
            refreshToken,
            name: user.name,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.login = login;
const refreshToken = async (req, res, next) => {
    try {
        const validatedData = request_types_1.RefreshTokenRequestSchema.parse(req.body);
        const { refreshToken } = validatedData;
        const jwtSecretKey = process.env.JWT_SECRET_KEY;
        const jwtRefreshKey = process.env.JWT_REFRESH_KEY;
        if (!jwtSecretKey) {
            throw new errors_1.AppError(errors_1.HttpStatusCode.INTERNAL_SERVER, "config_error", "JWT secret key not configured");
        }
        try {
            const userId = await (0, redisClient_1.verifyRefreshToken)(refreshToken);
            if (!userId) {
                throw new errors_1.AppError(errors_1.HttpStatusCode.FORBIDDEN, "auth_error", "Invalid or expired refresh token");
            }
            const decoded = jsonwebtoken_1.default.verify(refreshToken, jwtRefreshKey);
            const newToken = jsonwebtoken_1.default.sign({
                time: Date(),
                name: decoded.name,
                id: decoded.id,
                exp: Math.floor(Date.now() / 1000) +
                    Number(process.env.EXPIRESIN || "3600"),
            }, jwtSecretKey);
            res.status(errors_1.HttpStatusCode.OK).json({
                status: "success",
                token: newToken,
                name: decoded.name,
            });
        }
        catch (jwtError) {
            if (jwtError instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new errors_1.AppError(errors_1.HttpStatusCode.UNAUTHORIZED, "auth_error", "Token has expired");
            }
            if (jwtError instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new errors_1.AppError(errors_1.HttpStatusCode.UNAUTHORIZED, "auth_error", "Invalid token");
            }
            throw jwtError;
        }
    }
    catch (error) {
        next(error);
    }
};
exports.refreshToken = refreshToken;
//# sourceMappingURL=loginController.js.map