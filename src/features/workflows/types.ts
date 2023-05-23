import type { FileType } from "../files/type";

export type WorkflowStatus =
	| "Draft"
	| "Triage"
	| "Allocated"
	| "In Progress"
	| "Delivered"
	| "Rejected"
	| "Cancelled"
	| "Deleted";

export type WorkflowAddressDataType = {
	containerNumber: string;
	cargoReferenceNumber?: string;
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
	customsReference?: string;
	borderCrossing?: string;
};

export type WorkflowContainerDataType = {
	goodsDescription: string;
	cargoType: string;
	containerLength: string;
	containerWidth: string;
	containerHeight: string;
	containerTypeLabel: string;
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
	shipperNotes?: string;
	carrierNotes?: string;
};

export type WorkflowType = {
	id: string;
	user_for: string;
	status: WorkflowStatus;
	selectedCarrier?: number;
	assignedDriver?: number;
	workflowAddressData: WorkflowAddressDataType;
	workflowContainerData: WorkflowContainerDataType;
	workflowNotes: WorkflowNotesDataType;
	carrierNotes: string;
	shipperNotes: string;
	driverNotes: string;
	uploadedFiles: FileType[];
	fileUrls: FileType[];
	createdAt: string;
	modifiedAt: string;
};
