import { Request, Response } from "express";
import {
	getWorkflowById,
	getWorkflowsByUserId,
	getWorkflowsByCarrierId,
	createWorkflow,
	editWorkflow,
} from "./service";

export const GetWorkflow = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;

		const workflowId = req.params.workflowId;

		if (!userId || !workflowId) {
			return res.status(400).send(`workflows.GetWorkflow - Missing params`);
		}

		const workflow = await getWorkflowById({ workflowId });

		const returnData = {
			message: "success",
			workflow,
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
		// const searchValue = req.query.search;

		if (!userId) {
			return res.status(400).send(`workflows.GetWorkflow - Missing params`);
		}

		const workflows = await getWorkflowsByUserId({ userId });

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
		if (!carrierId) {
			return res
				.status(400)
				.send(`workflows.GetWorkflowsCarrierFor - Missing params`);
		}

		const workflows = await getWorkflowsByCarrierId({ carrierId });

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
			workflowNotes,
			selectedCarrier,
			uploadedFiles,
		} = body;

		if (
			!workflowAddressData ||
			!workflowContainerData ||
			!workflowNotes ||
			!selectedCarrier ||
			!uploadedFiles
		) {
			return res.status(400).send(`workflows.CreateWorkflow - Missing body`);
		}

		await createWorkflow({
			userId,
			workflowAddressData,
			workflowContainerData,
			workflowNotes,
			selectedCarrier,
			uploadedFiles,
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

		await editWorkflow({ workflowId, data: body });

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
