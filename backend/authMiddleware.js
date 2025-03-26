// authMiddleware.js

const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "xby/XnhNf/tMgzxf8xo5uHgIQWt3f8j2Vd843GK46tc=";

function authenticateToken(req, res, next) {
    console.log("Hello uesis");
  // 1. Get the token from headers, cookies, or query params
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

  if (!token) {
    return res.status(401).json({ message: 'Access token is missing or invalid' });
  }

  // 2. Verify token
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.error("JWT verification failed:", err.message);
      return res.status(403).json({ message: 'Token is not valid' });
    }

    // 3. Attach user to request object for use in routes
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;
