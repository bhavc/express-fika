export type CargoType =
	| "Container"
	| "FCL"
	| "LCL"
	| "Reefer"
	| "Flat Bed"
	| "OOG"
	| "Fragile"
	| "Hazardous"
	| "Bulk";

export type LocationType =
	| "Residential"
	| "Commercial"
	| "Dock"
	| "Lift gate"
	| "Crane"
	| "Side load";

export type WorkflowStatus =
	| "Draft"
	| "Triage"
	| "In Progress"
	| "Shipped"
	| "Cancelled"
	| "Deleted";
