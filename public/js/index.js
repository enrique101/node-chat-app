const socket = io();
socket.on('connect', ()=>{
    console.log('connected to server');
});

socket.on('disconnect', ()=>{
    console.log('Disconnected from server');
});

socket.on('newMessage', data =>{
    const { from, text } = data;
    const newMessage = document.createElement("li");
    newMessage.innerHTML = `${from}: ${text}`;
    document.querySelector('#messages').appendChild(newMessage);
});

socket.on('newLocationMessage', data =>{
    console.log(data);
    const { from, text } = data;
    const newMessage = document.createElement("li");
    const link = document.createElement("a");
    link.target = '_blank';
    link.innerText = `I'm here! :D`,
    link.href = data.url;
    newMessage.innerHTML = `${from}: `;
    newMessage.appendChild(link);
    document.querySelector('#messages').appendChild(newMessage);
});


document.querySelector('#message-form').addEventListener('submit',(e)=>{
    e.preventDefault();
    const from = 'loki';
    const input = event.currentTarget.querySelector("[name=message]");
    const text = input.value;
    input.value = "";
    socket.emit('createMessage', {
        from,
        text,
    }, data=>{
        console.log(`got it ${data}`);
    });
});

document.querySelector('#send-location').addEventListener('click',(e)=>{
    e.preventDefault();
    if(!navigator.geolocation){
        return alert('No geolocation!');
    }
    navigator.geolocation.getCurrentPosition(position =>{
        const { coords: {longitude, latitude} } = position;
        socket.emit('createLocationMessage', {
            longitude,
            latitude,
        });
    },
    error =>{
        alert('Unable to get access to geolocation :(');
    })

});