// client.js

// Connect to backend (auto detects local vs hosted)
const socket = io(
  location.hostname === "localhost"
    ? "http://localhost:3000"
    : "https://chatapplication-ll5y.onrender.com"
);

// Function to append messages to chat window
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("message", position);
  const container = document.querySelector(".container");
  container.appendChild(messageElement);
  container.scrollTop = container.scrollHeight; // Auto scroll
};

// Ask user for name and notify server
const name = prompt("Enter your name here");
socket.emit("new-user-joined", name);

// Show when a new user joins
socket.on("user-joined", name => {
  console.log(`${name} has joined inspect chat`);
  append(`${name} has joined the chat`, "left");
});

// Send messages to server
const form = document.getElementById("send-container");
const input = document.getElementById("messageinp");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const enteredText = input.value.trim();
  if (enteredText !== "") {
    append(`You: ${enteredText}`, "right");
    socket.emit("send", enteredText);
    input.value = "";
  }
});

// Receive message from others
socket.on("receive", data => {
  append(`${data.name}: ${data.message}`, "left");
});

// Show when someone leaves
socket.on("leave", name => {
  append(`${name} has left the chat`, "left");
});
