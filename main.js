class Task {
    constructor(text, isDone) {
        this.text = text;
        this.isDone = isDone;
        this.div = null;
    }

    createTask() {
            let paragraph = document.createElement("p");
            paragraph.textContent = this.text;

            let taskRemove = document.createElement("img");
            taskRemove.src = "img/delete.png";
            taskRemove.dataset.type = "taskRemove";

            let taskCompleted = document.createElement("img");
            taskCompleted.src = "img/check-mark.png";
            taskCompleted.dataset.type = "taskCompleted";

            let taskNotCompleted = document.createElement("img");
            taskNotCompleted.src = "img/cancel.png";
            taskNotCompleted.dataset.type = "taskNotCompleted";

            let backToListBtn = document.createElement("img");
            backToListBtn.src = "img/return.png";
            backToListBtn.dataset.type = "backToListBtn";

            let helpButtons = document.createElement("div");
            helpButtons.append(taskNotCompleted);
            helpButtons.append(taskCompleted);
            helpButtons.append(taskRemove);
            helpButtons.append(backToListBtn);
            helpButtons.classList.add("helpButtons");

            let createDiv = document.createElement("div");
            createDiv.append(paragraph);
            createDiv.append(helpButtons);
            this.div = createDiv;
            createDiv.classList.add("task");

            if (this.isDone === false)
            {
                taskRemove.classList.add("helpBtn");
                taskCompleted.classList.add("helpBtn");
                taskNotCompleted.classList.add("helpBtn");
                backToListBtn.classList.add("displayNone");
                bodyTaskList.prepend(this.div);
            }
            else if (this.isDone == "failed")
            {
                createDiv.classList.add("fold");
                taskRemove.classList.add("displayNone");
                taskCompleted.classList.add("displayNone");
                taskNotCompleted.classList.add("displayNone");
                backToListBtn.classList.add("helpBtn");
                foldTaskList.prepend(this.div);
            }
            else if (this.isDone === true)
            {
                createDiv.classList.add("completed");
                taskRemove.classList.add("displayNone");
                taskCompleted.classList.add("displayNone");
                taskNotCompleted.classList.add("displayNone");
                backToListBtn.classList.add("helpBtn");
                completedTaskList.prepend(this.div);
            }

            programView.writeCongratulation();

            mainInput.value = null;
    }
}

    let dataService = {
        tasks: [],

        get allTasks() {
            return this.tasks;
        },

        get notCompletedTasks() {
            return this.tasks.filter(task => task.isDone == false);
        },

        add(task) {
            this.tasks.push(task);
            this.save();
        },

        save() {
            localStorage.setItem("tasks", JSON.stringify(this.tasks));
        },

        open() {
            this.tasks = JSON.parse(localStorage.getItem("tasks")) || [];
        },

        deleteTask(text) {
            this.tasks = this.tasks.filter(task => task.text != text);
            dataService.save();
        },

        changeIsDone(text, value) {
            this.tasks.forEach(task => {
                if (task.text == text)
                {
                    task.isDone = value;
                }
            })
            this.save();
        },

        createAllFromLocalStorage() {
            this.open();
            this.tasks.forEach(task => {
                let newTask = new Task(task.text, task.isDone);
                newTask.createTask();
            })
        },

        initialFakeLocalStorage() {
            let fakeLocalStorage = [
                {text: 'Save this world!', isDone: "failed"},
                {text: 'Do homework!', isDone: "failed"},
                {text: 'Find my love', isDone: false},
                {text: 'Kill f*cking putin!', isDone: false},
                {text: 'Find best company ever!', isDone: false},
                {text: 'Say: `Love you!` - to my mum', isDone: true},
            ];
            fakeLocalStorage.forEach(task => {
                let newTask = new Task(task.text, task.isDone);
                newTask.createTask();
            });
        }

    }

    let programView = {
        giveToInputClassError() {
            mainInput.classList.remove("noError");
            mainInput.classList.add("errorInput");
        },

        giveToInputClassNoError() {
            mainInput.classList.remove("errorInput");
            mainInput.classList.add("noError");
        },

        writeCongratulation() {
            if (bodyTaskList.childElementCount === 2)
            {
                congratulationElementsTask.forEach(element => {
                    element.classList.remove("congratulation");
                    element.classList.add("displayNone");
                })

            }
            else if (bodyTaskList.childElementCount === 1)
            {
                congratulationElementsTask.forEach(element => {
                    element.classList.remove("displayNone");
                    element.classList.add("congratulation");
                })
            }


            if (foldTaskList.childElementCount === 2)
            {
                congratulationElementsFailed.forEach(element => {
                    element.classList.remove("congratulation");
                    element.classList.add("displayNone");
                })

            }
            else if (foldTaskList.childElementCount === 1)
            {
                congratulationElementsFailed.forEach(element => {
                    element.classList.remove("displayNone");
                })
            }
            if (completedTaskList.childElementCount === 2)
            {
                congratulationElementsCompleted.forEach(element => {
                    element.classList.remove("congratulation");
                    element.classList.add("displayNone");
                })

            }
            else if (completedTaskList.childElementCount === 1)
            {
                congratulationElementsCompleted.forEach(element => {
                    element.classList.remove("displayNone");
                    element.classList.add("congratulation");
                })
            }


        }

    }

