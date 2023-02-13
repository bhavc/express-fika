import express from "express";
import { Login, Register } from "./controller";

export const AuthRouter = express.Router();

AuthRouter.post("/register", Register);
AuthRouter.post("/login", Login);
