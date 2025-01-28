const TaskService = require("../services/task.service");

const taskValidationSchema = require("../validations/taskSchema.validation");

const createTask = async (req, res) => {
  const { error } = taskValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { title, description, deadline } = req.body;
    const file = req.file;

    // Prepare the task object
    const taskData = {
      title,
      description,
      deadline,
      linkedFile: file
        ? { data: file.buffer, contentType: file.mimetype }
        : null, // Optional linkedFile field
    };

    const savedTask = await TaskService.createTask(taskData);
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

const downloadTaskFile = async (req, res) => {
  try {
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

    console.log("File buffer size:", fileBuffer.length); // Check buffer size
    console.log("Content type:", contentType); // Check content type

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
      console.error("Validation error:", error.details[0].message);
      return res.status(400).json({ error: error.details[0].message });
    }

    const { title, description, status, deadline } = req.body;
    const file = req.file;

    const updatedFields = {
      title,
      description,
      status,
      deadline,
    };

    // Only add the linked file if a new file is provided
    if (file) {
      updatedFields.linkedFile = {
        data: file.buffer,
        contentType: file.mimetype,
      };
    }

    const updatedTask = await TaskService.updateTask(
      req.params.id,
      updatedFields
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("Error updating task:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({ error: error.message });
    }

    res.status(500).json({ error: "Failed to update task" });
  }
};

const deleteTask = async (req, res) => {
  try {
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
  downloadTaskFile,
};
