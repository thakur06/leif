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
  const { userId, token, role, logout , login } = useAuth();
  const getUser = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/users/register", // API Endpoint
        {
          email: user.email,
          name: user.name,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer your_jwt_token_here`, // Replace with the correct token
          },
        }
      );
      return response.data; // Assuming response.data contains user data
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const fetchUserData = async () => {
        const userdata = await getUser();
        console.log(userdata)
        login(userdata.user_id,userdata.token,userdata.role)
        if (userdata && userdata.role === "manager") {
          navigate("/dashboard"); // Redirect to dashboard if role is "manager"
        } else {
          navigate("/clock"); // Redirect to clock if role is not "manager"
        }
      };

      fetchUserData();
    }
  }, [isAuthenticated, user, navigate]); // Add user as dependency

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-4">Register to Track Your Shifts</h1>
      <Button
        type="primary"
        onClick={() =>
          loginWithRedirect({
            screen_hint: "signup",
            appState: { returnTo: "/clock" }, // Will redirect to /clock after signup
          })
        }
      >
        Register
      </Button>
    </div>
  );
};

export default Register;
