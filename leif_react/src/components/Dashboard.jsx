import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { useAuth0 } from "@auth0/auth0-react";
const ManagerDashboard = () => {
  const { role} = useAuth();
  const { isAuthenticated,} = useAuth0();


  const [locationData, setLocationData] = useState({
    perimeter: 500, // Example perimeter in meters
    latitude: 37.7749, // Example latitude
    longitude: -122.4194, // Example longitude
  });
const navigate=useNavigate();

  useEffect(() => {
!isAuthenticated?navigate("/signin"):null;
role!="manager"?navigate("/clock"):null
  }, [])
  
  const handleFormSubmit = (e) => {
    e.preventDefault();
    const { perimeter, latitude, longitude } = locationData;
    // Here, we would send the perimeter data to the server
    alert(`Location perimeter set to ${perimeter} meters at latitude ${latitude}, longitude ${longitude}`);
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Manager Dashboard</h2>

        {/* Form to set location perimeter */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Perimeter (in meters)</label>
            <input
              type="number"
              name="perimeter"
              value={locationData.perimeter}
              onChange={(e) => setLocationData({ ...locationData, perimeter: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Latitude</label>
            <input
              type="number"
              step="any"
              name="latitude"
              value={locationData.latitude}
              onChange={(e) => setLocationData({ ...locationData, latitude: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Longitude</label>
            <input
              type="number"
              step="any"
              name="longitude"
              value={locationData.longitude}
              onChange={(e) => setLocationData({ ...locationData, longitude: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition duration-200"
          >
            Set Location Perimeter
          </button>
        </form>
      </div>
    </div>
  );
};

export default ManagerDashboard;
