import { Pool } from "pg";
import { Kysely, PostgresDialect } from "kysely";
import dotenv from "dotenv";

import { Database } from "./types";

dotenv.config();

export const Db = new Kysely<Database>({
	// Use MysqlDialect for MySQL and SqliteDialect for SQLite.
	dialect: new PostgresDialect({
		pool: new Pool({
			connectionString: process.env.POSTGRES_CONNECTION_STRING,
		}),
	}),
});
