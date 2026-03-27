const roleOrder = {
  viewer: 1,
  analyst: 2,
  admin: 3,
};

export function requireRole(minRole) {
  return (req, res, next) => {
    const userRole = req.user?.role;

    if (!userRole || roleOrder[userRole] < roleOrder[minRole]) {
      return res.status(403).json({ error: "Forbidden" });
    }

    next();
  };
}