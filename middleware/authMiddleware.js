import jwt from "jsonwebtoken";
import User from "../model/userModel.js";
import asyncHandler from "./asyncHandler.js";

export const protectMiddleware = asyncHandler(async (req, res, next) => {
  let token;
  token = req.cookies.jwt;

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Unauthorized");
    }
  } else {
    res.status(401);
    throw new Error("Unauthorized,token is not found");
  }
});

export const roleMiddleware = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    const userRole = await User.findById(req.user._id);
    const roleName = userRole.role;

    if (!roles.includes(roleName)) {
      res.status(401);
      throw new Error("Unauthorized");
    }

    next();
  });
};
