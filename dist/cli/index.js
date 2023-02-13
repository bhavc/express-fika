"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const program = new commander_1.Command();
const migrations_1 = require("../migrations/migrations");
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
        return (0, migrations_1.migrateUp)();
    }
    if (options["Down"]) {
        return (0, migrations_1.migrateDown)();
    }
    if (options["Latest"] || options["L"]) {
        return (0, migrations_1.migrateToLatest)();
    }
    if (options["list"] || options["Ls"]) {
        return (0, migrations_1.getMigrations)();
    }
});
program.parse();
//# sourceMappingURL=index.js.map