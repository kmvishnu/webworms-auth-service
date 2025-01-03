import { z } from "zod";

export const LoginRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const OtpRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
  purpose: z.enum(["registration", "forgotPassword"], {
    invalid_type_error: "Purpose must be either 'registration' or 'forgotPassword'",
  }),
});

export const VerifyOtpRequestSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters long")
    // .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    // .regex(/[a-z]/, "Password must include at least one lowercase letter")
    // .regex(/\d/, "Password must include at least one number")
    // .regex(/[@$!%*?&#]/, "Password must include at least one special character"),
    ,
  name: z.string().min(3, "Name must be at least 3 characters long"),
});

export const VerifyForgotPasswordSchema = z.object({
  email: z.string().email("Invalid email format"),
  otp: z.string().length(6, "OTP must be 6 digits"),
  newPassword: z
    .string()
    .min(4, "Password must be at least 4 characters long")
    // .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    // .regex(/[a-z]/, "Password must include at least one lowercase letter")
    // .regex(/\d/, "Password must include at least one number")
    // .regex(/[@$!%*?&#]/, "Password must include at least one special character"),
});



export const RefreshTokenRequestSchema = z.object({
  refreshToken: z.string().min(1, "Refresh token is required"),
});

export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type RefreshTokenRequest = z.infer<typeof RefreshTokenRequestSchema>;
