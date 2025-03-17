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

// 📝 **User Registration**
router.post(
  "/register",
  [
    check("name", "Name is required").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) return res.status(400).json({ msg: "User already exists" });

      user = new User({ name, email, password });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = { user: { id: user.id } };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      res.status(500).send("Server error"+err);
    }
  }
);

// 📝 **User Login**
router.post(
  "/login",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: "Invalid Credentials" });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Invalid Credentials" });

      const payload = { user: { id: user.id } };
      jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      res.status(500).send("Server error");
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

// 📝 **Update Location Perimeter**
router.put("/update-perimeter", async (req, res) => {
  try {
    // First, check if the user is a manager in the authMiddleware
    const { perimeter, latitude, longitude } = req.body;

    // Validate the input data
    if (typeof perimeter !== "number" || typeof latitude !== "number" || typeof longitude !== "number") {
      return res.status(400).json({ msg: "Perimeter, latitude, and longitude are required" });
    }

    // Find the user and check if they're a manager
    const user = await User.findById(req.user.id); // Assuming req.user.id is set after authentication
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    // Ensure the user is a manager
    if (user.role !== "manager") {
      return res.status(403).json({ msg: "Unauthorized: Managers only" });
    }

    // If the user is a manager, proceed to update the location perimeter

    // Update the location perimeter (assuming there's only one location perimeter document)
    const locationPerimeter = await LocationPerimeter.findOne();
    if (!locationPerimeter) {
      return res.status(404).json({ msg: "Location perimeter not found" });
    }

    // Update the perimeter, latitude, and longitude
    locationPerimeter.perimeter = perimeter;
    locationPerimeter.latitude = latitude;
    locationPerimeter.longitude = longitude;

    // Save the updated perimeter
    await locationPerimeter.save();

    // Return the updated location perimeter
    res.json(locationPerimeter);

  } catch (err) {
    console.error(err);
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






module.exports = router;
