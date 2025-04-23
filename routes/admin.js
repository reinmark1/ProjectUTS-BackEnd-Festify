const express = require("express");
const multer = require("multer");
const path = require("path");
const ImageModel = require("../models/image");

const router = express.Router();

const isAuth = (req, res, next) => {
  if (req.session.isAuth) return next();
  res.redirect("/login");
};

const isAdmin = (req, res, next) => {
  if (
    req.session.role === "admin" &&
    req.session.isAdminKey === "abc123superkey"
  ) {
    next();
  } else {
    res.redirect("/dashboard");
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Tampilkan form dan daftar gambar
router.get("/", isAuth, isAdmin, async (req, res) => {
  const images = await ImageModel.find().sort({ createdAt: -1 });
  res.render("admin", { images });
});

// Proses upload gambar
router.post("/", isAuth, isAdmin, upload.single("image"), async (req, res) => {
  const { text } = req.body;
  const imagePath = "/uploads/" + req.file.filename;

  // Simpan ke MongoDB
  await ImageModel.create({
    text,
    imagePath,
    uploadedBy: req.session.username, // << ini penting
  });

  res.redirect("/admin");
});

// console.log("Uploaded file path:", imagePath);

module.exports = router;
