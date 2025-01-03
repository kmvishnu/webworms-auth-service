"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = void 0;
const error_types_1 = require("../types/error.types");
const validateRequest = (schema) => {
    return async (req, res, next) => {
        try {
            await schema.parseAsync(req.body);
            next();
        }
        catch (error) {
            const errorMessages = error.errors.map((err) => ({
                field: err.path.join("."),
                message: err.message,
            }));
            next(new error_types_1.AppError(400, "validation_error", JSON.stringify(errorMessages)));
        }
    };
};
exports.validateRequest = validateRequest;
//# sourceMappingURL=validateRequest.js.map