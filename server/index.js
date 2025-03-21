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
  // await User.insertMany( [
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Priya Sharma", 
  //     email: "priya.sharma@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Rahul Patel", 
  //     email: "rahul.patel@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Aarti Verma", 
  //     email: "aarti.verma@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Vikram Singh", 
  //     email: "vikram.singh@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Neha Gupta", 
  //     email: "neha.gupta@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Arjun Reddy", 
  //     email: "arjun.reddy@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Sneha Kapoor", 
  //     email: "sneha.kapoor@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Rohit Kumar", 
  //     email: "rohit.kumar@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Pooja Desai", 
  //     email: "pooja.desai@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Kiran Malhotra", 
  //     email: "kiran.malhotra@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Amit Jain", 
  //     email: "amit.jain@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Divya Nair", 
  //     email: "divya.nair@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Suresh Yadav", 
  //     email: "suresh.yadav@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Anjali Mehra", 
  //     email: "anjali.mehra@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Manish Thakur", 
  //     email: "manish.thakur@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Riya Chopra", 
  //     email: "riya.chopra@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Sanjay Bose", 
  //     email: "sanjay.bose@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Meena Iyer", 
  //     email: "meena.iyer@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Naveen Rana", 
  //     email: "naveen.rana@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Shalini Pillai", 
  //     email: "shalini.pillai@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Kunal Joshi", 
  //     email: "kunal.joshi@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Rekha Saxena", 
  //     email: "rekha.saxena@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Vivek Mishra", 
  //     email: "vivek.mishra@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Jyoti Bhatt", 
  //     email: "jyoti.bhatt@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Deepak Rawat", 
  //     email: "deepak.rawat@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Sunita Kulkarni", 
  //     email: "sunita.kulkarni@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Ramesh Menon", 
  //     email: "ramesh.menon@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Tara Dutta", 
  //     email: "tara.dutta@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Ashok Vyas", 
  //     email: "ashok.vyas@careindia.org", 
  //     role: "careworker" 
  //   },
  //   { 
  //     _id: new mongoose.Types.ObjectId(), 
  //     name: "Preeti Aggarwal", 
  //     email: "preeti.aggarwal@careindia.org", 
  //     role: "careworker" 
  //   },
  // ]);
  
  // Insert dummy Shifts with data for today and the previous week
  await Shift.insertMany([
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbd0cb4c98ba9c9e5ea5ad"), // Priya Sharma
      date: new Date("2025-03-10T00:00:00.000Z"), // Monday
      clockInTime: "08:15",
      clockOutTime: "16:30",
      clockInLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockOutLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockInNote: "Starting morning shift in Ward A",
      clockOutNote: "Completed patient rounds",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbc74b0ae19d3a024e3c6d"), // bio guest
      date: new Date("2025-03-10T00:00:00.000Z"),
      clockInTime: "09:00",
      clockOutTime: "17:15",
      clockInLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockOutLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockInNote: "Assisting in OPD today",
      clockOutNote: "Finished assisting Dr. Singh",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbcf8b0ae19d3a024e3cc6"), // steven.baker
      date: new Date("2025-03-10T00:00:00.000Z"),
      clockInTime: "10:30",
      clockOutTime: "18:00",
      clockInLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockOutLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockInNote: "Late start due to traffic",
      clockOutNote: "Evening shift completed",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbd0cb4c98ba9c9e5ea5b1"), // Neha Gupta
      date: new Date("2025-03-10T00:00:00.000Z"),
      clockInTime: "08:45",
      clockOutTime: "17:00",
      clockInLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockOutLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockInNote: "Morning duties in ICU",
      clockOutNote: "All patients stable",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbceff0ae19d3a024e3ca6"), // andrew.parker
      date: new Date("2025-03-10T00:00:00.000Z"),
      clockInTime: "09:15",
      clockOutTime: "15:45",
      clockInLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockOutLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockInNote: "Short shift in radiology",
      clockOutNote: "X-rays completed",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbd0cb4c98ba9c9e5ea5ae"), // Rahul Patel
      date: new Date("2025-03-11T00:00:00.000Z"), // Tuesday
      clockInTime: "08:00",
      clockOutTime: "16:00",
      clockInLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockOutLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockInNote: "Morning shift in Ward B",
      clockOutNote: "Patient checkups done",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbceae0ae19d3a024e3c9e"), // margaret.turner
      date: new Date("2025-03-11T00:00:00.000Z"),
      clockInTime: "09:30",
      clockOutTime: "17:45",
      clockInLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockOutLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockInNote: "Assisting in patient admissions",
      clockOutNote: "Records updated",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbd0cb4c98ba9c9e5ea5af"), // Aarti Verma
      date: new Date("2025-03-11T00:00:00.000Z"),
      clockInTime: "10:00",
      clockOutTime: "18:15",
      clockInLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockOutLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockInNote: "Supporting lab staff",
      clockOutNote: "Lab reports filed",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbcf160ae19d3a024e3cae"), // diane.lopez
      date: new Date("2025-03-11T00:00:00.000Z"),
      clockInTime: "08:45",
      clockOutTime: "16:30",
      clockInLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockOutLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockInNote: "Morning duties in pediatrics",
      clockOutNote: "Kids all settled",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbd0cb4c98ba9c9e5ea5b0"), // Vikram Singh
      date: new Date("2025-03-11T00:00:00.000Z"),
      clockInTime: "09:15",
      clockOutTime: "17:00",
      clockInLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockOutLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockInNote: "Shift in ER",
      clockOutNote: "ER stabilized",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbd0cb4c98ba9c9e5ea5b2"), // Arjun Reddy
      date: new Date("2025-03-12T00:00:00.000Z"), // Wednesday
      clockInTime: "08:30",
      clockOutTime: "16:45",
      clockInLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockOutLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockInNote: "Starting in OPD",
      clockOutNote: "OPD duties completed",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbcfe10ae19d3a024e3cde"), // lisa.carter
      date: new Date("2025-03-12T00:00:00.000Z"),
      clockInTime: "09:00",
      clockOutTime: "17:15",
      clockInLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockOutLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockInNote: "Assisting in OT prep",
      clockOutNote: "Surgery support done",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbd0cb4c98ba9c9e5ea5b3"), // Sneha Kapoor
      date: new Date("2025-03-12T00:00:00.000Z"),
      clockInTime: "10:00",
      clockOutTime: "18:30",
      clockInLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockOutLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockInNote: "Late shift in Ward D",
      clockOutNote: "Night prep finished",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbcfc30ae19d3a024e3cd6"), // joseph.king
      date: new Date("2025-03-12T00:00:00.000Z"),
      clockInTime: "08:15",
      clockOutTime: "16:15",
      clockInLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockOutLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockInNote: "Morning rounds in ICU",
      clockOutNote: "ICU patients monitored",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbd0cb4c98ba9c9e5ea5b4"), // Rohit Kumar
      date: new Date("2025-03-12T00:00:00.000Z"),
      clockInTime: "09:45",
      clockOutTime: "17:30",
      clockInLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockOutLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockInNote: "Shift in diagnostics",
      clockOutNote: "Tests completed",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbd0cb4c98ba9c9e5ea5b5"), // Pooja Desai
      date: new Date("2025-03-13T00:00:00.000Z"), // Thursday
      clockInTime: "09:15",
      clockOutTime: "17:45",
      clockInLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockOutLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockInNote: "Assisting in Ward E",
      clockOutNote: "Ward duties finished",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dba5a50ae19d3a024e3bb5"), // gparihar
      date: new Date("2025-03-13T00:00:00.000Z"),
      clockInTime: "10:30",
      clockOutTime: "18:15",
      clockInLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockOutLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockInNote: "Late start in OPD",
      clockOutNote: "OPD closed for the day",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbd0cb4c98ba9c9e5ea5b6"), // Kiran Malhotra
      date: new Date("2025-03-13T00:00:00.000Z"),
      clockInTime: "08:45",
      clockOutTime: "16:30",
      clockInLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockOutLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockInNote: "Morning shift in maternity",
      clockOutNote: "All deliveries monitored",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbcf8b0ae19d3a024e3cc6"), // steven.baker
      date: new Date("2025-03-13T00:00:00.000Z"),
      clockInTime: "09:00",
      clockOutTime: "17:00",
      clockInLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockOutLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockInNote: "Shift in lab support",
      clockOutNote: "Lab samples processed",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbd0cb4c98ba9c9e5ea5b7"), // Amit Jain
      date: new Date("2025-03-13T00:00:00.000Z"),
      clockInTime: "10:15",
      clockOutTime: "18:00",
      clockInLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockOutLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockInNote: "Helping in radiology",
      clockOutNote: "Scans completed",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbd0cb4c98ba9c9e5ea5bc"), // Riya Chopra
      date: new Date("2025-03-14T00:00:00.000Z"), // Friday
      clockInTime: "08:15",
      clockOutTime: "16:45",
      clockInLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockOutLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockInNote: "Morning shift in OPD",
      clockOutNote: "OPD closed early",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbcfc30ae19d3a024e3cd6"), // joseph.king
      date: new Date("2025-03-14T00:00:00.000Z"),
      clockInTime: "09:45",
      clockOutTime: "17:30",
      clockInLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockOutLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockInNote: "Last shift in ER",
      clockOutNote: "ER duties completed",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbd0cb4c98ba9c9e5ea5be"), // Meena Iyer
      date: new Date("2025-03-14T00:00:00.000Z"),
      clockInTime: "10:00",
      clockOutTime: "18:15",
      clockInLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockOutLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockInNote: "Late shift in Ward H",
      clockOutNote: "Ward prep for weekend",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbcf8b0ae19d3a024e3cc6"), // steven.baker
      date: new Date("2025-03-14T00:00:00.000Z"),
      clockInTime: "08:30",
      clockOutTime: "16:30",
      clockInLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockOutLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockInNote: "Friday shift in lab",
      clockOutNote: "Lab work finished",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbd0cb4c98ba9c9e5ea5bf"), // Naveen Rana
      date: new Date("2025-03-14T00:00:00.000Z"),
      clockInTime: "09:15",
      clockOutTime: "17:00",
      clockInLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockOutLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockInNote: "Shift in pharmacy",
      clockOutNote: "Stock updated",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbceae0ae19d3a024e3c9e"), // margaret.turner
      date: new Date("2025-03-14T00:00:00.000Z"),
      clockInTime: "08:00",
      clockOutTime: "16:15",
      clockInLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockOutLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockInNote: "Early shift in ICU",
      clockOutNote: "Patients checked",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbd0cb4c98ba9c9e5ea5c0"), // Shalini Pillai
      date: new Date("2025-03-14T00:00:00.000Z"),
      clockInTime: "09:30",
      clockOutTime: "17:45",
      clockInLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockOutLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockInNote: "Assisting in Ward I",
      clockOutNote: "Ward duties done",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbd0cb4c98ba9c9e5ea5c1"), // Kunal Joshi
      date: new Date("2025-03-14T00:00:00.000Z"),
      clockInTime: "08:45",
      clockOutTime: "16:30",
      clockInLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockOutLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockInNote: "Morning shift in ER",
      clockOutNote: "ER stabilized",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbd0cb4c98ba9c9e5ea5c2"), // Rekha Saxena
      date: new Date("2025-03-14T00:00:00.000Z"),
      clockInTime: "10:00",
      clockOutTime: "18:00",
      clockInLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockOutLocation: { latitude: 28.4028807, longitude: 76.9549329 },
      clockInNote: "Late shift in Ward J",
      clockOutNote: "Ward cleaned",
    },
    {
      _id: new mongoose.Types.ObjectId(),
      user: new mongoose.Types.ObjectId("67dbd0cb4c98ba9c9e5ea5c3"), // Vivek Mishra
      date: new Date("2025-03-14T00:00:00.000Z"),
      clockInTime: "09:30",
      clockOutTime: "17:45",
      clockInLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockOutLocation: { latitude: 28.4051203, longitude: 76.973656 },
      clockInNote: "Shift in ICU",
      clockOutNote: "Patients monitored",
    },
  ]);
  

  console.log("Database seeded successfully!");
  mongoose.connection.close();
  res.send("Data added to DB")
})
app.get("/",(req,res)=>{
console.log("testing dummy endpoint");
res.send("show me on the ui");
})
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
