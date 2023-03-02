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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserAuth = exports.registerUser = exports.loginUser = exports.jwtVerify = exports.jwtSign = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const database_1 = require("../../core/database");
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, 10);
});
const comparePassword = (password, hash) => __awaiter(void 0, void 0, void 0, function* () {
    const isSame = bcrypt_1.default.compare(password, hash);
    return isSame;
});
const jwtSign = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jsonwebtoken_1.default.sign(payload, process.env.PRIVATE_JWT_KEY, {
        expiresIn: "24h",
    });
    return token;
});
exports.jwtSign = jwtSign;
const jwtVerify = (token) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, process.env.PRIVATE_JWT_KEY);
        return decoded;
    }
    catch (err) {
        throw new Error(`auth.service:jwtVerify - Error verifying JWT ${err.message}`);
    }
});
exports.jwtVerify = jwtVerify;
const loginUser = ({ email, password, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield database_1.Db.selectFrom("auth")
            .selectAll()
            .where("email", "=", email)
            .execute();
        const user = data[0];
        if (!user) {
            throw new Error("auth.service:loginUser - User does not exist.");
        }
        const isSamePassword = yield comparePassword(password, user.password);
        if (!isSamePassword) {
            throw new Error("auth.service:loginUser - Incorrect password.");
        }
        return user;
    }
    catch (err) {
        throw new Error(`auth.service:loginUser - Error logging in user ${err.message}`);
    }
});
exports.loginUser = loginUser;
const registerUser = ({ email, password, role, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // create function that will create user depending on role
        const data = yield database_1.Db.selectFrom("auth")
            .select("id")
            .where("email", "=", email)
            .execute();
        if (data && data.length > 0) {
            throw new Error(`auth.service:registerUser - a user is already registered with this email`);
        }
        const status = "Activated";
        const hashedPassword = yield hashPassword(password);
        const { id: userId } = yield database_1.Db.insertInto("auth")
            .values({
            email,
            password: hashedPassword,
            role,
            status,
        })
            .returning("id")
            .executeTakeFirstOrThrow();
        const user = {
            id: userId,
            email,
            password: hashedPassword,
            role,
            status,
        };
        return user;
    }
    catch (err) {
        throw new Error(`auth.service:registerUser - Error registering user ${err.message}`);
    }
});
exports.registerUser = registerUser;
const getUserAuth = ({ userId }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const numericId = parseInt(userId, 10);
        const data = yield database_1.Db.selectFrom("auth")
            .selectAll()
            .where("id", "=", numericId)
            .execute();
        const user = data[0];
        if (!user) {
            throw new Error("auth.service:loginUser - User does not exist.");
        }
        return user;
    }
    catch (err) {
        throw new Error(`auth.service:loginUser - Error logging in user ${err.message}`);
    }
});
exports.getUserAuth = getUserAuth;
//# sourceMappingURL=service.js.map