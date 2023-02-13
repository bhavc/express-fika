"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.migrateToLatest = void 0;
const path = __importStar(require("path"));
const pg_1 = require("pg");
const fs_1 = require("fs");
const kysely_1 = require("kysely");
const migrateToLatest = () => __awaiter(void 0, void 0, void 0, function* () {
    const db = new kysely_1.Kysely({
        dialect: new kysely_1.PostgresDialect({
            pool: new pg_1.Pool({
                connectionString: "postgres://postgres_phoenix_user:LtAp0F0wVCAlNHv5lPy8tCpC5KfM7hsb@dpg-cfaod702i3mjdujni7fg-a.ohio-postgres.render.com/postgres_phoenix?ssl=true",
            }),
        }),
    });
    const migrationFolder = path.join(__dirname, "..", "migrations");
    console.log("migrationFoler", migrationFolder);
    const migrator = new kysely_1.Migrator({
        db,
        provider: new kysely_1.FileMigrationProvider({
            fs: fs_1.promises,
            path,
            migrationFolder,
        }),
    });
    const { error, results } = yield migrator.migrateToLatest();
    results === null || results === void 0 ? void 0 : results.forEach((it) => {
        if (it.status === "Success") {
            console.log(`migration "${it.migrationName}" was executed successfully`);
        }
        else if (it.status === "Error") {
            console.error(`failed to execute migration "${it.migrationName}"`);
        }
    });
    if (error) {
        console.error("failed to migrate");
        console.error(error);
        process.exit(1);
    }
    yield db.destroy();
});
exports.migrateToLatest = migrateToLatest;
//# sourceMappingURL=migrations.js.map