const socket = io();

// Referencias a los elementos del DOM
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const messagesContainer = document.getElementById("messages");

// Función para agregar un mensaje al chat
function addMessage(message) {
    const messageElement = document.createElement("div");
    messageElement.className = "message";
    messageElement.textContent = message;
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto-scroll
}

// Enviar mensaje cuando se presiona el botón
sendButton.addEventListener("click", () => {
    const message = messageInput.value.trim();
    if (message) {
        socket.emit('sendMessage', message); // Enviar mensaje al servidor
        messageInput.value = ""; // Limpiar campo de entrada
    }
});

// Escuchar nuevos mensajes del servidor
socket.on('newMessage', (message) => {
    addMessage(message); // Agregar el mensaje recibido al chat
});
