// main.js
const socket = io();

const form = document.getElementById("login-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = form.name.value;
  socket.emit("login", name);
});

socket.on("redirect", (url) => {
  window.location.href = url;
});