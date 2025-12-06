import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js";

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

    let account;
    if (decode.role === "admin" || decode.role === "superadmin") {
      account = await Admin.findById(decode.userId).select("-password");
    } else {
      account = await User.findById(decode.userId).select("-password");
    }

    if (!account) {
      return res.status(401).json({
        success: false,
        message: "Account not found",
      });
    }

    req.id = decode.userId;
    req.role = decode.role;
    req.company = decode.company || null;
    req.user = account;

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
