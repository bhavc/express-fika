import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("workflow_notes")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("workflow_id", "integer", (col) => col.notNull())
		.addForeignKeyConstraint(
			"workflow_id_constraint",
			["workflow_id"],
			"workflow",
			["id"],
			(cb) => cb.onDelete("cascade")
		)
        .addColumn("user_from", "integer", (col) => col.notNull())
        .addForeignKeyConstraint(
			"user_from_constraint",
			["user_from"],
			"users",
			["id"],
			(cb) => cb.onDelete("cascade")
		)
        .addColumn("user_to", "integer", (col) => col.notNull())
        .addForeignKeyConstraint(
			"user_to_constraint",
			["user_to"],
			"users",
			["id"],
			(cb) => cb.onDelete("cascade")
		)
        .addColumn("message", "varchar", (col) => col.notNull())
		.addColumn("created_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.addColumn("modified_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("workflow_notes").execute();
}
