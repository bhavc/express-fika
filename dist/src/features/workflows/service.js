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
exports.createWorkflow = exports.getWorkflowsByUserId = exports.getWorkflowById = void 0;
const database_1 = require("../../core/database");
const getWorkflowById = ({ workflowId, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const workflowIdAsNumber = parseInt(workflowId, 10);
        const workflow = yield database_1.Db.selectFrom("workflow")
            .selectAll()
            .where("id", "=", workflowIdAsNumber)
            .executeTakeFirstOrThrow();
        if (!workflow) {
            throw new Error(`workflow.service: getWorkflowById - Error getting workflow`);
        }
        return workflow;
    }
    catch (err) {
        throw new Error(`workflow.service: getWorkflowById - Error getting workflow ${err.message}`);
    }
});
exports.getWorkflowById = getWorkflowById;
const getWorkflowsByUserId = ({ userId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userIdAsNumber = parseInt(userId, 10);
        const workflows = yield database_1.Db.selectFrom("workflow")
            .selectAll()
            .where("user_for", "=", userIdAsNumber)
            .execute();
        if (!workflows) {
            throw new Error(`workflow.service: getWorkflowById - Error getting workflow`);
        }
        return workflows;
    }
    catch (err) {
        throw new Error(`workflow.service: getWorkflowById - Error getting workflow ${err.message}`);
    }
});
exports.getWorkflowsByUserId = getWorkflowsByUserId;
const createWorkflow = ({ userId, workflowAddressData, workflowContainerData, workflowNotes, uploadedFiles, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const parsedUserId = parseInt(userId, 10);
        const jsonFiles = uploadedFiles.map((file) => {
            return JSON.stringify({
                name: file.name,
                type: file.type,
                blobName: file.blobName,
            });
        });
        const createdWorkflow = yield database_1.Db.insertInto("workflow")
            .values({
            user_for: parsedUserId,
            status: "Triage",
            workflowAddressData: (0, database_1.toJson)(workflowAddressData),
            workflowContainerData: (0, database_1.toJson)(workflowContainerData),
            workflowNotes: (0, database_1.toJson)(workflowNotes),
            file_urls: jsonFiles,
        })
            .returningAll()
            .executeTakeFirstOrThrow();
        return createdWorkflow;
    }
    catch (err) {
        throw new Error(`workflow.service: createWorkflow - Error creating workflow ${err.message}`);
    }
});
exports.createWorkflow = createWorkflow;
//# sourceMappingURL=service.js.map