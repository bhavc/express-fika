import express from "express";
import multer from "multer";

import {
	GetCurrentUser,
	EditUser,
	EditUserProfileImage,
	GetCarrierByRegion,
} from "./controller";
import { Authorize } from "../auth/controller";

const upload = multer({ storage: multer.memoryStorage() });

export const UserRouter = express.Router();

UserRouter.get("/current", Authorize, GetCurrentUser);
UserRouter.put("/", Authorize, EditUser);
UserRouter.post(
	"/editUserProfileImage",
	Authorize,
	upload.any(),
	EditUserProfileImage
);
UserRouter.get(
	"/getCarrierByRegion/:carrierCountry",
	Authorize,
	GetCarrierByRegion
);
