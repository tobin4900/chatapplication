
//client javascript file
const socket = io("http://localhost:3000");
//updating dom to display user joined the chat
const append=(message,position)=>{
    const messageelement=document.createElement("div");
    messageelement.innerText=message;
    messageelement.classList.add('message', position);
    const container=document.querySelector(".container");
    container.append(messageelement);
}
//send message to server to emit to all users also to append to my chat the message i have sent
// socket.emit("send-message",message)


const name=prompt("enter your name here");
socket.emit("new-user-joined",name);
socket.on('user-joined',name=>{
    //append in chat that a user has joined on right side
    
    console.log(`${name} has joined inspect chat`); 
    append(`${name} has joined chat`,"right");})
    const form = document.getElementById('send-container');
    const input = document.getElementById('messageinp');
    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevents the default form submission
        const enteredText = input.value; // Get the value from the input field
        console.log(enteredText);
        append(`you:${enteredText}`,"right");
        socket.emit("send",enteredText,);
    });
    //recieves meassage from other clients through server 
    socket.on("recieve",data=>{
        append(`${data.name}:${data.message}`,"left");
    })
    //disconnected client broadcast that they left
    socket.on("leave",id=>{
        append(`${id} has gone`,"right");
    })
    

