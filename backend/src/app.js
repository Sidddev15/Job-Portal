const express = require("express");
const cors = require("cors");
const app = express();
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const jobRoutes = require("./routes/job.route");
const applicationRoutes = require("./routes/application.route");

app.use(cors());
app.use(express.json());

// This is very important 👇
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

module.exports = app;
