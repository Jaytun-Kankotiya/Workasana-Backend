import { addNewProject } from "../controllers/projectController.js";
import express from 'express'


const projectRouter = express.Router()

projectRouter.post('/add-new', addNewProject)


export default projectRouter