import { AuthTable } from "../features/auth/model";
import { PaymentTable } from "../features/payment/model";
import { UserTable } from "../features/users/model";
import { WorkflowTable } from "../features/workflows/model";

export interface Database {
	auth: AuthTable;
	payment: PaymentTable;
	users: UserTable;
	workflow: WorkflowTable;
}
