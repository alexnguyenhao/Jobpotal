import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    const decode = jwt.verify(token, process.env.SECRET_KEY);
    if (!decode) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }
    const user = await User.findById(decode.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }
    req.id = decode.userId;
    req.role = decode.role;
    req.company = decode.company || null;
    req.user = user;

    next();
  } catch (error) {
    console.error("Auth error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default isAuthenticated;
