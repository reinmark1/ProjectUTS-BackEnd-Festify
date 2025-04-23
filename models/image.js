const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
  text: String,
  imagePath: String,
  uploadedBy: {
    type: String, // simpan username dari session
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Image", imageSchema);
