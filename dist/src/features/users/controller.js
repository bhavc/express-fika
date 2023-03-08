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
exports.EditUser = exports.GetCurrentUser = void 0;
const service_1 = require("./service");
const service_2 = require("../auth/service");
const GetCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(500).send("users.GetCurrentUser - no userId provided");
        }
        const userAuth = yield (0, service_2.getUserAuth)({ userId });
        const user = yield (0, service_1.getUserProfile)({ userId });
        const userData = Object.assign(Object.assign({}, user), { role: userAuth.role });
        const returnData = Object.assign({}, userData);
        return res.status(200).json(returnData);
    }
    catch (err) {
        return res
            .status(500)
            .send(`users.GetCurrentUser - Error getting users ${err.message}`);
    }
});
exports.GetCurrentUser = GetCurrentUser;
const EditUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(500).send("users.EditUser - no userId provided");
        }
        if (!req.body) {
            return res.status(500).send("users.EditUser - no body params provided");
        }
        const data = req.body.data;
        const userAuth = yield (0, service_2.getUserAuth)({ userId });
        const userRole = userAuth.role;
        yield (0, service_1.editUserProfile)({ userId, userRole, data });
        const returnData = {
            message: "Successfully updated user",
        };
        return res.status(200).json(returnData);
    }
    catch (err) {
        return res
            .status(500)
            .send(`users.EditUser - Error editing user ${err.message}`);
    }
});
exports.EditUser = EditUser;
//# sourceMappingURL=controller.js.map