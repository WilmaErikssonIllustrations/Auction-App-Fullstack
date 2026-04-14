import express from "express";
import type { LoginRequest } from "../models/requests/loginRequest.mjs";
import { loginUser } from "../controllers/loginController.mjs";
import jwt from "jsonwebtoken";

export const loginRouter = express.Router();

loginRouter.post("/", async (req, res) => {
    const { email, password }: LoginRequest = req.body;
    try {

        const userDto = await loginUser({ email, password });

        if (userDto) {
            const token = jwt.sign(userDto, "supersecretsecret");

            const expires = new Date();
            expires.setHours(expires.getHours() + 1);

            res.cookie("login", token, {
                expires,
                sameSite: "lax",
                secure: false,
                httpOnly: true,
            });

            return res.status(200).json(userDto);
        }

        res.status(400).json({ message: "Unable to log in" });
    } catch (error) {
        console.error(error);
        res.status(500).json(JSON.stringify(error));
    }
});

loginRouter.post("/logout", (req, res) => {
    res.clearCookie("login");
    res.status(200).send("Utloggad");
});