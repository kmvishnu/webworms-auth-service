import helmet from "helmet";
import rateLimit from "express-rate-limit";
import cors from "cors";

const configureHelmet = () => {
  return helmet();
};

const configureRateLimiter = () => {
  return rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30, // limit each IP to 30 requests per window
    message: "Too many requests, please try again later.",
  });
};

const configureCors = () => {
  const corsOptions = {
    origin: "*",
    methods: "GET,POST,PUT,DELETE",
  };
  return cors(corsOptions);
};

export const securityMiddlewares = {
  helmet: configureHelmet,
  rateLimiter: configureRateLimiter,
  cors: configureCors,
};
