let express =require('express');
let app = express();
let http = require('http').createServer(app);
let path = require('path');
let io = require('socket.io')(http);

app.use(express.static('.'));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/index.html'));
});

let nbreConnection :number=0;
let Games: Array<any>=[];

io.on('connection',(socket)=>{
    nbreConnection++;
    console.log('a user connected',nbreConnection);
    socket.on('disconnect', function(){
        nbreConnection--;
        console.log('user disconnected',nbreConnection);
    });

    socket.on('start',()=>{
        //gestion debut de partie
    });
    socket.on('Position',({Destinataire,Position})=>{
        socket
            .in(Destinataire)
            .emit('Position',Position);
    });
    socket.on('pause',(data:string)=>{
        socket
            .in(data)
            .emit('pause');
    });
    socket.on('continue',(data:string)=>{
        socket
            .in(data)
            .emit('continue');
    });
    socket.on('balle',({Destinataire,Balle})=>{
        // console.log('balle:',data);
        socket
            //.to(Destinataire)
            .in(Destinataire)
            .emit('balle',Balle);

    });

    socket.on('nbreConnection',()=>{
        socket.emit('nbreConnection',nbreConnection);
    }) ;

    socket.on('score',({Destinataire, ScoreP1, ScoreP2, Service})=>{
        socket
            .in(Destinataire)
            //.to(Destinataire)
            .emit('score',{
                ScoreP1:ScoreP1,
                ScoreP2:ScoreP2,
                Service:Service
            });

    }) ;
///////////////////////////////////
    /*
    socket.on('CreateGame',({NomPartie,ID})=>{

        if(Games.some((el)=> {return NomPartie==el.NomPartie})){
            socket.emit('GameAlreadyExist',NomPartie);
            console.log('exist deja',Games.some((el)=>{return NomPartie==el.NomPartie}),NomPartie,Games);
        }else
        {
            Games.push({
                'NomPartie': NomPartie,
                'IdHote':ID,
                'IdAdversaire':'',
            });
            //socket.join(data);
            socket.emit('GameCreated',NomPartie);
            console.log(NomPartie ,'creer',Games.some((el)=>{return NomPartie==el.NomPartie}),NomPartie,Games);
        }
    }) ;
*/

    socket.on('CreateGame',({NomPartie,ID,nbrJoueur},cb)=>{

        if(Games.some((el)=> {return NomPartie==el.NomPartie})){
            socket.emit('GameAlreadyExist',NomPartie);
            cb(null);
            console.log('exist deja',Games.some((el)=>{return NomPartie==el.NomPartie}),NomPartie,Games);
        }else
        {
            Games.push({
                'NomPartie': NomPartie,
                'IdHote':ID,
                'IdAdversaire':[],
                'nbrJoueur':nbrJoueur

            });
            let room=io.nsps['/'].adapter.rooms[NomPartie];
            if (1===1){};
            socket.join(NomPartie);
            cb(NomPartie);
            console.log(NomPartie ,'creer',Games.some((el)=>{return NomPartie==el.NomPartie}),NomPartie,Games);
        }
    }) ;

    socket.on('JoinGame',({NomPartie,ID},cb)=>{
        console.log('Join Game',{NomPartie,ID},Games.some((el)=>{return NomPartie==el.NomPartie}),
            NomPartie,Games);
        if(!Games.some((el)=>{
            console.log('deja rejoint',el.IdAdversaire.includes(socket.id));
            return NomPartie === el.NomPartie
            && el.IdAdversaire.length < el.nbrJoueur-1
            && !el.IdAdversaire.includes(socket.id)
            && el.IdHote!==socket.id;
        })){
            console.log(Games.filter((el)=>{
                return NomPartie==el.NomPartie && el.IdAdversaire === ''
            }).length);
            (Games.filter((el)=>{
                return NomPartie==el.NomPartie
            }).length===0)? cb(`la partie n'existe pas`) :  (Games.filter((el)=>{
                return NomPartie==el.NomPartie
            })[0].IdHote===socket.id) ?cb({
                IdHote:'vous ne pouvez pas etre votre propre adversaire',
                Place:0
            }):
                cb({
                    IdHote:'partie complete',
                    Place:0
                });
        }else
        {
            let Game=Games
                .filter((el)=>NomPartie===el.NomPartie)[0]
                ;
            let IdHote=Game.IdHote;
            Games
                .filter((el)=>NomPartie===el.NomPartie)[0]
                .IdAdversaire.push(socket.id);
            socket
                .join(NomPartie);
            socket
                .in(NomPartie)
                //.to(IdHote)
                .emit('AdversaireJoin',socket.id);
            if(Game.nbrJoueur-1===Game.IdAdversaire.length){
                socket
                    .in(NomPartie)
                    .emit('partieComplete')
            };
            console.log(socket.id,Games.filter((el)=>{return NomPartie==el.NomPartie})[0].IdHote);

            console.log('partie rejoint');

            cb({
                IdHote:IdHote,
                Place:Game.IdAdversaire.length+1
            });
        }
    }) ;

    socket.on('reinitGame',({Destinataire})=>{
        socket
            //.to(Destinataire)
            .in(Destinataire)
            .emit('reinitGame');
    })
});

http.listen(3000, function(){
    console.log('listening on localhost:3000');
});
