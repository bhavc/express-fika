import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.alterTable("workflow")
		.addColumn("workflow_assigned_vehicle", "jsonb")
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	// await db.schema.dropTable("workflow_notes").execute();
	await db.schema
		.alterTable("workflow")
		.dropColumn("workflow_assigned_vehicle")
		.execute();
}
