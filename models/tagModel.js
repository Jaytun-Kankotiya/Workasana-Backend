import mongoose from "mongoose";


const tagSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    }
})

const tagModel = mongoose.model('Tag', tagSchema)

export default tagModel