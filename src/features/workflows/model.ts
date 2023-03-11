import { Generated, ColumnType, RawBuilder } from "kysely";
import { WorkflowStatus } from "./types";

export interface WorkflowTable {
	id: Generated<number>;
	user_for: number;
	status: WorkflowStatus;
	workflowAddressData: Record<string, any>;
	workflowContainerData: Record<string, any>;
	workflowNotes: Record<string, any>;
	file_urls: ColumnType<string[]>;
	created_at: ColumnType<Date, string | undefined, never>;
	modified_at: ColumnType<Date, string | undefined, never>;
}
