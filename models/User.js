import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phoneNo:{
      type: Number,
    },
    location:String,
    profilePhoto: {
      type: String,
      default: ""
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    skills: [String],
    experience: {
      type: Number,
      default: 0,
    },  
    education: String,
    resumeUrl: String,
    appliedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        unique:true
      },
    ],
    otp: Number,
    otpExpiry: Date,
    activeToken:String
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
