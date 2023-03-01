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
            .createTable("workflow")
            .addColumn("id", "serial", (col) => col.primaryKey())
            .addColumn("user_for", "integer", (col) => col.notNull())
            .addForeignKeyConstraint("user_for_constraint", ["user_for"], "users", ["id"], (cb) => cb.onDelete("cascade"))
            .addColumn("status", "varchar", (col) => col.notNull().unique())
            .addColumn("workflowAddressData", "jsonb")
            .addColumn("workflowContainerData", "jsonb")
            .addColumn("workflowNotes", "jsonb")
            .addColumn("file_urls", (0, kysely_1.sql) `jsonb[]`)
            .addColumn("created_at", "timestamp", (col) => col.defaultTo((0, kysely_1.sql) `now()`).notNull())
            .addColumn("modified_at", "timestamp", (col) => col.defaultTo((0, kysely_1.sql) `now()`).notNull())
            .execute();
    });
}
exports.up = up;
function down(db) {
    return __awaiter(this, void 0, void 0, function* () {
        yield db.schema.dropTable("workflow").execute();
    });
}
exports.down = down;
//# sourceMappingURL=0002_Create_Workflows.js.map