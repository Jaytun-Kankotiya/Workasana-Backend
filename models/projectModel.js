import mongoose from "mongoose";


const projectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    status: {
        type: String,
        enum: ["To Do", "In Progress", "Completed", "Blocked"],
        default: 'To Do'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {timestamps: true})

const projectModel = mongoose.model("Project", projectSchema)

export default projectModel