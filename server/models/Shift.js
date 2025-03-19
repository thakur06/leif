const mongoose = require("mongoose");

const ShiftSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true }, // New date field for the shift date
  clockInTime: { type: String, required: true }, // Store time in HH:mm format
  clockOutTime: { type: String, default: null }, // Store time in HH:mm format, default is null
  clockInLocation: { latitude: Number, longitude: Number },
  clockOutLocation: { latitude: Number, longitude: Number },
  clockInNote: { type: String },
  clockOutNote:{ type: String }
});

module.exports = mongoose.model("Shift", ShiftSchema);
