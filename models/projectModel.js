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
    createdAt: {
        type: Date,
        default: Date.now
    }
})

const projectModel = mongoose.model("Project", projectSchema)

export default projectModel