import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import taskRouter from "./routes/taskRoute.js";
import focusSessionRouter from "./routes/focusSessionRoute.js";
import { errorHandler } from "./middleware/errorHandler.js";
import FocusSession from "./models/FocusSession.js";

const app = express();

app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(express.static(path.join(__dirname, "/public/taskWebsite")));

app.use("/task", taskRouter);
app.use("/focusSession", focusSessionRouter)

app.use(errorHandler);

export default app;