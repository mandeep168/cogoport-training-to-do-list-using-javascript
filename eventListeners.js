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
    if(ele.target.classList.contains('subtask-mark-done')){
        const taskId = ele.target.name.split('-')[0];
        const index = ele.target.name.split('-')[1];
        markSubtaskDone(taskId, index, ele.target)
        return;
    }
}) ;


document.getElementById('add-subtask').addEventListener(('click'), () => {
    const subtasksDiv = document.getElementById('subtasks');
    const inputfield = document.createElement('input');
    inputfield.type="text";
    inputfield.name="subtask";
    inputfield.placeholder="Subtask..."
    subtasksDiv.append(inputfield);
});


// document.getElementById('filter-by-due-date').addEventListener(('click'), () => {
//     console.log('filter button triggered')
//     displayTasks(sortByDueDate());
// });
// document.getElementById('filter-by-category').addEventListener(('click'), () => {
//     console.log('filter button triggered')
//     const inputField = document.getElementById('filter-category-input');
//     displayTasks(filterByCategory(inputField.value));
// });
// document.getElementById('filter-by-priority').addEventListener(('click'), () => {
//     console.log('filter button triggered')
//     displayTasks(sortByPriority());
// });
document.getElementById('backlogs').addEventListener(('click'), () => {
    const tasksDiv = document.getElementById('tasks-div');
    tasksDiv.innerHTML = '<h2>Backlogs: </h2>';
    displayTasks(backlogs());
});
document.getElementById('activity-logs').addEventListener(('click'), () => {
    
    const tasksDiv = document.getElementById('tasks-div');
    tasksDiv.innerHTML = '';
    logs.forEach(log => {
        activityLog(log);
    })
});
document.getElementById('search').addEventListener(('click'), () => {
    const combinedSearch = document.getElementById('combined-search').value.trim();
    const searchByTags = document.getElementById('tags-search').value.trim();
    displayTasks(search(combinedSearch, searchByTags));
});
document.getElementById('apply-filters').addEventListener(('click'), () => {
    displayTasks(filter());
});
document.getElementById('clear-filters').addEventListener(('click'), () => {
    document.getElementById('category-filter').value = '';
    document.getElementById('due-date-range-from').value = '';
    document.getElementById('due-date-range-to').value = '';
    document.getElementById('priority').value = 'all';
    document.getElementById('sort-by').value = 'dueDate';
});