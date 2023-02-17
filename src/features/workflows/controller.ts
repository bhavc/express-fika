import { Request, Response } from "express";

export const GetWorkflow = async (req: Request, res: Response) => {
	try {
		const userId = req.userId;
		const workflowId = req.workflowId;

		if (!userId || !workflowId) {
			return res.status(400).send(`workflows.GetWorkflow - Missing params`);
		}

		return res.status(200).json();
	} catch (err) {
		return res
			.status(500)
			.send(`workflows.GetWorkflow - Error getting workflow ${err.message}`);
	}
};

export const GetWorkflows = async (req: Request, res: Response) => {
	try {
		console.log("req", req.userId);

		return res.status(200).json();
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
