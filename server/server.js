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
    // socket.emit('request', /* */); // emit an event to the socket
    // io.emit('broadcast', /* */); // emit an event to all connected sockets
    // socket.on('reply', function(){ /* */ }); // listen to the event
    console.log("connection done");
    socket.on('disconnect', socket => {
        console.log("User disconected");
    });
});

server.listen(port,()=>{
    console.log(`Server is running at http://localhost:${port}`);
});
