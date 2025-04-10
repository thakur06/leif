const express = require("express");
const Shift = require("../models/Shift");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();
const moment = require("moment"); 
const { getDistance } = require("geolib");
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');


const LocationPerimeter = require("../models/LocationPerimeter"); // Import the LocationPerimeter model
// Enable the plugins
dayjs.extend(utc);
dayjs.extend(timezone);
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

    const istTime = dayjs().tz("Asia/Kolkata").format("HH:mm");

    // Now you can use it like this:
    const shift = new Shift({
      user: req.user.id,
      date: dayjs().tz("Asia/Kolkata").format("YYYY-MM-DD"),
      clockInTime: istTime,
      clockInLocation: { latitude, longitude },
      clockInNote: note,
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
    const istTime = dayjs().tz("Asia/Kolkata").format("HH:mm");
    const currentDate = new Date();
    shift.clockOutTime = istTime; // Store time (HH:mm)
    shift.clockOutLocation = { latitude, longitude };
    shift.clockOutNote = note;

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

    // Fetch all shifts that were clocked in today and populate user data
    const shifts = await Shift.find({
      date: {
        $gte: startOfDay, // Greater than or equal to the start of today
        $lte: endOfDay,   // Less than or equal to the end of today
      },
    })
    .populate('user', 'name email role')  // Populate the user field with name, email, and role
    .sort({ date: 1, clockInTime: 1 }); // Sort by date and clockInTime

    // Map over the shifts and include user details in the response
    const shiftsWithUserData = shifts.map(shift => ({
      ...shift.toObject(),
      user: {
        name: shift.user.name,
        email: shift.user.email,
        role: shift.user.role,
      }
    }));

    res.json(shiftsWithUserData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});


// 📝 **Get Total Hours for Last Week (Monday to Friday) & Clocked-In Employee Count**
router.get("/week", authMiddleware, async (req, res) => {
  try {

    const today = new Date();  // This will use current date (April 09, 2025)
    
    
    const lastMonday = new Date(today);
    lastMonday.setDate(today.getDate() - today.getDay() - 6);
    
   
    const lastSunday = new Date(today);
    lastSunday.setDate(today.getDate() - today.getDay());

    // Fetch all shifts from last week
    const shifts = await Shift.find({
      date: { $gte: lastMonday, $lte: lastSunday },
    }).populate('user');

    if (!shifts.length) {
      return res.status(404).json({ msg: "No shifts found for last week." });
    }

    let totalHours = 0;
    const hoursPerDay = {};      // Total hours per day
    const usersPerDay = {};      // Unique users per day
    const hoursPerStaff = {};    // Total hours per staff member

    shifts.forEach((shift) => {
      
      if (shift.clockOutTime) {
        const [inHours, inMinutes] = shift.clockInTime.split(':').map(Number);
        const [outHours, outMinutes] = shift.clockOutTime.split(':').map(Number);
        
        const clockIn = new Date(shift.date);
        clockIn.setHours(inHours, inMinutes, 0, 0);
        
        const clockOut = new Date(shift.date);
        clockOut.setHours(outHours, outMinutes, 0, 0);

        
        if (clockOut < clockIn) {
          clockOut.setDate(clockOut.getDate() + 1);
        }

        // Calculate hours worked
        const hoursWorked = (clockOut - clockIn) / (1000 * 60 * 60);
        totalHours += hoursWorked;

        // Format date as YYYY-MM-DD
        const shiftDate = shift.date.toISOString().split('T')[0];

        // Update hours per day
        hoursPerDay[shiftDate] = (hoursPerDay[shiftDate] || 0) + hoursWorked;

        // Track unique users per day
        if (!usersPerDay[shiftDate]) {
          usersPerDay[shiftDate] = new Set();
        }
        usersPerDay[shiftDate].add(shift.user._id.toString());

        // Track hours per staff
        const userId = shift.user._id.toString();
        hoursPerStaff[userId] = {
          hours: (hoursPerStaff[userId]?.hours || 0) + hoursWorked,
          name: shift.user.name
        };
      }
    });

    // Calculate averages and counts
    const avgHoursPerDay = {};
    const numPeoplePerDay = {};
    
    for (const date in hoursPerDay) {
      const numPeople = usersPerDay[date].size;
      numPeoplePerDay[date] = numPeople;
      avgHoursPerDay[date] = hoursPerDay[date] / numPeople;  // Average hours per person per day
    }

    // Format response
    const response = {
      averageHoursPerDay: Object.fromEntries(
        Object.entries(avgHoursPerDay).map(([date, hours]) => [date, Number(hours.toFixed(2))])
      ),
      numberOfPeoplePerDay: numPeoplePerDay,
      totalHoursPerStaff: Object.fromEntries(
        Object.entries(hoursPerStaff).map(([userId, data]) => [
          userId,
          {
            name: data.name,
            totalHours: Number(data.hours.toFixed(2))
          }
        ])
      ),
      totalWeekHours: Number(totalHours.toFixed(2))
    };

    res.json(response);

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
