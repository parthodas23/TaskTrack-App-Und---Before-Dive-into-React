// Selecting DOM elements
const taskForm = document.getElementById("task-form");
const taskTitle = document.getElementById("task-title");
const taskDesc = document.getElementById("task-desc");
const taskList = document.getElementById("task-list");

// Fetch and display tasks on page load
fetchTasks();

// Add new task
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newTask = {
    title: taskTitle.value,
    description: taskDesc.value,
  };

  fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTask),
  })
    .then((res) => res.json())
    .then((task) => {
      displayTask(task);
      taskForm.reset(); // Clear the form
    });
});

// Fetch tasks from the server
function fetchTasks() {
  fetch("/api/tasks")
    .then((res) => res.json())
    .then((tasks) => tasks.forEach(displayTask));
}

// Display a task in the UI
function displayTask(task) {
  const li = document.createElement("li");
  li.className = "task-item";
  li.dataset.id = task.id;
  li.innerHTML = `
    <strong>${task.title}</strong>
    <p>${task.description}</p>
    <button onclick="deleteTask(${task.id})">Delete</button>
  `;
  taskList.appendChild(li);
}

// Delete a task
function deleteTask(taskId) {
  fetch(`/api/tasks/${taskId}`, { method: "DELETE" })
    .then((res) => res.json())
    .then(() => {
      document.querySelector(`li[data-id='${taskId}']`).remove();
    });
}
