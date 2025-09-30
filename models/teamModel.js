import mongoose from "mongoose";

const teamSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    members: [String]
})

const teamModel = mongoose.model('Team', teamSchema)

export default teamModel