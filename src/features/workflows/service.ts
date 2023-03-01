import { Db, toJson } from "../../core/database";
import { sql } from "kysely";

import type {
	WorkflowAddressDataType,
	WorkflowContainerDataType,
	WorkflowNotesDataType,
	FileType,
} from "./types";

export const getWorkflowById = async ({
	workflowId,
}: {
	workflowId: string;
}) => {
	try {
		const workflowIdAsNumber = parseInt(workflowId, 10);

		const workflow = await Db.selectFrom("workflow")
			.selectAll()
			.where("id", "=", workflowIdAsNumber)
			.executeTakeFirstOrThrow();

		if (!workflow) {
			throw new Error(
				`workflow.service: getWorkflowById - Error getting workflow`
			);
		}

		return workflow;
	} catch (err) {
		throw new Error(
			`workflow.service: getWorkflowById - Error getting workflow ${err.message}`
		);
	}
};

export const getWorkflowsByUser = async ({ userId }: { userId: string }) => {
	try {
		const userIdAsNumber = parseInt(userId, 10);

		const workflows = await Db.selectFrom("workflow")
			.selectAll()
			.where("user_for", "=", userIdAsNumber)
			.execute();

		if (!workflows) {
			throw new Error(
				`workflow.service: getWorkflowById - Error getting workflow`
			);
		}

		return workflows;
	} catch (err) {
		throw new Error(
			`workflow.service: getWorkflowById - Error getting workflow ${err.message}`
		);
	}
};

export const createWorkflow = async ({
	userId,
	workflowAddressData,
	workflowContainerData,
	workflowNotes,
	uploadedFiles,
}: {
	userId: string;
	workflowAddressData: WorkflowAddressDataType;
	workflowContainerData: WorkflowContainerDataType;
	workflowNotes: WorkflowNotesDataType;
	uploadedFiles: FileType[];
}) => {
	try {
		console.log(workflowAddressData);
		console.log(workflowContainerData);
		console.log(workflowNotes);
		console.log(uploadedFiles);

		const parsedUserId = parseInt(userId, 10);

		const jsonFiles = uploadedFiles.map((file) => {
			return JSON.stringify(file);
		});

		const createdWorkflow = await Db.insertInto("workflow")
			.values({
				user_for: parsedUserId,
				status: "Triage",
				workflowAddressData: toJson(workflowAddressData),
				workflowContainerData: toJson(workflowContainerData),
				workflowNotes: toJson(workflowNotes),
				file_urls: jsonFiles,
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		console.log("createdWorkflow", createdWorkflow.file_urls);
	} catch (err) {
		throw new Error(
			`workflow.service: createWorkflow - Error creating workflow ${err.message}`
		);
	}
};
