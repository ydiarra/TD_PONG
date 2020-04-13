let express =require('express');
let app = express();
let http = require('http').createServer(app);
let path = require('path');
let io = require('socket.io')(http);

app.use(express.static('.'));

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname + '/index.html'));
});

let nbreConnection=0;
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

    socket.on('Position',(data)=>{
       // console.log(data);
        socket.broadcast.emit('Position',data);
    });
    socket.on('balle',(data)=>{
       // console.log('balle:',data);
        socket.broadcast.emit('balle',data);

    });

    socket.on('nbreConnection',()=>{
        socket.emit('nbreConnection',nbreConnection);
    }) ;
    socket.on('score',(data)=>{
        socket.broadcast.emit('score',data);
    }) ;
});

http.listen(3000, function(){
    console.log('listening on localhost:3000');
});
