
import { sendOtpMail, verifyEmail } from "../../components/v1/emailComponent";
import { createUser } from "../../components/v1/userComponent";
import { getOtpFromRedis } from "../../config/redisClient";

export const sendOtp = async (req, res) => {
  const status = await verifyEmail(req.body.email);

  if (status === true) {
    return res.status(400).json({
      status: "false",
      message: "User already exists, Please Proceed to login ",
    });
  }

  const emailStatus = await sendOtpMail(req.body.email);
  if (emailStatus) {
    return res.status(200).json({
      status: "success",
      message: "OTP has been sent to the provided email.",
    });
  }

  return res.status(500).json({
    status: "failed",
    message: "Unable to send email at the momment",
  });
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
