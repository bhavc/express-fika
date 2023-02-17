import { Request, Response } from "express";
import { getWorkflowById, getWorkflowsByUser } from "./service";

export const GetWorkflow = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;
		const workflowId = req.workflowId;

		if (!userId || !workflowId) {
			return res.status(400).send(`workflows.GetWorkflow - Missing params`);
		}

		const workflow = await getWorkflowById({ workflowId });

		const returnData = {
			workflow,
		};

		return res.status(200).json(returnData);
	} catch (err) {
		return res
			.status(500)
			.send(`workflows.GetWorkflow - Error getting workflow ${err.message}`);
	}
};

export const GetWorkflows = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;

		if (!userId) {
			return res.status(400).send(`workflows.GetWorkflow - Missing params`);
		}

		const workflows = await getWorkflowsByUser({ userId });

		const returnData = {
			workflows,
		};

		return res.status(200).json(returnData);
	} catch (err) {
		return res
			.status(500)
			.send(`workflows.GetWorkflows - Error getting workflow ${err.message}`);
	}
};

export const CreateWorkflow = async (req: Request, res: Response) => {
	try {
		console.log("req", req.userId);

		return res.status(200).json();
	} catch (err) {
		return res
			.status(500)
			.send(`workflows.CreateWorkflow - Error getting workflow ${err.message}`);
	}
};

export const EditWorkflow = async (req: Request, res: Response) => {
	try {
		console.log("req", req.userId);

		return res.status(200).json();
	} catch (err) {
		return res
			.status(500)
			.send(`workflows.EditWorkflow - Error getting workflow ${err.message}`);
	}
};

export const DeleteWorkflow = async (req: Request, res: Response) => {
	try {
		console.log("req", req.userId);

		return res.status(200).json();
	} catch (err) {
		return res
			.status(500)
			.send(`workflows.DeleteWorkflow - Error getting workflow ${err.message}`);
	}
};
