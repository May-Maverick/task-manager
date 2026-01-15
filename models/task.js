import mongoose from "mongoose"

const taskSchema = new mongoose.Schema({
    title : {type: String, required: true},
    subject: {type: String, required: true},
    time: {type: String, required: true},
    complete: {type: Boolean, required: true},
});

const Task = mongoose.model("Task", taskSchema);

export default Task;