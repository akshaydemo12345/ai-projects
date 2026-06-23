const jwt = require('jsonwebtoken');
const User = require('../models/User');

const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      console.warn(`🛡️ [AUTH] Unauthorized Access Blocked: ${req.method} ${req.originalUrl}`);
      return res.status(401).json({ status: 'fail', message: 'Not authorized, no token' });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret');

    // Access tokens are extremely long-lived (JWT_EXPIRES_IN, default 9999d),
    // so we MUST confirm the account still exists on every request. Without
    // this, a deleted (or banned) user's existing token keeps working
    // forever — they'd stay "logged in" indefinitely instead of being
    // kicked out the moment their account is removed.
    const stillExists = await User.exists({ _id: decoded.id });
    if (!stillExists) {
      return res.status(401).json({ status: 'fail', message: 'User no longer exists' });
    }

    // If the token already carries user meta (new-style tokens), skip the
    // full-document DB lookup — we've already confirmed the user exists above.
    // This eliminates one DB round-trip on every authenticated request.
    // Old tokens (id-only) fall back to a single DB fetch.
    if (decoded.name && decoded.email && decoded.plan !== undefined) {
      req.user = {
        _id: decoded.id,
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        plan: decoded.plan,
        credits: decoded.credits ?? 0,
      };
      return next();
    }

    // Fallback for old tokens — fetch from DB once, then future logins will use new token format
    const currentUser = await User.findById(decoded.id).select('_id name email plan credits').lean();
    if (!currentUser) {
      return res.status(401).json({ status: 'fail', message: 'User no longer exists' });
    }

    req.user = currentUser;
    next();
  } catch (err) {
    res.status(401).json({ status: 'fail', message: 'Not authorized, token failed' });
  }
};

// ROLE-BASED AUTHORIZATION
const restrictTo = (...roles) => {
  return (req, res, next) => {
    // 1. req.user is set by 'protect' middleware
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        status: 'fail',
        message: 'You do not have permission to perform this action',
      });
    }
    next();
  };
};

module.exports = { protect, restrictTo };