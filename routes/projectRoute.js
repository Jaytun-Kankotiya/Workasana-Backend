import { addNewProject, fetchAllProjects, fetchProjectById, updateProject } from "../controllers/projectController.js";
import express from 'express'


const projectRouter = express.Router()

projectRouter.post('/', addNewProject)
projectRouter.get('/', fetchAllProjects)
projectRouter.get('/:id', fetchProjectById)
projectRouter.patch('/:id', updateProject)


export default projectRouter
