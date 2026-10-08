// Role verification middleware for route protection

/**
 * Ensures the requesting user possesses the 'Admin' role.
 * Rejects unauthorized non-admin staff with 403 Forbidden.
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "Admin") {
    return res.status(403).json({
      message: "Access denied. Administrator privileges required.",
    });
  }
  next();
};

module.exports = {
  requireAdmin,
};
