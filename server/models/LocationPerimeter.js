const mongoose = require("mongoose");

const LocationPerimeterSchema = new mongoose.Schema({
  perimeter: { 
    type: Number, // Radius in meters
    required: true, 
    min: 1 // Ensure radius is at least 1 meter
  },
  latitude: { 
    type: Number, 
    required: true 
  },
  longitude: { 
    type: Number, 
    required: true 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("LocationPerimeter", LocationPerimeterSchema);
