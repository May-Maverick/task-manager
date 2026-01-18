

const form = document.querySelector("#form");
const title_input = document.querySelector("#title");
const subject_input = document.querySelector("#subject");
const time_input = document.querySelector("#time");
const incompleteTasks = document.querySelector(".incompleteTasks");
const tasks_container = document.querySelector(".tasks-container");
const taskInfo = document.querySelector(".taskInfo");
const taskDetails = document.querySelector(".taskDetails");
const task_analysis = document.querySelector(".task-analysis");
const task_listing = document.querySelector(".task-listing");
const task_title = document.querySelector("#task-title");
const task_subject = document.querySelector("#task-subject");
const task_time = document.querySelector("#task-time");
const task_delete = document.querySelector("#task-delete");
const task_edit = document.querySelector("#task-edit");
const task_begin = document.querySelector("#task-begin");
const task_details = document.querySelector(".task-details");
let tasksListed = [];
let viewTask;
let isEditing = false;


(async () => {
    const tasks = await getTasks();
    tasksListed = tasks;
    requestAnimationFrame(() => {
        tasksListed.forEach(element => {
            displayTaskTile(element);
        });
    })
})();
 





form.addEventListener("submit", async (e) => {

    e.preventDefault();
    const task = createTask(title_input.value, subject_input.value, time_input.value);
    title_input.value = "";
    subject_input.value = "";
    time_input.value = "";
    const newTask = await sendTask(task);
    tasksListed.push(newTask);
    displayTaskTile(newTask);

});

task_delete.addEventListener("click", async () => {

    await taskDelete(viewTask);
    firstView();

    
});

task_edit.addEventListener("click", async () => {

    if (!isEditing){
        task_details.classList.add("edit");
        task_edit.innerText = "Save";
        isEditing = true;
        return;
    }

    if (isEditing) {
        viewTask.title = task_title.innerText;
        viewTask.subject = task_subject.innerText;
        viewTask.time = task_time.innerText;

        viewTask = await taskEdit(viewTask);
        tasksListed = tasksListed.filter(element => element._id !== viewTask._id);
        tasksListed.push(viewTask);
         task_details.classList.remove("edit");
        task_edit.innerText = "Edit";
        isEditing = false;
    }


});

task_begin.addEventListener("click", (e) => {

    thirdVeiw();
})

function createTask(title, subject, time) {
    const task = {
        title: title,
        subject: subject,
        time: time,
        complete: false
    };

    return task;
}

async function sendTask(task) {
    try {
        const url = "/task";
        const response = await fetch(url, {
            method: "POST",
            headers : {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(task)
        });

        if(!response.ok) {
            throw new Error("Failed to save task to databse");
        }

        const data = await response.json();
        return data;
    } catch(error){
        console.error("Error: ", error.mesage);
        alert("Failed to save task");
    }

}

async function getTasks() {
    try {
        const url = "/task";
        const response = await fetch(url);

        if(!response.ok){
            throw new Error("Failed to recieve tasks from databse");
        }
        const data = await response.json();

        const tasks = data == null ? [] : data; 

        return tasks;
    } catch (error){
        console.error("Failed to get tasks: ", error.message);
        alert("Tasks retrieval from databse failed");
    }
}

function displayTaskTile(task) {

    const title = document.createElement("p");
    title.innerText = task.title;

    const subject = document.createElement("p");
    subject.innerText = task.subject;

    const time = document.createElement("p");
    time.innerText = task.time;

    const title_container = document.createElement("div");
    title_container.className = "title-container";

    const subject_container = document.createElement("div");
    subject_container.className = "subject-container";

    const time_container = document.createElement("div");
    time_container.className = "time-container";

    const taskTile = document.createElement("div");
    taskTile.className = "taskTile";

    title_container.appendChild(title);
    subject_container.appendChild(subject);
    time_container.appendChild(time);

    
    taskTile.appendChild(title_container);
    taskTile.appendChild(subject_container);
    taskTile.appendChild(time_container);

    
    tasks_container.appendChild(taskTile);


    tileClick(taskTile, task);

};

const secondView = () => {
        taskInfo.classList.add("hidden");
        incompleteTasks.classList.add("expanded");
        task_listing.classList.add("hidden");
        taskDetails.classList.add("shown");
        task_analysis.classList.add("shown");
};

const firstView = () => {

            requestAnimationFrame(()=> {
            tasks_container.innerHTML = "";
            tasksListed.forEach(task => {
            displayTaskTile(task);
            });
        });

        taskInfo.classList.remove("hidden");
        incompleteTasks.classList.remove("expanded");
        task_listing.classList.remove("hidden");
        taskDetails.classList.remove("shown");
        task_analysis.classList.remove("shown");

       
    
};

const thirdVeiw = () => {
    taskDetails.classList.remove("shown");
}



const tileClick = (tile, task) => {
        tile.addEventListener("click", () => {
        secondView();

        viewTask = task;

        task_title.innerText = viewTask.title;
        task_subject.innerText = viewTask.subject;
        task_time.innerText = viewTask.time;

    })
}

const taskDelete = async (task) => {
    try {
        const url = `/task/${task._id}`;
        const response = await fetch(url, {method: "DELETE"});

        if(!response.ok){
            throw new Error("Task deletion failed");
        }
        const data = await response.json();

        tasksListed = tasksListed.filter(element => element._id !== task._id);
        
    } catch(error){
        console.error("Failed to delete task: ", error.message);
        alert("Task deletion failed");

    }

}

const  taskEdit = async (task) => {

    try{
        const url = `task/${task._id}`;
        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify(task),
        });

        if(!response.ok){
            throw new Error("Edit task PUT request failed");
        }
        const data = await response.json();
        return data;
    } catch(error){
        console.error("Task edit failed: ", error.message);
        alert("Task was not modified");
    }
}

