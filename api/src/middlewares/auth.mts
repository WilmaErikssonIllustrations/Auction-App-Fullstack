import type { Request, Response, NextFunction } from "express";
import { convertUserToDTO, type UserDTO } from "../models/User.mjs";
import jwt from "jsonwebtoken";
import { findUserByEmail } from "../controllers/userController.mjs";

export const auth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) throw Error("no JWT Secret found");
    const token = req.cookies.login;

    if (!token) {
      return res.status(401).json({ message: "No authentication token found" });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as UserDTO;

    const user = await findUserByEmail(decoded.email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    next();
  } catch (error) {
    console.error("Error in auth middleware:", error);
    res.status(500).json({ message: "Error in auth middleware" });
  }
};
