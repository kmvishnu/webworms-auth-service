"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const loginController_1 = require("../controllers/v1/loginController");
const otpController_1 = require("../controllers/v1/otpController");
const V1Routes = (0, express_1.Router)();
V1Routes.post("/login", loginController_1.login);
V1Routes.post("/refreshToken", loginController_1.refreshToken);
V1Routes.post("/sendOtp", otpController_1.sendOtp);
V1Routes.post("/verifyOtp", otpController_1.verifyOtp);
V1Routes.post("/verifyForgotPasswordOtp", otpController_1.verifyForgotPasswordOtp);
exports.default = V1Routes;
//# sourceMappingURL=appRoutes.js.map