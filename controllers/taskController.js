import taskModel from "../models/taskModel.js"

const addNewTask = async (req, res) => {
    const { name, project, team, owners, tags, timeToComplete, status} = req.body

    if(!name){
        return res.status(404).json({success: false, message: "Invalid Input: Name is required"})
    }

    if(!project || !mongoose.Types.ObjectId.isValid(project)){
        return res.status(404).json({success: false, message: "Invalid Input: Project Id is Invalid"})
    }

    if(!team){
        return res.status(404).json({success: false, message: "Invalid Input: Team is required"})
    }

    if(!owners){
        return res.status(404).json({success: false, message: "Invalid Input: Owner is required"})
    }

    if(!tags){
        return res.status(404).json({success: false, message: "Invalid Input: Tag is required"})
    }

    if(!timeToComplete){
        return res.status(404).json({success: false, message: "Invalid Input: Time to compelete is required"})
    }

    if(!status){
        return res.status(404).json({success: false, message: "Invalid Input: Status is required"})
    }

    try {
        const task = new taskModel({name, project, team, owners, tags, timeToComplete, status})
        await task.save()
        return res.status(200).json({success: true, message: "Task added successfully"})
    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }  
}