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

function addTaskToTheDiv(taskDiv, task){
    try {
        taskDiv.getElementsByClassName('name')[0].innerHTML = task.name;
        taskDiv.getElementsByClassName('category')[0].innerHTML = `Category: ${task.category}`;
        if(task.tags && task.tags.length>0) {
            taskDiv.getElementsByClassName('tags')[0].innerHTML = `Tags: `;
            task.tags.forEach((tag) => {
                const spanTag = document.createElement('span');
                spanTag.innerHTML = tag;
                taskDiv.getElementsByClassName('tags')[0].append(spanTag);
            })

        }
        else taskDiv.getElementsByClassName('tags')[0].innerHTML = 'Tags: ';
        taskDiv.getElementsByClassName('priority')[0].innerHTML = `Priority: ${task.priority}`;
        taskDiv.getElementsByClassName('due-date')[0].innerHTML = `Due Date: ${task.dueDate}`;
        taskDiv.getElementsByClassName('reminder')[0].innerHTML = `Reminder: ${(task.reminder) ? task.reminder : ''}`;
        
        
        const subtasks = taskDiv.getElementsByClassName('subtasks')[0];
        subtasks.innerHTML = 'Subtasks: ';

        task.subtasks.forEach((subtask, index) => {

            const subtaskDiv = document.createElement('div');
            const checkbox = document.createElement('input');
            const spanTag = document.createElement('span');

            spanTag.innerHTML = subtask.name;
            if(subtask.isDone) {
                checkbox.checked = true;
                subtaskDiv.classList.add('marked-done');
            }
            checkbox.setAttribute('type', 'checkbox');
            checkbox.setAttribute('name', `${task.id}-${index}`);
            checkbox.classList.add('subtask-mark-done');
            subtaskDiv.setAttribute('id', `${task.id}-${index}`);

            subtaskDiv.append(checkbox);
            subtaskDiv.append(spanTag);
            subtasks.append(subtaskDiv);
        })
    } catch (err) {
        console.log(err);
    }
}

function addEditTask( id, isAdd = true) {
    let task = {};
    task.id=id;
    const taskText = form.elements['name'].value;
    const dueDate = parseDueDate(taskText);
    const formattedDueDate = dueDate ? dueDate.toISOString().slice(0, 10) : '';
    const taskWithoutDate = taskText.replace(/(\sby\s.*|tomorrow|today)/gi, '').trim();

    task.name = taskWithoutDate;
    task.priority = form.elements['priority'].value;
    task.category = form.elements['category'].value.trim();
    task.tags = form.elements['tag'].value.trim().split(',');

    if(formattedDueDate != '')
        task.dueDate = formattedDueDate;
    else if(form.elements['due-date'].value.trim() == "") 
        task.dueDate = new Date().toISOString().slice(0, 10);
    else task.dueDate = form.elements['due-date'].value;
    
    task.isDone = false;
    task.subtasks = [];
    if(form.elements['reminder'].value != '') task.reminder = new Date(form.elements['reminder'].value).toISOString().slice(0, 16);
    if(form.elements['subtask']){
        if(!form.elements['subtask'].length) {
            if(form.elements['subtask'].value.trim() !== '') task.subtasks.push({
                name: form.elements['subtask'].value.trim(),
                isDone: false,
            });
        }
        else {
            form.elements['subtask'].forEach(subtask => {
                if(subtask.value.trim() !== '') task.subtasks.push({
                    name: subtask.value.trim(),
                    isDone: false,
                });
            });
        }
    }
    const logEntry = {
        'taskTitle': task.name,
        'timestamp': new Date().toString().slice(0, 24),
    };
    if(isAdd) {
        tasks.push(task);
        addTaskToTheDom(task);
        logEntry.action = 'added a task';
    }
    else {
        logEntry.action = 'updated a task';
        let index = tasks.findIndex(tasks => tasks.id == id);
        if(index == -1) console.log("task does not exist");
        else{
            task.isDone = tasks[index].isDone;
            tasks[index] = task;
        }
        const taskDiv = document.getElementById(task.id);
        addTaskToTheDiv(taskDiv, task);
    }
    form.reset();
    form.elements['add-or-update'].value='add';
    document.getElementById('subtasks').innerHTML = '';
    logs.unshift(logEntry);
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
        const tagsDiv = document.createElement('div');
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
        taskDiv.appendChild(tagsDiv);
        taskDiv.appendChild(dueDate);
        taskDiv.appendChild(reminder);
        taskDiv.appendChild(subtasks);
        taskDiv.appendChild(btns);

        btns.appendChild(btnEdit);
        btns.appendChild(btnDelete);
        btns.appendChild(btnIsDone);


        name.classList.add('name');
        category.classList.add('category');
        tagsDiv.classList.add('tags');
        priority.classList.add('priority');
        dueDate.classList.add('due-date');
        reminder.classList.add('reminder');
        subtasks.classList.add('subtasks');
        btns.classList.add('btns');

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

        addTaskToTheDiv(taskDiv, task);

    } catch (err) {
        console.log(err);
    }
}

