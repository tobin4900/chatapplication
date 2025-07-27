const express = require('express');
const cors = require('cors');
const app = express();
const path = require('path');

// Configure CORS properly
app.use(cors({
    origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
    methods: ['GET', 'POST'],
    credentials: true
}));

// Serve static files from frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// Handle client-side routing - should come AFTER static files
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

const server = require('http').createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: ["http://127.0.0.1:5500", "http://localhost:5500"],
        methods: ["GET", "POST"],
        credentials: true
    }
});

const user = {};

io.on('connection', (socket) => {
    socket.on("new-user-joined", name => {
        user[socket.id] = name;
        console.log(`user: ${name} with id:${socket.id} has joined`);
        socket.broadcast.emit('user-joined', name);
    });

    socket.on("send", message => {
        console.log(`message from ${user[socket.id]}: ${message}`);
        socket.broadcast.emit("recieve", {
            message: message,
            name: user[socket.id]
        });
    });

    socket.on('disconnect', () => {
        const username = user[socket.id];
        if (username) {
            console.log(`user: ${username} with id:${socket.id} has left`);
            socket.broadcast.emit("leave", username);
            delete user[socket.id];
        }
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});