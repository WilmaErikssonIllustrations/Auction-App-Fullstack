import { getUser } from "./getUser";
import { logoutUser } from "./logout";

export const displayGreeting = async () => {
    const greeting = document.getElementById("greeting");

    const userInfo = await getUser();

    if (!greeting) return;

    const isProductPage = window.location.pathname.includes("productPage");

    if (userInfo) {

        greeting.innerHTML = `Hej, ${userInfo.name}! Du är inloggad 
        <button id="logoutBtn" class="logout-link">Logga ut</button>`;


        document.getElementById("userInfo")?.classList.remove("hide");
        document.getElementById("greeting")?.classList.add("smaller");

        const logoutBtn = document.getElementById("logoutBtn");
        logoutBtn?.addEventListener("click", () => {
            logoutUser();
        });

    } else {

        document.getElementById("userInfo")?.classList.add("hide");

        const buttonsHtml = `
            <div class="auth-buttons-container">
                <button class="auth-btn" onclick="window.location.href='login.html'">Logga in</button> 
                <button class="auth-btn" onclick="window.location.href='register.html'">Bli medlem</button>
            </div>
        `;

        if (isProductPage) {

            greeting.innerHTML = `
                <h1>RetroBuda.</h1>
                ${buttonsHtml}`;
            greeting.classList.add("smaller");
        } else {

            greeting.innerHTML = `
                <h1>RetroBuda.</h1>
                <h3>auktionssidan för dig som vill fynda retro och vintage</h3>
                ${buttonsHtml}
            `;
            greeting.classList.remove("smaller");
        }
    }
};