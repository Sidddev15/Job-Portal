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
      const { minSalary, maxSalary, ...rest } = req.body;
      const job = new Job({
        ...rest,
        salaryMin: Number(salaryMin),
        salaryMax: Number(salaryMax),
        salaryRange: `${salaryMin}-${salaryMax} LPA`,
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
  try {
    // extract filters from query params
    const {
      skills, // comma-separated string: "React,Node"
      locations, // e.g. "Remote"
      status, // "open" | "closed"
      minSalary, // as number (LPA)
      maxSalary, // as number (LPA)
      page = 1,
      limit = 10,
      search, // keyword search (optional)
    } = req.query;
    const filter = {};

    //keyword search on title/description
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // filter by skills
    if (skills) {
      filter.skills = { $all: skills.split(",") };
    }

    // filter by location
    if (locations) filter.locations = locations;

    // filter by status
    if (status) filter.status = status;

    // filter by salary
    if (minSalary) filter.minSalary = { $gte: Number(minSalary) };
    if (maxSalary) filter.maxSalary = { $gte: Number(maxSalary) };

    //Pagination
    const skip = (Number(page) - 1) * Number(limit);

    const jobs = await Job.find(filter)
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));
    const total = await Job.countDocuments(filter);

    res.json({
      jobs,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
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
  async (req, res, next) => {
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
      return res.json(job);
    } catch (err) {
      res.status(400).json({ message: err.message });
      return next(err);
    }
  }
);

// GET /api/jobs?includeApplied=true
router.get("/", auth, async (req, res, next) => {
  try {
    const { includeApplied } = req.query;
    const filter = { status: "open" };
    const jobs = await Job.find(filter)
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    if (
      includeApplied === "true" &&
      req.user &&
      req.user.role === "candidate"
    ) {
      const apps = await Application.find({ candidate: req.user._id }).select(
        "job"
      );
      const appliedSet = new Set(apps.map((a) => String(a.job)));
      const withFlag = jobs.map((j) => ({
        ...j.toObject(),
        appliedByMe: appliedSet.has(String(j._id)),
      }));
      return res.json(withFlag);
    }

    return res.json(jobs);
  } catch (err) {
    return next(err);
  }
});

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
