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
    console.log("Incoming /register request:", req.body);

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;

    try {
      let user = await User.findOne({ email });

      const generateTokenAndRespond = (user) => {
        const payload = {
          user: {
            id: user.id,
            role: user.role,
          },
        };

        jwt.sign(
          payload,
          process.env.JWT_SECRET || "abhishek@0101", // Fallback to hardcoded secret
          { expiresIn: "1h" },
          (err, token) => {
            if (err) {
              console.error("JWT signing error:", err);
              return res.status(500).json({ msg: "Token generation failed" });
            }

            console.log("Generated token:", token);
            res.json({
              user_id: user._id,
              role: user.role,
              token,
            });
          }
        );
      };

      if (user) {
        console.log("User already exists, logging in...");
        generateTokenAndRespond(user);
      } else {
        console.log("Creating new user...");
        const newUser = new User({
          name,
          email,
          role: "careworker",
        });

        await newUser.save();
        generateTokenAndRespond(newUser);
      }
    } catch (err) {
      console.error("Server error:", err);
      res.status(500).json({ msg: "Server error", error: err.message });
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
  console.log("incoming req")
  try {
    // Check if the user is a manager
    console.log(req.body)
    const user = await User.findById(req.user.id);
    if (!user || user.role !== "manager") {
      return res.status(403).json({ msg: "You must be a manager to set the location perimeter" });
    }

    const { perimeter, lat,lng } = req.body;

    if (!perimeter || !lat || !lng) {
      return res.status(400).json({ msg: "Perimeter and location are required" });
    }

    // Convert location string to coordinates using Nominatim
   
    // Check if a perimeter is already set
    let locationPerimeter = await LocationPerimeter.findOne();

    if (locationPerimeter) {
      // Update existing perimeter
      locationPerimeter.perimeter = perimeter;
      locationPerimeter.latitude = lat;
      locationPerimeter.longitude = lng;
     
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
