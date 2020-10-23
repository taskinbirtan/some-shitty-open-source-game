var express = require('express');
var app = express();
var path = require('path');

var http = require('http').createServer(app);
var io = require('socket.io')(http);


app.use("/public", express.static(path.join(__dirname, 'public')));


let userx = 0;
let usery = 0;

let lastMessage = '';

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    console.log('a user connected');

    io.emit('user-position', {userx: userx, usery:usery})

    socket.on('chat message', (msg) => {
        lastMessage = msg;
        io.emit('last-message', {lastMessage: lastMessage})
    });
    socket.on('go-right', (msg) => {
        userx = userx + 0.1;
        io.emit('user-position', {userx: userx, usery:usery})
        console.log('position: ' + userx + ' ' + usery)
    });
    socket.on('go-left', (msg) => {
        userx -= 0.1;
        io.emit('user-position', {userx: userx, usery:usery})
        console.log('position: ' + userx + ' ' + usery)
    });
    socket.on('go-up', (msg) => {
        usery = usery  + 0.1;
        io.emit('user-position', {userx: userx, usery:usery})
        console.log('position: ' + userx + ' ' + usery)
    });
    socket.on('go-down', (msg) => {
        usery = usery - 0.1;
        io.emit('user-position', {userx: userx, usery:usery})
        console.log('position: ' + userx + ' ' + usery)
    });
});


http.listen(3000, () => {
    console.log('listening on *:3000');
});