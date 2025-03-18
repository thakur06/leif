import React, { useState, useEffect } from "react";
import axios from "axios";

const ClockInOut = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [note, setNote] = useState("");
  const [clockedIn, setClockedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [locationPerimeter, setLocationPerimeter] = useState(null);

  useEffect(() => {
    // Fetch the user's current location
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });

    // Fetch location perimeter data
    const fetchLocationPerimeter = async () => {
      try {
        const res = await axios.get("/api/location-perimeter");
        setLocationPerimeter(res.data);
      } catch (err) {
        console.error("Error fetching perimeter", err);
      }
    };
    fetchLocationPerimeter();
  }, []);

  // Function to calculate the distance between two locations (Haversine formula)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c * 1000; // Distance in meters
  };

  // Clock in function
  const clockIn = async () => {
    if (!locationPerimeter) {
      setMessage("Location perimeter not set.");
      return;
    }

    const distance = getDistance(
      latitude,
      longitude,
      locationPerimeter.latitude,
      locationPerimeter.longitude
    );

    if (distance > locationPerimeter.perimeter) {
      setMessage("You are outside the allowed perimeter.");
    } else {
      try {
        const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage

        const res = await axios.post(
          "/api/clock-in",
          {
            latitude,
            longitude,
            note,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
            },
          }
        );
        setClockedIn(true);
        setMessage("Clocked in successfully.");
      } catch (err) {
        setMessage("Error clocking in.");
      }
    }
  };

  // Clock out function
  const clockOut = async () => {
    if (!clockedIn) {
      setMessage("You need to clock in first.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken"); // Assuming token is stored in localStorage

      const res = await axios.post(
        "/api/clock-out",
        {
          latitude,
          longitude,
          note,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
          },
        }
      );
      setClockedIn(false);
      setMessage("Clocked out successfully.");
    } catch (err) {
      setMessage("Error clocking out.");
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4 text-center">Care Worker Clock In/Out</h2>

      {/* Latitude and Longitude */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">Latitude: {latitude}</p>
        <p className="text-sm text-gray-500">Longitude: {longitude}</p>
      </div>

      {/* Clock In/Out Form */}
      <form className="space-y-4">
        <div className="mb-4">
          <label htmlFor="note" className="block text-sm font-medium text-gray-700">
            Optional Note
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Add a note (optional)"
          />
        </div>

        {/* Clock In / Out Buttons */}
        <div className="space-x-4">
          {!clockedIn ? (
            <button
              type="button"
              onClick={clockIn}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Clock In
            </button>
          ) : (
            <button
              type="button"
              onClick={clockOut}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              Clock Out
            </button>
          )}
        </div>

        {/* Time Display (Read-only) */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Clock Time</label>
          <input
            type="text"
            value={new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            readOnly
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600"
          />
        </div>

        {/* Error/Success Message */}
        {message && (
          <div className={`p-2 text-center text-white rounded-md ${message.includes('Error') ? 'bg-red-500' : 'bg-green-500'}`}>
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default ClockInOut;
