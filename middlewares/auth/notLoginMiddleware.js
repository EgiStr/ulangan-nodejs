import authService from "../../services/authServices.js";

export default function authMiddleware(req, res, next) {
  // Get token from header
  const token = req.cookies["X-accessToken"];
  const authService = authService();
  if (!token) {
    next()
  }else{
    res.redirect("/")
  }
  
}
