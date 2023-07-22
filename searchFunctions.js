
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
      const reminderTime = new Date(task.reminder);
  
      if (currentTime >= reminderTime) {
        delete task.reminder;
        alert(`Reminder for "${task.name}": It is time to complete your task!`);
      }
    });
  }

  setInterval(checkReminders, 10000);