"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyForgotPasswordOtp = exports.verifyOtp = exports.sendOtp = void 0;
const emailComponent_1 = require("../../components/v1/emailComponent");
const userComponent_1 = require("../../components/v1/userComponent");
const redisClient_1 = require("../../config/redisClient");
const errors_1 = require("../../types/errors");
const request_types_1 = require("../../types/request.types");
const sendOtp = async (req, res, next) => {
    try {
        const validatedData = request_types_1.OtpRequestSchema.parse(req.body);
        const { email, purpose } = validatedData;
        const resendKey = `resend:${email}`;
        if (purpose === "registration") {
            const status = await (0, emailComponent_1.verifyEmail)(email);
            if (status === true) {
                throw new errors_1.AppError(errors_1.HttpStatusCode.BAD_REQUEST, "user_exists", "User already exists, Please proceed to login");
            }
        }
        else if (purpose === "forgotPassword") {
            const status = await (0, emailComponent_1.verifyEmail)(email);
            if (status === false) {
                throw new errors_1.AppError(errors_1.HttpStatusCode.BAD_REQUEST, "email_not_registered", "Email not registered. Please sign up first.");
            }
        }
        const resendData = await redisClient_1.client.get(resendKey);
        const currentTime = Date.now();
        if (resendData) {
            const { count, lastSent } = JSON.parse(resendData);
            if (count >= 3) {
                throw new errors_1.AppError(errors_1.HttpStatusCode.TOO_MANY_REQUESTS, "resend_limit_reached", "Resend limit reached. Please try again after an hour.");
            }
            if (currentTime - lastSent < 60000) {
                throw new errors_1.AppError(errors_1.HttpStatusCode.TOO_MANY_REQUESTS, "resend_too_soon", "You can resend an OTP only after 1 minute.");
            }
            await redisClient_1.client.set(resendKey, JSON.stringify({ count: count + 1, lastSent: currentTime }), { KEEPTTL: true });
        }
        else {
            await redisClient_1.client.set(resendKey, JSON.stringify({ count: 1, lastSent: currentTime }), { EX: 3600 });
        }
        const emailStatus = await (0, emailComponent_1.sendOtpMail)(email);
        if (emailStatus) {
            res.status(errors_1.HttpStatusCode.OK).json({
                status: "success",
                message: `OTP has been sent to the provided email for ${purpose}.`,
            });
        }
        throw new errors_1.AppError(errors_1.HttpStatusCode.INTERNAL_SERVER, "email_failure", "Unable to send email at the moment");
    }
    catch (error) {
        next(error);
    }
};
exports.sendOtp = sendOtp;
const verifyOtp = async (req, res, next) => {
    try {
        const validatedData = request_types_1.VerifyOtpRequestSchema.parse(req.body);
        const { email, otp, password, name } = validatedData;
        const emailOtp = await (0, redisClient_1.getOtpFromRedis)(email);
        if (!emailOtp) {
            throw new errors_1.AppError(errors_1.HttpStatusCode.INTERNAL_SERVER, "otp_not_found", "OTP cannot be verified at the moment!");
        }
        const { otp: storedOtp, expiryTime } = emailOtp;
        if (Date.now() > expiryTime) {
            throw new errors_1.AppError(errors_1.HttpStatusCode.BAD_REQUEST, "otp_expired", "Sorry, this OTP has expired!");
        }
        if (otp !== storedOtp) {
            throw new errors_1.AppError(errors_1.HttpStatusCode.BAD_REQUEST, "invalid_otp", "Sorry, the OTP provided is not valid");
        }
        const result = await (0, userComponent_1.createUser)(name, email, password);
        if (result) {
            res.status(errors_1.HttpStatusCode.OK).json({
                status: "otpSuccess",
                message: "User Created",
            });
        }
        throw new errors_1.AppError(errors_1.HttpStatusCode.INTERNAL_SERVER, "user_creation_failed", "Failed to create user");
    }
    catch (error) {
        next(error);
    }
};
exports.verifyOtp = verifyOtp;
const verifyForgotPasswordOtp = async (req, res, next) => {
    try {
        const validatedData = request_types_1.VerifyForgotPasswordSchema.parse(req.body);
        const { email, otp, newPassword } = validatedData;
        const emailOtp = await (0, redisClient_1.getOtpFromRedis)(email);
        if (!emailOtp) {
            throw new errors_1.AppError(errors_1.HttpStatusCode.INTERNAL_SERVER, "otp_not_found", "OTP cannot be verified at the moment!");
        }
        const { otp: storedOtp, expiryTime } = emailOtp;
        if (Date.now() > expiryTime) {
            throw new errors_1.AppError(errors_1.HttpStatusCode.BAD_REQUEST, "otp_expired", "Sorry, this OTP has expired!");
        }
        if (otp !== storedOtp) {
            throw new errors_1.AppError(errors_1.HttpStatusCode.BAD_REQUEST, "invalid_otp", "Sorry, the OTP provided is not valid");
        }
        const result = await (0, userComponent_1.updateUser)(email, newPassword);
        if (result) {
            res.status(errors_1.HttpStatusCode.OK).json({
                status: "true",
                message: "Password Updated",
            });
        }
        throw new errors_1.AppError(errors_1.HttpStatusCode.INTERNAL_SERVER, "password_update_failed", "Unable to update password at the moment!");
    }
    catch (error) {
        next(error);
    }
};
exports.verifyForgotPasswordOtp = verifyForgotPasswordOtp;
//# sourceMappingURL=otpController.js.map