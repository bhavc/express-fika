import { Command } from "commander";
const program = new Command();
import {
	migrateUp,
	migrateDown,
	migrateToLatest,
	getMigrations,
} from "../migrations/migrations";

program.name("Migration management");

program
	.command("migrate")
	.description("Migration management for database")
	.argument("[migration]", "migration command to run")
	.option("-up", "migrate next migration up")
	.option("-down", "migrate next migration down")
	.option("-latest -l", "migrate to latest")
	.option("-list, -ls", "list all migrations")
	.action((arg, options) => {
		console.log("argument", arg);
		console.log("options", options);
		if (arg) {
			console.log("This command is not supported");
		}

		if (options["Up"]) {
			return migrateUp();
		}

		if (options["Down"]) {
			return migrateDown();
		}

		if (options["Latest"] || options["L"]) {
			return migrateToLatest();
		}

		if (options["list"] || options["Ls"]) {
			return getMigrations();
		}
	});

program.parse();
