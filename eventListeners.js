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
        id = parseInt(id)+1;
        addEditTask(id);
    } else{
        addEditTask(form.elements['add-or-update'].value, false);
    }
});

// event listeners for delete button for the task, edit button for the task, mark-done-undone buttons for the task
document.addEventListener('click', (ele) => {

    if(ele.target.classList.contains('delete-btn')){
        deleteTask(ele.target.name);
        return;
    }
    if(ele.target.classList.contains('edit-btn')){
        AddTaskContainer.style.display = "flex";
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


document.getElementById('filter-by-due-date').addEventListener(('click'), () => {
    console.log('filter button triggered')
    displayTasks(sortByDueDate());
});
document.getElementById('filter-by-category').addEventListener(('click'), () => {
    console.log('filter button triggered')
    const inputField = document.getElementById('filter-category-input');
    displayTasks(filterByCategory(inputField.value));
});
document.getElementById('filter-by-priority').addEventListener(('click'), () => {
    console.log('filter button triggered')
    displayTasks(sortByPriority());
});
document.getElementById('backlogs').addEventListener(('click'), () => {
    console.log('filter button triggered')
    displayTasks(backlogs());
});
document.getElementById('activity-logs').addEventListener(('click'), () => {
    console.log('filter button triggered')
    
    const tasksDiv = document.getElementById('tasks-div');
    tasksDiv.innerHTML = '';
    logs.forEach(log => {
        activityLog(log);
    })
});
document.getElementById('exact-search').addEventListener(('click'), () => {
    console.log('filter button triggered')
    const inputField = document.getElementById('exact-search-input');
    displayTasks(searchExact(inputField.value));
});
document.getElementById('subtask-search').addEventListener(('click'), () => {
    const inputField = document.getElementById('subtask-search-input');
    displayTasks(searchBySubtasks(inputField.value.split(',')));
});
document.getElementById('similar-words-search').addEventListener(('click'), () => {
    const inputField = document.getElementById('similar-words-search-input');
    displayTasks(searchBySubtasks(inputField.value));
});
document.getElementById('partial-search').addEventListener(('click'), () => {
    const inputField = document.getElementById('partial-search-input');
    displayTasks(searchPartial(inputField.value));
});
document.getElementById('tags-search').addEventListener(('click'), () => {
    const inputField = document.getElementById('tags-search-input');
    displayTasks(searchByTags(inputField.value.split(',')));
});

