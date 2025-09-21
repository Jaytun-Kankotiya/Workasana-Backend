import teamModel from "../models/teamModel.js";

export const addNewTeam = async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Input: Name is required" });
  }
  if (!description) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Invalid Input: Description is required",
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

    const team = new teamModel({ name, description });
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
