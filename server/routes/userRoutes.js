const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { check, validationResult } = require("express-validator");
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const dotenv = require("dotenv");
const LocationPerimeter=require("../models/LocationPerimeter")
dotenv.config();

router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        const payload = { user: { id: user.id, role: user.role } };
        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
          if (err) throw err;
          console.log(token);
          return res.json({ user_id: user._id, role: user.role, token }); // Return to prevent further execution
        });
        return; // Ensure no further execution after response is sent
      }

      // Create a new user with a default role (e.g., "user")
      const newUser = new User({ name, email, role: "user" });

      await newUser.save();

      const payload = { user: { id: newUser.id, role: newUser.role } };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
        if (err) throw err;
        console.log(token);
        res.json({ user_id: newUser._id, role: newUser.role, token });
      });
    } catch (err) {
      res.status(500).send("Server error: " + err);
    }
  }
);

module.exports = router;



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
    // Check if the user is a manager
    const user = await User.findById(req.user.id); // Assume req.user.id is set by the authMiddleware

    if (!user || user.role !== "manager") {
      return res.status(403).json({ msg: "You must be a manager to set the location perimeter" });
    }

    const { perimeter, latitude, longitude } = req.body;

    if (!perimeter || !latitude || !longitude) {
      return res.status(400).json({ msg: "Perimeter, latitude, and longitude are required" });
    }

    // Check if a perimeter is already set
    let locationPerimeter = await LocationPerimeter.findOne();

    if (locationPerimeter) {
      // If the perimeter already exists, update it
      locationPerimeter.perimeter = perimeter;
      locationPerimeter.latitude = latitude;
      locationPerimeter.longitude = longitude;
      locationPerimeter.createdAt = new Date(); // Optionally reset the created date on update
    } else {
      // If no perimeter exists, create a new one
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
