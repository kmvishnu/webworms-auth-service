import express, { Request, Response } from "express";
import appRoutes from "./routes/appRoutes";
import dotenv from "dotenv";
import connectDB from "./config/db.config";
import { connectToRedis } from "./config/redisClient";

dotenv.config();

const app = express();

connectDB();


connectToRedis().then(() => {
  console.log("Connected to Redis");
}).catch((err) => {
  console.error("Failed to connect to Redis:", err);
});

app.use(express.json());
app.use("/v1", appRoutes);

app.get("/healthCheck", (req: Request, res: Response) => {
  res.send("Webworms auth-service is up and running!");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
