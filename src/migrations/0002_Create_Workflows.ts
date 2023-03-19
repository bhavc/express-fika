import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("workflow")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("user_for", "integer", (col) => col.notNull())
		.addForeignKeyConstraint(
			"user_for_constraint",
			["user_for"],
			"users",
			["id"],
			(cb) => cb.onDelete("cascade")
		)
		.addColumn("status", "varchar", (col) => col.notNull())
		.addColumn("selected_carrier", "integer", (col) => col.notNull())
		.addForeignKeyConstraint(
			"selected_carrier_constraint",
			["selected_carrier"],
			"users",
			["id"],
			(cb) => cb.onDelete("cascade")
		)
		.addColumn("workflow_address_data", "jsonb")
		.addColumn("workflow_container_data", "jsonb")
		.addColumn("shipper_notes", "varchar")
		.addColumn("carrier_notes", "varchar")
		.addColumn("file_urls", sql`jsonb[]`)
		.addColumn("created_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.addColumn("modified_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("workflow").execute();
}
