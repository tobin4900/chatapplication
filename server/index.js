const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');

const app = express();
const server = http.createServer(app);

// ✅ Setup Socket.IO
const io = require('socket.io')(server, {
  cors: {
    origin: "*",  // For public chat, allow all
    methods: ["GET", "POST"]
  }
});

// ✅ Optional: Set Content Security Policy to allow Google Fonts (fix font error)
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; font-src 'self' https://fonts.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;");
  next();
});

// ✅ CORS middleware (safe to include)
app.use(cors());

// ✅ Serve static files from frontend folder
app.use(express.static(path.join(__dirname, 'frontend')));

// ✅ Send index.html for any route (SPA support)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/index.html'));
});

// ✅ In-memory user store
const users = {};

io.on('connection', (socket) => {
  socket.on("new-user-joined", name => {
    users[socket.id] = name;
    console.log(`${name} joined the chat`);
    socket.broadcast.emit("user-joined", name);
  });

  socket.on("send", message => {
    socket.broadcast.emit("receive", {
      message,
      name: users[socket.id]
    });
  });

  socket.on("disconnect", () => {
    const name = users[socket.id];
    if (name) {
      socket.broadcast.emit("leave", name);
      console.log(`${name} left the chat`);
      delete users[socket.id];
    }
  });
});

// ✅ Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
