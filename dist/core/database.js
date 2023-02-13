"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Db = void 0;
const pg_1 = require("pg");
const kysely_1 = require("kysely");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.Db = new kysely_1.Kysely({
    // Use MysqlDialect for MySQL and SqliteDialect for SQLite.
    dialect: new kysely_1.PostgresDialect({
        pool: new pg_1.Pool({
            connectionString: process.env.POSTGRES_CONNECTION_STRING,
        }),
    }),
});
//# sourceMappingURL=database.js.map