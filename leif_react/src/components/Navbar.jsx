import { Link, useNavigate } from "react-router-dom";
import { Button } from "antd";
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { MenuOutlined, CloseOutlined, UserOutlined } from "@ant-design/icons";
import { useAuth } from "../context/useAuth";

const Navbar = () => {
  const { userId, token, role } = useAuth();
  const { loginWithRedirect, logout: auth0Logout, isAuthenticated, user } = useAuth0();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userType, setUserType] = useState(role);
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated && user) {
      setUserType(role); // Sync with context role
    } else {
      setUserType(null); // Reset on logout
    }
  }, [isAuthenticated, user, role]);

  const handleLogout = () => {
    localStorage.clear();
    const returnToUrl = `${window.location.origin}/signin`; // Full URL: e.g., http://localhost:5173/signin
    auth0Logout({ logoutParams: { returnTo: returnToUrl } }); // Use Auth0 logout directly
    setIsMenuOpen(false); // Close mobile menu
    navigate('/signin', { replace: true }); // Fallback redirect
  };

  return (
    <nav className="bg-green-700 p-4 shadow-md w-full fixed top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo or Brand Name */}
        <p  className="text-white text-xl font-bold">
          CareWork
        </p>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>

        {/* Navigation Links */}
        <div
          className={`absolute md:static top-16 left-0 w-full md:w-auto bg-green-700 md:bg-transparent backdrop-blur-sm md:backdrop-blur-none flex flex-col md:flex-row items-center md:space-x-6 p-4 md:p-0 transition-all duration-300 ${
            isMenuOpen ? "block" : "hidden md:flex"
          }`}
        >
          <div className="flex flex-col md:flex-row md:space-x-6 space-y-4 md:space-y-0 text-center">
            {/* Show "Clock In/Out" only if the user is a careworker */}
            {isAuthenticated && userType === "careworker" && (
              <Link
                to="/clock"
                className="text-white hover:text-blue-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Clock In/Out
              </Link>
            )}

            {/* Show "Dashboard" only if the user is a manager */}
            {isAuthenticated && userType === "manager" && (
              <Link
                to="/dashboard"
                className="text-white hover:text-blue-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
            )}

            {/* Show "Analytics" only if the user is a manager */}
            {isAuthenticated && userType === "manager" && (
              <Link
                to="/analytics"
                className="text-white hover:text-blue-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Analytics
              </Link>
            )}

            {/* Show "User Logs" only if the user is a manager */}
            {isAuthenticated && userType === "manager" && (
              <Link
                to="/userlogs"
                className="text-white hover:text-blue-200 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                User Logs
              </Link>
            )}

            {/* Show "Profile" only if the user is authenticated */}
            {isAuthenticated && (
              <Link
                to="/profile"
                className="text-white hover:text-blue-200 transition-colors flex items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <UserOutlined className="mr-2" />
                Profile
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="mt-4 md:mt-0 text-center">
            {isAuthenticated ? (
              <Button
                onClick={handleLogout}
                type="primary"
                danger
                className="bg-red-500 hover:bg-red-600 border-none"
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => loginWithRedirect()}
                type="primary"
                className="bg-blue-500 hover:bg-blue-600 border-none"
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;