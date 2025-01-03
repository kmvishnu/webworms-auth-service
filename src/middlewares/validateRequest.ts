import { Request, Response, NextFunction } from "express";
import { AnyZodObject } from "zod";
import { AppError } from "../types/error.types";

export const validateRequest = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync(req.body);
      next();
    } catch (error: any) {
      const errorMessages = error.errors.map((err: any) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      next(
        new AppError(400, "validation_error", JSON.stringify(errorMessages))
      );
    }
  };
};
