import io from 'socket.io'
let socket=io();
let knowNumberServer=false;
let first=false;

$('#startGame').click(()=>{
    socket.emit('start');

    //let playerOneCopie=game.playerOne.sprite.posX;
});
$('#pauseGame').click(()=>{
    socket.emit('pause');
});
$('#continueGame').click(()=>{
    socket.emit('continue');
});
SendPosition=()=>{
    socket.emit('Positon',game.playerOne.sprite.posY);
};
socket.on('start',()=>{
    // alert('un joueur veut commencer !');
});
socket.on('Position',(data)=>{
    console.log(data);
    game.playerTwo.sprite.posY=data;
});

socket.on('balle',(data)=>{
    //console.log(data);
    if(knowNumberServer){
        game.ball.sprite.posX=data.sprite.posX;
        game.ball.sprite.posY=data.sprite.posY;
        game.ball.speed=data.speed;
    }


});

socket.on('nbreConnection',(data)=>{
    console.log('nbre connec',data);
    if(!knowNumberServer && data>1){
        console.log('je suis passe chez so');
        game.playerOne.sprite.posX=conf.PLAYERTWOPOSX;
        game.playerTwo.sprite.posX=conf.PLAYERONEPOSX;
        game.playerOne.originalPosition='right';
        game.playerTwo.originalPosition='left';
    }else{
        console.log('je suis le 1er arrivé');
        game.playerOne.first = true;
    }
    knowNumberServer=true;

})
socket.on('score',(data)=>{
    game.playerOne.score = data.ScoreP1;
    game.playerTwo.score = data.ScoreP2;
    game.clearLayer(game.scoreLayer);
    game.displayScore( game.playerOne.score , game.playerTwo.score  );
    console.log('reception maj score');
}) ;

//ia ou non ?
//variable service celui qui sert dinne la position de la balle jusqu'au moment ou il perd
//ajout choix vs IA ou multi
//ameliorer le multi etre sur que le 2 joueurs sont prs
//creer de multi rooms pour le multi pour + de 2 joueurs
//voir si ajout d'un menu
// revoir le CSS
