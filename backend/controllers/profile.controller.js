import cloudinary from "../config/cloudinary.js";

// @route PUT /api/profile
// updates name, bodyType, height, weight, goal
export const updateProfile = async (req, res) => {
  try {
    const { name, bodyType, height, weight, goal } = req.body;
    const user = req.user;

    if (name !== undefined) user.name = name;
    if (bodyType !== undefined) user.bodyType = bodyType;
    if (height !== undefined) user.height = height;
    if (weight !== undefined) user.weight = weight;
    if (goal !== undefined) user.goal = goal;

    await user.save();
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route POST /api/profile/avatar/upload
// expects multipart/form-data with field name "avatar"
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // upload buffer to Cloudinary via upload_stream
    const streamUpload = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "fitness-tracker/avatars", resource_type: "image" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(req.file.buffer);
      });

    const result = await streamUpload();

    req.user.avatarUrl = result.secure_url;
    await req.user.save();

    res.json({ avatarUrl: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route PUT /api/profile/avatar/preset
// body: { avatarUrl } -- a DiceBear-style generated URL picked on the frontend
export const setPresetAvatar = async (req, res) => {
  try {
    const { avatarUrl } = req.body;
    if (!avatarUrl) {
      return res.status(400).json({ message: "avatarUrl is required" });
    }

    req.user.avatarUrl = avatarUrl;
    await req.user.save();

    res.json({ avatarUrl });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @route DELETE /api/profile/avatar
export const deleteAvatar = async (req, res) => {
  try {
    req.user.avatarUrl = "";
    await req.user.save();
    res.json({ message: "Avatar removed" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};