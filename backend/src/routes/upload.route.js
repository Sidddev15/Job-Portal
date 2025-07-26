const express = require("express");
const multer = require("multer");
const { cloudStorage } = require("../utils/cloudinary");
const auth = require("../middlewares/auth.middleware");
const { requireRole } = require("../middlewares/role.middleware");
const { uploadResume } = require("../controller/upload.controller");
const router = express.Router();

const upload = multer({ storage: cloudStorage });

// post /api/upload/reusume
router.post(
  "/resume",
  auth,
  requireRole(["candidate"]),
  upload.single("resume"),
  uploadResume
);

module.exports = router;
