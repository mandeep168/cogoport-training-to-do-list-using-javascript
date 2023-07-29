const tasksDiv = document.getElementById('tasks-div');

// display the searched/filtered tasks 
function displayTasks(filteredTasks) {
    // console.log(filteredTasks);
    tasksDiv.innerHTML = '';
    filteredTasks.forEach((task) => {
        addTaskToTheDom(task);
    });
}

function parseDueDate() {

    let taskText = document.getElementById('task-name').value.trim();
    
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    if (taskText.toLowerCase().includes("tomorrow")) {
       document.getElementById('task-name').value = taskText.replace(/(\sby\s.*|tomorrow|today)/gi, '').trim();
        const tomorrow = new Date();
        tomorrow.setDate(today.getDate() + 1);
        const formattedDate = tomorrow.toISOString().split('T')[0];
        document.getElementById('due-date').value = formattedDate;
        return;
    } else if (taskText.toLowerCase().includes("today")) {
       document.getElementById('task-name').value = taskText.replace(/(\sby\s.*|tomorrow|today)/gi, '').trim();
       const today = new Date();
       const formattedDate = today.toISOString().split('T')[0];
       document.getElementById('due-date').value = formattedDate;
       return ;
    }

    const dateRegex = /(\b\d{1,2}(?:st|nd|rd|th)?\s(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)\s\d{2,4})/gi;
    const timeRegex = /(\d{1,2}:\d{2}\s(?:am|pm))/gi;

    const dateMatches = taskText.match(dateRegex);
    const timeMatches = taskText.match(timeRegex);

    if (dateMatches && dateMatches.length > 0) {
      const parsedDate = new Date(dateMatches[0]);
      if (timeMatches && timeMatches.length > 0) {
        const parsedTime = new Date(`2023-01-01 ${timeMatches[0]}`);
        parsedDate.setHours(parsedTime.getHours());
        parsedDate.setMinutes(parsedTime.getMinutes());
      }
      
    const taskText = document.getElementById('task-name').value;
    const formattedDueDate = parsedDate ? parsedDate.toISOString().slice(0, 10) : '';
    taskText.replace(/(\sby\s.*|tomorrow|today)/gi, '').trim();
    document.getElementById('due-date').value = formattedDueDate;

      return parsedDate;
    }
    return null;
}

function filter() {
    const category = document.getElementById('category-filter').value.trim();
    const fromDueDate = document.getElementById('due-date-range-from').value;
    const toDueDate = document.getElementById('due-date-range-to').value;
    const priority = document.getElementById('priority').value;
    const sortBy = document.getElementById('sort-by').value;

    let filterdItems = filterByDueDate(fromDueDate, toDueDate);
    filterdItems = filterByCategory(category, filterdItems);
    filterdItems = filterByPriority(priority, filterdItems);
    if(sortBy == 'priority') {
        filterdItems = sortByPriority(filterdItems);
    }
    else if(sortBy == 'dueDate') {
        filterdItems = sortByDueDate(filterdItems);
    }

    return filterdItems;
}

function filterByDueDate(from, to) {
    const tasksList =  tasks.filter(task => {
        return (to == '' || task.dueDate <= to) && (from == '' || task.dueDate >= from);
    })
    return tasksList;
}

function filterByCategory(category, taskList) {
    if(category == '') return taskList;
    let tasksFiltered = taskList.filter(task => {
        return (task.category == category);
    });
    return tasksFiltered;
}

function filterByPriority(priority, tasksList) {
    if(priority == 'all' || priority == '') return tasksList;

    return tasksList.filter(task => {
        return task.priority == priority;
    });
}
function sortByPriority(taskList) {
    const priorityOrder = {'high': 1, 'medium': 2, 'low': 3};
    taskList.sort((a, b) => {
        const priorityTaskA = priorityOrder[a.priority];
        const priorityTaskB = priorityOrder[b.priority];
        return priorityTaskA - priorityTaskB;
    });
    return taskList;
}

function sortByDueDate(taskList) {
    taskList.sort((a, b) => {
        const dueDateA = new Date(a.dueDate);
        const dueDateB = new Date(b.dueDate);
        return dueDateA - dueDateB;
    });
    return taskList;
}

function backlogs() {
    try{
        return tasks.filter(task => {
            return new Date(task.dueDate) < new Date();
        })
    } catch (err) {
        console.log(err);
    }
}


function search(combinedSearch, searchByTags) {
    const searchKeywords = combinedSearch.split(",").map((keyword) => keyword.trim());
    const tagSearchKeywords = searchByTags.split(",").map((keyword) => keyword.trim());
    const searchResults = [];

    searchKeywords.forEach((keyword) => {
        const searchTermLower = keyword.toLowerCase();
        const results = tasks.filter((task) => {
            const taskNameLower = task.name.toLowerCase();
            const subtasksLower = task.subtasks.map((subtask) => subtask.name.toLowerCase());
            const tagsLower = task.tags.map((tag) => tag.toLowerCase());

            return (
                taskNameLower.includes(searchTermLower) || // Partial search for task names
                taskNameLower === searchTermLower || // Exact search for task names
                taskNameLower.includes(searchTermLower) || // Similar words search for task names
                subtasksLower.some((subtask) => subtask.includes(searchTermLower)) // Search in subtasks
                // tagsLower.some((tag) => tag.includes(searchTermLower)) // Search in subtasks
            );
        });
    
        results.forEach(result => {
            if(!searchResults.includes(result)) searchResults.push(result);
        })
    });

    tagSearchKeywords.forEach((keyword) => {
        const searchTermLower = keyword.toLowerCase();
        const results = tasks.filter((task) => {
            const tagsLower = task.tags.map((tag) => tag.toLowerCase());

            return (
                tagsLower.some((tag) => tag.includes(searchTermLower)) // Search in tags
            );
        });
    
        results.forEach(result => {
            if(!searchResults.includes(result)) searchResults.push(result);
        })
    });

    return searchResults;
}

// Reminders
function checkReminders() {
    const currentTime = new Date();
  
    tasks.forEach(task => {
        if(task.reminder) {
            const reminderTime = new Date(task.reminder);
  
            if (currentTime >= reminderTime) {
                delete task.reminder;
                alert(`Reminder for "${task.name}": It is time to complete your task!`);
            }
        }
    });
}

setInterval(checkReminders, 10000);