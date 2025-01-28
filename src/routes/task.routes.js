const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.controller");
const upload = require("../middlewares/multer.middleware");
const validateObjectId = require("../middlewares/validateObjectId.middleware"); // Optional

router.post("/tasks", upload.single("linkedFile"), taskController.createTask);
router.get("/tasks", taskController.getAllTasks);
router.get("/tasks/:id", validateObjectId, taskController.getTaskById); // Added validation middleware
router.put(
  "/tasks/:id",
  validateObjectId,
  upload.single("linkedFile"),
  taskController.updateTask
); // Added validation middleware
router.delete("/tasks/:id", validateObjectId, taskController.deleteTask); // Added validation middleware
router.get(
  "/tasks/:id/file",
  validateObjectId,
  taskController.downloadTaskFile
); // Renamed for consistency

module.exports = router;
