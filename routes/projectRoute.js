import { addNewProject, fetchAllProjects, fetchProjectById } from "../controllers/projectController.js";
import express from 'express'


const projectRouter = express.Router()

projectRouter.post('/', addNewProject)
projectRouter.get('/', fetchAllProjects)
projectRouter.get('/:id', fetchProjectById)


export default projectRouter
