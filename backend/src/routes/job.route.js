const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const auth = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");

//POST /api/jobs (Recruiters & Admins)
router.post(
  "/",
  auth,
  requireRole(["recruiter", "admin"]),
  async (req, res) => {
    try {
      const job = new Job({
        ...req.body,
        postedBy: req.user._id,
      });
      await job.save();
      res.status(201).json(job);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

//GET /api/jobs (Anyone: public)
router.get("/", async (req, res) => {
  const jobs = await Job.find({ status: "open" }).populate(
    "postedBy",
    "name email"
  );
  res.json(jobs);
});

//GET /api/jobs/:id (Anyone Details)
router.get("/:id", async (req, res) => {
  const job = await Job.findById(req.params.id).populate(
    "postedBy",
    "name email"
  );
  if (!job) return res.status(404).json({ messsage: "Job not found" });
  res.json(job);
});

//PATCH /api/jobs/:id (only recruiters/admins who passed)
router.patch(
  "/:id",
  auth,
  requireRole(["recruiter", "admin"]),
  async (req, res) => {
    try {
      const job = await Job.findById(req.params.id);
      if (!job) return res.status(404).json({ message: "Job Not Found" });
      //only allow edit by poster or admin
      if (
        String(job.postedBy) !== String(req.user._id) &&
        req.user.role !== "admin"
      ) {
        return res.status(403).json({ message: "Not Authorised" });
      }
      Object.assign(job, req.body);
      await job.save();
      res.json(job);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
);

//DELETE /api/jobs/:id (Only recruiter and admin)
router.delete(
  "/:id",
  auth,
  requireRole(["recruiter", "admin"]),
  async (req, res) => {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job Not Found" });
    if (
      String(job.postedBy) !== String(req.user._id) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not Authorised" });
    }
    await Job.deleteOne();
    res.json({ message: "Job Deleted" });
  }
);

module.exports = router;
