import { Generated, ColumnType, RawBuilder } from "kysely";
import { WorkflowStatus } from "./types";

export interface WorkflowTable {
	id: Generated<number>;
	user_for: number;
	status: WorkflowStatus;
	selected_carrier: number;
	assigned_driver: number;
	workflow_address_data: Record<string, any>;
	workflow_container_data: Record<string, any>;
	shipper_notes: string;
	carrier_notes: string;
	driver_notes: string;
	// TODO Rename this column Record<string, any>[];
	file_urls: ColumnType<string[]>;
	created_at: ColumnType<Date, string | undefined, never>;
	modified_at: ColumnType<Date, string | undefined, never>;
}

export interface WorkflowStatusTable {
	id: Generated<number>;
	workflow_id: number;
	status: string;
	created_at: ColumnType<Date, string | undefined, never>;
	modified_at: ColumnType<Date, string | undefined, never>;
}

export interface WorkflowNotesTable {
	id: Generated<number>;
	workflow_id: number;
	user_from: number;
	user_to: number;
	message: string;
	created_at: ColumnType<Date, string | undefined, never>;
	modified_at: ColumnType<Date, string | undefined, never>;
}
