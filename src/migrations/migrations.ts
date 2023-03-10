import * as path from "path";
import { Pool } from "pg";
import { promises as fs } from "fs";
import {
	Kysely,
	Migrator,
	PostgresDialect,
	FileMigrationProvider,
} from "kysely";
import dotenv from "dotenv";

import { Database } from "../core/types";

dotenv.config();

const migrationFolder = path.join(__dirname, "..", "migrations");

const user = process.env.POSTGRES_USER;
const password = process.env.POSTGRES_PASSWORD;
const database = process.env.POSTGRES_DATABASE;
const host = process.env.POSTGRES_HOST;

const db = new Kysely<Database>({
	dialect: new PostgresDialect({
		pool: new Pool({
			// connectionString: process.env.POSTGRES_CONNECTION_STRING,
			user,
			password,
			database,
			host,
		}),
	}),
});

const migrator = new Migrator({
	db,
	provider: new FileMigrationProvider({
		fs,
		path,
		migrationFolder,
	}),
});

export const migrateToLatest = async () => {
	const { error, results } = await migrator.migrateToLatest();

	results?.forEach((it) => {
		if (it.status === "Success") {
			console.log(`migration "${it.migrationName}" was executed successfully`);
		} else if (it.status === "Error") {
			console.error(`failed to execute migration "${it.migrationName}"`);
		}
	});

	if (error) {
		console.error("failed to migrate to latest");
		console.error(error);
		process.exit(1);
	}

	await db.destroy();
};

export const migrateDown = async () => {
	const { error, results } = await migrator.migrateDown();
	results?.forEach((it) => {
		if (it.status === "Success") {
			console.log(`migration "${it.migrationName}" was executed successfully`);
		} else if (it.status === "Error") {
			console.error(`failed to execute migration "${it.migrationName}"`);
		}
	});

	if (error) {
		console.error("failed to migrate down");
		console.error(error);
		process.exit(1);
	}

	await db.destroy();
};

export const migrateUp = async () => {
	const { error, results } = await migrator.migrateUp();

	results?.forEach((it) => {
		if (it.status === "Success") {
			console.log(`migration "${it.migrationName}" was executed successfully`);
		} else if (it.status === "Error") {
			console.error(`failed to execute migration "${it.migrationName}"`);
		}
	});

	if (error) {
		console.error("failed to migrate up");
		console.error(error);
		process.exit(1);
	}

	await db.destroy();
};

export const getMigrations = async () => {
	const migrationInfo = await migrator.getMigrations();

	migrationInfo.map((migration) => {
		console.log("name: ", migration.name);
		console.log("executed at: ", migration.executedAt);
		console.log("migration: ", migration.migration);
	});

	await db.destroy();
};

// export const migrateTo
