"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toJson = exports.Db = void 0;
const pg_1 = require("pg");
const kysely_1 = require("kysely");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const createPool = () => {
    const user = process.env.POSTGRES_USER;
    const password = process.env.POSTGRES_PASSWORD;
    const database = process.env.POSTGRES_DATABASE;
    let host = process.env.POSTGRES_HOST;
    if (process.env.NODE_ENV === "prod") {
        host = process.env.POSTGRES_SOCKETPATH;
    }
    return new pg_1.Pool({
        user,
        password,
        database,
        host,
    }).on("error", (err, pool) => {
        if (err) {
            console.log("Unexpected error on idle client", err);
        }
        console.log("connected to postgres", pool.listenerCount);
    });
};
exports.Db = new kysely_1.Kysely({
    dialect: new kysely_1.PostgresDialect({
        pool: createPool(),
    }),
    // log(event) {
    // 	console.log("event", event);
    // },
});
const toJson = (obj) => {
    return (0, kysely_1.sql) `${JSON.stringify(obj)}`;
};
exports.toJson = toJson;
// export const toJson = <T>(object: T): RawBuilder<T> => {
// 	return sql`cast (${JSON.stringify(object)} as jsonb)`;
// };
//# sourceMappingURL=database.js.map