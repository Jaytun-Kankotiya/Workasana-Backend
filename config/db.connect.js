import mongoose from "mongoose";


export const initialization = async () =>{
    mongoose.connect(process.env.MONGO_URI).then(() => {
        console.log("Connected to database")
    }).catch((error) => {
        console.log("Error connecting database.")
    })
}



