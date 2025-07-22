const express = require("express");
const router = express.Router();
const Application = require("../models/Application");
const job = require("../models/Job");
const auth = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
const Job = require("../models/Job");

// Apply to all jobs (Candidate Only)
router.post(
  "/:jobId/apply",
  auth,
  requireRole(["candidate"]),
  async (req, res) => {
    const { jobId } = req.params;
    const { resumeUrl } = req.body;
    //Prevent double application
    const exists = await Application.findOne({
      job: jobId,
      candidate: req.user._id,
    });
    if (exists) return res.status(400).json({ message: "Already Applied" });
    const app = new Application({
      job: jobId,
      candidate: req.user._id,
      resumeUrl,
    });
    await app.save();
    res.status(201).json(app);
  }
);

//List candidate application
router.get("/my", auth, requireRole(["candidate"]), async (req, res) => {
  const apps = await Application.find({ candidate: req.user._id }).populate(
    "job"
  );
  res.json(apps);
});

//Recruiter :: View applicants to thier job
router.get(
  "/job/:jobId",
  auth,
  requireRole(["recruiter", "admin"]),
  async (req, res) => {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ message: "Job Not Found" });
    if (
      String(job.postedBy) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ messsage: "Not Authorised" });
    }
    const apps = await Application.find({ job: req.params.jobId }).populate(
      "candidate",
      "name email"
    );
    res.json(apps);
  }
);

//Admin : List All Application
router.get("/", auth, requireRole(["admin"]), async (req, res) => {
  const apps = await Application.find()
    .populate("job")
    .populate("candidate", "name email");
  res.json(apps);
});

module.exports = router;
