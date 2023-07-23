function fillFormFields(form, id) {
    let index = tasks.findIndex(tasks => tasks.id.toString() == id);
    console.log(tasks);
    if(index == -1) console.log(index);

    let task = tasks[index];
    form.elements['name'].value = task.name;
    form.elements['priority'].value = task.priority;
    form.elements['category'].value = task.category;
    form.elements['tag'].value = task.tag;
    form.elements['due-date'].value = task.dueDate;
    form.elements['reminder'].value = task.reminder;
    form.elements['add-or-update'].value = id;
    tasks[index].subtasks.forEach(subtask => {
        const subtasksDiv = document.getElementById('subtasks');
        const inputfield = document.createElement('input');
        inputfield.type="text";
        inputfield.name="subtask";
        inputfield.value = subtask;
        subtasksDiv.append(inputfield);
    });
}

function addTaskFromLocalStorage(task) {
    tasks.push(task);
    addTaskToTheDom(task);
}

function addEditTask( id, isAdd = true) {
    let task = {};
    task.id=id;
    task.name = form.elements['name'].value;
    task.priority = form.elements['priority'].value;
    task.category = form.elements['category'].value;
    task.tags = form.elements['tag'].value.trim().split(',');
    if(form.elements['due-date'].value == "") {
        task.dueDate = new Date().toISOString().slice(0, 10);
    }
    else task.dueDate = form.elements['due-date'].value;
    task.isDone = false;
    task.subtasks = [];
    if(form.elements['reminder'].value != '') task.reminder = new Date(form.elements['reminder'].value).toISOString().slice(0, 16);
    if(form.elements['subtask']){
        if(!form.elements['subtask'].length) {
            if(form.elements['subtask'].value.trim() !== '') task.subtasks.push(form.elements['subtask'].value.trim());
        }
        else {
            form.elements['subtask'].forEach(subtask => {
                if(subtask.value.trim() !== '') task.subtasks.push(subtask.value.trim());
            });
        }
    }

    if(isAdd) {
        tasks.push(task);
        addTaskToTheDom(task);
        logs.push({
            'action': 'added a task',
            'taskTitle': task.name,
            'timestamp': new Date().toString().slice(0, 24),
        });
    }
    else {
        logs.push({
            'action': 'updated a task',
            'taskTitle': task.name,
            'timestamp': new Date().toString().slice(0, 24),
        });
        let index = tasks.findIndex(tasks => tasks.id == id);
        if(index == -1) console.log("task does not exist");
        else{
            task.isDone = tasks[index].isDone;
            tasks[index] = task;
        }
        editTaskOnDom(task);
    }
    form.reset();
    form.elements['add-or-update'].value='add';
    document.getElementById('subtasks').innerHTML = '';
    localStorage.setItem('tasks', JSON.stringify(tasks));
    localStorage.setItem('logs', JSON.stringify(logs));
}

function addTaskToTheDom(task) {
    try {
        const tasksDiv = document.getElementById('tasks-div');
        const taskDiv = document.createElement('div');
        const subtasks = document.createElement('div');
        const btns = document.createElement('div');
        const name = document.createElement('span');
        const category = document.createElement('span');
        const tag = document.createElement('span');
        const priority = document.createElement('span');
        const dueDate = document.createElement('span');
        const reminder = document.createElement('span');
        
        const btnDelete = document.createElement('button');
        const btnEdit = document.createElement('button');
        const btnIsDone = document.createElement('button');
        

        tasksDiv.appendChild(taskDiv);
        taskDiv.appendChild(name);
        taskDiv.appendChild(priority);
        taskDiv.appendChild(category);
        taskDiv.appendChild(tag);
        taskDiv.appendChild(dueDate);
        taskDiv.appendChild(reminder);
        taskDiv.appendChild(subtasks);
        taskDiv.appendChild(btns);

        btns.appendChild(btnEdit);
        btns.appendChild(btnDelete);
        btns.appendChild(btnIsDone);


        name.innerHTML = task.name;
        name.classList.add('name');
        category.innerHTML = `Category: ${task.category}`;
        category.classList.add('category');
        tag.innerHTML = `Tags: ${task.tags.join(',')}`;
        tag.classList.add('tags');
        priority.innerHTML = `Priority: ${task.priority}`;
        priority.classList.add('priority');
        dueDate.innerHTML = `Due Date: ${task.dueDate}`;
        dueDate.classList.add('due-date');
        reminder.innerHTML = `Reminder: ${(task.reminder) ? task.reminder : ''}`;
        reminder.classList.add('reminder');
        subtasks.classList.add('subtasks');
        subtasks.innerHTML = 'Subtasks: '
        btns.classList.add('btns');

        task.subtasks.forEach(subtask => {
            const spanTag = document.createElement('span');
            spanTag.innerHTML = subtask;
            subtasks.append(spanTag);
        })
        
        btnDelete.name = task.id;
        btnEdit.name = task.id;
        btnIsDone.name = task.id;
        btnEdit.innerHTML = 'Edit';
        btnDelete.innerHTML = 'Delete';
        btnIsDone.innerHTML = 'Mark as Done';
        btnDelete.classList.add("delete-btn");
        btnEdit.classList.add("edit-btn");
        btnIsDone.classList.add("mark-done-btn");

        taskDiv.setAttribute('id', task.id);
        taskDiv.classList.add('task-card');
    } catch (err) {
        console.log(err);
    }
}

