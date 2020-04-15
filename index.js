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
var Games = [];
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
    socket.on('Position', function (_a) {
        var Destinataire = _a.Destinataire, Position = _a.Position;
        // console.log(data);
        socket
            .to(Destinataire)
            .emit('Position', Position);
    });
    socket.on('pause', function (data) {
        // console.log(data);
        socket
            .to(data)
            .emit('pause');
    });
    socket.on('continue', function (data) {
        // console.log(data);
        socket
            .to(data)
            .emit('continue');
    });
    socket.on('balle', function (_a) {
        var Destinataire = _a.Destinataire, Balle = _a.Balle;
        // console.log('balle:',data);
        socket
            .to(Destinataire)
            .emit('balle', Balle);
    });
    socket.on('nbreConnection', function () {
        socket.emit('nbreConnection', nbreConnection);
    });
    socket.on('score', function (_a) {
        var Destinataire = _a.Destinataire, ScoreP1 = _a.ScoreP1, ScoreP2 = _a.ScoreP2, Service = _a.Service;
        socket.to(Destinataire).emit('score', {
            ScoreP1: ScoreP1,
            ScoreP2: ScoreP2,
            Service: Service
        });
    });
    ///////////////////////////////////
    socket.on('CreateGame', function (_a) {
        var NomPartie = _a.NomPartie, ID = _a.ID;
        if (Games.some(function (el) { return NomPartie == el.NomPartie; })) {
            socket.emit('GameAlreadyExist', NomPartie);
            console.log('exist deja', Games.some(function (el) { return NomPartie == el.NomPartie; }), NomPartie, Games);
        }
        else {
            Games.push({
                'NomPartie': NomPartie,
                'IdHote': ID,
                'IdAdversaire': ''
            });
            //socket.join(data);
            socket.emit('GameCreated', NomPartie);
            console.log(NomPartie, 'creer', Games.some(function (el) { return NomPartie == el.NomPartie; }), NomPartie, Games);
        }
    });
    socket.on('JoinGame', function (_a, cb) {
        var NomPartie = _a.NomPartie, ID = _a.ID;
        console.log('Join Game', { NomPartie: NomPartie, ID: ID }, Games.some(function (el) { return NomPartie == el.NomPartie; }), NomPartie, Games);
        if (!Games.some(function (el) {
            return NomPartie === el.NomPartie
                && el.IdAdversaire === ''
                && el.IdHote !== socket.id;
        })) {
            console.log(Games.filter(function (el) {
                return NomPartie == el.NomPartie && el.IdAdversaire === '';
            }).length);
            (Games.filter(function (el) {
                return NomPartie == el.NomPartie;
            }).length === 0) ? cb("la partie n'existe pas") : (Games.filter(function (el) {
                return NomPartie == el.NomPartie;
            })[0].IdHote === socket.id) ? cb('vous ne pouvez pas etre votre propre adversaire') : cb('la partie est complete');
        }
        else {
            var IdHote = Games
                .filter(function (el) { return NomPartie === el.NomPartie; })[0]
                .IdHote;
            Games
                .filter(function (el) { return NomPartie === el.NomPartie; })[0]
                .IdAdversaire = socket.id;
            socket
                .to(IdHote)
                .emit('AdversaireJoin', socket.id);
            console.log(socket.id, Games.filter(function (el) { return NomPartie == el.NomPartie; })[0].IdHote);
            console.log('partie rejoint');
            cb(IdHote);
        }
    });
    socket.on('reinitGame', function (_a) {
        var Destinataire = _a.Destinataire;
        socket.to(Destinataire).emit('reinitGame');
    });
});
http.listen(3000, function () {
    console.log('listening on localhost:3000');
});
