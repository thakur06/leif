import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend ,PointElement,LineElement} from "chart.js";
import moment from "moment";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement ,Title, Tooltip, Legend);

const ManagerDashboard = () => {
  const [locationData, setLocationData] = useState({
    perimeter: 500, // Example perimeter in meters
    latitude: 37.7749, // Example latitude
    longitude: -122.4194, // Example longitude
  });

  // Dummy user shifts data
  const [userShifts, setUserShifts] = useState([
    { _id: "1", user: { name: "Alice Johnson" }, clockInTime: "08:00", clockOutTime: "16:00", note: "On time" },
    { _id: "2", user: { name: "Bob Smith" }, clockInTime: "09:00", clockOutTime: "17:00", note: "Late" },
    { _id: "3", user: { name: "Charlie Davis" }, clockInTime: "08:30", clockOutTime: "16:30", note: "On time" },
  ]);

  // Dummy data for chart statistics
  const [chartData, setChartData] = useState({
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    avgHours: [8, 7.5, 8.2, 7.8, 8.1], // Avg hours spent clocked in each day
    clockIns: [3, 3, 2, 3, 3], // Number of people clocking in each day
    totalHours: [24, 22.5, 24.6, 23.4, 24.3], // Total hours clocked in per staff
  });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { perimeter, latitude, longitude } = locationData;

    // Here, we would send the perimeter data to the server
    alert(`Location perimeter set to ${perimeter} meters at latitude ${latitude}, longitude ${longitude}`);
  };

  // Bar chart data and options for Average Hours, Clock-ins, and Total Hours
  const data  = {
    labels: chartData?.days || [], // Days of the week
    datasets: [
      {
        label: "Avg Hours Spent Clocked In",
        data: chartData?.avgHours || [],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Number of People Clocking In",
        data: chartData?.clockIns || [],
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
      {
        label: "Total Hours Clocked In per Staff",
        data: chartData?.totalHours || [],
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: "Staff Clock-in Data",
      },
    },
    scales: {
      x: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-6">Manager Dashboard</h2>

      {/* Form to set location perimeter */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-xl font-semibold mb-4">Set Location Perimeter</h3>
        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Perimeter (in meters)</label>
            <input
              type="number"
              name="perimeter"
              value={locationData.perimeter}
              onChange={(e) => setLocationData({ ...locationData, perimeter: e.target.value })}
              className="mt-2 block w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Latitude</label>
            <input
              type="number"
              step="any"
              name="latitude"
              value={locationData.latitude}
              onChange={(e) => setLocationData({ ...locationData, latitude: e.target.value })}
              className="mt-2 block w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Longitude</label>
            <input
              type="number"
              step="any"
              name="longitude"
              value={locationData.longitude}
              onChange={(e) => setLocationData({ ...locationData, longitude: e.target.value })}
              className="mt-2 block w-full border border-gray-300 rounded p-2"
              required
            />
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
            Set Location Perimeter
          </button>
        </form>
      </div>

      {/* User Shift Log */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-xl font-semibold mb-4">User Shift Log for Today</h3>
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Name</th>
              <th className="px-4 py-2 border-b">Clock-in Time</th>
              <th className="px-4 py-2 border-b">Clock-out Time</th>
              <th className="px-4 py-2 border-b">Note</th>
            </tr>
          </thead>
          <tbody>
            {userShifts.map((shift) => (
              <tr key={shift._id}>
                <td className="px-4 py-2 border-b">{shift.user.name}</td>
                <td className="px-4 py-2 border-b">{shift.clockInTime}</td>
                <td className="px-4 py-2 border-b">{shift.clockOutTime || "Not clocked out yet"}</td>
                <td className="px-4 py-2 border-b">{shift.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bar Chart for statistics */}
      <div className="w-full p-4 md:max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-6">Manager Dashboard</h2>
      <div className="w-full h-full">
        <Line data={data} options={options} />
      </div>
    </div>
    </div>
  );
};

export default ManagerDashboard;
