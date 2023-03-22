import { Db } from "../../core/database";

import { PaymentType, EditPaymentType } from "./types";

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

export const editPaymentByWorkflowId = async ({
	workflowId,
	editPaymentData,
}: {
	workflowId: string;
	editPaymentData: EditPaymentType;
}) => {
	try {
		const workflowIdAsNumber = parseInt(workflowId, 10);

		const paymentDataDb: { [key: string]: any } = {};

		// acceptedPrice, update the price
		// update the accepted_by_carrier and accepted_by_shipper
		// and accepted date
		if (editPaymentData.acceptedPrice) {
			paymentDataDb.price = editPaymentData.acceptedPrice;
			paymentDataDb.accepted_by_carrier = true;
			paymentDataDb.accepted_by_shipper = true;
			paymentDataDb.accepted_date = new Date();
		} else if (editPaymentData.carrierQuote) {
			// if carrierQuoteRequest, update the price,
			// update the accepted_by_carrier and accepted_by_shipper
			// and accepted date
			paymentDataDb.price = editPaymentData.carrierQuote;
			paymentDataDb.accepted_by_carrier = true;
			paymentDataDb.accepted_by_shipper = true;
			paymentDataDb.accepted_date = new Date();
		} else if (editPaymentData.declineShipment) {
			// if declien in shipment from shipper side,
			// set price as null and no one accepted anything
			// TODO: maybe add a declined date or remove alltogether
			// all allow bidding for as much as possible
			paymentDataDb.accepted_by_carrier = false;
			paymentDataDb.accepted_by_shipper = false;
		} else {
			paymentDataDb.price = editPaymentData.carrierCounter;
			paymentDataDb.bid_turn = editPaymentData.bidTurn;
		}

		await Db.updateTable("payment")
			.set(paymentDataDb)
			.where("workflow_id", "=", workflowIdAsNumber)
			.executeTakeFirstOrThrow();

		return;
	} catch (err) {
		throw new Error(
			`payment.service: editPaymentByWorkflowId - Error creating payment for workflow ${err.message}`
		);
	}
};
