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
exports.getUser = exports.createUserProfile = void 0;
const database_1 = require("../../core/database");
const createUserProfile = ({ id, company, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield database_1.Db.insertInto("users")
            .values({
            id,
            company_name: company,
        })
            .executeTakeFirstOrThrow();
        const userProfile = {
            company,
        };
        return userProfile;
    }
    catch (err) {
        throw new Error(`users.service: createUserProfile - Error creating users profile ${err.message}`);
    }
});
exports.createUserProfile = createUserProfile;
const getUser = ({ userId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const numericId = parseInt(userId, 10);
        const data = yield database_1.Db.selectFrom("users")
            .selectAll()
            .where("id", "=", numericId)
            .executeTakeFirstOrThrow();
        return data;
    }
    catch (err) {
        throw new Error(`users.service: getUsers - Error getting users ${err.message}`);
    }
});
exports.getUser = getUser;
//# sourceMappingURL=service.js.map