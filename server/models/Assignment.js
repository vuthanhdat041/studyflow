const mongoose = require("mongoose");

const AssignmentSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  title: { type: String, required: true },
  deadline: { type: Date, required: true },
  status: { type: String, enum: ["pending", "in-progress", "done"], default: "pending" }
}, { timestamps: true });

module.exports = mongoose.model("Assignment", AssignmentSchema);


