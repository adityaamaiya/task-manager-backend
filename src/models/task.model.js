const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: {
    type: String,
    enum: ["TODO", "DONE"],
    default: "TODO",
  },
  linkedFile: {
    data: { type: Buffer, required: false },
    contentType: { type: String, required: false },
  },
  createdOn: { type: Date, required: true, default: Date.now },
  deadline: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value > Date.now(); // Ensure deadline is a future date
      },
      message: "Deadline must be a future date",
    },
  },
});

const Task = mongoose.model("Task", taskSchema);

module.exports = Task;
