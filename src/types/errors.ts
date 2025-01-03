import { z } from "zod";

export enum HttpStatusCode {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER = 500,
  OK = 200,
  TOO_MANY_REQUESTS = 429,
}

export class AppError extends Error {
  constructor(
    public statusCode: HttpStatusCode,
    public status: string,
    message: string
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
