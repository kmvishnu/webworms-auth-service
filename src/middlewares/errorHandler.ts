import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import { AppError, HttpStatusCode } from "../types/errors";

export const errorHandler: ErrorRequestHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error("Error:", {
    name: err.name,
    message: err.message,
    stack: err.stack,
  });

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      status: "validation_error",
      errors: err.errors.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
    return;
  }

  // Handle custom app errors
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
    return;
  }

  // Handle JWT errors
  if (err.name === "JsonWebTokenError") {
    res.status(HttpStatusCode.UNAUTHORIZED).json({
      status: "auth_error",
      message: "Invalid token",
    });
    return;
  }

  if (err.name === "TokenExpiredError") {
    res.status(HttpStatusCode.UNAUTHORIZED).json({
      status: "auth_error",
      message: "Token expired",
    });
    return;
  }

  // Handle database errors
  if (err.name === "SequelizeValidationError") {
    res.status(HttpStatusCode.BAD_REQUEST).json({
      status: "validation_error",
      message: err.message,
    });
    return;
  }

  // Default error
  res.status(HttpStatusCode.INTERNAL_SERVER).json({
    status: "error",
    message: "Internal server error",
  });
  return;
};
