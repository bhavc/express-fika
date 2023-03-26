import express from "express";
import multer from "multer";

import {
	GetCurrentUser,
	EditCurrentUser,
	EditUserById,
	EditUserProfileImage,
	GetCarrierByRegion,
	GetDriversByCompany,
	GetUserById,
} from "./controller";
import { Authorize } from "../auth/controller";

const upload = multer({ storage: multer.memoryStorage() });

export const UserRouter = express.Router();

UserRouter.get("/current", Authorize, GetCurrentUser);
UserRouter.put("/", Authorize, EditCurrentUser);
UserRouter.post(
	"/editUserProfileImage",
	Authorize,
	upload.any(),
	EditUserProfileImage
);
UserRouter.get("/getCarrierByRegion", Authorize, GetCarrierByRegion);
UserRouter.get("/getDriversByCompany", Authorize, GetDriversByCompany);
UserRouter.get("/:id", Authorize, GetUserById);
UserRouter.put("/:id", Authorize, EditUserById);
