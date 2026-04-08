import express from "express";
import bcrypt from "bcrypt";
import { createUser, findUserByEmail } from "../controllers/userController.mjs";
import { convertUserToDTO } from "../models/User.mjs";



export const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "Alla fält måste fyllas i" });
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: "En användare med den e-postadressen finns redan" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await createUser(name, email, hashedPassword);

        res.status(201).json({ message: "Användare registrerad framgångsrikt", user: convertUserToDTO(newUser) });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ett fel inträffade vid registrering av användare" });
    }
});
    
