import projectModel from "../models/projectModel.js";


export const addNewProject = async (req, res) => {
    const {name, description} = req.body

    if(!name){
        return res.status(404).json({success: false, message: "Invalid Input: Name is required"})
    }

    if(!description){
        return res.status(404).json({success: false, message: "Invalid Input: Description is required"})
    }

    try {
        
        const projectExists = await projectModel.findOne({name})

        if(projectExists){
            return res.status(500).json({success: false, message: `Project with ${name} is already exists`})
        }

        const project = new projectModel({name, description})

        await project.save()

        return res.status(200).json({success: true, message: "Project Added Successfully", project})
    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
}