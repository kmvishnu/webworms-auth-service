import express, { Request, Response } from "express";
import appRoutes from "./routes/appRoutes";
import dotenv from "dotenv";
import connectDB from "./config/db.config";
import { connectToRedis } from "./config/redisClient";
import { errorHandler } from "./middlewares/errorHandler";
import { securityMiddlewares } from "./middlewares/securityMiddleware";

dotenv.config();

const app = express();

app.use(securityMiddlewares.helmet());
app.use(securityMiddlewares.rateLimiter());
app.use(securityMiddlewares.cors());

connectDB();

connectToRedis()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((err) => {
    console.error("Failed to connect to Redis:", err);
  });

app.use(express.json());
app.use("/v1", appRoutes);

app.get("/healthCheck", (req: Request, res: Response) => {
  res.send("Webworms auth-service is up and running!");
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
