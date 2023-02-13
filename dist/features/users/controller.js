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
exports.GetCurrentUser = void 0;
const service_1 = require("./service");
const GetCurrentUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("req", req);
        const userId = req.userId;
        if (!userId) {
            return res.status(500).send("users.GetCurrentUser - no userId provided");
        }
        const user = yield (0, service_1.getUser)({ userId });
        return res.send("success");
    }
    catch (err) {
        return res
            .status(500)
            .send(`users.GetCurrentUser - Error getting users ${err.message}`);
    }
});
exports.GetCurrentUser = GetCurrentUser;
//# sourceMappingURL=controller.js.map