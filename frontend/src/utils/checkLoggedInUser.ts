export interface UserInfo {
    name: string;
    email: string;
}

export const checkLoggedInUser = async (): Promise<UserInfo | null> => {
    try {
        const response = await fetch("http://localhost:3000/api/users/me", {
            method: "GET",
            credentials: "include",
        });

        if (response.ok) {
            const userData = await response.json();
            return userData;
        } else {
            console.log("User not logged in or token expired");
            return null;
        }
    } catch (error) {
        console.error("Error checking logged in user:", error);
        return null;
    }
};