import { Db, toJson } from "../../core/database";
import { sql } from "kysely";
const { max } = Db.fn;

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

		const workflowResult = await Db.selectFrom("workflow")
			.leftJoin("users", "users.id", "workflow.user_for")
			.leftJoin(
				"users as userDriver",
				"userDriver.id",
				"workflow.assigned_driver"
			)
			.leftJoin(
				"auth as authDriver",
				"authDriver.id",
				"workflow.assigned_driver"
			)
			.leftJoin(
				"users as userCarrier",
				"userCarrier.id",
				"workflow.selected_carrier"
			)
			.selectAll("workflow")
			.select([
				"userCarrier.id as carrier_id",
				"userCarrier.company_name as carrier_company_name",
				"userDriver.id as driverId",
				"userDriver.first_name as driverFirstname",
				"userDriver.last_name as driverLastname",
				"authDriver.username as driverUsername",
			])
			.where("workflow.id", "=", workflowIdAsNumber)
			.executeTakeFirstOrThrow();

		if (!workflowResult) {
			throw new Error(
				`workflow.service: getWorkflowById - Error getting workflow`
			);
		}

		const workflow = {
			id: workflowResult.id,
			userId: workflowResult.user_for,
			status: workflowResult.status,
			selectedCarrier: {
				id: workflowResult.carrier_id,
				companyName: workflowResult.carrier_company_name,
			},
			assignedDriver: {
				id: workflowResult.driverId,
				firstName: workflowResult.driverFirstname,
				lastName: workflowResult.driverLastname,
				username: workflowResult.driverUsername,
			},
			workflowAddressData: workflowResult.workflow_address_data,
			workflowContainerData: workflowResult.workflow_container_data,
			shipperNotes: workflowResult.shipper_notes,
			carrierNotes: workflowResult.carrier_notes,
			fileUrls: workflowResult.file_urls,
		};

		return workflow;
	} catch (err) {
		throw new Error(
			`workflow.service: getWorkflowById - Error getting workflow ${err.message}`
		);
	}
};

export const getAllWorkflowsByUserId = async ({
	userId,
}: {
	userId: string;
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
				`workflow.service: getAllWorkflowsByUserId - Error getting workflow`
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
			`workflow.service: getAllWorkflowsByUserId - Error getting workflow ${err.message}`
		);
	}
};

export const getWorkflowsByStatusGroup = async ({
	userId,
	statusGroup,
}: {
	userId: string;
	statusGroup?: string;
}) => {
	try {
		const userIdAsNumber = parseInt(userId, 10);
		let result;

		if (statusGroup === "active") {
			result = await Db.selectFrom("workflow")
				.leftJoin("users as carrier", "carrier.id", "workflow.user_for")
				.selectAll("workflow")
				.select([
					"carrier.id as carrier_id",
					"carrier.company_name as carrier_company_name",
				])
				.where("user_for", "=", userIdAsNumber)
				.where("status", "not in", [
					"Rejected",
					"Cancelled",
					"Delivered",
					"Deleted",
				])
				.execute();
		} else {
			result = await Db.selectFrom("workflow")
				.leftJoin("users as carrier", "carrier.id", "workflow.user_for")
				.selectAll("workflow")
				.select([
					"carrier.id as carrier_id",
					"carrier.company_name as carrier_company_name",
				])
				.where("user_for", "=", userIdAsNumber)
				.where("status", "in", [
					"Rejected",
					"Cancelled",
					"Delivered",
					"Deleted",
				])
				.execute();
		}

		if (!result) {
			throw new Error(
				`workflow.service: getWorkflowsByStatusGroup - Error getting workflow`
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
			`workflow.service: getWorkflowsByStatusGroup - Error getting workflow ${err.message}`
		);
	}
};

export const getAllWorkflowsByCarrierId = async ({
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
				`workflow.service: getAllWorkflowsByCarrierId - Error getting workflow`
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
			`workflow.service: getAllWorkflowsByCarrierId - Error getting workflow ${err.message}`
		);
	}
};

