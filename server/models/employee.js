const mongoose = require("mongoose");

const employeeSchema = mongoose.Schema({
  empId: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  // tasks: { type: [tasksSchema] },
});

module.exports = mongoose.model("Employee", employeeSchema);
