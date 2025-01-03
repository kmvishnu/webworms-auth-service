import { sendOtpMail, verifyEmail } from "../../components/v1/emailComponent";
import { createUser } from "../../components/v1/userComponent";
import { client, getOtpFromRedis } from "../../config/redisClient";

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  const resendKey = `resend:${email}`;

  try {
    const status = await verifyEmail(email);
    if (status === true) {
      return res.status(400).json({
        status: "false",
        message: "User already exists, Please Proceed to login",
      });
    }

    const resendData = await client.get(resendKey);
    const currentTime = Date.now();

    if (resendData) {
      const { count, lastSent } = JSON.parse(resendData);

      if (count >= 3) {
        return res.status(429).json({
          status: "false",
          message: "Resend limit reached. Please try again after and hour.",
        });
      }

      if (currentTime - lastSent < 60000) {
        return res.status(429).json({
          status: "false",
          message: "You can resend an OTP only after 1 minute.",
        });
      }

      await client.set(
        resendKey,
        JSON.stringify({ count: count + 1, lastSent: currentTime }),
        {
          EX: 3600,
        }
      );
    } else {
      await client.set(
        resendKey,
        JSON.stringify({ count: 1, lastSent: currentTime }),
        {
          EX: 300,
        }
      );
    }

    const emailStatus = await sendOtpMail(email);
    if (emailStatus) {
      return res.status(200).json({
        status: "success",
        message: "OTP has been sent to the provided email.",
      });
    }

    return res.status(500).json({
      status: "failed",
      message: "Unable to send email at the moment",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: "failed",
      message: "An error occurred while sending the OTP",
    });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp, password, name } = req.body;

  const emailOtp = await getOtpFromRedis(email);

  if (emailOtp) {
    const date = emailOtp.expiryTime;

    if (Date.now() > date) {
      return res.json({
        status: "failed",
        message: "Sorry this otp has expired!",
      });
    } else {
      const rOtp = emailOtp.otp;

      if (otp == rOtp) {
        const result = await createUser(name, email, password);
        if (result) {
          return res
            .status(200)
            .json({ status: "otpSuccess", message: "User Created" });
        }
      }

      return res.status(400).json({
        status: "otpFalse",
        message: "Sorry, the otp provided is not valid",
      });
    }
  }

  return res.status(500).json({
    status: "otpFailed",
    message: "OTP cannot be verified at the moment!",
  });
};
