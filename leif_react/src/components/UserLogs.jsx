import React, { useState, useEffect } from 'react';
import axios from 'axios';

export const UserLogs = () => {
  const [userShifts, setUserShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Function to reverse geocode latitude and longitude
  const reverseGeocode = async (lat, lon) => {
    try {
    console.log(lat,lon);
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
      );
return response.data.display_name
      // Extract the formatted address from the response

    } catch (err) {
      console.error('Error reverse geocoding:', err);
      return 'Error fetching address';
    }
  };

  useEffect(() => {
    // Fetch shift data from API
    const fetchUserShifts = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage

        const response = await axios.get('http://localhost:3000/api/shifts/history', {
          headers: {
            Authorization: `${token}`, // Add the token in the Authorization header
          },
        });

        // Reverse geocode clock-in and clock-out locations
        const shiftsWithAddresses = await Promise.all(
          response.data.map(async (shift) => {
            const clockInAddress = await reverseGeocode(
              shift.clockInLocation.latitude,
              shift.clockInLocation.longitude
            );
            const clockOutAddress = shift.clockOutLocation
              ? await reverseGeocode(
                  shift.clockOutLocation.latitude,
                  shift.clockOutLocation.longitude
                )
              : 'Not clocked out yet';

            return {
              ...shift,
              clockInAddress,
              clockOutAddress,
            };
          })
        );

        setUserShifts(shiftsWithAddresses);
      } catch (err) {
        setError('Error fetching shift data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserShifts();
  }, []); // Empty dependency array to run the effect once when the component mounts

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h3 className="text-2xl font-semibold text-gray-700 mb-6">User Shift Log for Today</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Clock-in Time</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Clock-out Time</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Clock-in Location</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Clock-out Location</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Clock-in Note</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Clock-out Note</th>
            </tr>
          </thead>
          <tbody>
            {userShifts.map((shift) => (
              <tr key={shift._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 border-b text-sm text-gray-700">{shift.user.name}</td>
                <td className="px-4 py-3 border-b text-sm text-gray-700">{shift.clockInTime}</td>
                <td
                  className={`px-4 py-3 border-b text-sm text-gray-700 ${
                    !shift.clockOutTime ? 'text-red-500 font-bold' : null
                  }`}
                >
                  {shift.clockOutTime || 'Not clocked out yet'}
                </td>
                <td className="px-4 py-3 border-b text-sm text-gray-700">{shift.clockInAddress}</td>
                <td className="px-4 py-3 border-b text-sm text-gray-700">{shift.clockOutAddress}</td>
                <td className="px-4 py-3 border-b text-sm text-gray-700">{shift.clockInNote}</td>
                <td className="px-4 py-3 border-b text-sm text-gray-700">{shift.clockOutNote}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};