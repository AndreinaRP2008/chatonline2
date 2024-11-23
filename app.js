const messagesContainer = document.getElementById("messages");
const messageInput = document.getElementById("messageInput");
const sendButton = document.getElementById("sendButton");
const imageInput = document.getElementById("imageInput");
const imagePreview = document.getElementById("imagePreview");
const audioButton = document.getElementById("audioButton");

// Para la grabación de audio
let mediaRecorder;
let audioChunks = [];
let isRecording = false;
let audioBlob;

// Función para agregar mensajes al chat
function addMessage(content, type = "text") {
    const messageElement = document.createElement("div");
    messageElement.className = "message";

    if (type === "image") {
        const img = document.createElement("img");
        img.src = content;
        messageElement.appendChild(img);
    } else if (type === "audio") {
        const audio = document.createElement("audio");
        audio.controls = true;
        audio.src = URL.createObjectURL(content);
        messageElement.appendChild(audio);
    } else {
        messageElement.textContent = content;
    }

    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto-scroll
}

// Grabar audio
audioButton.addEventListener("click", () => {
    if (isRecording) {
        mediaRecorder.stop();  // Detener la grabación
        audioButton.textContent = "🎙️";  // Cambiar icono de botón
    } else {
        navigator.mediaDevices.getUserMedia({ audio: true })  // Solicitar permisos de audio
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);
                mediaRecorder.ondataavailable = event => {
                    audioChunks.push(event.data);
                };
                mediaRecorder.onstop = () => {
                    audioBlob = new Blob(audioChunks, { type: "audio/wav" });
                    addMessage(audioBlob, "audio"); // Enviar el audio grabado
                    audioChunks = []; // Limpiar el arreglo de chunks
                };
                mediaRecorder.start();
                audioButton.textContent = "⏹️";  // Cambiar icono a "detener"
            })
            .catch(err => {
                console.error("Error al acceder al micrófono", err);
            });
    }
    isRecording = !isRecording;  // Cambiar estado de grabación
});

// Enviar mensaje o imagen
sendButton.addEventListener("click", () => {
    const text = messageInput.value.trim();
    const file = imageInput.files[0];

    if (text) {
        addMessage(text); // Agrega mensaje de texto
        messageInput.value = "";
    } else if (file) {
        const reader = new FileReader();
        reader.onload = () => {
            addMessage(reader.result, "image"); // Agrega imagen
            imageInput.value = ""; // Limpia el input de archivos
            imagePreview.style.display = 'none'; // Oculta la vista previa
        };
        reader.readAsDataURL(file); // Convierte la imagen a Base64
    } else {
        alert("Por favor, escribe un mensaje o selecciona una imagen.");
    }
});
