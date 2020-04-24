
let socket=io({
    autoConnect:false
});
let knowNumberServer=false;
let first=false;

$('#startGame').click(()=>{
    socket.emit('start');

    //let playerOneCopie=game.playerOne.sprite.posX;
});
$('#pauseGame').click(()=>{
    socket.emit('pause',game.NomPartieMulti);
});
$('#continueGame').click(()=>{
    socket.emit('continue',game.NomPartieMulti);
});

SendPosition=()=>{
    socket.emit('Positon',game.playerOne.sprite.posY);
};
socket.on('start',()=>{
    // alert('un joueur veut commencer !');
});
socket.on('Position',({Position,ID})=>{
    //console.log('poistion recu',Position);
    if (game.playerTwo.IdSocket===ID){

        game.playerTwo.sprite.posY=Position;
    }else if (game.playerThree.IdSocket===ID){
        game.playerThree.sprite.posY=Position;
    }else if (game.playerFour.IdSocket===ID){
        game.playerFour.sprite.posY=Position;
    }

});

socket.on('balle',(data)=>{
    //console.log(data)
    game.ball.sprite.posX=data.sprite.posX;
    game.ball.sprite.posY=data.sprite.posY;
    game.ball.speed=data.speed;
    //console.log('info sur la balle');
});

socket.on('nbreConnection',(data)=>{
    console.log('nbre connec',data);
    if(!knowNumberServer && data>1){

        game.teamOne.service = false;
    }else{

        game.playerOne.first = true;
        game.teamOne.service = true;
    }
    knowNumberServer=true;

})
socket.on('score',({ScoreP1,ScoreP2,Service,ID})=>{

    if (game.playerTwo.IdSocket===ID && (game.Myplace===3 || game.Myplace===1)
        ||(game.playerOne.IdSocket===ID && (game.Myplace===2 || game.Myplace===4))){
        alert(1);

        game.teamOne.score = ScoreP2;
        game.teamTwo.score = ScoreP1;
    }else if (game.playerTwo.IdSocket===ID && !(game.Myplace===3 || game.Myplace===1)
        ||(game.playerOne.IdSocket===ID && !(game.Myplace===2 || game.Myplace===4))){

        game.teamOne.score = ScoreP1;
        game.teamTwo.score = ScoreP2;
    }
    game.teamOne.service = Service;
    game.clearLayer(game.scoreLayer);

    game.displayScore( game.teamOne.score , game.teamTwo.score  )

}) ;
socket.on('GameCreated',(data)=>{
    $('#NomPartie').css('display','none');
    $('#CreateGame').css('display','none');
    $('#CreateGame2v2').css('display','none');
    $('#JoinGame').css('display','none');
    game.teamOne.service = true;
    console.log('created',data);
    $('.lds-roller').css('display','inline');

    //En attente de l'adversaire
}) ;
socket.on('JoinGame',(data)=>{
    console.log('joined',data);
    //game.playerTwo.IdSocket=data;
}) ;
socket.on('GameAlreadyExist',(data)=>{
    alert('cette partie nexiste pas');
});
socket.on('GameNotExist',(data)=>{
    alert('Ce nom de jeu nexiste pas');
}) ;

socket.on('AdversaireJoin',({ID,playerPLace})=>{


    switch (playerPLace+1) {
        case(2):
            game.playerTwo.IdSocket=ID;
            break;
        case(3):
            (game.Myplace===2)?
                game.playerFour.IdSocket=ID:
                game.playerThree.IdSocket=ID;

            break;
        case(4):
            (game.Myplace===2)?
                game.playerThree.IdSocket=ID:
                game.playerFour.IdSocket=ID;
            game.gameOn=true;
            break;
    }


});
socket.on('reinitGame',()=>{
    game.reinitGame();
});
socket.on('continue',()=>{
    game.control.onContinueGameClickButton();
});
socket.on('pause',()=>{
    game.control.onPauseGameClickButton();
});
socket.on('partieComplete',()=>{
    $('.lds-roller').css('display','none');
    game.gameOn=true;
    game.reinitGame();
})

