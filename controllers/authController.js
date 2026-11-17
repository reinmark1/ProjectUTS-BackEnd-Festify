const bcrypt = require("bcryptjs");
const UserModel = require("../models/user");
const Image = require("../models/image");
const Event = require("../models/event");

exports.getLanding = (req, res) => {
  res.render("landing");
};

exports.getLogin = (req, res) => {
  res.render("login");
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.redirect("/login");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.redirect("/login");

    req.session.isAuth = true;
    req.session.username = user.username;
    req.session.role = user.role;
    req.session.email = user.email;

    req.session.save((err) => {
      if (err) return res.redirect("/login");
      res.redirect("/dashboard");
    });
  } catch (err) {
    console.error("Login error:", err);
    res.redirect("/login");
  }
};

exports.getRegister = (req, res) => {
  res.render("register");
};

exports.postRegister = async (req, res) => {
  const { username, email, password } = req.body;
  
  const isLengthValid = password.length >= 8 && password.length <= 15;
  const containsNumber = /\d/.test(password);

  if (!isLengthValid || !containsNumber) {
    return res.render("register", {
      error: "Password harus 8-15 karakter dan mengandung minimal 1 angka.",
    });
  }

  let user = await UserModel.findOne({ email });
  if (user) return res.render("register", { error: "Email sudah digunakan." });

  const hashedPassword = await bcrypt.hash(password, 12);
  const role = username === "admin" ? "admin" : "user";

  user = new UserModel({
    username,
    email,
    password: hashedPassword,
    role,
  });

  await user.save();
  res.redirect("/login");
};

exports.getDashboard = async (req, res) => {
  try {
    const images = await Image.find({ uploadedBy: "admin" }).sort({
      uploadedAt: -1,
    });
    const allEvents = await Event.find().sort({ date: 1 });
    const openEvents = allEvents.filter((event) => !event.isRegistrationClosed);
    const closedEvents = allEvents.filter((event) => event.isRegistrationClosed);

    res.render("dashboard", {
      username: req.session.username,
      images,
      openEvents,
      closedEvents,
    });
  } catch (err) {
    console.error("Error loading dashboard:", err);
    res.render("dashboard", {
      username: req.session.username,
      images: [],
      openEvents: [],
      closedEvents: [],
    });
  }
};

exports.getProfile = (req, res) => {
  res.render("profile", { username: req.session.username });
};

exports.getLoginAdmin = (req, res) => {
  res.render("loginAdmin", { error: null });
};

exports.postLoginAdmin = async (req, res) => {
  const { adminKey } = req.body;
  if (adminKey === "abc123superkey") {
    req.session.isAuth = true;
    req.session.role = "admin";
    req.session.isAdminKey = adminKey;
    req.session.save(() => res.redirect("/admin"));
  } else {
    res.render("loginAdmin", { error: "Kode admin salah!" });
  }
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
};