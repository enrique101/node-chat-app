const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const port = process.env.PORT || 3000;

const app = express();

const server = http.createServer(app);

const io = socketIO(server);

app.use('/', express.static(path.join(__dirname, '../public')));

io.on('connection', socket =>{

    socket.emit('newMessage', {
        from: "Admin",
        text: "Welcome to the chat!",
        createdAt: new Date().getTime(),
    });

    socket.broadcast.emit('newMessage',{
        from: "Admin",
        text: "New user joined!",
        createdAt: new Date().getTime(),
    });

    socket.on('createMessage', data =>{
        io.emit('newMessage',{
            ...data,
            createdAt: new Date().getTime(),
        });
    });

    socket.on('disconnect', socket => {
        console.log("User disconected");
    });
});

server.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
});
