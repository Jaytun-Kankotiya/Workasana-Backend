import { addNewTask, deleteTask, fetchTaskById, fetchTasks, updateTask } from "../controllers/taskController.js";
import express from "express";

const taskRouter = express.Router()

taskRouter.post("/", addNewTask)
taskRouter.get("/", fetchTasks)
taskRouter.get("/:id", fetchTaskById)
taskRouter.patch("/:id", updateTask)
taskRouter.delete("/:id", deleteTask)

export default taskRouter