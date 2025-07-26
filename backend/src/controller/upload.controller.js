exports.uploadResume = async (req, res) => {
  console.log("Uploaded file", req.file);
  if (!req.file) return res.status(400).json({ message: "No File Uploaded" });
  res.json({ url: req.file.path });
};
