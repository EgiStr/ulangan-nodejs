import { decode } from "jsonwebtoken";
import errorStatus from "../../helpers/errorStatus.js";
import authServices from "../../services/authServices.js";

export default function authMiddleware(req, res, next) {
  // Get token from header
  const token = req.cookies["X-accessToken"];

  const authService = authServices();
  if (!token) {
    const error = new Error("You Must Login | No access token found")
    error.statusCode = 403
    throw error
  }
  try {
    const decoded = authService.verify(token);
    req.user = decoded.user;
    next();
  } catch (err) {
    throw new errorStatus(err)
  }
}
