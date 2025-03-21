import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
const Dashboard = () => {
  const { role } = useAuth();
  const { isAuthenticated } = useAuth0();
  const navigate = useNavigate();

  const [locationData, setLocationData] = useState({
    perimeter: 500,
    location: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) navigate("/signin");
    else if (role !== "manager") navigate("/clock");
  }, [isAuthenticated, role, navigate]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!locationData.location.trim()) {
      setError("Please enter a location");
      setLoading(false);
      return;
    }

    if (locationData.perimeter <= 0) {
      setError("Perimeter must be a positive number");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        'https://leif-q464.vercel.app/api/users/location-perimeter',
        locationData,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${localStorage.getItem('token')}`
          }
        }
      );
    
      const result = response.data;
      setLocationData("");
      alert(`Location perimeter set to ${result.perimeter} meters at
             (Lat: ${result.latitude}, Long: ${result.longitude})`);
            
    } catch (err) {
      setError(err.message || "Failed to save location. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
          Manager Dashboard
        </h2>

        {error && (
          <div className="text-red-500 text-sm mb-4">{error}</div>
        )}

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Perimeter (in meters)
            </label>
            <input
              type="number"
              name="perimeter"
              value={locationData.perimeter}
              onChange={(e) =>
                setLocationData({ ...locationData, perimeter: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              required
              min="1"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Location
            </label>
            <input
              type="text"
              name="location"
              value={locationData.location}
              onChange={(e) =>
                setLocationData({ ...locationData, location: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              required
              placeholder="Enter city or address (e.g., San Francisco, CA)"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg text-white transition duration-200 ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Saving..." : "Set Location Perimeter"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Dashboard;