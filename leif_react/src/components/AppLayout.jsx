import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const AppLayout = () => {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto p-4">
        <Outlet /> {/* This renders child routes */}
      </div>
    </div>
  );
};

export default AppLayout;
