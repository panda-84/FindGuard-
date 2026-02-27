// middleware/roleMiddleware.js
// Checks if the logged in user has the correct role

export const roleMiddleware = (allowedRole) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated." });
    }

    if (req.user.role !== allowedRole) {
      return res.status(403).json({
        message: `Access denied. Only ${allowedRole}s can do this.`
      });
    }

    next();
  };
};