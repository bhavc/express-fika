import { AuthTable } from "../features/auth/model";
import { UserTable } from "../features/users/model";

export interface Database {
	auth: AuthTable;
	users: UserTable;
}
