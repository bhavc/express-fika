import { Pool } from "pg";
import { Kysely, PostgresDialect, RawBuilder, sql } from "kysely";
import dotenv from "dotenv";

import { Database } from "./types";

dotenv.config();

// TODO fix this
export const Db = new Kysely<Database>({
	dialect: new PostgresDialect({
		pool: new Pool({
			connectionString: process.env.POSTGRES_CONNECTION_STRING,
		}).on("error", (err, pool) => {
			if (err) {
				console.log("Unexpected error on idle client", err);
			}
			console.log("connected to postgres", pool.listenerCount);
		}),
	}),
	log(event) {
		console.log("event", event);
	},
});

export const toJson = <T>(obj: T): RawBuilder<T> => {
	return sql`${JSON.stringify(obj)}`;
};

// export const toJson = <T>(object: T): RawBuilder<T> => {
// 	return sql`cast (${JSON.stringify(object)} as jsonb)`;
// };
