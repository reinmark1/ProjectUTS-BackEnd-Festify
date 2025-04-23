const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDBSession = require("connect-mongodb-session")(session);
const bcrypt = require("bcryptjs");
const path = require("path");

const UserModel = require("../models/user"); // Pastikan path ini benar
const adminRoutes = require("../routes/admin"); // Pastikan path ini benar

const app = express();

const mongoURI = "mongodb://localhost:27017/session";

// Connect ke MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Session Store MongoDB
const store = new mongoDBSession({
  uri: mongoURI,
  collection: "mySession",
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  session({
    secret: "key sign",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

// Middleware untuk otentikasi
const isAuth = (req, res, next) => {
  if (req.session.isAuth) return next();
  res.redirect("/login");
};

// Routes
app.get("/", (req, res) => {
  res.render("landing");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.redirect("/login");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.redirect("/login");

    req.session.isAuth = true;
    req.session.username = user.username;
    req.session.role = user.role;

    // Jika admin, arahkan ke halaman admin
    if (user.role === "admin") {
      req.session.isAdminKey = "abc123superkey";
      return res.redirect("/admin");
    }

    res.redirect("/dashboard");
  } catch (err) {
    console.error("Login error:", err);
    res.redirect("/login");
  }
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  let user = await UserModel.findOne({ email });
  if (user) return res.redirect("/register");

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
});

const Image = require("../models/image"); // Tambahkan di atas

app.get("/dashboard", isAuth, async (req, res) => {
  try {
    const images = await Image.find({ uploadedBy: "admin" }).sort({
      uploadedAt: -1,
    });
    res.render("dashboard", {
      username: req.session.username,
      images,
    });
  } catch (err) {
    console.error("Error loading images:", err);
    res.render("dashboard", {
      username: req.session.username,
      images: [],
    });
  }
});

app.post("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) throw err;
    res.redirect("/");
  });
});

app.get("/loginAdmin", (req, res) => {
  res.render("loginAdmin", { error: null });
});

app.post("/loginAdmin", async (req, res) => {
  const { adminKey } = req.body;
  
  if (adminKey === "abc123superkey") {
    req.session.isAuth = true; // wajib tambahkan ini juga!
    req.session.role = "admin"; // simpan role di session
    req.session.isAdminKey = adminKey; // Simpan kode di session

    res.redirect("/admin"); // ARAHKAN KE DASHBOARD ADMIN
  } else {
    res.render("loginAdmin", { error: "Kode admin salah!" });
  }
});

// Router untuk fitur admin
app.use("/admin", adminRoutes);

// Jalankan server
app.listen(3000, () => console.log("Server running on port 3000"));
