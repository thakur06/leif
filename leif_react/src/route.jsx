import { createBrowserRouter } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./utils/protectedRoutes"
import AppLayout from "./components/AppLayout";
import ClockInOut from "./components/Clock";


const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      { index: true, element: <Register/> }, // Default child
      { path: "signin", element: <Login/> }, // Default child },
      { path: "clock", element: <ClockInOut/> }, // Default child },
      { path: "dashboard", element: <ProtectedRoute><Dashboard /></ProtectedRoute> },
    ],
  },
]);

export default router;
