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
    socket.emit('createMessage',{
        from: 'email@gmail.com',
        text: 'text',
        createdAt: Date.now().toString()
    });

    socket.on('newMessage', data =>{
        console.log('newMessage', data);
    });

    socket.on('disconnect', socket => {
        console.log("User disconected");
    });
});

server.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
});
