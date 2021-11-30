// express admin middleware

export default function adminMiddleware(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      status: "error",
      message: "You are not authorized to access this route",
    });
  }
  next();
}