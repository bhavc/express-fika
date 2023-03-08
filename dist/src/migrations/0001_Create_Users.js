"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const kysely_1 = require("kysely");
function up(db) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.schema
            .createTable("auth")
            .addColumn("id", "serial", (col) => col.primaryKey())
            .addColumn("email", "varchar", (col) => col.notNull().unique())
            .addUniqueConstraint("unique_email_constraint", ["email"])
            .addColumn("password", "varchar", (col) => col.notNull())
            .addColumn("username", "varchar", (col) => col.unique())
            .addColumn("role", "varchar", (col) => col.notNull())
            .addColumn("status", "varchar", (col) => col.notNull())
            .addColumn("created_at", "timestamp", (col) => col.defaultTo((0, kysely_1.sql) `now()`).notNull())
            .addColumn("modified_at", "timestamp", (col) => col.defaultTo((0, kysely_1.sql) `now()`).notNull())
            .execute();
        yield db.schema
            .createTable("users")
            .addColumn("id", "serial", (col) => col.primaryKey())
            .addColumn("first_name", "varchar")
            .addColumn("last_name", "varchar")
            .addColumn("company_name", "varchar", (col) => col.unique())
            .addColumn("phone_number", "varchar")
            .addColumn("emergency_numbers", (0, kysely_1.sql) `varchar[]`)
            .addColumn("gender", "varchar")
            .addColumn("languages_supported", (0, kysely_1.sql) `varchar[]`)
            .addColumn("smartphone_access", "boolean")
            .addColumn("livetracking_available", "boolean")
            .addColumn("dashcam_setup", "boolean")
            .addColumn("areas_serviced", (0, kysely_1.sql) `varchar[]`)
            .addColumn("region_serviced", (0, kysely_1.sql) `varchar[]`)
            .addColumn("bucket_storage_urls", (0, kysely_1.sql) `varchar[]`)
            .addColumn("created_at", "timestamp", (col) => col.defaultTo((0, kysely_1.sql) `now()`).notNull())
            .addColumn("modified_at", "timestamp", (col) => col.defaultTo((0, kysely_1.sql) `now()`).notNull())
            .execute();
    });
}
exports.up = up;
function down(db) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.schema.dropTable("auth").execute();
        yield db.schema.dropTable("users").execute();
    });
}
exports.down = down;
//# sourceMappingURL=0001_Create_Users.js.map