import { Db, toJson } from "../../core/database";

import type {
	WorkflowAddressDataType,
	WorkflowContainerDataType,
	WorkflowNotesDataType,
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
			.selectAll()
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
				id: result.selected_carrier,
				companyName: result.company_name,
				companyAddress: result.company_address,
				companyPhone: result.phone_number,
				emergencyPhone: result.emergency_numbers,
				languagesSupported: result.languages_supported,
				hasSmartphoneAccess: result.has_smartphone_access,
				hasLivetrackingAvailable: result.has_livetracking_available,
				hasDashcamSetup: result.has_dashcam_setup,
				areasServiced: result.areas_serviced,
				regionsServiced: result.regions_serviced,
				avatarImageData: result.avatar_image_data,
				insuranceFileData: result.insurance_file_data,
				bucketStorageUrls: result.bucket_storage_urls,
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

export const getWorkflowsByUserId = async ({ userId }: { userId: string }) => {
	try {
		const userIdAsNumber = parseInt(userId, 10);

		const result = await Db.selectFrom("workflow")
			.selectAll()
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
				selectedCarrier: workflow.selected_carrier,
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
