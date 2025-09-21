import tagModel from "../models/tagModel.js";

export const addNewTag = async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid Input: Name is required" });
  }

  try {
    const tagExist = await tagModel.findOne({ name });
    if (tagExist) {
      return res
        .status(409)
        .json({
          success: false,
          message: `Tag with name ${name} is already exists`,
        });
    }

    const tag = new tagModel({ name });
    await tag.save();
    return res
      .status(201)
      .json({
        success: true,
        message: `Tag with name ${name} added successfully`,
        data: tag
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};


export const fetchAllTags = async (req, res) => {
    try {
        const tags = await tagModel.find()

        if(!tags || tags.length === 0){
            return res.status(404).json({success: false, message: "Mo tags found"})
        }

        return res.status(200).json({success: true, message: " List of tags", data: tags})
    } catch (error) {
        return res.status(500).json({success: false, message: error.message})
    }
}
