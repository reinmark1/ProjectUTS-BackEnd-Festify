const express = require("express");
const router = express.Router();
const Event = require("../models/event");
const Registration = require("../models/registration");

const isAuth = (req, res, next) => {
    if (req.session.isAuth) return next();
    res.redirect("/login");
  };
  
// Detail Event
router.get("/event/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    res.render("eventDetail", { event });
  } catch (err) {
    res.send("Event tidak ditemukan.");
  }
});

// Tampilkan Form Pendaftaran
router.get("/event/:id/register", async (req, res) => {
  const event = await Event.findById(req.params.id);
  res.render("registerEvent", { event });
});

// Proses Pendaftaran
router.post("/event/:id/register", async (req, res) => {
    const { name, email, phone, gender, dob, address } = req.body;
  
    try {
      await Registration.create({
        eventId: req.params.id,
        name,
        email,
        phone,
        gender,
        dob,
        address
      });
  
      res.render("registrationSuccess");
    } catch (err) {
      console.error("Gagal menyimpan pendaftaran:", err);
      res.send("❌ Terjadi kesalahan saat menyimpan pendaftaran.");
    }
});

router.get("/my-events", isAuth, async (req, res) => {
    try {
      const registrations = await Registration.find({ email: req.session.email }).populate("eventId");
      res.render("myEvents", { registrations });
    } catch (err) {
      console.error(err);
      res.send("Gagal memuat event.");
    }
  });
  

module.exports = router;