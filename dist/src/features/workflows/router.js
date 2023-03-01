"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowRouter = void 0;
const express_1 = __importDefault(require("express"));
const controller_1 = require("./controller");
const controller_2 = require("../auth/controller");
exports.WorkflowRouter = express_1.default.Router();
exports.WorkflowRouter.get("/", controller_2.Authorize, controller_1.GetWorkflows);
exports.WorkflowRouter.get("/:workflowId", controller_2.Authorize, controller_1.GetWorkflow);
exports.WorkflowRouter.post("/", controller_2.Authorize, controller_1.CreateWorkflow);
exports.WorkflowRouter.patch("/:id", controller_2.Authorize, controller_1.EditWorkflow);
exports.WorkflowRouter.delete("/:id", controller_2.Authorize, controller_1.DeleteWorkflow);
//# sourceMappingURL=router.js.map