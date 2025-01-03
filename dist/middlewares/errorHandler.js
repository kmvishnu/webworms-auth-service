"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const errors_1 = require("../types/errors");
const errorHandler = (err, req, res, next) => {
    console.error("Error:", {
        name: err.name,
        message: err.message,
        stack: err.stack,
    });
    // Handle Zod validation errors
    if (err instanceof zod_1.ZodError) {
        res.status(errors_1.HttpStatusCode.BAD_REQUEST).json({
            status: "validation_error",
            errors: err.errors.map((e) => ({
                field: e.path.join("."),
                message: e.message,
            })),
        });
        return;
    }
    // Handle custom app errors
    if (err instanceof errors_1.AppError) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
        return;
    }
    // Handle JWT errors
    if (err.name === "JsonWebTokenError") {
        res.status(errors_1.HttpStatusCode.UNAUTHORIZED).json({
            status: "auth_error",
            message: "Invalid token",
        });
        return;
    }
    if (err.name === "TokenExpiredError") {
        res.status(errors_1.HttpStatusCode.UNAUTHORIZED).json({
            status: "auth_error",
            message: "Token expired",
        });
        return;
    }
    // Handle database errors
    if (err.name === "SequelizeValidationError") {
        res.status(errors_1.HttpStatusCode.BAD_REQUEST).json({
            status: "validation_error",
            message: err.message,
        });
        return;
    }
    // Default error
    res.status(errors_1.HttpStatusCode.INTERNAL_SERVER).json({
        status: "error",
        message: "Internal server error",
    });
    return;
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=errorHandler.js.map