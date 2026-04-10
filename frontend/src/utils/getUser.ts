export interface UserInfo {
  name: string;
  email: string;
  id: string;
}

export const getUser = async (id: string = "me"): Promise<UserInfo | null> => {
  try {
    const response = await fetch(`http://localhost:3000/api/users/${id}`, {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      return await response.json();
    }

    console.log(id === "me" ? "User not logged in" : `Could not get user with id: ${id}`);
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};
