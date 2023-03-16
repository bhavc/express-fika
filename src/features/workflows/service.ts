import { Db, toJson } from "../../core/database";

import type {
	WorkflowAddressDataType,
	WorkflowContainerDataType,
	WorkflowNotesDataType,
	WorkflowType,
} from "./types";
import type { UserProfile } from "../users/types";
import type { FileType } from "../files/type";

export const getWorkflowById = async ({
	workflowId,
}: {
	workflowId: string;
}) => {
	try {
		const workflowIdAsNumber = parseInt(workflowId, 10);

		const result = await Db.selectFrom("workflow")
			.innerJoin("users", "users.id", "workflow.user_for")
			.selectAll("workflow")
			.select([
				"users.id as carrier_id",
				"users.company_name as carrier_company_name",
			])
			.where("workflow.id", "=", workflowIdAsNumber)
			.executeTakeFirstOrThrow();

		if (!result) {
			throw new Error(
				`workflow.service: getWorkflowById - Error getting workflow`
			);
		}

		const workflow = {
			id: result.id,
			userId: result.user_for,
			status: result.status,
			selectedCarrier: {
				id: result.carrier_id,
				companyName: result.carrier_company_name,
			},
			workflowAddressData: result.workflow_address_data,
			workflowContainerData: result.workflow_container_data,
			workflowNotes: result.workflow_notes,
			fileUrls: result.file_urls,
		};

		return workflow;
	} catch (err) {
		throw new Error(
			`workflow.service: getWorkflowById - Error getting workflow ${err.message}`
		);
	}
};

export const getWorkflowsByUserId = async ({
	userId,
	searchValue,
}: {
	userId: string;
	searchValue?: string;
}) => {
	try {
		const userIdAsNumber = parseInt(userId, 10);

		const result = await Db.selectFrom("workflow")
			.leftJoin("users as carrier", "carrier.id", "workflow.user_for")
			.selectAll("workflow")
			.select([
				"carrier.id as carrier_id",
				"carrier.company_name as carrier_company_name",
			])
			.where("user_for", "=", userIdAsNumber)
			.execute();

		if (!result) {
			throw new Error(
				`workflow.service: getWorkflowById - Error getting workflow`
			);
		}

		const workflows = result.map((workflow) => {
			return {
				id: workflow.id,
				userId: workflow.user_for,
				status: workflow.status,
				selectedCarrier: {
					id: workflow.carrier_id,
					companyName: workflow.carrier_company_name,
				},
				workflowAddressData: workflow.workflow_address_data,
				workflowContainerData: workflow.workflow_container_data,
				workflowNotes: workflow.workflow_notes,
				fileUrls: workflow.file_urls,
				createdAt: workflow.created_at,
			};
		});

		return workflows;
	} catch (err) {
		throw new Error(
			`workflow.service: getWorkflowById - Error getting workflow ${err.message}`
		);
	}
};

export const getWorkflowsByCarrierId = async ({
	carrierId,
}: {
	carrierId: string;
}) => {
	try {
		const carrierIdAsNumber = parseInt(carrierId, 10);

		const result = await Db.selectFrom("workflow")
			.leftJoin("users as carrier", "carrier.id", "workflow.user_for")
			.selectAll("workflow")
			.select([
				"carrier.id as carrier_id",
				"carrier.company_name as carrier_company_name",
			])
			.where("workflow.selected_carrier", "=", carrierIdAsNumber)
			.execute();

		if (!result) {
			throw new Error(
				`workflow.service: getWorkflowsByCarrierId - Error getting workflow`
			);
		}

		const workflows = result.map((workflow) => {
			return {
				id: workflow.id,
				userId: workflow.user_for,
				status: workflow.status,
				selectedCarrier: {
					id: workflow.carrier_id,
					companyName: workflow.carrier_company_name,
				},
				workflowAddressData: workflow.workflow_address_data,
				workflowContainerData: workflow.workflow_container_data,
				workflowNotes: workflow.workflow_notes,
				fileUrls: workflow.file_urls,
				createdAt: workflow.created_at,
			};
		});

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
	selectedCarrier,
	uploadedFiles,
}: {
	userId: string;
	workflowAddressData: WorkflowAddressDataType;
	workflowContainerData: WorkflowContainerDataType;
	workflowNotes: WorkflowNotesDataType;
	selectedCarrier: UserProfile;
	uploadedFiles: FileType[];
}) => {
	try {
		const parsedUserId = parseInt(userId, 10);

		const jsonFiles = uploadedFiles.map((file) => {
			return JSON.stringify({
				name: file.name,
				type: file.type,
				blobName: file.blobName,
			});
		});

		const result = await Db.insertInto("workflow")
			.values({
				user_for: parsedUserId,
				status: "Triage",
				selected_carrier: selectedCarrier.id,
				workflow_address_data: toJson(workflowAddressData),
				workflow_container_data: toJson(workflowContainerData),
				workflow_notes: toJson(workflowNotes),
				file_urls: jsonFiles,
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		const workflow = {
			id: result.id,
			userId: result.user_for,
			status: result.status,
			selectedCarrier: result.selected_carrier,
			workflowAddressData: result.workflow_address_data,
			workflowContainerData: result.workflow_container_data,
			workflowNotes: result.workflow_notes,
			fileUrls: result.file_urls,
		};

		return workflow;
	} catch (err) {
		throw new Error(
			`workflow.service: createWorkflow - Error creating workflow ${err.message}`
		);
	}
};

export const editWorkflow = async ({
	workflowId,
	data,
}: {
	workflowId: string;
	data: unknown;
}) => {
	try {
		const numericId = parseInt(workflowId, 10);

		const workflowData = data as WorkflowType;

		const { status, carrierNotes } = workflowData;

		const workflowDataDb: { [key: string]: any } = {};

		if (status) {
			workflowDataDb.status = status;
		}

		// TODO: add this column
		// if (carrierNotes) {
		// 	workflowDataDb.carrierNotes = carrierNotes;
		// }

		console.log("workflowDataDb", workflowDataDb);

		const result = await Db.updateTable("workflow")
			.set(workflowDataDb)
			.where("id", "=", numericId)
			.executeTakeFirstOrThrow();

		return result.numUpdatedRows;
	} catch (err) {
		throw new Error(
			`users.service: editUserProfile - Error editing user ${err.message}`
		);
	}
};
