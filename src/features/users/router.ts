import express from "express";
import { GetCurrentUser } from "./controller";
import { Authorize } from "../auth/controller";

export const UserRouter = express.Router();

UserRouter.get("/current", Authorize, GetCurrentUser);
