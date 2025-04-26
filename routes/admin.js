const express = require("express");
const multer = require("multer");
const path = require("path");
const Event = require("../models/event");

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
    res.redirect("/login");
  }
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// Halaman admin: daftar event
router.get("/", isAuth, isAdmin, async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });

    const openEvents = events.filter(e => !e.isRegistrationClosed);
    const closedEvents = events.filter(e => e.isRegistrationClosed);

    res.render("admin", {
      openEvents,
      closedEvents
    });
  } catch (err) {
    console.error("Gagal memuat event:", err);
    res.render("admin", {
      openEvents: [],
      closedEvents: []
    });
  }
});

// Proses tambah event
router.post("/events", isAuth, isAdmin, upload.single("poster"), async (req, res) => {
  const { title, date, description } = req.body;
  const posterPath = "/uploads/" + req.file.filename;

  await Event.create({ title, date, description, poster: posterPath });
  res.redirect("/admin");
});

router.get("/events/new", isAuth, isAdmin, (req, res) => {
  res.render("addEvent");
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

const Registration = require("../models/registration");

// Tampilkan daftar pendaftar untuk event tertentu
router.get("/events/:id/registrants", isAuth, isAdmin, async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    const registrants = await Registration.find({ eventId: req.params.id });

    res.render("registrantList", { event, registrants });
  } catch (err) {
    console.error("Gagal ambil data registrant:", err);
    res.send("Terjadi kesalahan.");
  }
});

router.post("/registrants/:id/delete", isAuth, isAdmin, async (req, res) => {
  try {
    const regId = req.params.id;
    const registration = await Registration.findByIdAndDelete(regId);

    res.redirect("/admin/registrants");
  } catch (err) {
    console.error("Gagal menghapus pendaftar:", err);
    res.redirect("/admin/registrants");
  }
});

module.exports = router;
