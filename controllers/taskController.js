import Task from "../models/task.js";

export const getIncompleteTasks = async (req, res) => {
        const tasks = await Task.find({complete: false});
        res.json(tasks);
    
};

export const sendTask = async (req, res) => {
        const newTask = req.body;
        const taskDoc = await Task.create(newTask);

        if(!taskDoc){
                return res.status(500).json({message: "Task not creation failed"});
        }
        res.json(taskDoc);
};

export const deleteTask = async (req, res) => {
    const {id} = req.params;
    const response = await Task.findByIdAndDelete(id);
   
    if(!response) {
       return res.status(404).json({message: "Task not found in deletion process"});
    }

    res.json(response);
}