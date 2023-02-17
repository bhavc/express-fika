import { Db } from "../../core/database";

export const getWorkflowById = async ({
	workflowId,
}: {
	workflowId: string;
}) => {
	try {
		const workflowIdAsNumber = parseInt(workflowId);

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
		const userIdAsNumber = parseInt(userId);

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