function editTaskOnDom(task) {
    const taskDiv = document.getElementById(task.id);
    if(!taskDiv) console.log("div not found");
    
    taskDiv.getElementsByClassName('name')[0].innerHTML = task.name;
    taskDiv.getElementsByClassName('category')[0].innerHTML = `Category: ${task.category}`;
    if(task.tag.length>0) taskDiv.getElementsByClassName('tag')[0].innerHTML = `Tags: ${task.tag}`;
    else taskDiv.getElementsByClassName('tag')[0].innerHTML = 'Tags: ';
    taskDiv.getElementsByClassName('priority')[0].innerHTML = `Priority: ${task.priority}`;
    taskDiv.getElementsByClassName('due-date')[0].innerHTML = `Due Date: ${task.dueDate}`;
    taskDiv.getElementsByClassName('due-date')[0].reminder = `Reminder: ${(task.reminder) ? task.reminder : ''}`;
    
    
    const subtasks = taskDiv.getElementsByClassName('subtasks')[0];
    taskDiv.getElementsByClassName('subtasks')[0].innerHTML = 'Subtasks: ';

    task.subtasks.forEach(subtask => {
        const spanTag = document.createElement('span');
        span.innerHTML = subtask;
        subsets.append(spanTag);
    })
}

function deleteTask(id) {
    try {
        let index = tasks.findIndex(tasks => tasks.id == id);
        logs.push({
            'action': 'Deleted a task',
            'taskTitle': tasks[index].name,
            'timestamp': new Date().toString().slice(0, 24),
        });
        tasks.splice(index, 1);
        const taskDiv = document.getElementById(id);
        taskDiv.remove();
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('logs', JSON.stringify(logs));
    } catch (err) 
    {
        console.log(err);
    }
}

function markDoneUndone (id, btn, markDone) {
    try{
        
        let index = tasks.findIndex(tasks => tasks.id == id);
        const taskDiv = document.getElementById(id);
        if(markDone) {
            logs.push({
                'action': 'Mark a task as done',
                'taskTitle': tasks[index].name,
                'timestamp': new Date().toString().slice(0, 24),
            });
            tasks[index].isDone = true;

            btn.classList.remove('mark-done-btn');
            btn.classList.add('mark-undone-btn');
            btn.innerHTML = 'Mark as Undone';
            taskDiv.style.textDecoration = "line-through";
        }else {
            logs.push({
                'action': 'Mark a task as undone',
                'taskTitle': tasks[index].name,
                'timestamp': new Date().toString().slice(0, 24),
            });
            tasks[index].isDone = false;
            taskDiv.style.textDecoration = "none";
            btn.classList.remove('mark-undone-btn');
            btn.classList.add('mark-done-btn');
            btn.innerHTML = 'Mark as Done';
        }
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('logs', JSON.stringify(logs));

    } catch (err) {
        console.log(err)
    }

}


function filterByCategory(category) {
    let tasksFiltered = tasks.filter(task => {
        return (task.category == category);
    });
    return tasksFiltered;
}

function filterByTags(tags) {
    let tasksFiltered = tasks.filter(task => {
        return (
            task.tags.forEach(tag => {
                tags.forEach(tagFilter => {
                    if(tag.trim() == tagFilter.trim()) return true;
                })
            })
        )
    });
    return tasksFiltered;
}

function sortByPriority() {
    const priorityOrder = {'high': 1, 'medium': 2, 'low': 3};
    let sortedBypriority = JSON.parse(JSON.stringify(tasks));
    sortedBypriority.sort((a, b) => {
        const priorityTaskA = priorityOrder[a.priority];
        const priorityTaskB = priorityOrder[b.priority];
        return priorityTaskA - priorityTaskB;
    });
    return sortedBypriority;
}

function sortByDueDate() {

    let sortedByDueDate = JSON.parse(JSON.stringify(tasks));
    sortedByDueDate.sort((a, b) => {
        const dueDateA = new Date(a.dueDate);
        const dueDateB = new Date(b.dueDate);
        return !(dueDateA - dueDateB);
    });
    return sortedByDueDate;
}

function backlogs() {
    
    let sortedByDueDate = sortByDueDate();
    let left = 0;
    let right = sortedByDueDate.length;

    while (left < right) {
        const mid = Math.floor((left + right) / 2);

        const midTaskDueDate = new Date(sortedByDueDate[mid].dueDate);
        if (midTaskDueDate > new Date()) {
            right = mid - 1;
        } else {
            left = mid;
        }
    }

    sortedByDueDate = sortedByDueDate.slice(0, left+1);
    return sortedByDueDate;
}

