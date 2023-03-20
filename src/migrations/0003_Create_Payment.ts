import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("payment")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("workflow_id", "integer", (col) => col.notNull())
		.addForeignKeyConstraint(
			"workflow_id_constraint",
			["workflow_id"],
			"workflow",
			["id"],
			(cb) => cb.onDelete("cascade")
		)
		.addColumn("price", "decimal")
		.addColumn("accepted_by_carrier", "boolean", (col) =>
			col.notNull().defaultTo("false")
		)
		.addColumn("accepted_by_shipper", "boolean", (col) =>
			col.notNull().defaultTo("false")
		)
		.addColumn("bid_turn", "integer")
		.addForeignKeyConstraint(
			"bid_turn_constraint",
			["bid_turn"],
			"user",
			["id"],
			(cb) => cb.onDelete("cascade")
		)
		.addColumn("accepted_date", "timestamp")
		.addColumn("created_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.addColumn("modified_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("payment").execute();
}
