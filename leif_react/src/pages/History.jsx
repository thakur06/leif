import React, { useEffect, useState } from "react";
import axios from "axios";

export const History = ({clk}) => {
  const [history, setHistory] = useState([]);
  const userId = localStorage.getItem("user_id"); // Fetch userId from localStorage
  useEffect(() => {
    const fetchHistory = async () => {
      try {
        // Simulating API response with dummy data
        const { data } = await axios.get(`http://localhost:3000/api/shifts/shifthistory/${userId}`); // Replace with actual API endpoint

        // Sort by latest date first
       

        setHistory(data);
      } catch (error) {
        console.error("Error fetching history:", error);
      }
    };

    fetchHistory();
  }, []);

  const handleClockOut = async (id, clockOutTime, note) => {
    try {
      const response = await axios.post(`/api/clockout/${id}`, {
        clockOutTime,
        note,
      });

      if (response.status === 200) {
        setHistory((prevHistory) =>
          prevHistory.map((entry) =>
            entry._id === id
              ? { ...entry, clockOutTime, note }
              : entry
          )
        );
      }
    } catch (error) {
      console.error("Error clocking out:", error);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">History</h2>
      <ul className="space-y-4">
        {history.map((entry) => (
          <li key={entry._id} className="p-4 border rounded-lg shadow">
            <p><strong>Date:</strong> {new Date(entry.date).toLocaleDateString()}</p>
            <p><strong>Clock In:</strong> {entry.clockInTime}</p>
            <p>
              <strong>Clock Out:</strong>{" "}
              {entry.clockOutTime ? entry.clockOutTime : "Not clocked out"}
            </p>
            <p><strong>Note:</strong> {entry.note || "No note provided"}</p>
            <p>
              <strong>Location:</strong> ({entry.clockInLocation.latitude}, {entry.clockInLocation.longitude})
            </p>

            {/* Show clock-out form if user has not clocked out */}
            {!entry.clockOutTime && (
              <form
                className="mt-2 flex flex-col space-y-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  const clockOutTime = e.target.clockOutTime.value;
                  const note = e.target.note.value;
                  handleClockOut(entry._id, clockOutTime, note);
                }}
              >
                <label>
                  <strong>Clock Out Time:</strong>
                  <input
                    type="time"
                    name="clockOutTime"
                    required
                    className="border p-2 rounded ml-2"
                  />
                </label>
                <label>
                  <strong>Note:</strong>
                  <input
                    type="text"
                    name="note"
                    placeholder="Enter a note"
                    className="border p-2 rounded w-full"
                  />
                </label>
                <button
                  type="submit"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  onClick={clk}
                >
                  Clock Out
                </button>
              </form>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};
