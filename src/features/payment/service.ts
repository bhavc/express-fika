import { Db } from "../../core/database";

import { PaymentType } from "./types";

// TODO we will update the price as users go back and forth

// step 1, user will always create a workflow with useCustomPrice and the customPrice.

// when editing the workflow, you can edit whenever parties agree
// if custom price then save,
// if not save the shippers quote.
// if negotiating, save when a user says they agree on price

export const createPaymentByWorkflowId = async ({
	workflowId,
	workflowPriceData,
}: {
	workflowId: number;
	workflowPriceData: PaymentType;
}) => {
	try {
		const paymentDbValues: { [key: string | number]: string | number } = {
			workflow_id: workflowId,
		};

		if (workflowPriceData.useCustomPricing && workflowPriceData.customPrice) {
			paymentDbValues.price = workflowPriceData.customPrice;
		}

		const result = await Db.insertInto("payment")
			.values(paymentDbValues)
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

export const getPaymentByWorkflowId = async ({
	workflowId,
}: {
	workflowId: string;
}) => {
	try {
		const workflowIdAsNumber = parseInt(workflowId, 10);

		const result = await Db.selectFrom("payment")
			.selectAll()
			.where("workflow_id", "=", workflowIdAsNumber)
			.executeTakeFirstOrThrow();

		// shipper creates without price

		// if it has no price, it was just created
		// carrier has to accept -> add price and accepted for both and move to allocated
		// shipper rfq, carrier accepts add price and accept for both
		// carrier counter, no accepted by and workflow in another status

		const payment = {
			id: result.id,
			// TODO rename to workflow_for
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
