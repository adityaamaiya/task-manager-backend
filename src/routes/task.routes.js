const express = require("express");
const router = express.Router();
const taskController = require("../controllers/task.controller");
const upload = require("../middlewares/multer.middleware");

router.post("/tasks",upload.single("linkedFile"), taskController.createTask);
router.get("/tasks", taskController.getAllTasks);
router.get("/tasks/:id", taskController.getTaskById);
router.put("/tasks/:id",upload.single("linkedFile"), taskController.updateTask);
router.delete("/tasks/:id", taskController.deleteTask);
router.get("/tasks/:id/file", taskController.downloaddTaskFile);

module.exports = router;
