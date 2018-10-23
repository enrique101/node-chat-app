const socket = io();
socket.on('connect', ()=>{
    console.log('connected to server');
});

socket.on('disconnect', ()=>{
    console.log('Disconnected from server');
});

socket.on('newMessage', data =>{
    console.log(data);
    const { from, text } = data;
    const newMessage = document.createElement("li");
    newMessage.innerHTML = `${from}: ${text}`;
    document.querySelector('#messages').appendChild(newMessage);
});


document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    const from = 'loki';
    const text = event.currentTarget.querySelector("[name=message]").value;
    socket.emit('createMessage', {
        from,
        text,
    }, data=>{
        console.log(`got it ${data}`);
    });
});