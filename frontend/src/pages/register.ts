import "../style/style.css";

const registerForm = document.getElementById("registerForm") as HTMLFormElement;

registerForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const nameInput = document.getElementById("name") as HTMLInputElement;
  const emailInput = document.getElementById("email") as HTMLInputElement;
  const passwordInput = document.getElementById("password") as HTMLInputElement;

  let name: string = "";
  let email: string = "";
  let password: string = "";

  if (nameInput instanceof HTMLInputElement) {
    name = nameInput.value;
  } else {
    throw new Error("Namnfältet hittades inte");
  }

  if (emailInput instanceof HTMLInputElement) {
    email = emailInput.value;
  } else {
    throw new Error("Emailfältet hittades inte");
  }

  if (passwordInput instanceof HTMLInputElement) {
    password = passwordInput.value;
  } else {
    throw new Error("Lösenordsfältet hittades inte");
  }

  try {
    const response = await fetch("http://localhost:3000/api/users/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      alert("Registrering lyckades! Du kan nu logga in.");
      window.location.href = "/login";
    } else {
      alert(`Registrering misslyckades: ${data.message}`);
    }
  } catch (error) {
    console.error("Fel vid registrering av användare:", error);
    throw new Error("Misslyckades att registrera användare");
  }
});
