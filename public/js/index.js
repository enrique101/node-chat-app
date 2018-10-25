const socket = io();
socket.on('connect', ()=>{
    console.log('connected to server');
});

socket.on('disconnect', ()=>{
    console.log('Disconnected from server');
});

const scrollToBottom = ()=>{
    const messages = document.querySelector('#messages');
    const newMessage = messages.querySelector('li:last-child');
    const lastMessage = messages.querySelector('li:nth-last-child(2)');
    const {clientHeight, scrollTop, scrollHeight} = messages;
    console.table({clientHeight, scrollTop, scrollHeight});
    const newMessageHeight = newMessage.clientHeight;
    const lastMessageHeight = lastMessage ? lastMessage.clientHeight : 0;
    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop = scrollHeight;
    }
};

socket.on('newMessage', data =>{
    const { createdAt } = data;
    const templateRaw = document.querySelector('#message-template').innerHTML;
    const template = Mustache.render(templateRaw,{
        ...data,
        createdAt: moment(createdAt).format('h:mm a'),
    });
    const node = document.createElement('template');
    node.innerHTML = template;
    document.querySelector('#messages').appendChild(node.content.firstElementChild);
    scrollToBottom();
});

socket.on('newLocationMessage', data =>{
    const { createdAt } = data;
    const templateRaw = document.querySelector('#location-message-template').innerHTML;
    const template = Mustache.render(templateRaw,{
        ...data,
        createdAt: moment(createdAt).format('h:mm a'),
    });
    const node = document.createElement('template');
    node.innerHTML = template;
    document.querySelector('#messages').appendChild(node.content.firstElementChild);
    scrollToBottom();
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

const locationButton = document.querySelector('#send-location');

locationButton.addEventListener('click',(e)=>{
    e.preventDefault();
    locationButton.disabled = true;
    if(!navigator.geolocation){
        return alert('No geolocation!');
    }
    navigator.geolocation.getCurrentPosition(position =>{
        const { coords: {longitude, latitude} } = position;
        locationButton.disabled = false;
        socket.emit('createLocationMessage', {
            longitude,
            latitude,
        });
    },
    error =>{
        document.querySelector('#send-location').disabled = true;
        alert('Unable to get access to geolocation :(');
    })

});