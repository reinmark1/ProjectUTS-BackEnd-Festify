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
    res.redirect("/login"); // atau "/unauthorized"
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
const Event = require("../models/event");

// Form tambah event
router.get("/", isAuth, isAdmin, async (req, res) => {
  const images = await ImageModel.find().sort({ createdAt: -1 });
  const events = await Event.find().sort({ createdAt: -1 });

  res.render("admin", { images, events });
});

// Proses tambah event
router.post("/events", isAuth, isAdmin, upload.single("poster"), async (req, res) => {
  const { title, date, description } = req.body;
  const posterPath = "/uploads/" + req.file.filename;

  await Event.create({ title, date, description, poster: posterPath });
  res.redirect("/admin");
});

// Form edit event
router.get("/events/:id/edit", isAuth, isAdmin, async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.render("editEvent", { event });
});

// Proses update event
router.post("/events/:id/update", isAuth, isAdmin, async (req, res) => {
  const { title, date, description } = req.body;

  await Event.findByIdAndUpdate(req.params.id, {
    title,
    date,
    description
  });

  res.redirect("/admin");
});

// Tutup registrasi
router.post("/events/:id/close", isAuth, isAdmin, async (req, res) => {
  await Event.findByIdAndUpdate(req.params.id, { isRegistrationClosed: true });
  res.redirect("/admin");
});

module.exports = router;
