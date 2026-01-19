const form = document.querySelector("#form");
const main = document.querySelector(".main");
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
const focus_session = document.querySelector(".Focus-Session");
const session_start = document.querySelector("#start");
const timer = document.querySelector("#timer");
const VIEW = {
    LIST: "list",
    DETAIL: "detail",
    FOCUS: "focus"
};

let tasksListed = [];
let viewTask;
let isEditing = false;
let inFocus = false;
let timerInterval = null;
let startTime;
let start = false;
let remainder;
let duration = 0;




//on window load
(async () => {
    const tasks = await getTasks();
    tasksListed = tasks;
    tasksListed.forEach(task => {
    displayTaskTile(task);
    
   });
   setView(VIEW.LIST);
   
})();
 

//button eventListeners

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
    tasks_container.innerHTML = "";
    tasksListed.forEach(task => {
        displayTaskTile(task);
    });
    setView(VIEW.LIST);
    

    
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
    setView(VIEW.FOCUS);
});




session_start.addEventListener("click", (e) => {
    if(!start){
        start = true;
        setDuration(); 
        startTime = Date.now();
        resumptionTime = startTime;
    }

    if(inFocus){
        session_start.innerText = "Resume";
        clearInterval(timerInterval);
        duration = remainder;
        resumptionTime = Date.now();
        inFocus = false;

    } else {
        session_start.innerText = "Pause";
        timerInterval = setInterval(countdown, 1000);
        inFocus = true;
    }

})



//function definitions

function createTask(title, subject, time) {
    const task = {
        title: title,
        subject: subject,
        time: time,
        complete: false
    };

    return task;
};


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

};


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
};


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


/*const secondView = () => {
        taskInfo.classList.add("hidden");
        incompleteTasks.classList.add("expanded");
        task_listing.classList.add("hidden");
        taskDetails.classList.add("shown");
        task_analysis.classList.add("shown");
};

const firstView = () => {

        taskInfo.classList.remove("hidden");
        incompleteTasks.classList.remove("expanded");
        task_listing.classList.remove("hidden");
        taskDetails.classList.remove("shown");
        task_analysis.classList.remove("shown");           
    
};

const thirdView = () => {
    taskDetails.classList.remove("shown");
    focus_session.classList.add('shown');
}

*/

const tileClick = (tile, task) => {
        tile.addEventListener("click", () => {
        setView(VIEW.DETAIL);

        viewTask = task;

        task_title.innerText = viewTask.title;
        task_subject.innerText = viewTask.subject;
        task_time.innerText = viewTask.time;

    })
};



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

};



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
};

const getDurationfromString = (timeString) => {
     let timeValue = timeString.substring(0, timeString.length-3);
     if (timeString.includes("min")){
        return Number(timeValue)*60*1000;
     } else {
        return Number(timeValue)*60*60*1000;
     }
};

const setDuration = () => {
    let timeString = viewTask.time;
    timeString = timeString.trim();
    const timeArr = timeString.split(" ");
    if (timeArr.length == 1){
        duration = getDurationfromString(timeArr[0]);
    } else {
        duration = getDurationfromString(timeArr[0]);
        duration += getDurationfromString(timeArr[1]);

    };
    
};



const countdown = () => {
    remainder = duration - (Date.now() - resumptionTime);

    if (remainder <= 0){
        clearInterval(timerInterval);
        timer.innerText = "00:00:00";
        return;
    }
    let seconds = Math.floor(remainder/1000);
    let min = Math.floor(seconds/60);
    let hrs = Math.floor(seconds/3600);
    let sec = seconds % 60;//Do this for hours

    timer.innerText = `${hrs.toString().padStart(2,"0")}:${min.toString().padStart(2,"0")}:${sec.toString().padStart(2,"0")}`;


};



const setView = (view) => {

        
        switch(view) {
            case VIEW.LIST:

                //By default VIEW.LIST is displayed only way to access it intentionally is from other views, in which case set everyhting to default
                taskInfo.classList.remove("hidden");
                incompleteTasks.classList.remove("expanded");
                task_listing.classList.remove("hidden");
                taskDetails.classList.remove("shown");
                task_analysis.classList.remove("shown");
                focus_session.classList.remove("shown");
                break;

            case VIEW.DETAIL:
                
                taskInfo.classList.add("hidden");
                incompleteTasks.classList.add("expanded");
                task_listing.classList.add("hidden");
                taskDetails.classList.add("shown");
                task_analysis.classList.add("shown");

                break;
            
            case VIEW.FOCUS:

                //Focus only accessed by first going to detail
                taskDetails.classList.remove("shown");
                focus_session.classList.add("shown");

                break;
        }
};

