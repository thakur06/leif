// src/components/Register.jsx
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "antd";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const Register = () => {
  const { loginWithRedirect, isAuthenticated, user } = useAuth0();
  const navigate = useNavigate();
  const { userId, token, role, login } = useAuth();

  const getUser = async () => {
    console.log(user)
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/register",
        {
          email: user.email,
          name: user.name,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error during registration:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserData = async () => {
        try {
          const userdata = await getUser();
          console.log("User data:", userdata);
          login(userdata.user_id, userdata.token, userdata.role);
          if (userdata && userdata.role === "manager") {
            navigate("/dashboard");
          } else {
            navigate("/clock");
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };

      fetchUserData();
    }
  }, [isAuthenticated, user, navigate, token, login]);

  return (
    <div className="text-center justify-items-center">
      
      <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-6 bg-white">
        <div className="flex flex-col items-center w-full max-w-md">
      
          <img
            src="https://cdn-icons-png.flaticon.com/512/2966/2966334.png" // Free hospital icon from Flaticon
            alt="Hospital Logo"
            className="w-20 h-20 mb-6"
          />

          {/* Title */}
          <h1 className="text-3xl font-bold text-gray-800 mb-4 text-center">
            Welcome to CareWork
          </h1>

          {/* Subtitle */}
          <p className="text-gray-600 mb-6 text-center">
            Register to manage and track your shifts efficiently
          </p>

          {/* Register Button */}
          <Button
            type="primary"
            onClick={() =>
              loginWithRedirect({
                screen_hint: "signup",
                appState: { returnTo: "/clock" },
              })
            }
            className="w-full bg-blue-600 hover:bg-blue-700 border-none text-white font-semibold py-2 rounded-md"
          >
            Register Now
          </Button>

          {/* Login Link */}
          <p className="mt-4 text-sm text-gray-500">
            Already have an account?{" "}
            <a href="/signin" className="text-blue-600 hover:underline">
              Sign In
            </a>
          </p>
        </div>
      </div>

      {/* Right Side: Hospital Image */}
    
    </div>
  );
};

export default Register;