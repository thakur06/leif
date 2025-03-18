// src/context/useAuth.js
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

// Custom hook to access AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  return context;
};
