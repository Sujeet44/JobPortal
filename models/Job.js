import mongoose from"mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    company: {
      type: String,
      required: true
    },
    salary:Number,
    description: {
      type: String,
      required: true
    },
    requiredSkills: [String],
    responsibilities:[String],
    minExperience: {
      type: Number,
      default: 0
    },
    location: String,
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    jobType: {
  type: String,
  enum: ["Full-Time", "Part-Time", "Contract", "Internship"],
  default: "Full-Time"
},
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);