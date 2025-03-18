import { createBrowserRouter } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./utils/protectedRoutes";
import AppLayout from "./components/AppLayout";
import ClockInOut from "./components/Clock";
import { useAuth0 } from "@auth0/auth0-react";
import { useAuth } from "./context/useAuth";
const ProtectedDashboard = ({ children }) => {
  const { userId, token, role, logout } = useAuth();
  const { isAuthenticated, user } = useAuth0();
  const userType = user?.["https://yourdomain.com/role"] || "user"; // Get role from metadata

  if (!isAuthenticated || role !== "manager") {
    return <div className="text-red-500 text-center mt-10">Access Denied</div>;
  }

  return children;
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Register /> },
      { path: "signin", element: <Login /> },
      { path: "clock", element: <ProtectedRoute><ClockInOut /></ProtectedRoute> },
      { path: "dashboard", element: <ProtectedDashboard><Dashboard /></ProtectedDashboard> },
    ],
  },
]);

export default router;
