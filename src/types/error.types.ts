export class AppError extends Error {
  constructor(
    public statusCode: number,
    public status: string,
    message: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}
