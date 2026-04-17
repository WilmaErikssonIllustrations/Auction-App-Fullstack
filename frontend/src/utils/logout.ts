import axios from "axios";

export const logoutUser = async (): Promise<void> => {
  try {
    await axios.post(
      "http://localhost:3000/login/logout",
      {},
      { withCredentials: true },
    );
  } catch (error) {
    console.error("Kunde inte logga ut från servern", error);
  }

  sessionStorage.clear();
  window.location.href = "index.html";
};
