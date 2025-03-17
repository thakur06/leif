const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const User =require("./models/User");
const Shift =require("./models/Shift");
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect("mongodb+srv://bioguest94:abhishek0101@cluster0.74mod.mongodb.net/test")
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/shifts", require("./routes/shiftRoutes"));
app.post("/seed",async(req,res)=>{
  const today = new Date();
  const lastWeek = new Date();
  lastWeek.setDate(today.getDate() - 7);
  
  // Insert dummy Users
  await User.insertMany([
    { 
      _id: new mongoose.Types.ObjectId(), 
      name: "Alice Johnson", 
      email: "alice@example.com", 
      role: "manager", 
      password: "hashedpassword" 
    },
    { 
      _id: new mongoose.Types.ObjectId(), 
      name: "Bob Smith", 
      email: "bob@example.com", 
      role: "careworker", 
      password: "hashedpassword" 
    },
    { 
      _id: new mongoose.Types.ObjectId(), 
      name: "Charlie Davis", 
      email: "charlie@example.com", 
      role: "careworker", 
      password: "hashedpassword" 
    }
  ]);
  
  // Insert dummy Shifts with data for today and the previous week
  await Shift.insertMany([
    { 
      _id: new mongoose.Types.ObjectId(), 
      user: "6601a1b5e4b01f1234567891", // Alice Johnson's user ID
      clockInTime: today.setHours(8, 0, 0, 0), // Today at 08:00 AM
      clockOutTime: null, 
      clockInLocation: { latitude: 37.7749, longitude: -122.4194 }, 
      note: "Started shift." 
    },
    { 
      _id: new mongoose.Types.ObjectId(), 
      user: "6601a1b5e4b01f1234567892", // Bob Smith's user ID
      clockInTime: today.setHours(9, 0, 0, 0), // Today at 09:00 AM
      clockOutTime: null, 
      clockInLocation: { latitude: 37.7750, longitude: -122.4195 }, 
      note: "Clocked in late." 
    },
    { 
      _id: new mongoose.Types.ObjectId(), 
      user: "6601a1b5e4b01f1234567893", // Charlie Davis's user ID
      clockInTime: lastWeek.setHours(8, 30, 0, 0), // Previous week at 08:30 AM
      clockOutTime: null, 
      clockInLocation: { latitude: 37.7748, longitude: -122.4194 }, 
      note: "Started shift last week." 
    },
    { 
      _id: new mongoose.Types.ObjectId(), 
      user: "6601a1b5e4b01f1234567892", // Bob Smith's user ID
      clockInTime: lastWeek.setHours(10, 0, 0, 0), // Previous week at 10:00 AM
      clockOutTime: null, 
      clockInLocation: { latitude: 37.7751, longitude: -122.4196 }, 
      note: "Clocked in late last week." 
    }
  ]);
  

  console.log("Database seeded successfully!");
  mongoose.connection.close();
  res.send("Data added to DB")
})
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
