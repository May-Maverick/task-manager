import mongoose from "mongoose";

const FocusSessionSchema = new mongoose.Schema({
    taskId : {type: String, required: true},
    start : {type: String, required: true},
    end : {type: String, required: true},
    duration : {type: String, required: true}
});

const FocusSession = mongoose.model("FocusSession", FocusSessionSchema);

export default FocusSession;