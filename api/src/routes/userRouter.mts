import express from "express";
import bcrypt from "bcrypt";
import {
  createUser,
  findUserByEmail,
  findUserById,
} from "../controllers/userController.mjs";
import { convertUserToDTO, type UserDTO } from "../models/User.mjs";
import jwt from "jsonwebtoken";

export const userRouter = express.Router();

userRouter.get("/me", async (req, res) => {
  try {
    const token = req.cookies.login;

    if (!token) {
      return res.status(401).json({ message: "No authentication token found" });
    }

    const decoded = jwt.verify(token, "supersecretsecret") as UserDTO;

    const user = await findUserByEmail(decoded.email);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(convertUserToDTO(user));
  } catch (error) {
    console.error("Error in /me endpoint:", error);
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

userRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Alla fält måste fyllas i" });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "En användare med den e-postadressen finns redan" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await createUser(name, email, hashedPassword);

    res.status(201).json({
      message: "Användare registrerad framgångsrikt",
      user: convertUserToDTO(newUser),
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Ett fel inträffade vid registrering av användare" });
  }
});

userRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await findUserById(id);

    if (user) {
      res.status(200).json(convertUserToDTO(user));
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong getting user");
  }
});
