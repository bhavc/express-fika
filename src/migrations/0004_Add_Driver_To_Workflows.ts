import { Kysely, sql } from "kysely";

// TODO: move into workflow migration during production
export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.alterTable("workflow")
		.addColumn("assigned_driver", "integer")
		.execute();

	await db.schema
		.alterTable("workflow")
		.addForeignKeyConstraint(
			"assigned_driver_constraint",
			["assigned_driver"],
			"users",
			["id"]
			// (cb) => cb.onDelete("cascade")
		)
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema
		.alterTable("workflow")
		.dropColumn("assigned_driver")
		.execute();
}