function deleteTask(id) {
    try {
        let index = tasks.findIndex(tasks => tasks.id == id);
        logs.unshift({
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
        const logEntry = {
            'taskTitle': tasks[index].name,
            'timestamp': new Date().toString().slice(0, 24),
        };
        if(markDone) {
            logEntry.action = 'Mark a task as done';
            tasks[index].isDone = true;
            btn.classList.remove('mark-done-btn');
            btn.classList.add('mark-undone-btn');
            btn.innerHTML = 'Mark as Undone';
            // taskDiv.style.textDecoration = "line-through";
            taskDiv.classList.add('marked-done');
        }else {
            logEntry.action = 'Mark a task as undone';
            tasks[index].isDone = false;
            // taskDiv.style.textDecoration = "none";
            taskDiv.classList.remove('marked-done');
            btn.classList.remove('mark-undone-btn');
            btn.classList.add('mark-done-btn');
            btn.innerHTML = 'Mark as Done';
        }
        logs.unshift(logEntry);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('logs', JSON.stringify(logs));

    } catch (err) {
        console.log(err)
    }

}


function activityLog(log) {
    const tasksDiv = document.getElementById('tasks-div');
    const logDiv = document.createElement('div');

    const br = document.createElement('br');
    const br1 = document.createElement('br');

    const action = document.createElement('span');
    const name = document.createElement('span');
    const time = document.createElement('span');

    action.innerHTML = `<strong>Action:</strong> ${log.action}`;
    name.innerHTML = `<strong>Task name:</strong> ${log.taskTitle}`;
    time.innerHTML = log.timestamp;

    tasksDiv.append(logDiv);
    logDiv.classList.add('log-div');

    logDiv.append(action);
    logDiv.append(br);
    logDiv.append(name);
    logDiv.append(br1);
    logDiv.append(time);
}


function markSubtaskDone(id, index, checkbox) {
    try{
        
        let taskIndex = tasks.findIndex(tasks => tasks.id == id);
        const subtaskDiv = document.getElementById(`${id}-${index}`);
        const logEntry = {
            'taskTitle': tasks[taskIndex].name,
            'timestamp': new Date().toString().slice(0, 24),
        };
        if(checkbox.checked) {
            logEntry.action = `Mark a subtask <i> ${tasks[taskIndex].subtasks[index].name} </i> as done`;
            tasks[taskIndex].subtasks[index].isDone = true;
            // subtaskDiv.style.textDecoration = "line-through";
            subtaskDiv.classList.add('marked-done');
        }else {
            logEntry.action = `Mark a subtask <i> ${tasks[taskIndex].subtasks[index].name} </i> as undone`;
            tasks[taskIndex].subtasks[index].isDone = false;
            // subtaskDiv.style.textDecoration = "none";
            
            subtaskDiv.classList.remove('marked-done');
        }
        logs.unshift(logEntry);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        localStorage.setItem('logs', JSON.stringify(logs));

    } catch (err) {
        console.log(err)
    }

}