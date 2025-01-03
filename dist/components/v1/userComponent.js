"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.createUser = exports.verifyUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = __importDefault(require("../../models/User"));
const verifyUser = async (email) => {
    try {
        const user = await User_1.default.findOne({ email: email });
        return user;
    }
    catch (error) {
        console.error("Error finding user:", error);
    }
};
exports.verifyUser = verifyUser;
const createUser = async (name, email, password) => {
    try {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await User_1.default.create({
            name: name,
            email: email,
            password: hashedPassword,
        });
        return true;
    }
    catch (error) {
        console.error("Error creating user:", error);
        4;
        return false;
    }
};
exports.createUser = createUser;
const updateUser = async (email, password) => {
    try {
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const updatedUser = await User_1.default.findOneAndUpdate({ email }, { password: hashedPassword }, { new: true });
        return true;
    }
    catch (error) {
        console.error("Error updating user:", error);
        return false;
    }
};
exports.updateUser = updateUser;
//# sourceMappingURL=userComponent.js.map