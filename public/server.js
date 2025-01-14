// Importing required modules
const express = require("express");
const fs = require("fs"); // To read and write JSON files
const path = require("path"); // To handle file paths

const app = express();
const PORT = 3000; // Port where the server will run

// Middleware to parse incoming JSON requests
app.use(express.json());
// Middleware to serve static files (HTML, CSS, JS)
app.use(express.static(path.join(__dirname, "public")));

// Path to the tasks data file
const tasksFilePath = path.join(__dirname, "data", "tasks.json");

// Utility function to read tasks from the JSON file
function readTasks() {
  const data = fs.readFileSync(tasksFilePath, "utf8");
  return JSON.parse(data); // Parse JSON string into JavaScript object
}

// Utility function to write tasks to the JSON file
function writeTasks(tasks) {
  fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2));
}

// API Endpoints
// Get all tasks
app.get("/api/tasks", (req, res) => {
  const tasks = readTasks();
  res.json(tasks); // Send tasks as a JSON response
});

// Add a new task
app.post("/api/tasks", (req, res) => {
  const tasks = readTasks();
  const newTask = req.body; // New task from the request body
  newTask.id = Date.now(); // Assign a unique ID to the task
  tasks.push(newTask); // Add the new task to the tasks array
  writeTasks(tasks); // Save updated tasks to the file
  res.status(201).json(newTask); // Respond with the new task
});

// Update an existing task
app.put("/api/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const taskId = parseInt(req.params.id); // Task ID from the request URL
  const updatedTask = req.body; // Updated task details

  const taskIndex = tasks.findIndex((task) => task.id === taskId);
  if (taskIndex !== -1) {
    tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask }; // Merge updates
    writeTasks(tasks); // Save updated tasks to the file
    res.json(tasks[taskIndex]); // Respond with the updated task
  } else {
    res.status(404).json({ message: "Task not found" }); // Handle invalid ID
  }
});

// Delete a task
app.delete("/api/tasks/:id", (req, res) => {
  const tasks = readTasks();
  const taskId = parseInt(req.params.id); // Task ID from the request URL

  const filteredTasks = tasks.filter((task) => task.id !== taskId);
  if (tasks.length !== filteredTasks.length) {
    writeTasks(filteredTasks); // Save updated tasks to the file
    res.status(200).json({ message: "Task deleted" });
  } else {
    res.status(404).json({ message: "Task not found" }); // Handle invalid ID
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
