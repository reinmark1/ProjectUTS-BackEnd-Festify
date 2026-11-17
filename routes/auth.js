const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Middleware untuk proteksi halaman
const isAuth = (req, res, next) => {
  if (req.session.isAuth) return next();
  res.redirect("/login");
};

// Routing
router.get("/", authController.getLanding);

router.get("/login", authController.getLogin);
router.post("/login", authController.postLogin);

router.get("/register", authController.getRegister);
router.post("/register", authController.postRegister);

router.get("/loginAdmin", authController.getLoginAdmin);
router.post("/loginAdmin", authController.postLoginAdmin);

router.post("/logout", authController.postLogout);

// Halaman yang butuh isAuth
router.get("/dashboard", isAuth, authController.getDashboard);
router.get("/profile", isAuth, authController.getProfile);

module.exports = router;