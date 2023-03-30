import express from "express";
import {
	GetWorkflow,
	GetWorkflowsUserFor,
	GetWorkflowsCarrierFor,
	GetWorkflowsDriverFor,
	GetWorkflowsDriverForLatest,
	CreateWorkflow,
	EditWorkflow,
	DeleteWorkflow,
} from "./controller";
import { Authorize } from "../auth/controller";

export const WorkflowRouter = express.Router();

WorkflowRouter.get("/", Authorize, GetWorkflowsUserFor);
WorkflowRouter.get("/carrierFor", Authorize, GetWorkflowsCarrierFor);
WorkflowRouter.get("/driverFor", Authorize, GetWorkflowsDriverFor);
WorkflowRouter.get("/driverForLatest", Authorize, GetWorkflowsDriverForLatest);
WorkflowRouter.get("/:id", Authorize, GetWorkflow);
WorkflowRouter.post("/", Authorize, CreateWorkflow);
WorkflowRouter.patch("/:id", Authorize, EditWorkflow);
WorkflowRouter.delete("/:id", Authorize, DeleteWorkflow);
