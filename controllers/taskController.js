import mongoose from "mongoose"
import taskModel from "../models/taskModel.js"
import projectModel from "../models/projectModel.js"
import teamModel from "../models/teamModel.js"
import userModel from "../models/userModel.js"


const statusList = ["To Do", "In Progress", "Completed", "Blocked"]

export const addNewTask = async (req, res) => {
    let { name, project, team, owners, tags, timeToComplete, status} = req.body

    timeToComplete = Number(timeToComplete);

    if(!name){
        return res.status(404).json({success: false, message: "Invalid Input: Name is required"})
    }

    if(!project){
        return res.status(404).json({success: false, message: "Invalid Input: Project Id is Invalid"})
    }

    if(!team){
        return res.status(404).json({success: false, message: "Invalid Input: Team is required"})
    }

    if(!owners || !Array.isArray(owners) || owners.length === 0){
        return res.status(404).json({success: false, message: "Invalid Input: Owner is required"})
    }

    if(!tags || !Array.isArray(tags) || tags.length === 0){
        return res.status(404).json({success: false, message: "Invalid Input: Tag is required"})
    }

    if(!timeToComplete || isNaN(timeToComplete)){
        return res.status(404).json({success: false, message: "Invalid Input: Time to compelete is required"})
    }

    if(!status || !statusList.includes(status)){
        return res.status(404).json({success: false, message: "Invalid Input: Status is required"})
    }

    try {

        const projectDoc = await projectModel.findOne({name: project})
        if(!projectDoc){
            return res.status(404).json({success: false, message: "Project not found"})
        }

        const teamDoc = await teamModel.findOne({name: team})
        if(!teamDoc){
            return res.status(404).json({success: false, message: "Team not found"})
        }

        const ownerDocs = await userModel.find({name: {$in: owners}})
        if(ownerDocs.length !== owners.length){
            return res.status(404).json({success: false, message: "One or more owners not found"})
        }
        const ownerIds = ownerDocs.map((owner) => owner._id)

        const task = new taskModel({name, project: projectDoc._id, team: teamDoc._id, owners: ownerIds, tags, timeToComplete, status})
        await task.save()
        return res.status(201).json({success: true, message: "Task added successfully", data: task})
    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }  
}


export const fetchTasks = async (req, res) => {
    try {
        const {team, owner, tags, project, status} = req.query

        const filter = {}

        if(project){
            const projectDoc = await projectModel.findOne({name: project})
            if(!projectDoc){
                return res.status(404).json({success: false, message: "Project not found"})
            }
            filter.project = projectDoc._id
        }

        if(owner){
            const ownerDocs = await userModel.find({name: owner})
            if(!ownerDocs || ownerDocs.length === 0){
                return res.status(404).json({success: false, message: `Task with owner ${owner} not found`})
            }
            filter.owners = {$in: ownerDocs.map((owner) => owner._id)}
        }

        if(team){
            const teamDoc = await teamModel.findOne({name: team})
            if(!teamDoc){
                return res.status(404).json({success: false, message: `Team with name ${team} not found`})
            }
        }

        if(tags){
            const tagArray = tags.split(",").map((tag) => tag.trim())
            filter.tags = {$all: tagArray}
        }

        if(status){
            filter.status = status
        }

        const tasks = await taskModel.find(filter).populate("project", "name").populate("team", "name").populate("owners", "name")

        return res.status(200).json({success: true, message: " List of filtered tasks.", data: tasks})
    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
}


export const updateTask = async (req, res) => {
    const {id} = req.params
    const { name, project, team, owners, tags, timeToComplete, status } = req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({status: false, message: "Invalid Task ID"})
    }

    try {
        const updateFields = {}

        if(name){
            updateFields.name = name
        }

        if(project){
            const projectDoc = await projectModel.findOne({name: project})
            if(!projectDoc){
                return res.status(404).json({success: false, message: "Project not found"})
            }
            updateFields.project = project._id
        }

        if(team){
            const teamDoc = await teamModel.findOne({name: team})
            if(!teamDoc){
                return res.status(404).json({success: false, message: "Team not found"})
            }
            updateFields.team = teamDoc._id
        }

        if(owners){
            const ownerDocs = await userModel.find({name: {$in: owners}})
            if(ownerDocs.length !== owners.length){
                return res.status(404).json({success: false, message: "One or more owners not found"})
            }
        }

        if(tags){
            updateFields.tags = tags
        }

        if(timeToComplete){
            updateFields.timeToComplete = timeToComplete
        } 

        if(status){
            if(!statusList.includes(status)){
                return res.status(400).json({success: false, message: "Invalid status"})
            }
            updateFields.status = status
        }

        const updatedTask = await taskModel.findByIdAndUpdate(id, {$set: updateFields}, {new: true})
        .populate("project", "name")
        .populate("team", "name")
        .populate("owners", "name")

        if(!updatedTask){
            return res.status(404).json({success: false, message: "Task not found"})
        }

        return res.status(200).json({success: true, message: "Task Updated Successfully", data: updatedTask})

    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
}


export const deleteTask = async (req, res) => {
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, message: "Invalid Task ID"})
    }

    try {
        const deletedTask = await taskModel.findByIdAndDelete(id)

        if(!deletedTask){
            return res.status(404).json({success: false, message: "Task not found"})
        }

        return res.status(200).json({success: true, message: "Task deleted successfully", data: deletedTask})
    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
}

export const fetchTaskById = async (req, res) => {
    const {id} = req.params
    if(!id){
        return res.status(400).json({success: false, message: "Task Id Not Found"})
    }

    try {
        const task = await taskModel.findById(id).populate('project', '_id name').populate('owners', 'name').populate('team', 'name members')
        console.log(task)
        if(!task){
            return res.status(404).json({success: false, message: "Task Not Found"})
        }
        return res.status(200).json({success: true, message: "Task Fetch Successfully", data: task})
    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
}