export const getWorkflowsByStatusGroupCarrierId = async ({
	carrierId,
	statusGroup,
}: {
	carrierId: string;
	statusGroup: string;
}) => {
	try {
		const carrierIdAsNumber = parseInt(carrierId, 10);
		let result;

		if (statusGroup === "active") {
			result = await Db.selectFrom("workflow")
				.leftJoin("users as carrier", "carrier.id", "workflow.user_for")
				.selectAll("workflow")
				.select([
					"carrier.id as carrier_id",
					"carrier.company_name as carrier_company_name",
				])
				.where("workflow.selected_carrier", "=", carrierIdAsNumber)
				.where("status", "not in", [
					"Rejected",
					"Cancelled",
					"Delivered",
					"Deleted",
				])
				.execute();
		} else {
			result = await Db.selectFrom("workflow")
				.leftJoin("users as carrier", "carrier.id", "workflow.user_for")
				.selectAll("workflow")
				.select([
					"carrier.id as carrier_id",
					"carrier.company_name as carrier_company_name",
				])
				.where("workflow.selected_carrier", "=", carrierIdAsNumber)
				.where("status", "in", [
					"Rejected",
					"Cancelled",
					"Delivered",
					"Deleted",
				])
				.execute();
		}

		if (!result) {
			throw new Error(
				`workflow.service: getWorkflowsByStatusGroupCarrierId - Error getting workflow`
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
			`workflow.service: getWorkflowsByStatusGroupCarrierId - Error getting workflow ${err.message}`
		);
	}
};

// TODO make sure i filter out certain things that a driver does not need to
// see, such as price
export const getWorkflowsByDriverId = async ({
	driverId,
}: {
	driverId: string;
}) => {
	try {
		const driverIdIdAsNumber = parseInt(driverId, 10);

		const result = await Db.selectFrom("workflow")
			.leftJoin("users as driver", "driver.id", "workflow.assigned_driver")
			.selectAll("workflow")
			.where("workflow.assigned_driver", "=", driverIdIdAsNumber)
			.execute();

		const workflows = result.map((workflow) => {
			return {
				id: workflow.id,
				userId: workflow.user_for,
				status: workflow.status,
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
			`workflow.service: getWorkflowsByDriverId - Error getting workflow ${err.message}`
		);
	}
};

export const getLatestWorkflowByDriverId = async ({
	driverId,
}: {
	driverId: string;
}) => {
	try {
		const driverIdIdAsNumber = parseInt(driverId, 10);

		const result = await Db.selectFrom("workflow")
			.leftJoin("users as driver", "driver.id", "workflow.assigned_driver")
			.selectAll("workflow")
			.where("workflow.assigned_driver", "=", driverIdIdAsNumber)
			.executeTakeFirst();

		if (!result) {
			return {};
		}

		const workflow = {
			id: result.id,
			userId: result.user_for,
			status: result.status,
			workflowAddressData: result.workflow_address_data,
			workflowContainerData: result.workflow_container_data,
			shipperNotes: result.shipper_notes,
			carrierNotes: result.carrier_notes,
			fileUrls: result.file_urls,
			createdAt: result.created_at,
		};

		return workflow;
	} catch (err) {
		throw new Error(
			`workflow.service: getLatestWorkflowByDriverId - Error getting workflow ${err.message}`
		);
	}
};

export const getWorkflowStatusForWorkflow = async ({
	workflowId,
}: {
	workflowId: string;
}) => {
	try {
		const parsedWorkflowId = parseInt(workflowId);

		const result = await Db.selectFrom("workflow_status")
			.select("status")
			.distinct()
			.select(max("created_at").as("max_created_at"))
			.where("workflow_id", "=", parsedWorkflowId)
			.groupBy("status")
			.orderBy("max_created_at")
			.orderBy("status")
			.execute();

		const mappedWorkflowStatus = result.map((workflowStatus) => {
			const status = workflowStatus.status;
			const createdAt = workflowStatus.max_created_at;

			return { status, createdAt };
		});

		return mappedWorkflowStatus;
	} catch (err) {
		throw new Error(
			`workflow.service: getWorkflowStatusForWorkflow - Error creating workflow ${err.message}`
		);
	}
};

export const getWorkflowNotesByWorkflowId = async ({
	workflowId,
	userFrom,
	userTo,
}: {
	workflowId: string;
	userFrom: string;
	userTo: string;
}) => {
	try {
		const workflowIdAsNumber = parseInt(workflowId, 10);
		const userFromAsNumber = parseInt(userFrom, 10);
		const userToAsNumber = parseInt(userTo, 10);

		const result =
			await sql`SELECT * FROM workflow_notes WHERE workflow_id = ${workflowIdAsNumber}
		AND (user_from = ${userFromAsNumber} AND user_to = ${userToAsNumber}) OR (user_from = ${userToAsNumber} AND user_to = ${userFromAsNumber})
		ORDER BY created_at
		  `.execute(Db);

		return result.rows;
	} catch (err) {
		throw new Error(
			`workflow.service: getWorkflowNotes - Error getting workflow notes ${err.message}`
		);
	}
};

export const postWorkflowNotesByWorkflowId = async ({
	workflowId,
	userFrom,
	userTo,
	message,
}: {
	workflowId: string;
	userFrom: string;
	userTo: string;
	message: string;
}) => {
	try {
		const workflowIdAsNumber = parseInt(workflowId, 10);
		const userFromAsNumber = parseInt(userFrom, 10);
		const userToAsNumber = parseInt(userTo, 10);

		const result = await Db.insertInto("workflow_notes")
			.values({
				workflow_id: workflowIdAsNumber,
				user_from: userFromAsNumber,
				user_to: userToAsNumber,
				message,
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		return result;
	} catch (err) {
		throw new Error(
			`workflow.service: postWorkflowNotesByWorkflowId - Error getting workflow notes ${err.message}`
		);
	}
};

const updateWorkflowNotes = async ({
	workflowId,
	userFrom,
	userTo,
	message,
}: {
	workflowId: number;
	userFrom: number;
	userTo: number;
	message: string;
}) => {
	try {
		await Db.insertInto("workflow_notes")
			.values({
				workflow_id: workflowId,
				user_from: userFrom,
				user_to: userTo,
				message: message,
			})
			.returningAll()
			.executeTakeFirstOrThrow();
	} catch (err) {
		throw new Error(
			`workflow.service: updateWorkflowNotes - Error updating workflow notes ${err.message}`
		);
	}
};

const updateWorkflowStatus = async ({
	workflowId,
	workflowStatus,
}: {
	workflowId: number;
	workflowStatus: string;
}) => {
	try {
		await Db.insertInto("workflow_status")
			.values({
				workflow_id: workflowId,
				status: workflowStatus,
			})
			.returningAll()
			.executeTakeFirstOrThrow();
	} catch (err) {
		throw new Error(
			`workflow.service: updateWorkflowStatus - Error creating workflow ${err.message}`
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

		await updateWorkflowStatus({
			workflowId: workflow.id,
			workflowStatus: result.status,
		});

		// here we store only the shipper notes because thats
		// all thats available on initial create
		await updateWorkflowNotes({
			workflowId: workflow.id,
			userFrom: result.user_for,
			userTo: result.selected_carrier,
			message: result.shipper_notes,
		});

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

		const { status, assignedDriver, carrierNotes, uploadedFiles, driverNotes } =
			workflowData;

		const workflowDataDb: { [key: string]: any } = {};

		if (status) {
			workflowDataDb.status = status;
		}

		if (assignedDriver) {
			workflowDataDb.assigned_driver = assignedDriver;
		} else {
			workflowDataDb.assigned_driver = null;
		}

		if (carrierNotes) {
			workflowDataDb.carrier_notes = carrierNotes;
		}

		// TODO add this field
		// if (driverNotes) {
		// 	workflowDataDb.driver_notes = driverNotes;
		// }

		if (uploadedFiles) {
			const mappedUploadedFiles = uploadedFiles.map((file) => {
				return JSON.stringify({
					name: file.name,
					type: file.type,
					blobName: file.blobName,
				});
			});

			workflowDataDb.file_urls = mappedUploadedFiles;
		}

		const result = await Db.updateTable("workflow")
			.set(workflowDataDb)
			.where("id", "=", numericId)
			.executeTakeFirstOrThrow();

		if (status) {
			await updateWorkflowStatus({
				workflowId: numericId,
				workflowStatus: status,
			});
		}

		return result.numUpdatedRows;
	} catch (err) {
		throw new Error(
			`users.service: editWorkflow - Error editing user ${err.message}`
		);
	}
};

export const editWorkflowFiles = async ({
	workflowId,
	uploadedFiles,
}: {
	workflowId: string;
	uploadedFiles: FileType[];
}) => {
	try {
		const numericId = parseInt(workflowId, 10);

		const mappedUploadedFiles = uploadedFiles.map((file) => {
			return JSON.stringify({
				name: file.name,
				type: file.type,
				blobName: file.blobName,
			});
		});

		const result = await Db.updateTable("workflow")
			.set({ file_urls: mappedUploadedFiles })
			.where("id", "=", numericId)
			.executeTakeFirstOrThrow();

		return result.numUpdatedRows;
	} catch (err) {
		throw new Error(
			`users.service: editWorkflow - Error editing user ${err.message}`
		);
	}
};
