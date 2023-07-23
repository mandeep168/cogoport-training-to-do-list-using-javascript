var tasks = (localStorage.getItem('tasks')) ? JSON.parse(localStorage['tasks']) : [];
var id = 1;
var logs = (localStorage.getItem('logs')) ? JSON.parse(localStorage['logs']) : [];
var form = document.getElementById('task-form');

const openPopupButton = document.getElementById("openPopupButton");
const closePopupButton = document.getElementById("closePopupButton");
const AddTaskContainer = document.getElementById("add-task-container");

// for opening form as pop up
openPopupButton.addEventListener("click", () => {
    AddTaskContainer.style.display = "flex";
});

// fetching data from localstorage
tasks.forEach(task => {
    addTaskToTheDom(task);
    id = task.id;
});

document.addEventListener('keypress', function (e) {
    if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
    }
    
});


form.addEventListener('submit', (event) => {
    event.preventDefault();
    AddTaskContainer.style.display = "none";
    if(form.elements['add-or-update'].value === 'add') {
        id+=1;
        addEditTask(id);
    } else{
        addEditTask(form.elements['add-or-update'].value, false);
    }
});


document.addEventListener('click', (ele) => {

    if(ele.target.classList.contains('delete-btn')){
        deleteTask(ele.target.name);
        return;
    }
    if(ele.target.classList.contains('edit-btn')){
        fillFormFields(form, ele.target.name);
        return;
    }
    if(ele.target.classList.contains('mark-done-btn')){
        markDoneUndone(ele.target.name, ele.target, true);
        return;
    }
    if(ele.target.classList.contains('mark-undone-btn')){
        markDoneUndone(ele.target.name, ele.target, false);
        return;
    }
}) ;


document.getElementById('add-subtask').addEventListener(('click'), () => {
    const subtasksDiv = document.getElementById('subtasks');
    const inputfield = document.createElement('input');
    inputfield.type="text";
    inputfield.name="subtask";
    subtasksDiv.append(inputfield);
});