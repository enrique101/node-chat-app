const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage, generateLocationMessage } = require('./utils/message');

const port = process.env.PORT || 3000;

const app = express();

const server = http.createServer(app);

const io = socketIO(server);

app.use('/', express.static(path.join(__dirname, '../public')));

io.on('connection', socket =>{

    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat!'));

    socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user just join!'));

    socket.on('createMessage', (data, fn) =>{
        io.emit('newMessage',generateMessage(data.from, data.text));
        fn('this is from server');
    });

    socket.on('createLocationMessage', coords =>{
        io.emit('newLocationMessage',generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', socket => {
        console.log("User disconected");
    });
});

server.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
});
