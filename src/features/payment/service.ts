import { Db } from "../../core/database";

export const createPaymentForWorkflow = async ({
	workflowId,
	price,
}: {
	workflowId: number;
	price: number;
}) => {
	try {
		const result = await Db.insertInto("payment")
			.values({
				workflow_id: workflowId,
				price,
			})
			.returningAll()
			.executeTakeFirstOrThrow();

		const payment = {
			id: result.id,
			workflowId: result.workflow_id,
			price: result.price,
			acceptedByCarrier: result.accepted_by_carrier,
			acceptedByShipper: result.accepted_by_shipper,
			acceptedDate: result.accepted_date,
			createdAt: result.created_at,
			modifiedAt: result.modified_at,
		};

		return payment;
	} catch (err) {
		throw new Error(
			`payment.service: createPaymentForWorkflow - Error creating payment for workflow ${err.message}`
		);
	}
};
