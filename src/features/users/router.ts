import express from "express";
import { GetCurrentUser, EditUser } from "./controller";
import { Authorize } from "../auth/controller";

export const UserRouter = express.Router();

UserRouter.get("/current", Authorize, GetCurrentUser);
UserRouter.put("/", Authorize, EditUser);
