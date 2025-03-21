import React, { useState, useEffect } from "react";
import axios from "axios";

const Clock = () => {
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [note, setNote] = useState("");
  const [clockedIn, setClockedIn] = useState(false);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const userId = localStorage.getItem("user_id");

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      setLatitude(position.coords.latitude);
      setLongitude(position.coords.longitude);
    });

    const fetchHistory = async () => {
      try {
        const { data } = await axios.get(`https://leif-q464.vercel.app/api/shifts/shifthistory/${userId}`);
        setHistory(data);
      } catch (error) {
        console.error("Error fetching history:");
      }
    };
    fetchHistory();
  }, [userId, clockedIn]);

  const clockIn = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://leif-q464.vercel.app/api/shifts/clock-in",
        { latitude, longitude, note },
        { headers: { Authorization: `${token}` } }
      );
      setClockedIn(true);
      setNote("");
      setMessage("Clocked in successfully.");
    } catch (err) {
      setMessage("Error clocking in: " + err);
    }
  };

  const clockOut = async (id, note) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `https://leif-q464.vercel.app/api/shifts/clock-out`,
        { latitude, longitude, note },
        { headers: { Authorization: `${token}` } }
      );

      setClockedIn(false);
      setHistory((prevHistory) =>
        prevHistory.map((entry) =>
          entry._id === id ? { ...entry, note } : entry
        )
      );
      setMessage("Clocked out successfully.");
    } catch (err) {
      setMessage("Error clocking out: " + err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Care Worker Clock In/Out</h2>

      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <p className="text-sm text-gray-700">Latitude: {latitude}</p>
        <p className="text-sm text-gray-700">Longitude: {longitude}</p>
      </div>

      <form className="space-y-4">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Optional Note</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Add a note (optional)"
            rows="3"
          />
        </div>

        <div className="flex justify-center space-x-4">
          {!clockedIn ? (
            <button
              type="button"
              onClick={clockIn}
              className="w-full md:w-auto bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition duration-300"
            >
              Clock In
            </button>
          ) : (
            <button
              type="button"
              onClick={() => clockOut()}
              className="w-full md:w-auto bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600 transition duration-300"
            >
              Clock Out
            </button>
          )}
        </div>
      </form>

      {message && (
        <div className={`mt-4 p-3 text-center text-white rounded-md ${message.includes('Error') ? 'bg-red-500' : 'bg-green-500'}`}>
          {message}
        </div>
      )}

      <h2 className="text-2xl font-bold mt-8 mb-4 text-blue-600">History</h2>
      <ul className="space-y-4">
        {history.length>0 ? history.map((entry) => (
          <li key={entry._id} className={`p-6 bg-gray-50 rounded-lg shadow-sm ${!entry.clockOutTime?"border border-red-500":null}`}>
            <div className="space-y-2">
              <p><strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}</p>
              <p><strong>Clock In:</strong> {entry.clockInTime}</p>
              <p><strong>Clock Out:</strong> {entry.clockOutTime || "Not clocked out"}</p>
              <p><strong>ClockInNote:</strong> {entry.clockInNote || "No note provided"}</p>
              <p><strong>ClockOutNote :</strong> {entry.clockOutNote || "No note provided"}</p>
              <p><strong>Location:</strong> ({entry.clockInLocation.latitude}, {entry.clockInLocation.longitude})</p>
            </div>
            {!entry.clockOutTime && (
              <form
                className="mt-4 space-y-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  
                  const note = e.target.note.value;
                  clockOut(entry._id, note);
                }}
              >
                <div className="flex flex-col space-y-2">

                  <label className="text-sm font-medium text-gray-700">
                    <strong>Note:</strong>
                    <input type="text" name="note" placeholder="Enter a note" className="ml-2 p-2 border rounded-md w-full" />
                  </label>
                </div>
                <button type="submit" className="w-full md:w-auto bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300">
                  Clock Out
                </button>
              </form>
            )}
          </li>
        )):<div>No shifts found</div>}
      </ul>
    </div>
  );
};

export default Clock;