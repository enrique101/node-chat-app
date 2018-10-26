const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const { isValidString } = require('./utils/validators');
const { Users } = require('./utils/users');

const { generateMessage, generateLocationMessage } = require('./utils/message');

const port = process.env.PORT || 3000;

const app = express();

const server = http.createServer(app);

const io = socketIO(server);

const users = new Users();

app.use('/', express.static(path.join(__dirname, '../public')));

io.on('connection', socket =>{
    socket.on('join',({ name, room }, fn)=>{
        if(!isValidString(name) || !isValidString(room)){
            return fn('Invalid data');
        }
        socket.join(room);
        users.add(socket.id, name, room);

        io.to(room).emit('updateUserList', users.getUsersByRoom(room));

        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat!'));
        socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${name} has joined!`));
        fn();
    });

    socket.on('createMessage', (data, fn) =>{
        io.emit('newMessage',generateMessage(data.from, data.text));
        fn('this is from server');
    });

    socket.on('createLocationMessage', coords =>{
        io.emit('newLocationMessage',generateLocationMessage('Admin', coords.latitude, coords.longitude));
    });

    socket.on('disconnect', () => {
        const { room, name } = users.get(socket.id);
        users.remove(socket.id);
        if(room){
            io.to(room).emit('updateUserList',users.getUsersByRoom(room));
            io.to(room).emit('newMessage', generateMessage('Admin', `${name} has left!`));
        }
    });
});

server.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
});
