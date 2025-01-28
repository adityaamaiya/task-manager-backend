const mongoose = require("mongoose");
const Task = require("../models/task.model");

const createTask = async (taskData) => {
  try {
    const task = await Task.create(taskData); // No need to call save() here
    return task;
  } catch (error) {
    throw error;
  }
};

const getAllTasks = async () => {
  try {
    const tasks = await Task.find({});
    return tasks;
  } catch (error) {
    throw error;
  }
};

const getTaskById = async (taskId) => {
  if (!mongoose.Types.ObjectId.isValid(taskId)) {
    throw new Error("Invalid Task ID");
  }

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }
    return task;
  } catch (error) {
    throw error;
  }
};

const updateTask = async (taskId, taskData) => {
  try {
    const task = await Task.findByIdAndUpdate(taskId, taskData, { new: true });

    return task;
  } catch (error) {
    throw error;
  }
};

const deleteTask = async (taskId) => {
  try {
    const task = await Task.findByIdAndDelete(taskId);

    return task;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask,
};
