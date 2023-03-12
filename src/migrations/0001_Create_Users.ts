import { Kysely, sql } from "kysely";

export async function up(db: Kysely<any>): Promise<void> {
	await db.schema
		.createTable("auth")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("email", "varchar", (col) => col.notNull().unique())
		.addUniqueConstraint("unique_email_constraint", ["email"])
		.addColumn("password", "varchar", (col) => col.notNull())
		.addColumn("username", "varchar", (col) => col.unique())
		.addColumn("role", "varchar", (col) => col.notNull())
		.addColumn("status", "varchar", (col) => col.notNull())
		.addColumn("created_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.addColumn("modified_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.execute();

	await db.schema
		.createTable("users")
		.addColumn("id", "serial", (col) => col.primaryKey())
		.addColumn("first_name", "varchar")
		.addColumn("last_name", "varchar")
		.addColumn("company_name", "varchar")
		.addColumn("company_address", "varchar")
		.addColumn("phone_number", "varchar")
		.addColumn("emergency_numbers", sql`varchar[]`)
		.addColumn("gender", "varchar")
		.addColumn("languages_supported", sql`varchar[]`)
		.addColumn("has_smartphone_access", "boolean")
		.addColumn("has_livetracking_available", "boolean")
		.addColumn("has_dashcam_setup", "boolean")
		.addColumn("areas_serviced", sql`varchar[]`)
		.addColumn("regions_serviced", sql`varchar[]`)
		.addColumn("avatar_image_data", sql`jsonb`)
		.addColumn("bucket_storage_urls", sql`jsonb[]`)
		.addColumn("created_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.addColumn("modified_at", "timestamp", (col) =>
			col.defaultTo(sql`now()`).notNull()
		)
		.execute();
}

export async function down(db: Kysely<any>): Promise<void> {
	await db.schema.dropTable("auth").execute();
	await db.schema.dropTable("users").execute();
}
