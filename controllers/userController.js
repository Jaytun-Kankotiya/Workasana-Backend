import userModel from "../models/userModel.js";

export const getUserData = async (req, res) => {
    try {
        const userId = req.userId
        
        if(!userId){
            return res.status(500).json({success: false, message: "Not Authorized"})
        }
        const user = await userModel.findById(userId)
        if(!user){
            return res.status(404).json({success: false, message: "User Not Found"})
        }
        return res.status(200).json({success: true, data: {
            name: user.name,
            email: user.email,
            isVerified: user.isVerified
        }})
    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
}