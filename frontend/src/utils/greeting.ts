import { checkLoggedInUser } from "./checkLoggedInUser";

export const displayGreeting = async () => {
    const greeting = document.getElementById("greeting");
    const userInfo = await checkLoggedInUser();

    if (!greeting) return;

    if (userInfo) {
        greeting.textContent = `Hej, ${userInfo.name}! Du är inloggad`;
        document.getElementById("userInfo")?.classList.remove("hide");
    } else {
        greeting.textContent = "Välkommen till auktionssajten, vänligen Logga in eller Registrera dig";
    }
};