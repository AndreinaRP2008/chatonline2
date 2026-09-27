const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Servir los archivos estáticos (tu frontend)
app.use(express.static('public'));

// Manejar conexiones de Socket.IO
io.on('connection', (socket) => {
    console.log('Un usuario se ha conectado');

    // Escuchar un mensaje del cliente
    socket.on('sendMessage', (message) => {
        console.log('Mensaje recibido:', message);
        // Enviar el mensaje a todos los clientes conectados
        io.emit('newMessage', message);
    });

    // Manejar desconexión
    socket.on('disconnect', () => {
        console.log('Un usuario se ha desconectado');
    });
});

// Render proporciona el puerto mediante la variable de entorno PORT.
// En local seguimos usando 3000.
const PORT = process.env.PORT || 3000;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
