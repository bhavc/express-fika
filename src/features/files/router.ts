import express from "express";
import multer from "multer";

import { Authorize } from "../auth/controller";
import { UploadFile } from "./controller";

export const FileRouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

FileRouter.post("/file", upload.any(), UploadFile);
