import { Request, Response } from "express";
import {
	getWorkflowById,
	getAllWorkflowsByUserId,
	getAllWorkflowsByCarrierId,
	getWorkflowsByDriverId,
	getWorkflowStatusForWorkflow,
	getLatestWorkflowByDriverId,
	getWorkflowNotesByWorkflowId,
	postWorkflowNotesByWorkflowId,
	createWorkflow,
	editWorkflow,
	editWorkflowFiles,
	getWorkflowsByStatusGroup,
	getWorkflowsByStatusGroupCarrierId,
} from "./service";
import {
	createPaymentByWorkflowId,
	getPaymentByWorkflowId,
	editPaymentByWorkflowId,
} from "../payment/service";
import { generateSignedUrl } from "../files/service";

import type { WorkflowType } from "./types";
import type { EditPaymentType } from "../payment/types";
import type { FileType } from "../files/type";

export const GetWorkflow = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;
		const workflowId = req.params.id;

		if (!userId || !workflowId) {
			return res.status(400).send(`workflows.GetWorkflow - Missing params`);
		}

		const workflow = await getWorkflowById({ workflowId });
		const payment = await getPaymentByWorkflowId({ workflowId });

		const workflowFiles = workflow.fileUrls;
		const workflowFilesUnknown = workflowFiles as unknown;
		const workflowFilesAsFileType = workflowFilesUnknown as FileType[];

		if (workflowFilesAsFileType && workflowFilesAsFileType.length > 0) {
			for (const workflowFile of workflowFilesAsFileType) {
				const signedFileUrl = await generateSignedUrl(workflowFile.blobName);
				workflowFile.url = signedFileUrl;
			}
		}

		const workflowToFe = {
			...workflow,
			workflowPriceData: payment,
		};

		const returnData = {
			message: "success",
			workflow: workflowToFe,
		};

		return res.status(200).json(returnData);
	} catch (err) {
		return res
			.status(500)
			.send(`workflows.GetWorkflow - Error getting workflow ${err.message}`);
	}
};

export const GetWorkflowsUserFor = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;
		const query = req.query;
		const statusGroup = query.statusGroup as string;

		if (!userId) {
			return res.status(400).send(`workflows.GetWorkflow - Missing params`);
		}

		let workflows;
		if (statusGroup) {
			workflows = await getWorkflowsByStatusGroup({ userId, statusGroup });
		} else {
			workflows = await getAllWorkflowsByUserId({ userId });
		}

		const returnData = {
			workflows,
		};

		return res.status(200).json(returnData);
	} catch (err) {
		return res
			.status(500)
			.send(
				`workflows.GetWorkflowsUserFor - Error getting workflow ${err.message}`
			);
	}
};

export const GetWorkflowsCarrierFor = async (req: Request, res: Response) => {
	try {
		const carrierId = req.userId;
		const query = req.query;
		const statusGroup = query.statusGroup as string;

		if (!carrierId) {
			return res
				.status(400)
				.send(`workflows.GetWorkflowsCarrierFor - Missing params`);
		}

		let workflows;
		if (statusGroup) {
			workflows = await getWorkflowsByStatusGroupCarrierId({
				carrierId,
				statusGroup,
			});
		} else {
			workflows = await getAllWorkflowsByCarrierId({ carrierId });
		}

		const returnData = {
			workflows,
		};

		return res.status(200).json(returnData);
	} catch (err) {
		return res
			.status(500)
			.send(
				`workflows.GetWorkflowsCarrierFor - Error getting workflow ${err.message}`
			);
	}
};

export const GetWorkflowsDriverFor = async (req: Request, res: Response) => {
	try {
		const driverId = req.userId;
		if (!driverId) {
			return res
				.status(400)
				.send(`workflows.GetWorkflowsCarrierFor - Missing params`);
		}

		const workflows = await getWorkflowsByDriverId({ driverId });

		const returnData = {
			message: "Successfully retrieved workflows",
			data: workflows,
		};

		return res.status(200).json(returnData);
	} catch (err) {
		return res
			.status(500)
			.send(
				`workflows.GetWorkflowsCarrierFor - Error getting workflow ${err.message}`
			);
	}
};

export const GetWorkflowsDriverForLatest = async (
	req: Request,
	res: Response
) => {
	try {
		const driverId = req.userId;
		if (!driverId) {
			return res
				.status(400)
				.send(`workflows.GetWorkflowsCarrierFor - Missing params`);
		}

		const workflow = await getLatestWorkflowByDriverId({ driverId });

		const returnData = {
			message: "Successfully retrieved workflows",
			data: workflow,
		};

		return res.status(200).json(returnData);
	} catch (err) {
		return res
			.status(500)
			.send(
				`workflows.GetWorkflowsCarrierFor - Error getting workflow ${err.message}`
			);
	}
};

