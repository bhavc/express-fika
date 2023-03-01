"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRouter = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
exports.AuthRouter = express_1.default.Router();
exports.AuthRouter.post("/register", controller_1.Register);
exports.AuthRouter.post("/login", controller_1.Login);
//# sourceMappingURL=router.js.map