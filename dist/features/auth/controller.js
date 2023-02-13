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
exports.Login = exports.Register = exports.Authorize = void 0;
const service_1 = require("../users/service");
const service_2 = require("./service");
const Authorize = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // i have the jwt from the header
        // pull the jwt out
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).send(`auth.controller:Authorize - Unauthorized`);
        }
        const bearer = authHeader.split(" ");
        const bearerToken = bearer[1];
        if (!bearerToken) {
            return res
                .status(401)
                .send(`auth.controller:Authorize - Unauthorized, no bearer token`);
        }
        const decodedToken = (yield (0, service_2.jwtVerify)(bearerToken));
        if (!decodedToken) {
            return res
                .status(401)
                .send(`auth.controller:Authorize - Unauthorized, no bearer token`);
        }
        const userId = decodedToken.id;
        req.userId = userId;
        next();
    }
    catch (err) {
        return res
            .status(500)
            .send(`auth.controller:Authorize - Error verifying token ${err.message}`);
    }
});
exports.Authorize = Authorize;
const Register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        if (!body || !body.email || !body.password || !body.role) {
            return res.status(400).send("AuthController:Register - Missing data");
        }
        const { email, password, company, role } = body;
        let user = yield (0, service_2.registerUser)({
            email,
            password,
            role,
        });
        yield (0, service_1.createUserProfile)({ id: user.id, company });
        const jwtToken = yield (0, service_2.jwtSign)({ id: user.id });
        const response = {
            token: jwtToken,
        };
        return res.status(200).json(response);
    }
    catch (err) {
        return res
            .status(500)
            .send(`auth.controller:Register - Error registering users ${err.message}`);
    }
});
exports.Register = Register;
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { body } = req;
        if (!body || !body.email || !body.password) {
            return res.status(400).send("AuthController:Login - Missing data");
        }
        const { email, password } = body;
        let user = yield (0, service_2.loginUser)({ email, password });
        const jwtToken = yield (0, service_2.jwtSign)({ id: user.id });
        const response = {
            token: jwtToken,
        };
        return res.status(200).json(response);
    }
    catch (err) {
        return res
            .status(500)
            .send(`auth.controller:Register - Error registering users ${err.message}`);
    }
});
exports.Login = Login;
//# sourceMappingURL=controller.js.map