const socket = io();
socket.on('connect', ()=>{
    console.log('connected to server');
});

socket.on('disconnect', ()=>{
    console.log('Disconnected from server');
});

socket.emit('newMessage',{
    from: "from",
    text: "text",
});

socket.on('createMessage', data =>{
    console.log("createMessage: ", data);
});