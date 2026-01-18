import { errorHandler } from "../middleware/errorHandler.js";
import FocusSession from "../models/FocusSession.js";
import Task from "../models/task.js";

export const getAllFocusSessions = async(req, res) => {
    const sessions = await FocusSession.find();
    if(!sessions.length) return [];
    res.json(sessions);
};

export const getSubjectFocusSessions = async(req, res) => {
    const subjectParam = req.params.subject;
    if(!subject) {
        const err = new Error("No subject parameter was entered!");
        err.status = 400;
        throw err;
    };

    const subjectIds = await Task.find({subject: subjectParam, complete: true});
    let sessions;
    subjectIds.forEach( async (task) =>  {
        const session = await FocusSession.find({taskId: task._id});
        if (!session) return;
        sessions.push(session);

    });
    if(!sessions.length) return [];
    res.json(sessions);
}

export const postFocusSession = async (req, res)=> {
    if(!req.body) {
        const err = new Error("No focus session sent");
        err.status = 400;
        throw err;
    };

    const sessionDoc = await FocusSession.create(req.body);

    res.json(sessionDoc);
}