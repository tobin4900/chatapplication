const express = require('express');
const cors = require('cors');
const path = require('path');
const http = require('http');
const helmet = require('helmet'); // NEW: Security headers

const app = express();
const server = http.createServer(app);

// ✅ Setup Socket.IO
const io = require('socket.io')(server, {
  cors: {
    origin: "*", // For public chat, allow all
    methods: ["GET", "POST"]
  }
});

// ✅ Helmet CSP to allow fonts, styles, scripts from trusted sources
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "https://fonts.googleapis.com", "'unsafe-inline'"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "*"], // For socket connections
        imgSrc: ["'self'", "data:"]
      },
    },
  })
);

// ✅ CORS middleware
app.use(cors());

// ✅ Serve static files from frontend
app.use(express.static(path.join(__dirname, 'frontend')));

// ✅ Test route to verify backend
app.get('/', (req, res) => {
  res.send("Chat Backend is running ✅");
});

// ✅ Serve frontend for SPA routing
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

// ✅ Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
