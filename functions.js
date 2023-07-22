function fillFormFields(form, id) {
    let index = tasks.findIndex(tasks => tasks.id.toString() == id);
    console.log(tasks);
    if(index == -1) console.log(index);

    let task = tasks[index];
    form.elements['task-title'].value = task.title;
    form.elements['task-description'].value = task.description;
    form.elements['priority'].value = task.priority;
    form.elements['category'].value = task.category;
    form.elements['tag'].value = task.tag;
    form.elements['due-date-time'].value = task.dueDate;
    form.elements['add-or-update'].value = id;
}

function addTaskFromLocalStorage(task) {
    tasks.push(task);
    addTaskToTheDom(task);
}

function addEditTask( id, isAdd = true) {
    let task = {};
    task.id=id;
    task.title = form.elements['task-title'].value;
    task.description = form.elements['task-description'].value;
    task.priority = form.elements['priority'].value;
    task.category = form.elements['category'].value;
    task.tags = form.elements['tag'].value.trim().split(',');
    task.dueDate = form.elements['due-date-time'].value;
    task.isDone = false;

    localStorage.setItem(id, JSON.stringify(task));

    if(isAdd) {
        tasks.push(task);
        addTaskToTheDom(task);
    }
    else {
        let index = tasks.findIndex(tasks => tasks.id == id);
        if(index == -1) console.log(" addEdit TAsk task does not exist");
        else{
            task.isDone = tasks[index].isDone;
            tasks[index] = task;
        }
        editTaskOnDom(task);
    }
    form.reset();
}

function addTaskToTheDom(task) {
    try {
        const tasksDiv = document.getElementById('tasks-div');
        const taskDiv = document.createElement('div');
        const checkBox = document.createElement('input');
        const title = document.createElement('span');
        const description = document.createElement('span');
        const category = document.createElement('span');
        const tag = document.createElement('span');
        const priority = document.createElement('span');
        const dueDate = document.createElement('span');
        
        const btnDelete = document.createElement('button');
        const btnEdit = document.createElement('button');


        tasksDiv.appendChild(taskDiv);
        taskDiv.appendChild(checkBox);
        taskDiv.appendChild(title);
        taskDiv.appendChild(description);
        taskDiv.appendChild(category);
        taskDiv.appendChild(tag);
        taskDiv.appendChild(priority);
        taskDiv.appendChild(dueDate);
        taskDiv.appendChild(btnEdit);
        taskDiv.appendChild(btnDelete);


        checkBox.type="checkbox";
        checkBox.name=task.id;
        checkBox.classList.add('checkbox');
        title.innerHTML = task.title;
        title.classList.add('title');
        description.innerHTML = task.description;
        description.classList.add('description');
        category.innerHTML = task.category;
        category.classList.add('category');
        tag.innerHTML = task.tags.join(',');
        tag.classList.add('tag');
        priority.innerHTML = task.priority;
        priority.classList.add('priority');
        dueDate.innerHTML = task.dueDate;
        dueDate.classList.add('due-date');
        
        btnDelete.name = task.id;
        btnEdit.name = task.id;
        btnDelete.classList.add("delete-btn");
        btnEdit.classList.add("edit-btn");

        taskDiv.setAttribute('id', task.id);
    } catch (err) {
        console.log(err);
    }
}

function editTaskOnDom(task) {
    const taskDiv = document.getElementById(task.id);
    if(!taskDiv) console.log("div not found");
    
    taskDiv.getElementsByClassName('title')[0].innerHTML = task.title;
    taskDiv.getElementsByClassName('description')[0].innerHTML = task.description;
    taskDiv.getElementsByClassName('category')[0].innerHTML = task.category;
    taskDiv.getElementsByClassName('tag')[0].innerHTML = task.tag;
    taskDiv.getElementsByClassName('priority')[0].innerHTML = task.priority;
    taskDiv.getElementsByClassName('due-date')[0].innerHTML = task.dueDate;

}

function deleteTask(id) {
    localStorage.removeItem(id);
    try {
        let index = tasks.findIndex(tasks => tasks.id === id);
        tasks.splice(index, 1);
        const taskDiv = document.getElementById(id);
        taskDiv.remove();

    } catch (err) 
    {
        console.log(err);
    }
}

function markDoneUndone (id, checkBox) {
    try{
        let index = tasks.findIndex(tasks => tasks.id == id);
        const taskDiv = document.getElementById(id);
        if(checkBox.checked) {
            tasks[index].isDone = true;

            taskDiv.style.textDecoration = "line-through";
        }else {
            tasks[index].isDone = false;
            taskDiv.style.textDecoration = "none";
        }

    } catch (err) {
        console.log(err)
    }

}


function filterByCategory(category) {
    const tasksFiltered = tasks.filter(task => {
        return (task.category == category);
    });
    return tasksFiltered;
}