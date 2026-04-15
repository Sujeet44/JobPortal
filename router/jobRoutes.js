import Job from "../models/Job.js";
import express, { application } from 'express';
import protect from "../middleware/authMiddleware.js";
import authorizeRoles from "../middleware/roleMiddleware.js";
import calculateMatch from "../utils/matchAlgorithm.js";
import optionalAuth from "../middleware/optionalAuth.js";
import User from "../models/User.js"  

const jobRouter = express.Router();


// CREATE JOB (Admin Only)
jobRouter.post("/jobs/createJob",protect,authorizeRoles("admin"), async (req, res) => {
  try {
    const job = await Job.create({
      ...req.body,  
      createdBy: req.user._id
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  } 
});

// GET ALL JOBS 
// jobRouter.get("/jobs/getJobs",optionalAuth, async (req, res) => {
//    const jobs = await Job.find();

//   // If user is logged in → calculate match
//   if (req.user) {
//     const jobsWithMatch = jobs.map(job => {
//       const matchPercentage = calculateMatch(req.user, job);
//       return {
//         ...job.toObject(),
//         matchPercentage
//       };
//     });

//      jobsWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);

//     return res.json(jobsWithMatch);
//   }

//   res.json(jobs);
// });


jobRouter.get("/jobs/getJobs", optionalAuth, async (req, res) => {
  try {
    const { search = "",location="", page = 1 } = req.query;
    const limit = 15;
    const skip = (page - 1) * limit;

    let query = {};

    // Search filter
    if (search) {
      query.$or = [
        { title: { $regex: `^${search}`, $options: "i" } },
        { company: { $regex: `^${search}`, $options: "i" } },
        { requiredSkills: { $regex: `^${search}`, $options: "i" } }
      ];
    }

    if (location) {
      query.location = { $regex: `^${location}`, $options: "i" };
    }

    // Exclude jobs already applied by user
    if (req.user) {
      query.applicants = { $ne: req.user.id };
    } 
    
    const totalJobs = await Job.countDocuments(query);

    const jobs = await Job.find(query)
      .select("-applicants")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // If user logged in → calculate match %
    if (req.user) {
      const jobsWithMatch = jobs.map((job) => {
        const matchPercentage = calculateMatch(req.user, job);
        return {
          ...job.toObject(),
          matchPercentage
        };
      });

      jobsWithMatch.sort((a, b) => b.matchPercentage - a.matchPercentage);

      return res.json({
        jobs: jobsWithMatch,
        currentPage: Number(page),
        totalPages: Math.ceil(totalJobs / limit),
        totalJobs
      });
    }

    res.json({
      jobs,
      currentPage: Number(page),
      totalPages: Math.ceil(totalJobs / limit),
      totalJobs
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});




// GET SINGLE JOB
jobRouter.get("/jobs/:id/getJobById", async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }
  res.json(job);
});

// UPDATE JOB (Admin Only)
jobRouter.patch("/jobs/:id/updateJob",protect,authorizeRoles("admin"), async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  Object.assign(job, req.body);
  await job.save();

  res.json(job);
});

// DELETE JOB (Admin Only)
jobRouter.delete("/jobs/:id/deleteJob",protect,authorizeRoles, async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    return res.status(404).json({ message: "Job not found" });
  }

  await job.deleteOne();
  res.json({ message: "Job deleted successfully" });
});

// APPLY FOR JOB
// jobRouter.post("/jobs/:id/applyJob",protect, async (req, res) => {
//     console.log(req.params)
//   const job = await Job.findById(req.params.id);

//   if (!job) {
//     return res.status(404).json({ message: "Job not found" });
//   }

//   if (job.applicants.includes(req.user._id)) {
//     return res.status(400).json({ message: "Already applied" });
//   }

//   job.applicants.push(req.user._id);
//   await job.save();

//   res.json({ message: "Applied successfully" });
// });

jobRouter.post("/jobs/:id/applyJob",protect, async (req, res) => {
      try {
    const job = await Job.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // Check already applied
    if (job.applicants.includes(user._id)) {
      return res.status(400).json({ message: "Already applied" });
    }

    // Add user to job
    job.applicants.push(user._id);
    await job.save();

    // 🔥 Add job to user
    user.appliedJobs.push(job._id);
    await user.save();

    res.status(200).json({ message: "Applied successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  } 
});


jobRouter.get("/jobs/applied", protect, async (req, res) => {
  try {
    const userId = req.user.id;

    const appliedJobs = await Job.find({
      applicants: userId,
    }).sort({ _id: -1 });

    res.status(200).json(appliedJobs);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


jobRouter.get("/jobs/adminJobs", protect, async (req, res) => {
  try {
    const jobs = await Job.find({ createdBy: req.user.id }).sort({ createdAt: -1 });

    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
});


jobRouter.post("/jobs/:id/withdraw", protect, async (req, res) => {
  try {

    const jobId = req.params.id;
    const userId = req.user._id;

    await Job.findByIdAndUpdate(
      jobId,
      { $pull: { applicants: userId } }
    );

    await User.findByIdAndUpdate(
      userId,
      { $pull: { appliedJobs: jobId } }
    );

    res.status(200).json({
      success: true,
      message: "Application withdrawn successfully"
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});


export default jobRouter;