const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const dotenv = require("dotenv");
const LocationPerimeter=require("../models/LocationPerimeter");
const axios=require("axios");
dotenv.config();

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;

    try {
      // Check if user exists
      let user = await User.findOne({ email });

      if (user) {
        // User exists - generate token and return
        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: "1h" },
          (err, token) => {
            if (err) throw err;
            return res.json({ 
              user_id: user._id, 
              role: user.role, 
              token 
            });
          }
        );
      } else {
        // User doesn't exist - create new user
        const newUser = new User({ 
          name, 
          email, 
          role: "careworker" 
        });
        
        await newUser.save();
        
        // Generate token for new user
        const payload = { user: { id: newUser.id, role: newUser.role } };
        jwt.sign(
          payload,
          process.env.JWT_SECRET,
          { expiresIn: "1h" },
          (err, token) => {
            if (err) throw err;
            res.json({ 
              user_id: newUser._id, 
              role: newUser.role, 
              token 
            });
          }
        );
      }
    } catch (err) {
      res.status(500).send("Server error: " + err.message);
    }
  }
);


// 📝 **Get User Profile**
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// 📝 **Set Location Perimeter (Manager Only)**
router.post("/location-perimeter", authMiddleware, async (req, res) => {
  try {
    console.log("test location route")
    // Check if the user is a manager
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "manager") {
      return res.status(403).json({ msg: "You must be a manager to set the location perimeter" });
    }

    const { perimeter, location } = req.body;

    if (!perimeter || !location) {
      return res.status(400).json({ msg: "Perimeter and location are required" });
    }

    // Convert location string to coordinates using Nominatim
    const geoResponse = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`
    );

    if (!geoResponse.data.length) {
      return res.status(400).json({ msg: "Invalid location - could not find coordinates" });
    }

    const { lat, lon } = geoResponse.data[0];
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    // Check if a perimeter is already set
    let locationPerimeter = await LocationPerimeter.findOne();

    if (locationPerimeter) {
      // Update existing perimeter
      locationPerimeter.perimeter = perimeter;
      locationPerimeter.latitude = latitude;
      locationPerimeter.longitude = longitude;
     
      locationPerimeter.createdAt = new Date();
    } else {
      // Create new perimeter
      locationPerimeter = new LocationPerimeter({
        perimeter,
        latitude,
        longitude,
        
      });
    }

    await locationPerimeter.save();
    res.json(locationPerimeter);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

router.get("/locations", async (req, res) => {
  try {
    const locations = await LocationPerimeter.find({}, "perimeter latitude longitude");
    res.status(200).json(locations);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});





module.exports = router;
