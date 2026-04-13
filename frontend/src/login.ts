import axios from "axios";
import "./style.css";

document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userEmail = (document.getElementById("userEmail") as HTMLInputElement)
    .value;
  const userPassword = (
    document.getElementById("userPassword") as HTMLInputElement
  ).value;

  const response = await axios.post(
    // "https://fed25s-chat-cbgzhhgncrhjesg8.swedencentral-01.azurewebsites.net/login",
    "http://localhost:3000/login",
    {
      email: userEmail,
      password: userPassword,
    },
    {
      withCredentials: true,
    },
  );

  if (response.status >= 200 && response.status < 300) {
    sessionStorage.setItem("me", response.data.name);
    if (response.data.id) {
      sessionStorage.setItem("userId", response.data.id);
    } else {
      console.error("Inget ID hittades i svaret från servern. Kontrollera din backend!");
    }
    location.href = "/";
  }
});
