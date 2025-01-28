const cors = require("cors");
const express = require("express");
const app = express();
const PORT = 3002;
const mongoose = require("mongoose");
const taskRoutes = require("./src/routes/task.routes");

const DB_URI =
  "mongodb+srv://amaiyaaditya:test@task-manager.ptfns.mongodb.net/task-manager?retryWrites=true&w=majority&appName=task-manager";

mongoose
  .connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

app.use(cors());
app.use(express.json({ limit: "50mb" })); // Increase JSON payload limit
app.use(express.urlencoded({ limit: "50mb", extended: true })); // Increase URL-encoded payload limit

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/", taskRoutes);
