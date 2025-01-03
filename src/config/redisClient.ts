import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

export const client = createClient({
  url: `redis://${process.env.REDDIT_USERNAME}:${process.env.REDDIT_PASSWORD}@${process.env.REDDIT_HOST}:${process.env.REDDIT_PORT}`,
});

client.on("error", (err: Error) => {
  console.error("Error connecting to Redis:", err);
});

client.on("connect", () => {
  console.log("Connected to Redis");
});

export const connectToRedis = async () => {
  await client.connect();
};

export const saveRefreshToken = async (
  token: string,
  userId: string,
  expiryInSeconds: number
): Promise<void> => {
  try {
    await client.set(token, userId, {
      EX: expiryInSeconds,
    });
    console.log("Token saved to Redis");
  } catch (err) {
    console.error("Error saving token to Redis:", err);
  }
};

export const verifyRefreshToken = async (
  token: string
): Promise<string | null> => {
  try {
    const userId = await client.get(token);
    if (userId) {
      console.log("Token is valid");
      return userId;
    } else {
      console.log("Token is invalid");
      return null;
    }
  } catch (err) {
    console.error("Error verifying token in Redis:", err);
    return null;
  }
};

export const saveOtpToRedis = async (
  email: string,
  otp: string,
  expiryInSeconds: number
): Promise<void> => {
  try {
    const otpData = {
      otp: otp,
      email: email,
      expiryTime: Date.now() + expiryInSeconds * 1000, // Expiry time as a timestamp
    };

    const otpDataString = JSON.stringify(otpData);

    await client.set(`otp:${email}`, otpDataString, {
      EX: expiryInSeconds,
    });

    console.log("OTP saved to Redis for email:", email);
  } catch (err) {
    console.error("Error saving OTP to Redis:", err);
  }
};

export const getOtpFromRedis = async (email: string): Promise<any | null> => {
  try {
    const otpDataString = await client.get(`otp:${email}`);

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
  } catch (err) {
    console.error("Error retrieving OTP from Redis:", err);
    return null;
  }
};
