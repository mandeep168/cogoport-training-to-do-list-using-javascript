var tasks = (localStorage.getItem('tasks')) ? JSON.parse(localStorage['tasks']) : [];
var id = 1;
var logs = (localStorage.getItem('logs')) ? JSON.parse(localStorage['logs']) : [];
var form = document.getElementById('task-form');


// fetching data from localstorage
console.log('tasks');
tasks.forEach(task => {
    console.log('inside forEAch');
    addTaskToTheDom(task);
});

document.addEventListener('keypress', function (e) {
    if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
    }
    
});


form.addEventListener('submit', (event) => {
    event.preventDefault();
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
    if(ele.target.classList.contains('checkbox')){
        markDoneUndone(ele.target.name, ele.target);
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