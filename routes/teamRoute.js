import { addNewTeam, fetchAllTeams } from "../controllers/teamController.js";
import express from "express";

const teamRouter = express.Router()


teamRouter.post("/", addNewTeam)
teamRouter.get("/", fetchAllTeams)




export default teamRouter