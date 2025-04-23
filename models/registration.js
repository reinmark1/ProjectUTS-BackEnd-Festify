const mongoose = require("mongoose");

const registrationSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: true
  },
  name: String,
  email: String,
  phone: String,
  gender: String,
  dob: Date,
  address: String,
  registeredAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Registration", registrationSchema);
