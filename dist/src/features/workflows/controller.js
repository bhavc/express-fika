"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteWorkflow = exports.EditWorkflow = exports.CreateWorkflow = exports.GetWorkflows = exports.GetWorkflow = void 0;
const service_1 = require("./service");
const GetWorkflow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        const workflowId = req.workflowId;
        if (!userId || !workflowId) {
            return res.status(400).send(`workflows.GetWorkflow - Missing params`);
        }
        const workflow = yield (0, service_1.getWorkflowById)({ workflowId });
        const returnData = {
            workflow,
        };
        return res.status(200).json(returnData);
    }
    catch (err) {
        return res
            .status(500)
            .send(`workflows.GetWorkflow - Error getting workflow ${err.message}`);
    }
});
exports.GetWorkflow = GetWorkflow;
const GetWorkflows = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).send(`workflows.GetWorkflow - Missing params`);
        }
        const workflows = yield (0, service_1.getWorkflowsByUserId)({ userId });
        const returnData = {
            workflows,
        };
        return res.status(200).json(returnData);
    }
    catch (err) {
        return res
            .status(500)
            .send(`workflows.GetWorkflows - Error getting workflow ${err.message}`);
    }
});
exports.GetWorkflows = GetWorkflows;
// too add generics here
// interface APIResponse<Data> {
// 	data: Data;
// 	message: string;
// }
//    <Empty, APIResponse, ,>
const CreateWorkflow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(400).send(`workflows.CreateWorkflow - Missing params`);
        }
        const { body } = req;
        const { workflowAddressData, workflowContainerData, workflowNotes, uploadedFiles, } = body;
        if (!workflowAddressData ||
            !workflowContainerData ||
            !workflowNotes ||
            !uploadedFiles) {
            return res.status(400).send(`workflows.CreateWorkflow - Missing body`);
        }
        const createWorkflowResult = (0, service_1.createWorkflow)({
            userId,
            workflowAddressData,
            workflowContainerData,
            workflowNotes,
            uploadedFiles,
        });
        return res.status(200).json({
            message: "Successfully created workflow",
        });
    }
    catch (err) {
        return res
            .status(500)
            .send(`workflows.CreateWorkflow - Error getting workflow ${err.message}`);
    }
});
exports.CreateWorkflow = CreateWorkflow;
const EditWorkflow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(200).json();
    }
    catch (err) {
        return res
            .status(500)
            .send(`workflows.EditWorkflow - Error getting workflow ${err.message}`);
    }
});
exports.EditWorkflow = EditWorkflow;
const DeleteWorkflow = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(200).json();
    }
    catch (err) {
        return res
            .status(500)
            .send(`workflows.DeleteWorkflow - Error getting workflow ${err.message}`);
    }
});
exports.DeleteWorkflow = DeleteWorkflow;
//# sourceMappingURL=controller.js.map