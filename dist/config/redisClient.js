"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOtpFromRedis = exports.saveOtpToRedis = exports.verifyRefreshToken = exports.saveRefreshToken = exports.connectToRedis = exports.client = void 0;
const redis_1 = require("redis");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.client = (0, redis_1.createClient)({
    url: `redis://${process.env.REDDIT_USERNAME}:${process.env.REDDIT_PASSWORD}@${process.env.REDDIT_HOST}:${process.env.REDDIT_PORT}`,
});
exports.client.on("error", (err) => {
    console.error("Error connecting to Redis:", err);
});
exports.client.on("connect", () => {
    console.log("Connected to Redis");
});
const connectToRedis = async () => {
    await exports.client.connect();
};
exports.connectToRedis = connectToRedis;
const saveRefreshToken = async (token, userId, expiryInSeconds) => {
    try {
        await exports.client.set(token, userId, {
            EX: expiryInSeconds,
        });
        console.log("Token saved to Redis");
    }
    catch (err) {
        console.error("Error saving token to Redis:", err);
    }
};
exports.saveRefreshToken = saveRefreshToken;
const verifyRefreshToken = async (token) => {
    try {
        const userId = await exports.client.get(token);
        if (userId) {
            console.log("Token is valid");
            return userId;
        }
        else {
            console.log("Token is invalid");
            return null;
        }
    }
    catch (err) {
        console.error("Error verifying token in Redis:", err);
        return null;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
const saveOtpToRedis = async (email, otp, expiryInSeconds) => {
    try {
        const otpData = {
            otp: otp,
            email: email,
            expiryTime: Date.now() + expiryInSeconds * 1000, // Expiry time as a timestamp
        };
        const otpDataString = JSON.stringify(otpData);
        await exports.client.set(`otp:${email}`, otpDataString, {
            EX: expiryInSeconds,
        });
        console.log("OTP saved to Redis for email:", email);
    }
    catch (err) {
        console.error("Error saving OTP to Redis:", err);
    }
};
exports.saveOtpToRedis = saveOtpToRedis;
const getOtpFromRedis = async (email) => {
    try {
        const otpDataString = await exports.client.get(`otp:${email}`);
        if (!otpDataString) {
            console.log("No OTP found for email:", email);
            return null;
        }
        const otpData = JSON.parse(otpDataString);
        if (Date.now() > otpData.expiryTime) {
            console.log("OTP has expired for email:", email);
            return null;
        }
        return otpData;
    }
    catch (err) {
        console.error("Error retrieving OTP from Redis:", err);
        return null;
    }
};
exports.getOtpFromRedis = getOtpFromRedis;
//# sourceMappingURL=redisClient.js.map