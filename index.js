var express = require('express');
var app = express();
var http = require('http').createServer(app);
var path = require('path');
var io = require('socket.io')(http);
app.use(express.static('.'));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname + '/index.html'));
});
var nbreConnection = 0;
io.on('connection', function (socket) {
    nbreConnection++;
    console.log('a user connected', nbreConnection);
    socket.on('disconnect', function () {
        nbreConnection--;
        console.log('user disconnected', nbreConnection);
    });
    socket.on('start', function () {
        //console.log(socket, 'un joueur veut commencer !');
        socket.broadcast.emit('start');
    });
    socket.on('Position', function (data) {
        // console.log(data);
        socket.broadcast.emit('Position', data);
    });
    socket.on('balle', function (data) {
        // console.log('balle:',data);
        socket.broadcast.emit('balle', data);
    });
    socket.on('nbreConnection', function () {
        socket.emit('nbreConnection', nbreConnection);
    });
    socket.on('score', function (data) {
        socket.broadcast.emit('score', data);
    });
});
http.listen(3000, function () {
    console.log('listening on localhost:3000');
});
