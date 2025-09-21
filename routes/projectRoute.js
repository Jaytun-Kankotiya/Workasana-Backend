import { addNewProject, fetchAllProjects } from "../controllers/projectController.js";
import express from 'express'


const projectRouter = express.Router()

projectRouter.post('/', addNewProject)
projectRouter.get('/', fetchAllProjects)


export default projectRouter
