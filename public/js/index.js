const socket = io();
socket.on('connect', ()=>{
    console.log('connected to server');
});

socket.on('disconnect', ()=>{
    console.log('Disconnected from server');
});

socket.on('newMessage', data =>{
    console.log("newMessage: ", data);
});