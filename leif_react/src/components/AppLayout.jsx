import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useAuth0 } from "@auth0/auth0-react";
const AppLayout = () => {
  const { isAuthenticated, user } = useAuth0();
  return (
    <div>
      {isAuthenticated && <Navbar />}
      <div className="container mx-auto p-4">
        <Outlet /> {/* This renders child routes */}
      </div>
    </div>
  );
};

export default AppLayout;
