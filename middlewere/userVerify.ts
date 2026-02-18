import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import type { JwtPayload } from "jsonwebtoken"
import User from "../model/userModel.ts";


interface UserAuth extends Request{
    user: any
}

export const verifyUser = async (
  req: UserAuth,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.cookies?.user_token;

    // ✅ Check token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized. Token not provided.",
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET not defined");
    }

    // ✅ Verify token safely
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    ) as JwtPayload;

    if (!decoded?.id) {
      return res.status(401).json({
        success: false,
        message: "Invalid token",
      });
    }

    // ✅ Find user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;

    next();

  } catch (error) {
    console.error("Auth Middleware Error:", error);

    return res.status(401).json({
      success: false,
      message: "Unauthorized. Invalid or expired token.",
    });
  }
};