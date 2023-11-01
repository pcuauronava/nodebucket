/**
 * Title: app.js
 * Author: Professor Krasso
 * Date: 8/5/2023
 */
"use strict";

// Require statements
const express = require("express");
const createServer = require("http-errors");
const path = require("path");
//
const bodyParser = require("body-parser");

require("./connection");
const Employee = require("./models/employee");
const Task = require("./models/task");
// schema for the tasks collection

// Create the Express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const cors = require("cors");
app.use(cors());
// CORS configuration

// Configure the app
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "../dist/nodebucket")));
app.use("/", express.static(path.join(__dirname, "../dist/nodebucket")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // Allows any domain to access our resources
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  ); // Which kind of headers are allowed
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  ); // Which kind of requests are allowed
  next(); // Allows the request to continue to the next middleware in line
});

// Employee API routes

//working on this part!!!
// app.get("/api/employees/:empId/tasks", async (req, res) => {
//   try {
//     // const tasks = await Task.find({ employee:{ req.params.empId} });
//     // find the task where the empId field on the employee document matches the empId parameter
//     const tasks = await Task.find({ "employee.empId": req.params.empId });
//     res.json(tasks);
//   } catch (error) {
//     console.log(error);
//     res.status(500).send(error);
//   }
// });

app.get("/api/employees", async (req, res) => {
  Employee.find().then((documents) => {
    res.status(200).json({
      message: "Employees fetched successfully!",
      employees: documents,
    });
  });
});

app.get("/api/employees/:empId", async (req, res) => {
  try {
    const [employee] = await Employee.find({ empId: req.params.empId });
    res.json(employee);
  } catch (error) {
    res.status(500).send(error);
  }
});
// Employee API routes

app.post("/api/employees", (req, res, next) => {
  const employee = new Employee({
    empId: req.body.empId,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
  });
  employee.save().then((createdEmployee) => {
    res.status(201).json({
      message: "Employee added successfully",
      postId: createdEmployee._id,
    });
  });
});

app.delete("/api/employees/:id", (req, res, next) => {
  Task.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Employee deleted!" });
  });
});

// app.get("/api/tasks/:empId", async (req, res) => {
//   try {
//     const [employee] = await Employee.find({ empId: req.params.empId });
//     res.json(employee);
//   } catch (error) {
//     res.status(500).send(error);
//   }
// });

// Task API routes

app.post("/api/tasks", (req, res, next) => {
  const task = new Task({
    title: req.body.title,
    content: req.body.content,
  });
  task.save().then((createdTask) => {
    res.status(201).json({
      message: "Task added successfully",
      taskId: createdTask._id,
    });
  });
});

app.get("/api/tasks", async (req, res, next) => {
  Task.find().then((documents) => {
    res.status(200).json({
      message: "Tasks fetched successfully!",
      tasks: documents,
      // this is to match the format from the database with
      // data from the model in the database case the model is
      // id but in the database is _id
    });
  });
});

app.delete("/api/tasks/:id", (req, res, next) => {
  Task.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
    res.status(200).json({ message: "Task deleted!" });
  });
});

// error handler for 404 errors
app.use(function (req, res, next) {
  res(createServer(404)); // forward to error handler
});

// error handler for all other errors
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(err.status || 500); // set response status code

  // send response to client in JSON format with a message and stack trace
  res.json({
    type: "error",
    status: err.status,
    message: err.message,
    stack: req.app.get("env") === "development" ? err.stack : undefined,
  });
});

module.exports = app; // export the Express application
