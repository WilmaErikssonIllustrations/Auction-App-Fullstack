import bcrypt from "bcryptjs";
import type { LoginRequest } from "../models/requests/loginRequest.mjs";
import { User, convertUserToDTO } from "../models/User.mjs";



export const loginUser = async (req: LoginRequest) => {
    console.log("-----------------------------------------");
    console.log("Inloggningsförsök mottaget i controller:");
    console.log("E-post:", req.email);
    console.log("Lösenord (plain text):", req.password);

    // 1. Sök efter användaren
    const foundUser = await User.findOne({ email: req.email }).select("+password");

    if (!foundUser) {
        console.log("Resultat: Hittade ingen användare i databasen med den mejlen.");
        return null;
    }

    console.log("Resultat: Användare hittad! Hash i databas:", foundUser.password);

    // 2. Jämför lösenord
    const success = await bcrypt.compare(req.password, foundUser.password);
    console.log("Lösenordsmatchning (bcrypt):", success);

    if (success) {
        console.log("Inloggning lyckades!");
        return convertUserToDTO(foundUser);
    } else {
        console.log("Resultat: Fel lösenord.");
        return null;
    }
};
