import axios from "axios";

export const logoutUser = async (): Promise<void> => {
  try {
    await axios.post(
      "https://auction-app-fullstack.onrender.com/login/logout",
      {},
      { withCredentials: true },
    );
  } catch (error) {
    console.error("Kunde inte logga ut från servern", error);
  }

  sessionStorage.clear();
  window.location.href = "index.html";
};
