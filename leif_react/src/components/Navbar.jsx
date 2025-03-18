import { Link } from "react-router-dom";
import { Button } from "antd";
import { useAuth0 } from "@auth0/auth0-react";
import { useState, useEffect } from "react";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";

const Navbar = () => {
  const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userType, setUserType] = useState(null);

  // Update userType when user logs in or logs out
  useEffect(() => {
    if (isAuthenticated && user) {
      setUserType(user?.["https://yourdomain.com/role"] || "user"); // Default to "user"
    } else {
      setUserType(null); // Reset on logout
    }
  }, [isAuthenticated, user]);

  return (
    <nav className="bg-green-700 p-4 shadow-md w-full">
      <div className="container mx-auto flex justify-between items-center">
        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? <CloseOutlined /> : <MenuOutlined />}
        </button>

        {/* Navigation Links */}
        <div
          className={`absolute md:static top-16 left-0 w-full md:w-auto shadow-sm md:bg-transparent backdrop-blur-sm md:backdrop-blur-none flex flex-col md:flex-row items-center md:space-x-4 p-4 md:p-0 transition-all duration-300 ${
            isMenuOpen ? "block" : "hidden md:flex"
          }`}
        >
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0 text-center">
            <Link
              to="/"
              className="text-white hover:text-blue-200 transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {/* Show "Clock In/Out" only if logged in */}
            {isAuthenticated && (
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
          </div>

          {/* Auth Buttons */}
          <div className="mt-4 md:mt-0 text-center">
            {isAuthenticated ? (
              <Button
                onClick={() => {
                  logout({ returnTo: window.location.origin });
                  setUserType(null); // Ensure UI updates instantly
                }}
                type="primary"
                danger
                className="w-full md:w-auto"
              >
                Logout
              </Button>
            ) : (
              <Button
                onClick={() => loginWithRedirect()}
                type="primary"
                className="w-full md:w-auto"
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
