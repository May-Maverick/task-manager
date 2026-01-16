import express from "express";
import { asyncHandler } from "../middleware/asyncHandler.js";
import { getIncompleteTasks, sendTask, deleteTask, editTask } from "../controllers/taskController.js";

const taskRouter = express.Router();

taskRouter.get("/", asyncHandler(getIncompleteTasks));

taskRouter.post("/", asyncHandler(sendTask));

taskRouter.delete("/:id", asyncHandler(deleteTask));

taskRouter.put("/:id", asyncHandler(editTask));
export default taskRouter;
