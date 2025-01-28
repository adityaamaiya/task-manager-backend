const TaskService = require("../services/task.service");
const mongoose = require("mongoose");
const taskValidationSchema = require("../validations/taskSchema.validation");

const createTask = async (req, res) => {
  const { error } = taskValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { title, description, deadline } = req.body;
    const file = req.file;

    // Prepare the new task object
    const taskDta = {
      title,
      description,
      deadline,
      linkedFile: file
        ? { data: file.buffer, contentType: file.mimetype }
        : null,
    };

    const savedTask = await TaskService.createTask(taskDta);
    res.status(201).json(savedTask);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ error: "Failed to create task" });
  }
};

const getAllTasks = async (req, res) => {
  try {
    const tasks = await TaskService.getAllTasks();
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found" });
    }
    res.status(200).json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

const getTaskById = async (req, res) => {
  console.log("Request ID:", req.params.id); // Debug log

  try {
    // Validate Task ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid Task ID" });
    }
    const task = await TaskService.getTaskById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    console.error("Error in getTaskById:", error); // Debug error
    res.status(400).json({ error: error.message });
  }
};

const downloaddTaskFile = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid Task ID" });
    }
    const task = await TaskService.getTaskById(req.params.id);

    // Check if the task has a linked file and if the contentType is defined
    if (!task || !task.linkedFile || !task.linkedFile.data) {
      return res
        .status(404)
        .json({ error: "No linked file found for this task" });
    }

    const fileBuffer = task.linkedFile.data;
    const contentType =
      task.linkedFile.contentType || "application/octet-stream"; // Default MIME type

    res.setHeader("Content-Type", contentType); // Set content type for file
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=task-${task._id}.pdf`
    );
    res.status(200).send(fileBuffer); // Send the file buffer as the response
  } catch (error) {
    console.error("Error fetching file:", error);
    res
      .status(500)
      .json({ error: "Server error occurred while fetching file" });
  }
};

const updateTask = async (req, res) => {
  try {
    const { error } = taskValidationSchema.validate(req.body);
    if (error) {
      // If validation fails, return an error response
      return res.status(400).json({ error: error.details[0].message });
    }
    // Validate Task ID
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: "Invalid Task ID" });
    }

    // Update Task
    const task = await TaskService.updateTask(req.params.id, req.body);

    // Handle if task is not found
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Send updated task
    res.status(200).json(task);
  } catch (error) {
    console.error("Error updating task:", error);

    // Use appropriate status code for server errors
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

const deleteTask = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(404).json({ message: "Invalid Task ID" });
    }
    await TaskService.deleteTask(req.params.id);

    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
  downloaddTaskFile,
};
