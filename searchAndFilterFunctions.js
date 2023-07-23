const tasksDiv = document.getElementById('tasks-div');

// display the searched/filtered tasks 
function displayTasks(filteredTasks) {
    console.log(filteredTasks);
    tasksDiv.innerHTML = '';
    filteredTasks.forEach((task) => {
        addTaskToTheDom(task);
    });
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
        return dueDateA - dueDateB;
    });
    return sortedByDueDate;
}

function backlogs() {
    try{
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
    } catch (err) {
        console.log(err);
    }
}


// Function for searching by (exact) task name
function searchExact(searchTerm) {
    const searchedTasks = tasks.filter(task => task.name.toLowerCase() === searchTerm.toLowerCase());
    return searchedTasks;
}

// Function for searching based on subtasks
function searchBySubtasks(subtasks) {
    const searchedTasks = tasks.filter(task => subtasks.some(subtask => task.subtasks.includes(subtask.toLowerCase())));
    return searchedTasks;
}


// Function for searching based on similar words
function searchBySimilarWords(searchTerm) {
    const searchedTasks = tasks.filter(task => task.name.toLowerCase().includes(searchTerm.toLowerCase()));
    return searchedTasks;
}

// Function for searhcing based on partial keywords
function searchPartial(searchTerm) {
    const searchedTasks = tasks.filter(task => task.name.toLowerCase().includes(searchTerm.toLowerCase())); 
    return searchedTasks;
}

// Function for searhcing based on tags
function searchByTags(tags) {
    tags = searchTerm.split(',');
    const searchedTasks = tasks.filter(task => tags.some(t => task.tags.includes(t.toLowerCase())));
    return searchedTasks;
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