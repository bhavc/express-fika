import { Db, toJson } from "../../core/database";

import type {
	WorkflowAddressDataType,
	WorkflowContainerDataType,
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
			.innerJoin(
				"users as driverUser",
				"driverUser.id",
				"workflow.assigned_driver"
			)
			.innerJoin(
				"auth as driverAuth",
				"driverAuth.id",
				"workflow.assigned_driver"
			)
			.selectAll("workflow")
			.select([
				"users.id as carrier_id",
				"users.company_name as carrier_company_name",
				"driverUser.id as driver_id",
				"driverUser.first_name as driverFirstName",
				"driverUser.last_name as driverLastName",
				"driverAuth.username as driverUserName",
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
			assignedDriver: {
				id: result.driver_id,
				firstName: result.driverFirstName,
				lastName: result.driverLastName,
				username: result.driverUserName,
			},
			workflowAddressData: result.workflow_address_data,
			workflowContainerData: result.workflow_container_data,
			shipperNotes: result.shipper_notes,
			carrierNotes: result.carrier_notes,
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
				shipperNotes: workflow.shipper_notes,
				carrierNotes: workflow.carrier_notes,
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
				shipperNotes: workflow.shipper_notes,
				carrierNotes: workflow.carrier_notes,
				fileUrls: workflow.file_urls,
				createdAt: workflow.created_at,
			};
		});

		return workflows;
	} catch (err) {
		throw new Error(
			`workflow.service: getWorkflowsByCarrierId - Error getting workflow ${err.message}`
		);
	}
};

export const createWorkflow = async ({
	userId,
	workflowAddressData,
	workflowContainerData,
	shipperNotes,
	selectedCarrier,
	uploadedFiles,
}: {
	userId: string;
	workflowAddressData: WorkflowAddressDataType;
	workflowContainerData: WorkflowContainerDataType;
	shipperNotes?: string;
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
				shipper_notes: shipperNotes,
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
			shipperNotes: result.shipper_notes,
			carrierNotes: result.carrier_notes,
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
	workflowData,
}: {
	workflowId: string;
	workflowData: WorkflowType;
}) => {
	try {
		const numericId = parseInt(workflowId, 10);

		const { status, assignedDriver, carrierNotes } = workflowData;

		const workflowDataDb: { [key: string]: any } = {};

		if (status) {
			workflowDataDb.status = status;
		}

		if (assignedDriver) {
			workflowDataDb.assigned_driver = assignedDriver;
		}

		if (carrierNotes) {
			workflowDataDb.carrier_notes = carrierNotes;
		}

		const result = await Db.updateTable("workflow")
			.set(workflowDataDb)
			.where("id", "=", numericId)
			.executeTakeFirstOrThrow();

		return result.numUpdatedRows;
	} catch (err) {
		throw new Error(
			`users.service: editWorkflow - Error editing user ${err.message}`
		);
	}
};

// (async () => {
// 	// const result = await Db.selectFrom("workflow")
// 	// 		.innerJoin("users", "users.id", "workflow.user_for")
// 	// 		.innerJoin(
// 	// 			"users as driverUser",
// 	// 			"driverUser.id",
// 	// 			"workflow.assigned_driver"
// 	// 		)
// 	// 		.innerJoin(
// 	// 			"auth as driverAuth",
// 	// 			"driverAuth.id",
// 	// 			"workflow.assigned_driver"
// 	// 		)
// 	// 		.selectAll("workflow")
// 	// 		.select([
// 	// 			"users.id as carrier_id",
// 	// 			"users.company_name as carrier_company_name",
// 	// 			"driverUser.id as driver_id",
// 	// 			"driverUser.first_name as driverFirstName",
// 	// 			"driverUser.last_name as driverLastName",
// 	// 			"driverAuth.username as driverUserName",
// 	// 		])
// 	// 		.where("workflow.id", "=", workflowIdAsNumber)
// 	// 		.executeTakeFirstOrThrow();

// 	const result = await Db.selectFrom("workflow")
// 		.leftJoin("users", "users.id", "workflow.user_for")
// 		.leftJoin("users as userDriver", (join) =>
// 			join
// 				.onRef("userDriver.id", "=", "workflow.assigned_driver")
// 				.onExists("workflow.assigned_driver")
// 		)
// 		.selectAll("workflow")
// 		.select([
// 			"users.id as carrier_id",
// 			"users.company_name as carrier_company_name",
// 		])
// 		.where("workflow.id", "=", 1)
// 		.executeTakeFirstOrThrow();

// 	// await db
// 	// 	.selectFrom("person")
// 	// 	.innerJoin("pet", (join) =>
// 	// 		join.onRef("pet.owner_id", "=", "person.id").on("pet.name", "=", "Doggo")
// 	// 	)
// 	// 	.selectAll()
// 	// 	.execute();

// 	console.log("result", result);
// })();
