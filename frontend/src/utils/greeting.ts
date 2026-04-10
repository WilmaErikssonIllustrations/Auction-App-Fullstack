import { checkLoggedInUser } from "./checkLoggedInUser";
import { logoutUser } from "./logout";

export const displayGreeting = async () => {
    const greeting = document.getElementById("greeting");
    const userInfo = await checkLoggedInUser();

    if (!greeting) return;

    if (userInfo) {
        greeting.innerHTML = `Hej, ${userInfo.name}! Du är inloggad 
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

    }
};