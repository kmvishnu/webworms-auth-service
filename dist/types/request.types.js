"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenRequestSchema = exports.VerifyForgotPasswordSchema = exports.VerifyOtpRequestSchema = exports.OtpRequestSchema = exports.LoginRequestSchema = void 0;
const zod_1 = require("zod");
exports.LoginRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    password: zod_1.z.string().min(6, "Password must be at least 6 characters"),
});
exports.OtpRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    purpose: zod_1.z.enum(["registration", "forgotPassword"], {
        invalid_type_error: "Purpose must be either 'registration' or 'forgotPassword'",
    }),
});
exports.VerifyOtpRequestSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    otp: zod_1.z.string().length(6, "OTP must be 6 digits"),
    password: zod_1.z
        .string()
        .min(4, "Password must be at least 4 characters long")
    // .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    // .regex(/[a-z]/, "Password must include at least one lowercase letter")
    // .regex(/\d/, "Password must include at least one number")
    // .regex(/[@$!%*?&#]/, "Password must include at least one special character"),
    ,
    name: zod_1.z.string().min(3, "Name must be at least 3 characters long"),
});
exports.VerifyForgotPasswordSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format"),
    otp: zod_1.z.string().length(6, "OTP must be 6 digits"),
    newPassword: zod_1.z
        .string()
        .min(4, "Password must be at least 4 characters long")
    // .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    // .regex(/[a-z]/, "Password must include at least one lowercase letter")
    // .regex(/\d/, "Password must include at least one number")
    // .regex(/[@$!%*?&#]/, "Password must include at least one special character"),
});
exports.RefreshTokenRequestSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(1, "Refresh token is required"),
});
//# sourceMappingURL=request.types.js.map