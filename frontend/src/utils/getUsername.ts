import type { UserInfo } from "./checkLoggedInUser";

export const getUsername = async (id: string): Promise<UserInfo | null> => {
  try {
    const response = await fetch("http://localhost:3000/api/users/" + id, {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      const user = await response.json();
      return user;
    } else {
      console.log("Could not get user");
      return null;
    }
  } catch (error) {
    console.error("Error checking logged in user:", error);
    return null;
  }
};
