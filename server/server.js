const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');

const port = process.env.PORT || 3000;

const app = express();

const server = http.createServer(app);

const io = socketIO(server);

app.use('/', express.static(path.join(__dirname, '../public')));

io.on('connection', socket =>{

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat!'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user just join!'));

    socket.on('createMessage', data =>{
        io.emit('newMessage',generateMessage(data.from, data.text));
    });

    socket.on('disconnect', socket => {
        console.log("User disconected");
    });
});

server.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
});
