require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const mongoDBSession = require("connect-mongodb-session")(session);
const path = require("path");

const adminRoutes = require("../routes/admin");
const eventRoutes = require("../routes/event");
const authRoutes = require("../routes/auth");

const app = express();

const mongoURI = process.env.MONGODB_URI;
const PORT = process.env.PORT || 3000;

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
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use("/style", express.static(path.join(__dirname, "../style")));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

app.use("/", authRoutes);
app.use("/admin", adminRoutes);
app.use("/", eventRoutes);

// Jalankan server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));