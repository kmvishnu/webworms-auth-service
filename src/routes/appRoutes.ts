import { Router } from "express";
import { login, refreshToken } from "../controllers/v1/loginController";
import {
  sendOtp,
  verifyForgotPasswordOtp,
  verifyOtp,
} from "../controllers/v1/otpController";

const V1Routes = Router();

V1Routes.post("/sendOtp", sendOtp);
V1Routes.post("/verifyOtp", verifyOtp);
V1Routes.post("/login", login);
V1Routes.post("/verifyForgotPasswordOtp", verifyForgotPasswordOtp);
V1Routes.post("/refreshToken", refreshToken);

export default V1Routes;
