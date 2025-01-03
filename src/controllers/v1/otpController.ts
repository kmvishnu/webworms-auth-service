import { NextFunction } from "express";
import { sendOtpMail, verifyEmail } from "../../components/v1/emailComponent";
import { createUser, updateUser } from "../../components/v1/userComponent";
import { client, getOtpFromRedis } from "../../config/redisClient";
import { AppError, HttpStatusCode } from "../../types/errors";
import {
  OtpRequestSchema,
  VerifyForgotPasswordSchema,
  VerifyOtpRequestSchema,
} from "../../types/request.types";

export const sendOtp = async (req, res, next) => {
  try {
    const validatedData = OtpRequestSchema.parse(req.body);
    const { email, purpose } = validatedData;
    const resendKey = `resend:${email}`;
    if (purpose === "registration") {
      const status = await verifyEmail(email);
      if (status === true) {
        throw new AppError(
          HttpStatusCode.BAD_REQUEST,
          "user_exists",
          "User already exists, Please proceed to login"
        );
      }
    } else if (purpose === "forgotPassword") {
      const status = await verifyEmail(email);
      if (status === false) {
        throw new AppError(
          HttpStatusCode.BAD_REQUEST,
          "email_not_registered",
          "Email not registered. Please sign up first."
        );
      }
    }

    const resendData = await client.get(resendKey);
    const currentTime = Date.now();

    if (resendData) {
      const { count, lastSent } = JSON.parse(resendData);

      if (count >= 3) {
        throw new AppError(
          HttpStatusCode.TOO_MANY_REQUESTS,
          "resend_limit_reached",
          "Resend limit reached. Please try again after an hour."
        );
      }

      if (currentTime - lastSent < 60000) {
        throw new AppError(
          HttpStatusCode.TOO_MANY_REQUESTS,
          "resend_too_soon",
          "You can resend an OTP only after 1 minute."
        );
      }

      await client.set(
        resendKey,
        JSON.stringify({ count: count + 1, lastSent: currentTime }),
        { KEEPTTL: true }
      );
    } else {
      await client.set(
        resendKey,
        JSON.stringify({ count: 1, lastSent: currentTime }),
        { EX: 3600 }
      );
    }

    const emailStatus = await sendOtpMail(email);
    if (emailStatus) {
      res.status(HttpStatusCode.OK).json({
        status: "success",
        message: `OTP has been sent to the provided email for ${purpose}.`,
      });
    }

    throw new AppError(
      HttpStatusCode.INTERNAL_SERVER,
      "email_failure",
      "Unable to send email at the moment"
    );
  } catch (error) {
    next(error);
  }
};

export const verifyOtp = async (req, res, next) => {
  try {
    const validatedData = VerifyOtpRequestSchema.parse(req.body);
    const { email, otp, password, name } = validatedData;

    const emailOtp = await getOtpFromRedis(email);

    if (!emailOtp) {
      throw new AppError(
        HttpStatusCode.INTERNAL_SERVER,
        "otp_not_found",
        "OTP cannot be verified at the moment!"
      );
    }

    const { otp: storedOtp, expiryTime } = emailOtp;

    if (Date.now() > expiryTime) {
      throw new AppError(
        HttpStatusCode.BAD_REQUEST,
        "otp_expired",
        "Sorry, this OTP has expired!"
      );
    }

    if (otp !== storedOtp) {
      throw new AppError(
        HttpStatusCode.BAD_REQUEST,
        "invalid_otp",
        "Sorry, the OTP provided is not valid"
      );
    }

    const result = await createUser(name, email, password);
    if (result) {
      res.status(HttpStatusCode.OK).json({
        status: "otpSuccess",
        message: "User Created",
      });
    }

    throw new AppError(
      HttpStatusCode.INTERNAL_SERVER,
      "user_creation_failed",
      "Failed to create user"
    );
  } catch (error) {
    next(error);
  }
};

export const verifyForgotPasswordOtp = async (req, res, next) => {
  try {
    const validatedData = VerifyForgotPasswordSchema.parse(req.body);
    const { email, otp, newPassword } = validatedData;

    const emailOtp = await getOtpFromRedis(email);

    if (!emailOtp) {
      throw new AppError(
        HttpStatusCode.INTERNAL_SERVER,
        "otp_not_found",
        "OTP cannot be verified at the moment!"
      );
    }

    const { otp: storedOtp, expiryTime } = emailOtp;

    if (Date.now() > expiryTime) {
      throw new AppError(
        HttpStatusCode.BAD_REQUEST,
        "otp_expired",
        "Sorry, this OTP has expired!"
      );
    }

    if (otp !== storedOtp) {
      throw new AppError(
        HttpStatusCode.BAD_REQUEST,
        "invalid_otp",
        "Sorry, the OTP provided is not valid"
      );
    }

    const result = await updateUser(email, newPassword);
    if (result) {
      res.status(HttpStatusCode.OK).json({
        status: "true",
        message: "Password Updated",
      });
    }

    throw new AppError(
      HttpStatusCode.INTERNAL_SERVER,
      "password_update_failed",
      "Unable to update password at the moment!"
    );
  } catch (error) {
    next(error);
  }
};
