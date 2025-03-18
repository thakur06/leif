// src/context/AuthContext.js
import { createContext, useState } from "react";

// Create AuthContext
export const AuthContext = createContext();

// AuthProvider Component
export const AuthProvider = ({ children }) => {
  const [userId, setUserId] = useState(localStorage.getItem("user_id") || null);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [role, setRole] = useState(localStorage.getItem("role") || null);

  // Function to update user state and store in localStorage
  const login = (userId, token, role) => {
    setUserId(userId);
    setToken(token);
    setRole(role);
    localStorage.setItem("user_id", userId);
    localStorage.setItem("role", role);
    if (token) localStorage.setItem("token", token);
  };

  // Function to logout user
  const logoutbtn = () => {
    setUserId(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem("user_id");
    localStorage.removeItem("token");
    localStorage.removeItem("role");
  };

  return (
    <AuthContext.Provider value={{ userId, token, login, logoutbtn, role }}>
      {children}
    </AuthContext.Provider>
  );
};
