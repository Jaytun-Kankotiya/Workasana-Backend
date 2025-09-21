import { addNewTag, fetchAllTags } from "../controllers/tagController.js ";
import express from "express";

const tagRouter = express.Router()

tagRouter.post("/", addNewTag)
tagRouter.get("/", fetchAllTags)


export default tagRouter