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
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const router_1 = require("./features/auth/router");
const router_2 = require("./features/files/router");
const router_3 = require("./features/users/router");
const router_4 = require("./features/workflows/router");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
(() => __awaiter(void 0, void 0, void 0, function* () {
    app.use(express_1.default.urlencoded({ extended: false }));
    app.use(express_1.default.json());
    // app.use(bodyParser.urlencoded({ extended: false }));
    // app.use(bodyParser.json());
    app.use((0, cors_1.default)());
    app.get("/", (_, res) => {
        res.send("Express + TypeScript Server");
    });
    app.use("/auth", router_1.AuthRouter);
    app.use("/fileUpload", router_2.FileRouter);
    app.use("/user", router_3.UserRouter);
    app.use("/workflow", router_4.WorkflowRouter);
    app.listen(port, () => {
        console.info(`[server]: Server is running at http://localhost:${port}`);
    });
}))();
//# sourceMappingURL=index.js.map