"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendTestMail = exports.sendOtpMail = exports.verifyEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const User_1 = __importDefault(require("../../models/User"));
const redisClient_1 = require("../../config/redisClient");
const transporter = nodemailer_1.default.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER,
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
    },
});
const verifyEmail = async (email) => {
    try {
        const user = await User_1.default.findOne({ email: email });
        return !!user;
    }
    catch (error) {
        console.error("Error verifying email:", error);
        return false;
    }
};
exports.verifyEmail = verifyEmail;
const sendOtpMail = async (email) => {
    try {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        const mailOptions = {
            from: process.env.FROM_USER,
            to: email,
            subject: "OTP To Complete Your Signup",
            html: `<html> <h1>Hi,</h1> <br/><p style="color:grey; font-size:1.2em">Please use the below OTP code to complete your account setup</p><br><br><h1 style="color:orange">${code}</h1></html>`,
        };
        const expiryDate = Date.now() + 180000;
        try {
            await transporter.sendMail(mailOptions);
            await (0, redisClient_1.saveOtpToRedis)(email, code, expiryDate);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
    catch (e) {
        e;
        return false;
    }
};
exports.sendOtpMail = sendOtpMail;
const sendTestMail = async () => {
    try {
        const mailOptions = {
            from: process.env.FROM_USER,
            to: process.env.FROM_TEST_USER,
            subject: "This is a test email - You will receive this every 3rd day",
            html: `<html> <h1>Hi,</h1> <br/><p style="color:grey; font-size:1.2em">Please Ignore this mail</p><br><br><h1 style="color:orange"></h1></html>`,
        };
        try {
            await transporter.sendMail(mailOptions);
            return true;
        }
        catch (e) {
            console.log(e);
            return false;
        }
    }
    catch (e) {
        e;
        return false;
    }
};
exports.sendTestMail = sendTestMail;
//# sourceMappingURL=emailComponent.js.map