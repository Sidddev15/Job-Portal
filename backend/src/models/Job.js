const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    skills: [String],
    location: String,
    salaryMin: Number,
    salaryMax: Number,
    salaryRange: String,
    postedBy: { type: mongoose.Schema.ObjectId, ref: "User", required: true }, //recruiter
    status: { type: String, enum: ["open", "closed"], default: "open" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