export const GetWorkflowStatusForWorkflow = async (
	req: Request,
	res: Response
) => {
	try {
		const workflowId = req.params.id;
		if (!workflowId) {
			return res.status(400).send(`workflows.GetWorkflow - Missing params`);
		}

		const workflowStatus = await getWorkflowStatusForWorkflow({ workflowId });

		const returnData = {
			message: "success",
			workflowStatus,
		};

		return res.status(200).json(returnData);
	} catch (err) {
		return res
			.status(500)
			.send(
				`workflows.GetWorkflowStatusForWorkflow - Error getting workflow status ${err.message}`
			);
	}
};

export const GetWorkflowNotesForWorkflow = async (
	req: Request,
	res: Response
) => {
	try {
		const userId = req.userId;
		const workflowId = req.params.id;
		const userTo = req.params.userTo;

		if (!workflowId || !userTo) {
			return res
				.status(400)
				.send(`workflows.GetWorkflowNotesForWorkflow - Missing params userTo`);
		}

		const workflowNotes = await getWorkflowNotesByWorkflowId({
			workflowId,
			userFrom: userId,
			userTo,
		});

		const returnData = {
			message: "success",
			workflowNotes,
		};

		return res.status(200).json(returnData);
	} catch (err) {
		return res
			.status(500)
			.send(
				`workflows.GetWorkflowStatusForWorkflow - Error getting workflow status ${err.message}`
			);
	}
};

export const PostWorkflowNotesForWorkflow = async (
	req: Request,
	res: Response
) => {
	try {
		const userId = req.userId;
		const workflowId = req.params.id;
		const userTo = req.params.userTo;

		if (!workflowId || !userTo) {
			return res
				.status(400)
				.send(`workflows.PostWorkflowNotesForWorkflow - Missing params userTo`);
		}

		const data = req.body;
		const message = data.message;

		await postWorkflowNotesByWorkflowId({
			workflowId,
			userFrom: userId,
			userTo,
			message,
		});

		const workflowNotes = await getWorkflowNotesByWorkflowId({
			workflowId,
			userFrom: userId,
			userTo,
		});

		const returnData = {
			message: "success",
			workflowNotes,
		};

		return res.status(200).json(returnData);
	} catch (err) {
		return res
			.status(500)
			.send(
				`workflows.PostWorkflowNotesForWorkflow - Error getting workflow status ${err.message}`
			);
	}
};

// too add generics here
// interface APIResponse<Data> {
// 	data: Data;
// 	message: string;
// }

//    <Empty, APIResponse, ,>

export const CreateWorkflow = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;
		if (!userId) {
			return res.status(400).send(`workflows.CreateWorkflow - Missing params`);
		}

		const { body } = req;
		const {
			workflowAddressData,
			workflowContainerData,
			workflowPriceData,
			shipperNotes,
			selectedCarrier,
			uploadedFiles,
		} = body;

		if (
			!workflowAddressData ||
			!workflowContainerData ||
			!workflowPriceData ||
			!selectedCarrier ||
			!uploadedFiles
		) {
			return res.status(400).send(`workflows.CreateWorkflow - Missing body`);
		}

		const workflow = await createWorkflow({
			userId,
			workflowAddressData,
			workflowContainerData,
			shipperNotes,
			selectedCarrier,
			uploadedFiles,
		});

		// TODO maybe workflow should point to payment instead of other way around
		await createPaymentByWorkflowId({
			workflowId: workflow.id,
			workflowPriceData,
		});

		return res.status(200).json({
			message: "Successfully created workflow",
		});
	} catch (err) {
		return res
			.status(500)
			.send(`workflows.CreateWorkflow - Error getting workflow ${err.message}`);
	}
};

export const EditWorkflow = async (req: Request, res: Response) => {
	try {
		const workflowId = req.params.id;

		if (!workflowId) {
			return res
				.status(400)
				.send(`workflows.EditWorkflow - Missing workflow Id`);
		}

		const { body } = req;
		const workflowData = body.workflow as WorkflowType;
		const editPaymentData = body.payment as EditPaymentType;
		const uploadedFiles = body.uploadedFiles as FileType[];

		if (workflowData) {
			await editWorkflow({ workflowId, workflowData });
		}

		if (editPaymentData) {
			await editPaymentByWorkflowId({ workflowId, editPaymentData });
		}

		if (uploadedFiles && uploadedFiles.length > 0) {
			await editWorkflowFiles({ workflowId, uploadedFiles });
		}

		const returnData = {
			message: "Successfully updated workflow",
		};

		return res.status(200).json(returnData);
	} catch (err) {
		return res
			.status(500)
			.send(`workflows.EditWorkflow - Error getting workflow ${err.message}`);
	}
};

export const DeleteWorkflow = async (req: Request, res: Response) => {
	try {
		return res.status(200).json();
	} catch (err) {
		return res
			.status(500)
			.send(`workflows.DeleteWorkflow - Error getting workflow ${err.message}`);
	}
};
