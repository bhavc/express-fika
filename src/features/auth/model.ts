import { Generated, ColumnType } from "kysely";
import { Role, AuthStatus } from "./types";

export interface AuthTable {
	id: Generated<number>;
	email: string;
	username?: string;
	password: string;
	role: Role;
	status: AuthStatus;
	// groups: null;
	// permissions: null;
	// isActive: boolean;
	created_at: ColumnType<Date, string | undefined, never>;
	modified_at: ColumnType<Date, string | undefined, never>;
}
