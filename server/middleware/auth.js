// middleware/auth.js
const jwt = require('jsonwebtoken');
const asyncHandler = fn => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Verify JWT and attach user ID to request
const protect = asyncHandler(async (req, res, next) => {
  let token;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer')) {
    token = authHeader.split(' ')[1];
  }

  if (!token) {
    const err = new Error('Not authorized, token missing');
    err.statusCode = 401;
    throw err;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    const err = new Error('Not authorized, token invalid');
    err.statusCode = 401;
    throw err;
  }
});

module.exports = { protect };
