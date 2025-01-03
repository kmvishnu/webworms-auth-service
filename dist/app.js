"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const appRoutes_1 = __importDefault(require("./routes/appRoutes"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_config_1 = __importDefault(require("./config/db.config"));
const redisClient_1 = require("./config/redisClient");
const errorHandler_1 = require("./middlewares/errorHandler");
dotenv_1.default.config();
const app = (0, express_1.default)();
(0, db_config_1.default)();
(0, redisClient_1.connectToRedis)()
    .then(() => {
    console.log("Connected to Redis");
})
    .catch((err) => {
    console.error("Failed to connect to Redis:", err);
});
app.use(express_1.default.json());
app.use("/v1", appRoutes_1.default);
app.get("/healthCheck", (req, res) => {
    res.send("Webworms auth-service is up and running!");
});
app.use(errorHandler_1.errorHandler);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
//# sourceMappingURL=app.js.map