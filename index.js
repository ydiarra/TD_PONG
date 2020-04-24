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
        //gestion debut de partie
    });
    socket.on('Position', function (_a) {
        var Destinataire = _a.Destinataire, Position = _a.Position;
        socket
            .in(Destinataire)
            .emit('Position', {
            Position: Position,
            ID: socket.id,
        });
    });
    socket.on('pause', function (data) {
        socket
            .in(data)
            .emit('pause');
    });
    socket.on('continue', function (data) {
        socket
            .in(data)
            .emit('continue');
    });
    socket.on('balle', function (_a) {
        var Destinataire = _a.Destinataire, Balle = _a.Balle;
        // console.log('balle:',data);
        socket
            //.to(Destinataire)
            .in(Destinataire)
            .emit('balle', Balle);
    });
    socket.on('nbreConnection', function () {
        socket.emit('nbreConnection', nbreConnection);
    });
    socket.on('score', function (_a) {
        var Destinataire = _a.Destinataire, ScoreP1 = _a.ScoreP1, ScoreP2 = _a.ScoreP2, Service = _a.Service;
        socket
            .in(Destinataire)
            //.to(Destinataire)
            .emit('score', {
            ScoreP1: ScoreP1,
            ScoreP2: ScoreP2,
            Service: Service,
            ID: socket.id,
        });
    });
    socket.on('CreateGame', function (_a, cb) {
        var NomPartie = _a.NomPartie, ID = _a.ID, nbrJoueur = _a.nbrJoueur;
        if (Games.some(function (el) { return NomPartie == el.NomPartie; })) {
            socket.emit('GameAlreadyExist', NomPartie);
            cb(null);
            console.log('exist deja', Games.some(function (el) { return NomPartie == el.NomPartie; }), NomPartie, Games);
        }
        else {
            Games.push({
                'NomPartie': NomPartie,
                'IdHote': ID,
                'IdAdversaire': [],
                'nbrJoueur': nbrJoueur
            });
            var room = io.nsps['/'].adapter.rooms[NomPartie];
            if (1 === 1) { }
            ;
            socket.join(NomPartie);
            cb(NomPartie);
            console.log(NomPartie, 'creer', Games.some(function (el) { return NomPartie == el.NomPartie; }), NomPartie, Games);
        }
    });
    socket.on('JoinGame', function (_a, cb) {
        var NomPartie = _a.NomPartie, ID = _a.ID;
        console.log('Join Game', { NomPartie: NomPartie, ID: ID }, Games.some(function (el) { return NomPartie == el.NomPartie; }), NomPartie, Games);
        if (!Games.some(function (el) {
            console.log('deja rejoint', el.IdAdversaire.includes(socket.id));
            return NomPartie === el.NomPartie
                && el.IdAdversaire.length < el.nbrJoueur - 1
                && !el.IdAdversaire.includes(socket.id)
                && el.IdHote !== socket.id;
        })) {
            console.log(Games.filter(function (el) {
                return NomPartie == el.NomPartie && el.IdAdversaire === '';
            }).length);
            (Games.filter(function (el) {
                return NomPartie == el.NomPartie;
            }).length === 0) ? cb({
                IdHote: "la partie n'existe pas",
                Place: 0,
                Dernier: true
            }) : (Games.filter(function (el) {
                return NomPartie == el.NomPartie;
            })[0].IdHote === socket.id) ? cb({
                IdHote: 'vous ne pouvez pas etre votre propre adversaire',
                Place: 0,
                Dernier: true,
            }) :
                cb({
                    IdHote: 'partie complete',
                    Place: 0,
                    Dernier: true,
                });
        }
        else {
            var Game = Games
                .filter(function (el) { return NomPartie === el.NomPartie; })[0];
            var IdHote = Game.IdHote;
            socket
                .join(NomPartie);
            socket
                .in(NomPartie)
                //.to(IdHote)
                .emit('AdversaireJoin', {
                ID: socket.id,
                playerPLace: Game.IdAdversaire.length + 1
            });
            cb({
                IdHote: IdHote,
                Place: Game.IdAdversaire.length + 1,
                Dernier: Game.IdAdversaire.length + 1 === Game.nbrJoueur - 1,
                Adversaire: Game.IdAdversaire,
            });
            Games
                .filter(function (el) { return NomPartie === el.NomPartie; })[0]
                .IdAdversaire.push(socket.id);
            if (Game.nbrJoueur - 1 === Game.IdAdversaire.length) {
                socket
                    .in(NomPartie)
                    .emit('partieComplete');
                console.log('partie', Game.IdAdversaire.length + 1);
            }
        }
        ;
        console.log('partie rejoint');
    });
    socket.on('reinitGame', function (_a) {
        var Destinataire = _a.Destinataire;
        socket
            //.to(Destinataire)
            .in(Destinataire)
            .emit('reinitGame');
    });
});
http.listen(3000, function () {
    console.log('listening on localhost:3000');
});
