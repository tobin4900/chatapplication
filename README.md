Chat Application
A simple real-time public chat application built with Node.js, Express, and Socket.io. The app allows anyone to join a chat room, send and receive messages instantly, and see when other users join or leave the chat.

Live Demo
[Chat Application on Render](https://chatapplication-ll5y.onrender.com)


Features
Public chat – anyone can join by entering a name

Real-time messaging using Socket.io

Notifications when users join or leave

Express backend with Socket.io for communication

Helmet middleware for basic security headers

Tech Stack
Node.js

Express.js

Socket.io

Helmet

Hosted on Render

Project Structure
bash
Copy
Edit
chat-app/
│── frontend/           # Static HTML, CSS, JS files
│── index.js            # Main server file
│── package.json        # Dependencies and scripts
Installation & Setup
Clone the repository:

bash
Copy
Edit
git clone https://github.com/yourusername/chat-app.git
Navigate to the project folder:

bash
Copy
Edit
cd chat-app
Install dependencies:

bash
Copy
Edit
npm install
Start the server:

bash
Copy
Edit
npm start
Open your browser and visit:

arduino
Copy
Edit
http://localhost:3000
Socket Events (API Documentation)
new-user-joined – emitted when a new user joins the chat

user-joined – broadcast to other users when someone joins

send – send a chat message

receive – receive messages from other users

leave – broadcast when a user leaves the chat

