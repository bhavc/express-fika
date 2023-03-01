import { Generated, ColumnType } from "kysely";
import { WorkflowStatus, FileType } from "./types";

// TODO: go over this with mitty
export interface WorkflowTable {
	id: Generated<number>;
	user_for: number;
	status: WorkflowStatus;
	workflowAddressData: Record<string, any>;
	workflowContainerData: Record<string, any>;
	workflowNotes: Record<string, any>;
	file_urls: FileType[];
	created_at: ColumnType<Date, string | undefined, never>;
	modified_at: ColumnType<Date, string | undefined, never>;
}
