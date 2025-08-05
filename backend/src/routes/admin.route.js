const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Job = require("../models/Job");
const Application = require("../models/Application");
const auth = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");

router.get("/stats", auth, requireRole(["admin"]), async (req, res) => {
  try {
    const totalJobs = await Job.countDocuments();
    const totalCandidates = await User.countDocuments({ role: "candidate" });
    const totalRecruiters = await User.countDocuments({ role: "recruiter" });
    const totalApplications = await Application.countDocuments();

    // Example: Applications per month for last 6 months
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    const applicationsPerMonth = await Application.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      totalJobs,
      totalCandidates,
      totalRecruiters,
      totalApplications,
      applicationsPerMonth,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
