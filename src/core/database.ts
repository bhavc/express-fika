import { Pool } from "pg";
import { Kysely, PostgresDialect, RawBuilder, sql } from "kysely";
import dotenv from "dotenv";

import { Database } from "./types";

dotenv.config();

const createPool = () => {
	const user = process.env.POSTGRES_USER;
	const password = process.env.POSTGRES_PASSWORD;
	const database = process.env.POSTGRES_DATABASE;
	let host = process.env.POSTGRES_HOST;

	if (process.env.NODE_ENV === "prod") {
		host = process.env.POSTGRES_SOCKETPATH;
	}

	return new Pool({
		user,
		password,
		database,
		host,
	}).on("error", (err, pool) => {
		if (err) {
			console.log("Unexpected error on idle client", err);
		}
		console.log("connected to postgres", pool.listenerCount);
	});
};

export const Db = new Kysely<Database>({
	dialect: new PostgresDialect({
		pool: createPool(),
	}),
});

export const toJson = <T>(obj: T): RawBuilder<T> => {
	return sql`${JSON.stringify(obj)}`;
};
