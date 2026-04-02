export type User = {
  name: string;
  email: string;
  password: string;
};

export type UserDTO = {
  name: string;
  email: string;
};

// Ändra User till UserFromDB och lägg till id när schema och model är skapat
export const convertUserToDTO = (user: User): UserDTO => {
  return {
    // id: user.id
    name: user.name,
    email: user.email,
  } satisfies UserDTO;
};
