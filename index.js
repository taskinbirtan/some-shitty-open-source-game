var express = require('express');
var app = express();
var path = require('path');

var http = require('http').createServer(app);
var io = require('socket.io')(http);


app.use("/public", express.static(path.join(__dirname, 'public')));


let userx = 0;
let usery = 0;

let users = [];


let lastMessage = '';

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {


    let randomId = Math.floor(Math.random() * 100) + 1;
    users[randomId] = {};
    users[randomId].userx = 0;
    users[randomId].usery = 0;
    users[randomId].userId = randomId;


    io.emit('new-user', {userId: randomId, userx: users[randomId].userx, usery: users[randomId].usery});

    io.emit('user-position', users[randomId])

    socket.on('chat message', (msg) => {
        lastMessage = msg;
        io.emit('last-message', {lastMessage: lastMessage})
    });
    socket.on('go-right', (msg) => {
        users[randomId].userx += 0.1;
        io.emit('user-position', users[randomId])
    });
    socket.on('go-left', (msg) => {
        users[randomId].userx -= 0.1;

        io.emit('user-position', users[randomId])
    });
    socket.on('go-up', (msg) => {
        users[randomId].usery += 0.1;
        io.emit('user-position', users[randomId])
    });
    socket.on('go-down', (msg) => {
        users[randomId].usery -= 0.1;
        io.emit('user-position', users[randomId])
    });
});


http.listen(3000, () => {
    console.log('listening on *:3000');
});