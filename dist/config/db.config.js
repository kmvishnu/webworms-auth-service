"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const options = {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
};
const connectDB = async () => {
    try {
        await mongoose_1.default.connect(process.env.MONGO_URI, options);
        console.log("MongoDB Connected...");
    }
    catch (err) {
        console.error("Database connection error:", err);
        process.exit(1);
    }
};
exports.default = connectDB;
//# sourceMappingURL=db.config.js.map