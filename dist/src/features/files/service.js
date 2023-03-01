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
exports.uploadFiles = void 0;
const storage_1 = require("@google-cloud/storage");
const GoogleCloudProjectKey_json_1 = __importDefault(require("../../../GoogleCloudProjectKey.json"));
const bucketName = process.env.GOOGLE_CLOUD_BUCKET_NAME;
const projectId = process.env.GOOGLE_CLOUD_PROJECT_ID;
const generateFileHash = (originalFileName) => {
    const unixTimeStampMS = Date.now();
    const unixTimeStampSeconds = Math.floor(unixTimeStampMS / 1000);
    const formattedName = `${unixTimeStampSeconds} - ${originalFileName}`;
    return formattedName;
};
const uploadFileToCloudStorage = (blobName, file) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storage = new storage_1.Storage();
        return yield storage.bucket(bucketName).file(blobName).save(file.buffer);
    }
    catch (err) {
        throw new Error(`files.service: uploadFileToCloudStorage - Error uploading file ${err.message}`);
    }
});
const generateSignedUrl = (fileName) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const storage = new storage_1.Storage({
            projectId,
            credentials: GoogleCloudProjectKey_json_1.default,
        });
        // Get a v4 signed URL for reading the file
        const [signedUrl] = yield storage
            .bucket(bucketName)
            .file(fileName)
            .getSignedUrl({
            version: "v4",
            action: "read",
            expires: Date.now() + 15 * 60 * 1000, // 15 mins
        });
        return yield signedUrl;
    }
    catch (err) {
        throw new Error(`files.service: generateSignedUrl - Error storing file ${err.message}`);
    }
});
// TODO add auth to this route
// validate file types here
const uploadFiles = ({ files, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fileData = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const blobName = generateFileHash(file.originalname);
            yield uploadFileToCloudStorage(blobName, file);
            const signedUrl = yield generateSignedUrl(blobName);
            return {
                url: signedUrl,
                name: file.originalname,
                type: file.mimetype,
            };
        })));
        return fileData;
    }
    catch (err) {
        throw new Error(`files.service: uploadFiles - Error storing file ${err.message}`);
    }
});
exports.uploadFiles = uploadFiles;
//# sourceMappingURL=service.js.map