import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("workflow_statuses")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("workflow_id", "integer", (col) => col.notNull())
		.addForeignKeyConstraint(
			"workflow_id_constraint",
			["workflow_id"],
			"workflow",
			["id"],
			(cb) => cb.onDelete("cascade")
		)
		.addColumn("status", "varchar", (col) => col.notNull())
		.addColumn("created_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.addColumn("modified_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("workflow_statuses").execute();
}
