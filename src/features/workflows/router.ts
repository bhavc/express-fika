import express from "express";
import {
	GetWorkflow,
	GetWorkflowsUserFor,
	GetWorkflowsCarrierFor,
	GetWorkflowsDriverFor,
	GetWorkflowsDriverForLatest,
	GetWorkflowStatusForWorkflow,
	GetWorkflowNotesForWorkflow,
	CreateWorkflow,
	EditWorkflow,
	DeleteWorkflow,
} from "./controller";
import { Authorize } from "../auth/controller";

export const WorkflowRouter = express.Router();

WorkflowRouter.get("/status/:id", Authorize, GetWorkflowStatusForWorkflow);
WorkflowRouter.get("/driverForLatest", Authorize, GetWorkflowsDriverForLatest);
WorkflowRouter.get("/driverFor", Authorize, GetWorkflowsDriverFor);
WorkflowRouter.get("/carrierFor", Authorize, GetWorkflowsCarrierFor);
WorkflowRouter.get(
	"/:id/notes/:userTo",
	Authorize,
	GetWorkflowNotesForWorkflow
);
WorkflowRouter.get("/:id", Authorize, GetWorkflow);
WorkflowRouter.get("/", Authorize, GetWorkflowsUserFor);

WorkflowRouter.post("/", Authorize, CreateWorkflow);

WorkflowRouter.patch("/:id", Authorize, EditWorkflow);

WorkflowRouter.delete("/:id", Authorize, DeleteWorkflow);
