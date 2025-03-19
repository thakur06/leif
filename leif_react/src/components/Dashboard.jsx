import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend);

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
  const barChartData = {
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
    maintainAspectRatio: false, // Prevents the chart from collapsing on small devices
    plugins: {
      title: {
        display: true,
        text: "Staff Clock-in Data",
        font: {
          size: 16,
          weight: "bold",
        },
      },
      legend: {
        position: "bottom",
        labels: {
          font: {
            size: 14,
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen flex justify-center">
      <div className="w-full max-w-6xl"> {/* Limit width to max-w-6xl and center it */}
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Manager Dashboard</h2>

        {/* Form to set location perimeter */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">Set Location Perimeter</h3>
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Perimeter (in meters)</label>
              <input
                type="number"
                name="perimeter"
                value={locationData.perimeter}
                onChange={(e) => setLocationData({ ...locationData, perimeter: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
              <input
                type="number"
                step="any"
                name="latitude"
                value={locationData.latitude}
                onChange={(e) => setLocationData({ ...locationData, latitude: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
              <input
                type="number"
                step="any"
                name="longitude"
                value={locationData.longitude}
                onChange={(e) => setLocationData({ ...locationData, longitude: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Set Location Perimeter
            </button>
          </form>
        </div>

        {/* User Shift Log */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">User Shift Log for Today</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr className="bg-gray-100">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Clock-in Time</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Clock-out Time</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Note</th>
                </tr>
              </thead>
              <tbody>
                {userShifts.map((shift) => (
                  <tr key={shift._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b text-sm text-gray-700">{shift.user.name}</td>
                    <td className="px-4 py-3 border-b text-sm text-gray-700">{shift.clockInTime}</td>
                    <td className="px-4 py-3 border-b text-sm text-gray-700">{shift.clockOutTime || "Not clocked out yet"}</td>
                    <td className="px-4 py-3 border-b text-sm text-gray-700">{shift.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bar Chart for statistics */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-semibold text-gray-700 mb-6">Clock-in Statistics</h3>
          <div className="h-96"> {/* Fixed height for the chart */}
            <Line data={barChartData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;