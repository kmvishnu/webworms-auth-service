import { z } from "zod";

export const LoginRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const OtpRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
});

export const VerifyOtpRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
