import { updateTask } from "../controllers/taskController.js";
import { addNewTeam, fetchAllTeams, fetchTeamById, updateTeamById } from "../controllers/teamController.js";
import express from "express";

const teamRouter = express.Router()


teamRouter.post("/", addNewTeam)
teamRouter.get("/", fetchAllTeams)
teamRouter.get("/:id", fetchTeamById)
teamRouter.patch("/:id", updateTeamById)




export default teamRouter