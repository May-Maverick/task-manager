import Task from "../models/task.js";

export const getIncompleteTasks = async (req, res) => {
        const tasks = await Task.find({complete: false});
        res.json(tasks);
    
};

export const sendTask = async (req, res) => {
        const newTask = req.body;
        const taskDoc = await Task.create(newTask);

        if(!taskDoc){
                const err = new Error("Task creation failed");
                err.status = 500;
                throw err;
        }
        res.json(taskDoc);
};

export const deleteTask = async (req, res) => {
    const {id} = req.params;
    const response = await Task.findByIdAndDelete(id);
   
    if(!response) {
       const err = new Error("Task not found in deletion process");
       err.status = 404;
       throw err;
    }

    res.json(response);
}

export const taskEdit = async (req, res) => {
        const {id} = req.params;
        const option = { new: true, runValidators: true };
        const newTaskDoc = await Task.findByIdAndUpdate(id, req.body, option);
        if(!newTaskDoc) {
                const err = new Error("Task document not found when editing task in databse");
                err.status = 404;
                throw err;
        }

        res.json(newTaskDoc);

}