import bcrypt from "bcryptjs";
import type { LoginRequest } from "../models/requests/loginRequest.mjs";
import { User, convertUserToDTO } from "../models/User.mjs";

export const loginUser = async (req: LoginRequest) => {
  // Sök efter användaren
  const foundUser = await User.findOne({ email: req.email }).select(
    "+password",
  );

  if (!foundUser) {
    console.log(
      "Resultat: Hittade ingen användare i databasen med den mejlen.",
    );
    return null;
  }

  // Jämför lösenord
  const success = await bcrypt.compare(req.password, foundUser.password);

  if (success) {
    console.log("Inloggning lyckades!");
    return convertUserToDTO(foundUser);
  } else {
    console.log("Resultat: Fel lösenord.");
    return null;
  }
};
