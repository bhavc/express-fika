export type PaymentType = {
	id?: string;
	useCustomPricing?: boolean;
	customPrice?: string;
};

export type EditPaymentBidTurnType = "shipper" | "carrier";

export type EditPaymentType = {
	carrierQuote?: string;
	carrierCounter?: string;
	acceptedPrice?: string | null;
	bidTurn?: EditPaymentBidTurnType;
	declineShipment?: boolean;
};
