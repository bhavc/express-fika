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
exports.UploadFile = void 0;
const service_1 = require("./service");
// TODO add auth to this route
const UploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { files } = req;
        if (!files || files.length === 0) {
            return res.status(400).send("files.UploadFile - No files sent");
        }
        const fileList = files;
        const uploadFileData = yield (0, service_1.uploadFiles)({ files: fileList });
        const returnData = {
            uploadFileData,
        };
        return res.status(200).json(returnData);
    }
    catch (err) {
        return res
            .status(500)
            .send(`files.UploadFile - Error getting workflow ${err.message}`);
    }
});
exports.UploadFile = UploadFile;
//# sourceMappingURL=controller.js.map