class taskListView {
    constructor(e) {
        this.e = e;
    }
    clickHelpButtons(e) {
        let createDiv = this.e.target.parentElement.parentElement;
        let taskText = createDiv.querySelector("p").textContent;

        if (this.e.target.dataset.type == "taskRemove")
        {
            dataService.deleteTask(taskText);
            createDiv.remove();
        }
        if (this.e.target.dataset.type == "taskCompleted")
        {
            let taskRemove = this.e.target.nextElementSibling;
            let taskCompleted = this.e.target;
            let taskNotCompleted = this.e.target.previousElementSibling;
            let backToListBtn = this.e.target.nextElementSibling.nextElementSibling;

            createDiv.classList.remove("fold");
            createDiv.classList.add("completed");

            dataService.changeIsDone(taskText, true);

            completedTaskList.prepend(createDiv);

            this.hideHelpBtn(taskRemove, taskCompleted, taskNotCompleted, backToListBtn);
        }
        if (this.e.target.dataset.type == "taskNotCompleted")
        {
            let taskRemove = this.e.target.nextElementSibling.nextElementSibling;
            let taskCompleted = this.e.target.nextElementSibling;
            let taskNotCompleted = this.e.target;
            let backToListBtn = this.e.target.nextElementSibling.nextElementSibling.nextElementSibling;

            createDiv.classList.remove("completed");
            createDiv.classList.add("fold");

            dataService.changeIsDone(taskText, "failed");

            foldTaskList.prepend(createDiv);

            this.hideHelpBtn(taskRemove, taskCompleted, taskNotCompleted, backToListBtn);
        }

        programView.writeCongratulation();
    }

    hideHelpBtn(taskRemove, taskCompleted, taskNotCompleted, backToListBtn) {
        backToListBtn.classList.add("helpBtn");
        backToListBtn.classList.remove("displayNone");

        taskCompleted.classList.add("displayNone");
        taskCompleted.classList.remove("helpBtn");

        taskNotCompleted.classList.remove("helpBtn");
        taskNotCompleted.classList.add("displayNone");

        taskRemove.classList.remove("helpBtn");
        taskRemove.classList.add("displayNone");
    }

    returnHelpBtn(taskRemove, taskCompleted, taskNotCompleted, backToListBtn) {
        backToListBtn.classList.remove("helpBtn");
        backToListBtn.classList.add("displayNone");

        taskCompleted.classList.remove("displayNone");
        taskCompleted.classList.add("helpBtn");

        taskNotCompleted.classList.remove("displayNone");
        taskNotCompleted.classList.add("helpBtn");

        taskRemove.classList.remove("displayNone");
        taskRemove.classList.add("helpBtn");
    }

    returnTaskToList(e) {
        let taskRemove = this.e.target.previousElementSibling;
        let taskCompleted = this.e.target.previousElementSibling.previousElementSibling;
        let taskNotCompleted = this.e.target.previousElementSibling.previousElementSibling.previousElementSibling;
        let backToListBtn = this.e.target;
        let taskText = createDiv.querySelector("p").textContent;

        let createDiv = this.e.target.parentElement.parentElement;
        createDiv.classList.remove("completed");
        createDiv.classList.remove("fold");

        this.returnHelpBtn(taskRemove, taskCompleted, taskNotCompleted, backToListBtn);
        createDiv.classList.add("task")

        bodyTaskList.prepend(createDiv);
        programView.writeCongratulation();
        dataService.changeIsDone(taskText, "tasks");
    }
}


let mainInput = document.querySelector("#mainInput");
let bodyTaskList = document.querySelector("#bodyTaskList");
let createTaskButton = document.querySelector("#btn-createTask");
let testBtn = document.querySelector("#testBtn");
let completedTaskList = document.querySelector(".completedTaskList");
let foldTaskList = document.querySelector(".foldTaskList");
let congratulationElementsTask = document.querySelectorAll(".congratulationItems");
let congratulationElementsCompleted = document.querySelectorAll("#congratulationCompleted");
let congratulationElementsFailed = document.querySelectorAll("#congratulationFailed");

dataService.createAllFromLocalStorage();
programView.writeCongratulation();

testBtn.addEventListener("click", function () {
    dataService.initialFakeLocalStorage();
});

createTaskButton.addEventListener("click", function () {
    programView.giveToInputClassNoError();

    if (mainInput.value)
    {
        let newTask = new Task(mainInput.value, false);
        dataService.add(newTask);
        newTask.createTask();
    }
    else {
        programView.giveToInputClassError();
    }
});

bodyTaskList.addEventListener("click", function (e) {
    let click = new taskListView(e);
    click.clickHelpButtons();
});

foldTaskList.addEventListener("click", function (e) {
    if(e.target.dataset.type == "backToListBtn")
    {
        new taskListView(e).returnTaskToList();
    }
})

completedTaskList.addEventListener("click", function (e) {
    if(e.target.dataset.type == "backToListBtn")
    {
        new taskListView(e).returnTaskToList();
    }
})


