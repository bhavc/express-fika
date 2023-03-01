export type WorkflowStatus =
	| "Draft"
	| "Triage"
	| "In Progress"
	| "Shipped"
	| "Cancelled"
	| "Deleted";

export type WorkflowAddressDataType = {
	containerNumber: string;
	shipmentNumber?: string;
	pickupCompanyName: string;
	pickupAddress: string;
	pickupContactName: string;
	pickupContactPhone?: string;
	pickupWindow?: string;
	pickupAppointmentNeeded?: boolean;
	dropoffCompanyName: string;
	dropoffAddress: string;
	dropoffContactName: string;
	dropoffContactPhone?: string;
	dropoffWindow?: string;
	dropOffAppointmentNeeded?: boolean;
	bolNumber?: string;
	t1Number?: string;
	borderCrossing?: string;
};

export type WorkflowContainerDataType = {
	useCustomPricing?: boolean;
	customPrice?: string;
	goodsDescription: string;
	cargoType: string; // TODO this is not showing the string
	length: string;
	width: string;
	height: string;
	sealNumber: string;
	numberOfPackages: string;
	grossWeight: string;
	netWeight: string;
	goodsVolume: string;
	isHumid?: boolean;
	damaged?: boolean;
	frozen?: boolean;
	requiresChiller?: boolean;
	requiresControlledAtmosphere?: boolean;
	isDropoff?: boolean;
	dropoffTerminalName?: string;
	isReturn?: boolean;
	returnDepotName?: string;
	shippingLine?: string;
	vesselName?: string;
};

export type WorkflowNotesDataType = {
	notes?: string;
};

export type FileType = {
	name: string;
	type: string;
	url: string;
};
