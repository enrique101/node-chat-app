const getUrlParams = search => {
    const hashes = search.slice(search.indexOf('?') + 1).split('&');
    return hashes.reduce((newObj, values) => {
        const [key, val] = values.split('=');
        return {
            ...newObj,
            [key]: decodeURIComponent(val).replace(new RegExp(/\+/g), ' '),
        };
    },{});
};

const scrollToBottom = ()=>{
    const messages = document.querySelector('#messages');
    const newMessage = messages.querySelector('li:last-child');
    const lastMessage = messages.querySelector('li:nth-last-child(2)');
    const {clientHeight, scrollTop, scrollHeight} = messages;
    const newMessageHeight = newMessage.clientHeight;
    const lastMessageHeight = lastMessage ? lastMessage.clientHeight : 0;
    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop = scrollHeight;
    }
};


const socket = io();
socket.on('connect', ()=>{
    const params = getUrlParams(window.location.search);
    socket.emit('join', params, err=>{
        if(err){
            alert(err);
            window.location.href = '/';
        }
    });
});

socket.on('disconnect', ()=>{
    console.log('Disconnected from server');
});

socket.on('updateUserList', users=>{
    const templateRaw = document.querySelector('#user-list').innerHTML;
    const template = Mustache.render(templateRaw,users);
    const node = document.createElement('template');
    node.innerHTML = template;
    const el = document.querySelector('#people');
    el.innerHTML="";
    el.append(node.content.firstElementChild);
});

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