import "./style.css";

document.querySelector("#loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const emailInput = document.querySelector("#email") as HTMLInputElement | null;
    const passwordInput = document.querySelector("#password") as HTMLInputElement | null;

    if (!emailInput || !passwordInput) {
        console.error("Form inputs not found");
        return;
    }

    const email = emailInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
            credentials: "include",
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Login successful:", data);

            window.location.href = "/";
        } else {
            const errorData = await response.json();
            alert(`Login failed: ${errorData.message || "Invalid credentials"}`);
        }
    } catch (error) {
        console.error("Network error:", error);
        alert("Could not connect to the server.");
    }
});