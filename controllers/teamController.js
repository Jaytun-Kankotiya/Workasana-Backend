import teamModel from "../models/teamModel.js";

export const addNewTeam = async (req, res) => {
  const { name, members } = req.body;

  if (!name || !name.trim()) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Input: Name is required" });
  }
  if (!Array.isArray(members) || members.length === 0) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Invalid Input: Members are required",
      });
  }

  try {
    const teamExists = await teamModel.findOne({ name });
    if (teamExists) {
      return res
        .status(409)
        .json({
          success: false,
          message: `Team with name ${name} is already exists`,
        });
    }

    const team = new teamModel({ name, members });
    await team.save();

    return res.status(201).json({success: true, message: `New team with name ${name} added successfully`, data: team})
  } catch (error) {
    return res.status(500).json({success: false, message: error.message})
  }
};


export const fetchAllTeams = async (req, res) => {
    try {
        const teams = await teamModel.find()

        if(!teams || teams.length === 0){
            return res.status(404).json({success: false, message: "No teams found"})
        }

        return res.status(200).json({success: true, message: " List of team objects.", data: teams})
    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
}

export const fetchTeamById = async (req, res) => {
  const {id} = req.params

  if(!id){
    return res.status(404).json({success: false, message: "Page Not Found"})
  }
  try {
    const team = await teamModel.findById(id)
    if(!team){
      return res.status(404).json({success: false, message: "Team Not Found"})
    }
    return res.status(200).json({success: true, message: "Team Fetch Successfully", data: team})
  } catch (error) {
    return res.status(500).json({success: false, message: error.message})
  }
}

export const updateTeamById = async (req, res) => {
  const {name, members} = req.body
  const {id} = req.params
  try {
    const team = await teamModel.findByIdAndUpdate(id, {name, members}, {new: true})
    if(!team){
      return res.status(404).json({success: false, message: "Team Not Found"})
    }
    return res.status(200).json({success: true, message: "Team data updated successfully", data: team})
  } catch (error) {
    return res.status(500).json({success: false, message: error.message})
  }
}
