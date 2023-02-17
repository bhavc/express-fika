import express from "express";
import {
	GetWorkflow,
	GetWorkflows,
	CreateWorkflow,
	EditWorkflow,
	DeleteWorkflow,
} from "./controller";
import { Authorize } from "../auth/controller";

export const WorkflowRouter = express.Router();

WorkflowRouter.get("/", Authorize, GetWorkflows);
WorkflowRouter.get("/:workflowId", Authorize, GetWorkflow);
WorkflowRouter.post("/", Authorize, CreateWorkflow);
WorkflowRouter.patch("/:id", Authorize, EditWorkflow);
WorkflowRouter.delete("/:id", Authorize, DeleteWorkflow);
