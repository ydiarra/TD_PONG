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
        //console.log(socket, 'un joueur veut commencer !');
        socket.broadcast.emit('start');
    });

    socket.on('Position',({Destinataire,Position})=>{
        // console.log(data);
        socket
            .to(Destinataire)
            .emit('Position',Position);
    });
    socket.on('pause',(data)=>{
        // console.log(data);
        socket
            .to(data)
            .emit('pause');
    });
    socket.on('continue',(data)=>{
        // console.log(data);
        socket
            .to(data)
            .emit('continue');
    });
    socket.on('balle',({Destinataire,Balle})=>{
        // console.log('balle:',data);
        socket
            .to(Destinataire)
            .emit('balle',Balle);

    });

    socket.on('nbreConnection',()=>{
        socket.emit('nbreConnection',nbreConnection);
    }) ;

    socket.on('score',({Destinataire, ScoreP1, ScoreP2, Service})=>{
        socket.to(Destinataire).emit('score',{
            ScoreP1:ScoreP1,
            ScoreP2:ScoreP2,
            Service:Service
        });

    }) ;
///////////////////////////////////
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

    socket.on('JoinGame',({NomPartie,ID},cb)=>{
        console.log('Join Game',{NomPartie,ID},Games.some((el)=>{return NomPartie==el.NomPartie}),NomPartie,Games);
        if(!Games.some((el)=>{return NomPartie === el.NomPartie
            && el.IdAdversaire === ''
            && el.IdHote!==socket.id;
        })){
            console.log(Games.filter((el)=>{
                return NomPartie==el.NomPartie && el.IdAdversaire === ''
            }).length);
            (Games.filter((el)=>{
                return NomPartie==el.NomPartie
            }).length===0)? cb(`la partie n'existe pas`) :  (Games.filter((el)=>{
                return NomPartie==el.NomPartie
            })[0].IdHote===socket.id) ?cb('vous ne pouvez pas etre votre propre adversaire'):cb('la partie est complete');
        }else
        {

            let IdHote=Games
                .filter((el)=>NomPartie===el.NomPartie)[0]
                .IdHote;
            Games
                .filter((el)=>NomPartie===el.NomPartie)[0]
                .IdAdversaire=socket.id;

            socket
                .to(IdHote)
                .emit('AdversaireJoin',socket.id);
            console.log(socket.id,Games.filter((el)=>{return NomPartie==el.NomPartie})[0].IdHote);

            console.log('partie rejoint');
            cb(IdHote);
        }
    }) ;

    socket.on('reinitGame',({Destinataire})=>{
        socket.to(Destinataire).emit('reinitGame');
    })
});

http.listen(3000, function(){
    console.log('listening on localhost:3000');
});
