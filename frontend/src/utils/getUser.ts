export interface UserInfo {
  name: string;
  email: string;
  id: string;
}

export const getUser = async (id: string = "me"): Promise<UserInfo | null> => {
  try {
    const response = await fetch(`https://auction-app-fullstack.onrender.com/api/users/${id}`, {
      method: "GET",
      credentials: "include",
    });

    if (response.ok) {
      return await response.json();
    }

    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};
