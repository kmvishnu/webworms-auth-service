import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const options = {
    autoIndex: false,
    maxPoolSize: 10, 
    serverSelectionTimeoutMS: 5000, 
    socketTimeoutMS: 45000, 
    family: 4 
  };

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI as string, options);
    console.log("MongoDB Connected...");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1); 
  }
};

export default connectDB;
