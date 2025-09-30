import projectModel from "../models/projectModel.js";

const statusList = ["To Do", "In Progress", "Completed", "Blocked"]

export const addNewProject = async (req, res) => {
    const {name, description, status} = req.body

    if(!name){
        return res.status(400).json({success: false, message: "Invalid Input: Name is required"})
    }
    if(!description){
        return res.status(400).json({success: false, message: "Invalid Input: Description is required"})
    }
    if(!status || !statusList.includes(status)){
        return res.status(404).json({success: false, message: "Invalid Input: Status is required"})
    }

    try {
        const projectExists = await projectModel.findOne({name})
        if(projectExists){
            return res.status(409).json({success: false, message: `Project with ${name} is already exists`})
        }

        const project = new projectModel({name, description, status})
        await project.save()

        return res.status(201).json({success: true, message: "Project Added Successfully", project})
    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
}


export const fetchAllProjects = async (req, res) => {
    try {
        const projects = await projectModel.find()

        if(!projects){
            return res.status(404).json({success: false, message: "Failed to fetch project list"})
        }

        return res.status(200).json({success: true, message: "List of projects", data: projects})
    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
}

export const fetchProjectById = async (req, res) => {
    const {id} = req.params
    try {
        const project = await projectModel.findById(id)
        if(!project){
            return res.status(404).json({success: false, message: "Project Not Found"})
        }
        return res.status(200).json({success: true, message: "Project fetch successfully", data: project})
    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
}

export const updateProject = async (req, res) => {
    const {id} = req.params
    const {name, description, status} = req.body
    if(!id){
        return res.status(404).json({success: false, message: "Project Not Found"})
    }
    try {
        const updateFields = {}
        if(name){
            updateFields.name = name
        }
        if(description){
            updateFields.description = description
        }
        if(status){
            updateFields.status = status
        }


        const updatedProject = await projectModel.findByIdAndUpdate(id, {$set: updateFields}, {new: true})
        if(!updatedProject){
            return res.status(404).json({success: false, message: "Project Not Found"})
        }
        return res.status(200).json({success: true, message: "Project Data Updated Successfully", data: updateFields})
    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
}