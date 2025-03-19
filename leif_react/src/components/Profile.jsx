import React from "react";
import { useAuth0 } from "@auth0/auth0-react";
import manager from "../assets/manager.png"
import people from "../assets/people.png"
import { useAuth } from "../context/useAuth";
const Profile = () => {
  const { user, isAuthenticated } = useAuth0();
  const { userId, token, role} = useAuth();
  // Dummy data for shifts (replace with actual data from your backend)
  const totalShifts = 42; // Example total shifts

  return (
    <div className=" bg-gray-50 flex justify-center items-center ">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-4xl">
        {/* Profile Header */}
        <div className="bg-green-700 p-6 text-white text-center">
          <h1 className="text-3xl font-bold">User Profile</h1>
        </div>

        {/* Profile Content */}
        <div className="p-6">
          <div className="flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-6">
            {/* Profile Image */}
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-green-700">
              <img
                src={
                 role === "manager"
                    ? manager // Manager image
                    : people // Careworker image
                }
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>

            {/* User Details */}
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-2xl font-semibold text-gray-800">{user?.name}</h2>
              <p className="text-gray-600 mt-2">
                <span className="font-medium">Role:</span>{" "}
                {role}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Email:</span> {user?.email}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Total Shifts:</span> {totalShifts}
              </p>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mt-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Additional Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-700">Recent Activity</h4>
                <p className="text-gray-600">Last Clock-in: 08:00 AM</p>
                <p className="text-gray-600">Last Clock-out: 05:00 PM</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg">
                <h4 className="text-lg font-medium text-gray-700">Performance</h4>
                <p className="text-gray-600">Average Hours per Shift: 8.5</p>
                <p className="text-gray-600">Total Hours Worked: 340</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;