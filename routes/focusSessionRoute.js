import { getAllFocusSessions, getSubjectFocusSessions, postFocusSession } from "../controllers/focusSessionController.js";
import {asyncHandler} from "../middleware/asyncHandler.js"
import express from "express";

const focusSessionRouter = express.Router();

focusSessionRouter.get("/", asyncHandler(getAllFocusSessions));

focusSessionRouter.get("/:subject", asyncHandler(getSubjectFocusSessions));

focusSessionRouter.post("/", asyncHandler(postFocusSession));

export default focusSessionRouter;