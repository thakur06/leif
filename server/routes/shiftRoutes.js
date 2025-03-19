const express = require("express");
const Shift = require("../models/Shift");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const moment = require("moment"); 
const { getDistance } = require("geolib");
const LocationPerimeter = require("../models/LocationPerimeter"); // Import the LocationPerimeter model

// 📝 **Clock In**
router.post("/clock-in", authMiddleware, async (req, res) => {
  try {
    const { latitude, longitude, note } = req.body;

    // Retrieve the location perimeter data
    const locationPerimeter = await LocationPerimeter.findOne();

    if (!locationPerimeter) {
      return res.status(400).json({ msg: "Location perimeter not set" });
    }

    // Calculate the distance between the user's location and the perimeter's center
    const distance = getDistance(
      { latitude, longitude },
      { latitude: locationPerimeter.latitude, longitude: locationPerimeter.longitude }
    );

    // Check if the distance is within the perimeter
    if (distance > locationPerimeter.perimeter) {
      return res.status(400).json({ msg: "You are outside the allowed perimeter" });
    }

    // Check if the user already has an active shift (with null clockOutTime)
    const activeShift = await Shift.findOne({ user: req.user.id, clockOutTime: null });

    if (activeShift) {
      return res.status(400).json({ msg: "You already have an active shift. Please clock out first." });
    }

    // Get today's date
    const currentDate = new Date();
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); // Strip out the time

    // If the user is within the perimeter and has no active shift, proceed with clocking in
    const shift = new Shift({
      user: req.user.id,
      date: date, // Store only the date (e.g., 2025-03-17)
      clockInTime: currentDate.toTimeString().slice(0, 5), // Store time (HH:mm)
      clockInLocation: { latitude, longitude },
      note,
    });

    await shift.save();
    res.json(shift);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


// 📝 **Clock Out**
router.post("/clock-out", authMiddleware, async (req, res) => {
  try {
    const { latitude, longitude, note } = req.body;

    // Retrieve the location perimeter data
    const locationPerimeter = await LocationPerimeter.findOne();

    if (!locationPerimeter) {
      return res.status(400).json({ msg: "Location perimeter not set" });
    }

    // Calculate the distance between the user's location and the perimeter's center
    const distance = getDistance(
      { latitude, longitude },
      { latitude: locationPerimeter.latitude, longitude: locationPerimeter.longitude }
    );

    // Check if the distance is within the perimeter
    if (distance > locationPerimeter.perimeter) {
      return res.status(400).json({ msg: "You are outside the allowed perimeter" });
    }

    let shift = await Shift.findOne({ user: req.user.id, clockOutTime: null });

    if (!shift) return res.status(400).json({ msg: "No active shift found" });

    const currentDate = new Date();
    shift.clockOutTime = currentDate.toTimeString().slice(0, 5); // Store time (HH:mm)
    shift.clockOutLocation = { latitude, longitude };
    shift.note = note;

    // Optionally, you can set the clock-out date to match the clock-in date if needed
    shift.date = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()); // Same date

    await shift.save();
    res.json(shift);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;


// 📝 **Get Shift History**
router.get("/history", authMiddleware, async (req, res) => {
  try {
    // Get the start and end of today
    const startOfDay = moment().startOf('day').toDate(); // Start of today (00:00:00)
    const endOfDay = moment().endOf('day').toDate(); // End of today (23:59:59)

    // Fetch all shifts that were clocked in today
    const shifts = await Shift.find({
      date: {
        $gte: startOfDay, // Greater than or equal to the start of today
        $lte: endOfDay,   // Less than or equal to the end of today
      },
    }).sort({ date: 1, clockInTime: 1 }); // Sort by date and clockInTime

    res.json(shifts);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// 📝 **Get Total Hours for Last Week (Monday to Friday) & Clocked-In Employee Count**
router.get("/week", authMiddleware, async (req, res) => {
  try {
    

    // Get the current date
    const today = new Date();
    
    // Calculate the previous Monday (start of the last week)
    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - today.getDay() - 6);  // Adjust to the previous Monday
    console.log(lastMonday)
    // Calculate the previous Friday (end of the last week)
    const lastFriday = new Date(today);
    lastFriday.setDate(today.getDate() - today.getDay() - 2);  // Adjust to the previous Friday
    console.log(lastFriday)
    // Fetch all shifts from the previous Monday to Friday (excluding weekends)
    const shifts = await Shift.find({
      clockInTime: { $gte: lastMonday, $lte: lastFriday },
    });

    if (!shifts.length) {
      return res.status(404).json({ msg: "No shifts found for weekdays (Monday to Friday) last week." });
    }

    let totalHours = 0;
    const hoursPerDay = {}; // To store total hours worked for each day (Monday to Friday)
    const usersClockingInEachDay = {}; // To store unique users clocking in each day

    shifts.forEach((shift) => {
      const clockIn = new Date(shift.clockInTime);
      const clockOut = new Date(shift.clockOutTime);

      if (shift.clockOutTime) {
        // Calculate hours worked for this shift
        const hoursWorked = (clockOut - clockIn) / (1000 * 60 * 60); // Convert milliseconds to hours
        totalHours += hoursWorked;

        // Get the date of the shift (set to 00:00 to ignore time of day)
        const shiftDate = clockIn.toISOString().split('T')[0]; // Format: YYYY-MM-DD

        // Update total hours worked for each weekday
        if (!hoursPerDay[shiftDate]) {
          hoursPerDay[shiftDate] = 0;
        }
        hoursPerDay[shiftDate] += hoursWorked;

        // Track unique users clocking in each day (using Set to avoid duplicate entries)
        if (!usersClockingInEachDay[shiftDate]) {
          usersClockingInEachDay[shiftDate] = new Set();
        }
        usersClockingInEachDay[shiftDate].add(shift.user.toString());  // Add user ID to the Set
      }
    });

    // Calculate the number of unique users who clocked in for each day
    const usersPerDay = {};
    for (const date in usersClockingInEachDay) {
      usersPerDay[date] = usersClockingInEachDay[date].size;  // The size of the Set is the count of unique users
    }

    // Return the total hours, hours per day, and number of clocked-in employees per day
    res.json({
      totalHours,
      hoursPerDay,
      usersPerDay,
    });

  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Fetch shift history for a user
router.get("/shifthistory/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    // Find all shifts for the user, sorted by latest first
    const shifts = await Shift.find({ user: userId })
    .sort({
      clockOutTime: 1, // Sort clockOutTime in ascending order, null values will be first
      date: -1,        // Sort by date in descending order (most recent first)
      clockInTime: -1  // Sort by clockInTime in descending order
    });
  
    if (!shifts.length) {
      return res.status(404).json({ message: "No history found for this user" });
    }

    res.json(shifts);
  } catch (error) {
    console.error("Error fetching history:", error);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;
