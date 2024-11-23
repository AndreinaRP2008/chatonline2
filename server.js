const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Servir los archivos estáticos (tu frontend)
app.use(express.static('public'));

// Manejar conexión de sockets
io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');

    // Escuchar un mensaje del cliente
    socket.on('sendMessage', (message) => {
        console.log('Mensaje recibido:', message);
        // Enviar el mensaje a todos los clientes
        io.emit('newMessage', message);
    });

    // Manejar desconexión
    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado');
    });
});

// Iniciar el servidor
server.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
