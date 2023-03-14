import { Generated, ColumnType, RawBuilder } from "kysely";
import { WorkflowStatus } from "./types";

export interface WorkflowTable {
	id: Generated<number>;
	user_for: number;
	status: WorkflowStatus;
	selected_carrier: number;
	workflow_address_data: Record<string, any>;
	workflow_container_data: Record<string, any>;
	workflow_notes: Record<string, any>;
	file_urls: ColumnType<string[]>;
	created_at: ColumnType<Date, string | undefined, never>;
	modified_at: ColumnType<Date, string | undefined, never>;
}
