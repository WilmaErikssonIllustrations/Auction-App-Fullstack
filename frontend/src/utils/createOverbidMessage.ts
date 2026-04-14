export const createOverbidMessage = (msg: string) => {
  const container = document.getElementById("overbidMessage");
  if (!container) return;
  container.innerHTML = msg;
  container.classList.remove("hide");
  setTimeout(() => {
    container.classList.add("hide");
  }, 5000);
};
