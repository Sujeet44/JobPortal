import User from "../models/User.js";
import express from 'express';
import protect from '../middleware/authMiddleware.js';
import { upload } from "../middleware/upload.js";
import {uploadPhoto} from "../middleware/uploadPhoto.js"

const userProfileRouter = express.Router();


userProfileRouter.get("/profile",protect,async (req, res) => {
    try {
        res.status(201).json({message:req.user});
    } catch (error) {
        res.status(401).json({message:"Sever error"})
    }
});


userProfileRouter.get("/profile/dashboard", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("appliedJobs") // populate job details
      .select("-password");    // remove password from response

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      data: {
        userId:user._id,
        name: user.name,
        email: user.email,
        skills: user.skills,
        experience: user.experience,
        appliedJobs: user.appliedJobs,
        resumeUrl:user.resumeUrl,
        phoneNo:user.phoneNo
      }
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});



userProfileRouter.patch("/profile/update", protect, async (req, res) => {
  try {
    const { name, skills, experience, education, phoneNo } = req.body;

    const user = await User.findById(req.user._id);

    if (name) user.name = name;
    if (skills) user.skills = skills;
    if (experience !== undefined) user.experience = experience;
    if (education) user.education = education;
    if (phoneNo) user.phoneNo = phoneNo;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


userProfileRouter.post("/profile/uploadResume",protect,upload.single("resume"),async (req, res) => {
    console.log(req.file)
    try {
      const user = await User.findById(req.user._id);

      user.resumeUrl = `/uploads/${req.file.filename}`;

      await user.save();

      res.json({
        success: true,
        resumeUrl: user.resumeUrl,
      });
    } catch (error) {
      res.status(500).json({ message: "Upload failed" });
    }
  }
);

userProfileRouter.post("/profile/uploadPhoto",uploadPhoto.single("photo"), async (req, res) => {
  try {
    const userId = req.user.id;

    const photoPath = `/uploads/profilePhotos/${req.file.filename}`;

    const user = await User.findByIdAndUpdate(
      userId,
      { profilePhoto: photoPath },
      { new: true }
    );

    res.json({
      success: true,
      message: "Profile photo uploaded",
      data: user
    });

  } catch (error) {
    res.status(500).json({ message: "Upload failed" });
  }
})

export default userProfileRouter;