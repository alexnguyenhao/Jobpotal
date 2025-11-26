const isAdmin = (req, res, next) => {
  if (req.role !== "admin" && req.role !== "superadmin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Only Admin is allowed.",
    });
  }
  next();
};
export default isAdmin;
