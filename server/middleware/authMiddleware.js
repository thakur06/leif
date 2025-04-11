const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

module.exports = function (req, res, next) {
  // Extract token from Authorization header (handle "Bearer" prefix)
  const authHeader = req.header("Authorization");
  console.log("Authorization header:", authHeader);

  if (!authHeader) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Remove "Bearer " prefix if present
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "abhishek@0101");
    console.log("Decoded token:", decoded);
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error("Token verification error:", err);
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ msg: "Token has expired" });
    }
    res.status(401).json({ msg: "Token is not valid" });
  }
};