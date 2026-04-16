import { getUser } from "./getUser";
import { logoutUser } from "./logout";

export const displayGreeting = async () => {
  const greeting = document.getElementById("greeting");
  if (!greeting) return;

  const loggedInUser = await getUser();

  if (loggedInUser) {
    greeting.innerHTML = `Hej, ${loggedInUser.name}! Du är inloggad 
        <button id="logoutBtn" class="logout-link">Logga ut</button>`;

    document.getElementById("userInfo")?.classList.remove("hide");

    const logoutBtn = document.getElementById("logoutBtn");
    logoutBtn?.addEventListener("click", () => {
      logoutUser();
    });
  } else {
    greeting.innerHTML = `
            Välkommen till auktionssajten!
            <button class="auth-btn" onclick="window.location.href='login.html'">Logga in</button> 
            <button class="auth-btn" onclick="window.location.href='register.html'">Registrera dig</button>
        `;

    document.getElementById("userInfo")?.classList.add("hide");
  }
};