$('#multijoueur').click(()=>{
    //ai=false et attendre le joueur
    $('#NomPartie').css('display','inline');
    $('#CreateGame').css('display','inline');
    $('#CreateGame2v2').css('display','inline');
    $('#JoinGame').css('display','inline');
    socket.open();
    game.playerTwo.ai=false;
});
$('#pauseGame').click(()=>{
    if (!game.playerTwo.ai)
        socket.emit('pause',game.playerTwo.IdSocket);
});
$('#continueGame').click(()=>{
    if (!game.playerTwo.ai)
        socket.emit('continue',game.playerTwo.IdSocket);
});
$('#ML').click(()=>{
    init();
});
$('#CreateGame2v2').click(()=>{
    console.log($('#NomPartie').val(),$('#NomPartie').val().length);
    ($('#NomPartie').val().length!==0)?
        socket.emit('CreateGame',{
                NomPartie:$('#NomPartie').val(),
                ID:socket.id,
                nbrJoueur:4,
            },
            (data)=>{
                game.NomPartieMulti=data;
                if(data!==null) {
                    $('#NomPartie').css('display','none');
                    $('#CreateGame').css('display','none');
                    $('#JoinGame').css('display','none');
                    $('.lds-roller').css('display','inline');
                    $('#CreateGame2v2').css('display','none');

                    game.playerOne.service = true;
                    console.log('created',data);
                    game.Myplace=1;
                }
            }):
        alert('champs vide');
});
$('#CreateGame').click(()=>{
    console.log($('#NomPartie').val(),$('#NomPartie').val().length);
    ($('#NomPartie').val().length!==0)?
        socket.emit('CreateGame',{
                NomPartie:$('#NomPartie').val(),
                ID:socket.id,
                nbrJoueur:2,
            },
            (data)=>{
                game.NomPartieMulti=data;
                if(data!==null) {
                    $('#NomPartie').css('display','none');
                    $('#CreateGame').css('display','none');
                    $('#JoinGame').css('display','none');
                    $('#CreateGame2v2').css('display','none');
                    $('.lds-roller').css('display','inline');
                    game.Myplace=1;
                    game.gameOn=false;
                    game.teamOne.service = true;
                    console.log('created',data);

                }
            }):
        alert('champs vide');
});
$('#JoinGame').click(()=>{
    game.NomPartieMulti=$('#NomPartie').val();
    console.log($('#NomPartie').val(),$('#NomPartie').val().length);
    ($('#NomPartie').val().length!==0)?
        socket.emit('JoinGame',{
            NomPartie:$('#NomPartie').val(),
            ID:socket.id,
        },(data)=>{
            if (data.IdHote.split(' ').length>1){
                alert(data.IdHote);
                game.NomPartieMulti=null;
            }else{

                switch(data.Place+1){

                    case(2):
                        game.Myplace=2;
                        game.playerOne.sprite.posX=conf.PLAYERTWOPOSX;
                        game.playerTwo.sprite.posX=conf.PLAYERONEPOSX;
                        console.log(2,game.playerOne.sprite.posX,game.playerTwo.sprite.posX);
                        game.playerOne.originalPosition='right';
                        game.playerTwo.originalPosition='left';
                        //////////////////////
                        game.playerThree.sprite.posX=conf.PLAYERFOURPOSX;
                        game.playerFour.sprite.posX=conf.PLAYERTHREEPOSX;
                        game.playerThree.originalPosition='left';
                        game.playerFour.originalPosition='right';
                        game.playerTwo.IdSocket=data.IdHote;
                        console.log(data.Adversaire);
                        if (data.Dernier){
                            $('#CreateGame2v2').css('display','none');
                            game.gameOn=true;
                            game.reinitGame();
                        }

                        break;
                    case(4):
                        game.Myplace=4;
                        game.playerOne.sprite.posX=conf.PLAYERFOURPOSX;
                        game.playerTwo.sprite.posX=conf.PLAYERONEPOSX;
                        game.playerOne.originalPosition='right';
                        game.playerTwo.originalPosition='left';
                        //////////////////////
                        game.playerThree.sprite.posX=conf.PLAYERTWOPOSX;
                        game.playerFour.sprite.posX=conf.PLAYERTHREEPOSX;
                        game.playerThree.originalPosition='left';
                        game.playerFour.originalPosition='right';

                        game.teamOne.service = false;
                        game.playerThree.IdSocket=data.Adversaire[0];
                        game.playerFour.IdSocket=data.Adversaire[1];
                        game.playerTwo.IdSocket=data.IdHote;
                        console.log(data.Adversaire[0]);

                        $('#CreateGame2v2').css('display','none');
                        break;
                    case(3):
                        game.Myplace=3;
                        game.playerOne.sprite.posX=conf.PLAYERTHREEPOSX;
                        game.playerThree.sprite.posX=conf.PLAYERONEPOSX;
                        console.log(data.Adversaire);
                        game.playerThree.IdSocket=data.IdHote;
                        game.playerTwo.IdSocket=data.Adversaire[0];
                        game.gameOn=true;
                        game.reinitGame();
                        //replacer l'id de l'hote au bonne endroit


                        break;
                };


                $('#NomPartie').css('display','none');
                $('#CreateGame').css('display','none');
                $('#JoinGame').css('display','none');
                $('#CreateGame2v2').css('display','none');
                if(!data.Dernier)
                    $('.lds-roller').css('display','inline-block');
            }
        }):
        alert('champs vide');

});
