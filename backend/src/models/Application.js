const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeUrl: String,
    status: {
      type: String,
      enum: ["applied", "shortlisted", "accepted", "rejected"],
      default: "applied",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
