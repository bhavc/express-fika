import { AuthTable } from "../features/auth/model";
import { UserTable } from "../features/users/model";
import { WorkflowTable } from "../features/workflows/model";

export interface Database {
	auth: AuthTable;
	users: UserTable;
	workflow: WorkflowTable;
}
