const express = require('express');
const cors = require('cors');
const app = express();

// Use CORS middleware for Express
// app.use(cors({
//     origin: 'http://127.0.0.1:5500', // Replace this with the front-end URL
//     methods: ['GET', 'POST'],
//     credentials: true
// }));

// Create HTTP server and configure Socket.io
const server = require('http').createServer(app);
const io = require('socket.io')(server, {
  cors: {
    origin: "http://127.0.0.1:5500", // Same front-end URL
    methods: ["GET", "POST"],
    credentials: true
  }
});
const user={};

io.on('connection', (socket) => {
   
  socket.on("new-user-joined",name=>{
    user[socket.id]=name;
    console.log(`user: ${user[socket.id]} with id:${socket.id} has joined`);
    socket.broadcast.emit('user-joined',name);
     console.log(`${name} has joined vscode the chat`);
})
 //brodcast the message recieved from client to all other client
 socket.on("send",message=>{
  console.log(`message sent by client to server was recieved and it was ${message}`);
  socket.broadcast.emit("recieve",{message:message,name:user[socket.id]});
 })

 
  socket.on('disconnect', () => {
    console.log(`user: ${user[socket.id]} with id:${socket.id} has left`);
    socket.broadcast.emit("leave",user[socket.id]);
    delete user[socket.id];
    
  });
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
