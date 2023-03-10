"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRouter = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const controller_2 = require("../auth/controller");
exports.UserRouter = express_1.default.Router();
exports.UserRouter.get("/current", controller_2.Authorize, controller_1.GetCurrentUser);
exports.UserRouter.put("/", controller_2.Authorize, controller_1.EditUser);
//# sourceMappingURL=router.js.map